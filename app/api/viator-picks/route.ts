import { NextRequest, NextResponse } from "next/server";
import { getPort } from "../../ports/port-data";
import { resolveViatorPicks } from "../../lib/viator-api";

export const dynamic = "force-dynamic";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const CURRENCIES = new Set(["USD", "EUR", "GBP", "CAD", "AUD"]);

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug")?.trim() ?? "";
  const date = request.nextUrl.searchParams.get("date")?.trim() ?? "";
  const requestedCurrency = request.nextUrl.searchParams.get("currency")?.toUpperCase() ?? "USD";
  const currency = CURRENCIES.has(requestedCurrency) ? requestedCurrency : "USD";

  const port = getPort(slug);
  if (!port) {
    return NextResponse.json({ error: "Port not found." }, { status: 404 });
  }

  if (!DATE_PATTERN.test(date) || date < todayIso()) {
    return NextResponse.json({ error: "Choose a valid future port date." }, { status: 400 });
  }

  try {
    const picks = await resolveViatorPicks(port, date, currency);

    if (picks.length !== 6) {
      return NextResponse.json(
        {
          error: "Six exact products could not be resolved for this date.",
          code: "INCOMPLETE_CURATED_SET",
          count: picks.length,
          picks,
        },
        { status: 409 },
      );
    }

    return NextResponse.json({
      port: { slug: port.slug, name: port.name },
      date,
      currency,
      picks,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "VIATOR_REQUEST_FAILED";

    if (message === "VIATOR_NOT_CONFIGURED") {
      return NextResponse.json(
        { error: "Viator API is not configured.", code: message },
        { status: 503 },
      );
    }

    if (message === "VIATOR_KEY_NOT_ACTIVE") {
      return NextResponse.json(
        { error: "Viator API access is still activating.", code: message },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Live excursion details are temporarily unavailable.", code: message },
      { status: 502 },
    );
  }
}
