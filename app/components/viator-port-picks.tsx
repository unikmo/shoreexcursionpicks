"use client";

import { useEffect, useMemo, useState } from "react";

type EditorialConcept = {
  title: string;
  note: string;
  placeholderImage: string;
  group: "top" | "alternative";
};

type LivePick = {
  conceptTitle: string;
  productCode: string;
  title: string;
  description: string;
  imageUrl: string | null;
  productUrl: string;
  fromPrice: number | null;
  currency: string | null;
  priceBasis: string | null;
  rating: number | null;
  reviewCount: number | null;
  startTimes: string[];
  freeCancellation: boolean;
  availableForSelectedDate: boolean;
};

type Props = {
  portSlug: string;
  portName: string;
  concepts: EditorialConcept[];
};

function localToday() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function upcomingTravelDate(days = 30) {
  const date = new Date(`${localToday()}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function formatPrice(value: number | null, currency: string | null, basis: string | null) {
  if (value == null || !currency) return "Check live price";
  const rendered = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
  return `From ${rendered}${basis ? ` ${basis}` : ""}`;
}

function formatDate(value: string) {
  if (!value) return "Choose your port date";
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

function timesLabel(times: string[]) {
  if (!times.length) return "Flexible / no fixed start time shown";
  if (times.length <= 3) return times.join(" · ");
  return `${times.slice(0, 3).join(" · ")} +${times.length - 3} more`;
}

function PlaceholderCard({ concept, rank }: { concept: EditorialConcept; rank: number }) {
  return (
    <article className="cse-live-pick-card is-placeholder">
      <div className="cse-live-pick-image">
        <img src={concept.placeholderImage} alt="" width="720" height="480" loading="lazy" />
      </div>
      <div className="cse-live-pick-body">
        <div className="cse-live-pick-kicker">
          <span>{rank < 4 ? `Pick ${rank}` : "Alternative"}</span>
          <span>Choose a date for current details</span>
        </div>
        <h3>{concept.title}</h3>
        <p>{concept.note}</p>
        <div className="cse-live-pick-placeholder-meta">Exact product · price · date · start time</div>
      </div>
    </article>
  );
}

function LiveCard({ pick, date, rank }: { pick: LivePick; date: string; rank: number }) {
  return (
    <article className="cse-live-pick-card">
      <div className="cse-live-pick-image">
        {pick.imageUrl ? (
          <img src={pick.imageUrl} alt={pick.title} width="720" height="480" loading="lazy" />
        ) : null}
      </div>

      <div className="cse-live-pick-body">
        <div className="cse-live-pick-kicker">
          <span>{rank < 4 ? `Pick ${rank}` : "Alternative"}</span>
          {pick.rating != null ? (
            <span>
              {pick.rating.toFixed(1)} ★{pick.reviewCount != null ? ` · ${pick.reviewCount} reviews` : ""}
            </span>
          ) : (
            <span>Viator listing</span>
          )}
        </div>

        <h3>{pick.title}</h3>
        <p>{pick.description}</p>

        <dl className="cse-live-pick-meta">
          <div className="cse-live-pick-price">
            <dt>Price</dt>
            <dd>{formatPrice(pick.fromPrice, pick.currency, pick.priceBasis)}</dd>
          </div>
          <div className="cse-live-pick-date">
            <dt>Selected date</dt>
            <dd>
              {pick.availableForSelectedDate
                ? formatDate(date)
                : `Check exact times for ${formatDate(date)}`}
            </dd>
          </div>
          <div className="cse-live-pick-start">
            <dt>Start</dt>
            <dd>{timesLabel(pick.startTimes)}</dd>
          </div>
        </dl>

        <div className="cse-live-pick-footer">
          <div>
            {pick.freeCancellation ? <span className="cse-live-pick-badge">Free cancellation</span> : null}
            <small>Product {pick.productCode}</small>
          </div>
          <a href={pick.productUrl} target="_blank" rel="sponsored noreferrer noopener">
            View excursion
          </a>
        </div>
      </div>
    </article>
  );
}

export default function ViatorPortPicks({ portSlug, portName, concepts }: Props) {
  const [date, setDate] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [picks, setPicks] = useState<LivePick[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const minDate = useMemo(localToday, []);

  useEffect(() => {
    setDate(upcomingTravelDate());
  }, []);

  useEffect(() => {
    if (!date) {
      setPicks(null);
      setMessage(null);
      return;
    }

    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setMessage(null);

      try {
        const params = new URLSearchParams({ slug: portSlug, date, travelers: String(travelers) });
        const response = await fetch(`/api/viator-picks?${params.toString()}`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          if (data?.code === "VIATOR_KEY_NOT_ACTIVE") {
            setMessage("Current Viator pricing is still activating. The six exact picks will appear here as soon as API access is active.");
          } else if (data?.code === "VIATOR_CURATION_NOT_READY") {
            setMessage("This port’s exact six products are still being curated. We won’t substitute generic Viator results.");
          } else if (data?.code === "INCOMPLETE_CURATED_SET") {
            setMessage("We could not verify all six exact excursions for this date. Try another date rather than showing you generic results.");
          } else {
            setMessage(data?.error ?? "Current excursion details are temporarily unavailable.");
          }
          return;
        }

        if (!Array.isArray(data?.picks) || data.picks.length !== 6) {
          setMessage("We could not verify all six exact excursions for this date.");
          return;
        }

        setPicks(data.picks);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setMessage("Current excursion details are temporarily unavailable.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [date, portSlug, travelers]);

  const top = picks?.slice(0, 3) ?? null;
  const alternatives = picks?.slice(3, 6) ?? null;

  return (
    <section className="cse-live-picks" id="picks" aria-labelledby="live-picks-title">
      <div className="cse-live-picks-intro">
        <div>
          <p className="cse-eyebrow">Six, not sixty</p>
          <h2 id="live-picks-title">Your six curated {portName} excursions.</h2>
          <p>
            Choose the day your ship is in port. We then show the exact excursion listing, current price and start times—not a generic activities page.
          </p>
        </div>

        <div className="cse-live-picks-controls" aria-label="Excursion date and travelers">
          <label>
            <span>When are you in {portName}?</span>
            <input
              type="date"
              min={minDate}
              value={date}
              onInput={(event) => setDate(event.currentTarget.value)}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
          <label>
            <span>Adult travelers</span>
            <select value={travelers} onChange={(event) => setTravelers(Number(event.target.value))}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
                <option key={count} value={count}>{count}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {message ? <div className="cse-live-picks-status" role="status">{message}</div> : null}
      {loading ? <div className="cse-live-picks-status" role="status">Updating exact products and live pricing for {formatDate(date)}…</div> : null}

      <div className="cse-live-picks-heading">
        <span>01</span>
        <div>
          <p className="cse-eyebrow">Standout picks</p>
          <h2>Start with these three.</h2>
        </div>
      </div>

      <div className="cse-live-picks-grid cse-live-picks-grid-top">
        {top
          ? top.map((pick, index) => <LiveCard key={pick.productCode} pick={pick} date={date} rank={index + 1} />)
          : concepts.slice(0, 3).map((concept, index) => <PlaceholderCard key={concept.title} concept={concept} rank={index + 1} />)}
      </div>

      <div className="cse-live-picks-heading cse-live-picks-heading-alt" id="alternatives">
        <span>02</span>
        <div>
          <p className="cse-eyebrow">Alternatives</p>
          <h2>Three different ways to spend the day.</h2>
        </div>
      </div>

      <div className="cse-live-picks-grid cse-live-picks-grid-alt">
        {alternatives
          ? alternatives.map((pick, index) => <LiveCard key={pick.productCode} pick={pick} date={date} rank={index + 4} />)
          : concepts.slice(3, 6).map((concept, index) => <PlaceholderCard key={concept.title} concept={concept} rank={index + 4} />)}
      </div>

      <p className="cse-live-picks-disclosure">
        Prices and schedules come from the selected Viator listing and can change. “View excursion” always opens that exact product page to review final details and book.
      </p>
    </section>
  );
}
