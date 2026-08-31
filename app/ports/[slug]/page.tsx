import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NearbyPortGuides } from "../../components/nearby-port-guides";
import { SiteFooter, SiteHeader } from "../../components/site-shell";
import { viatorAffiliateUrl } from "../../lib/viator";
import { getPort, getRegionTone, getViatorSearchUrl, ports } from "../port-data";
import { getPortGuideDetail } from "../port-guide-data";
import { getActivityImage, getPortImage } from "../port-images";
import { getRegionSlug } from "../region-data";
import type { Activity, Port } from "../port-data";

type PortPageProps = { params: Promise<{ slug: string }> };

type ActivityCardProps = {
  item: Activity;
  port: Port;
  rank: number;
  quiet?: boolean;
};

function ActivityCard({ item, port, rank, quiet = false }: ActivityCardProps) {
  const href = viatorAffiliateUrl(getViatorSearchUrl(port, item));
  const image = getActivityImage(port, item, rank - 1);

  return (
    <article
      id={`pick-${rank}`}
      className={quiet ? "cse-activity-card cse-activity-card-quiet" : "cse-activity-card"}
    >
      {!quiet ? (
        <div className="cse-activity-card-media">
          <img src={image.src} alt={image.alt} width="720" height="440" loading="lazy" />
        </div>
      ) : null}
      <div className="cse-activity-rank">{String(rank).padStart(2, "0")}</div>
      <div className="cse-activity-copy">
        <h3>{item.title}</h3>
        <p>{item.note}</p>
      </div>
      <a href={href} target="_blank" rel="sponsored noreferrer noopener">
        View live options on Viator <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}

const seoTitles: Record<string, string> = {
  cozumel: "Best Cozumel Shore Excursions: 6 Curated Picks + Port Guide",
  nassau: "Best Nassau Shore Excursions: 6 Curated Picks + Port Guide",
  barcelona: "Barcelona Shore Excursions: 6 Curated Picks + Port Guide",
  "civitavecchia-rome": "Rome from Civitavecchia: 6 Shore Excursion Picks + Port Guide",
};

function getSeoTitle(port: Port) {
  return seoTitles[port.slug] ?? `Best ${port.name} Shore Excursions: 6 Curated Picks + Port Guide`;
}

export function generateStaticParams() {
  return ports.map((port) => ({ slug: port.slug }));
}

export async function generateMetadata({ params }: PortPageProps): Promise<Metadata> {
  const { slug } = await params;
  const port = getPort(slug);
  if (!port) return {};

  const title = getSeoTitle(port);
  const heroImage = getPortImage(port);
  const guide = getPortGuideDetail(port.slug);
  const places = guide?.importantPlaces.join(", ");

  return {
    title,
    description: `${port.heroLine} Compare six ${port.name} shore-excursion ideas${places ? ` and see key places including ${places}` : ""}.`,
    alternates: { canonical: `/ports/${port.slug}` },
    openGraph: {
      title,
      description: port.heroLine,
      url: `/ports/${port.slug}`,
      type: "article",
      images: [{ url: heroImage.src, alt: heroImage.alt }],
    },
  };
}

export default async function PortPage({ params }: PortPageProps) {
  const { slug } = await params;
  const port = getPort(slug);
  if (!port) notFound();

  const guide = getPortGuideDetail(port.slug);
  if (!guide) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shoreexcursionsguide.com";
  const allActivities = [...port.topActivities, ...port.nicheActivities];
  const heroImage = getPortImage(port);
  const regionSlug = getRegionSlug(port.region);
  const nearbyPorts = ports.flatMap((candidate) => {
    const candidateGuide = getPortGuideDetail(candidate.slug);
    return candidateGuide
      ? [{
          slug: candidate.slug,
          name: candidate.name,
          country: candidate.country,
          latitude: candidateGuide.latitude,
          longitude: candidateGuide.longitude,
          topPick: candidate.topActivities[0].title,
        }]
      : [];
  });

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Six curated shore excursion ideas in ${port.name}`,
    numberOfItems: allActivities.length,
    itemListElement: allActivities.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      description: item.note,
      url: `${siteUrl}/ports/${port.slug}#pick-${index + 1}`,
    })),
  };

  const destinationSchema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: `${port.name} cruise port guide`,
    description: port.heroLine,
    url: `${siteUrl}/ports/${port.slug}`,
    geo: {
      "@type": "GeoCoordinates",
      latitude: guide.latitude,
      longitude: guide.longitude,
    },
    containsPlace: guide.importantPlaces.map((name) => ({
      "@type": "TouristAttraction",
      name,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Ports", item: `${siteUrl}/ports` },
      ...(regionSlug
        ? [{ "@type": "ListItem", position: 3, name: port.region, item: `${siteUrl}/ports/regions/${regionSlug}` }]
        : []),
      {
        "@type": "ListItem",
        position: regionSlug ? 4 : 3,
        name: port.name,
        item: `${siteUrl}/ports/${port.slug}`,
      },
    ],
  };

  const faqItems = [
    {
      question: `What is the best shore excursion in ${port.name}?`,
      answer: `Our first pick is ${port.topActivities[0].title}. ${port.topActivities[0].note}`,
    },
    {
      question: `What should cruise passengers know about ${port.name}?`,
      answer: port.portNote,
    },
    {
      question: `What are important places to see in ${port.name}?`,
      answer: `Start with ${guide.importantPlaces.join(", ")}. Which one fits depends on your ship time and the kind of day you want.`,
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main className="cse-page">
      <SiteHeader />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className={`cse-port-hero-compact cse-region-${getRegionTone(port.region)}`}>
        <div className="cse-port-hero-copy">
          <p className="cse-eyebrow">{port.country} · cruise port guide</p>
          <h1>{port.name} shore excursions</h1>
          <p className="cse-lead">{port.heroLine}</p>
        </div>

        <div className="cse-port-hero-media">
          <img src={heroImage.src} alt={heroImage.alt} width="1200" height="720" fetchPriority="high" />
          <div className="cse-port-hero-caption">
            <strong>Port-day note</strong>
            <span>{port.portNote}</span>
          </div>
          {heroImage.sourceUrl ? (
            <a className="cse-port-image-credit" href={heroImage.sourceUrl} target="_blank" rel="noreferrer noopener">
              Image source ↗
            </a>
          ) : null}
        </div>

        <div className="cse-port-hero-actions">
          <span>3 top picks</span>
          <span>3 alternatives</span>
          {regionSlug ? <Link href={`/ports/regions/${regionSlug}`}>More {port.region} ports →</Link> : null}
        </div>
      </section>

      <section className="cse-port-context">
        <details>
          <summary>
            <span>
              <small>Know the port</small>
              <strong>Short history & important places</strong>
            </span>
            <b aria-hidden="true">+</b>
          </summary>
          <div className="cse-port-context-body">
            <div>
              <h2>{port.name} in brief</h2>
              <p>{guide.history}</p>
            </div>
            <div>
              <h2>Important places</h2>
              <ul>
                {guide.importantPlaces.map((place) => <li key={place}>{place}</li>)}
              </ul>
            </div>
          </div>
        </details>
      </section>

      <section className="cse-section cse-picks-section">
        <div className="cse-section-heading">
          <div>
            <p className="cse-eyebrow">Start here</p>
            <h2>3 strong ways to spend the day</h2>
          </div>
          <p className="cse-heading-note">
            We rank experience types, not operators. Viator shows current suppliers, prices, reviews and booking terms.
          </p>
        </div>
        <div className="cse-primary-activities">
          {port.topActivities.map((item, index) => (
            <ActivityCard item={item} port={port} rank={index + 1} key={item.title} />
          ))}
        </div>
      </section>

      <section className="cse-niche-section">
        <details>
          <summary>
            <span><small>Worth a look</small><strong>3 less-obvious alternatives</strong></span>
            <b aria-hidden="true">+</b>
          </summary>
          <div className="cse-niche-activities">
            {port.nicheActivities.map((item, index) => (
              <ActivityCard item={item} port={port} rank={index + 4} quiet key={item.title} />
            ))}
          </div>
        </details>
      </section>

      <section className="cse-port-logistics">
        <div>
          <p className="cse-eyebrow">Port-day logistics</p>
          <h2>Plan around this port, not a generic checklist.</h2>
        </div>
        <p>{port.portNote}</p>
      </section>

      <section className="cse-port-faq">
        <div className="cse-port-faq-heading">
          <p className="cse-eyebrow">Quick answers</p>
          <h2>{port.name} cruise questions</h2>
        </div>
        <div className="cse-port-faq-list">
          {faqItems.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <NearbyPortGuides currentSlug={port.slug} ports={nearbyPorts} />

      <section className="cse-partner-note" aria-label="Affiliate disclosure">
        <strong>Booking partner: Viator.</strong>
        <span>We research the options; Viator and the selected local supplier handle booking and fulfilment.</span>
        <small>We may earn a commission from qualifying bookings, at no extra cost to you.</small>
      </section>

      <div className="cse-next-port">
        <Link href={regionSlug ? `/ports/regions/${regionSlug}` : "/ports"}>← Choose another cruise port</Link>
      </div>

      <SiteFooter />
    </main>
  );
}
