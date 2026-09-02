import type { Port } from "../ports/port-data";
import { getCuratedViatorSet, type CuratedViatorSlot } from "../ports/viator-curation";
import { viatorAffiliateUrl } from "./viator";

const VIATOR_BASE_URL = "https://api.viator.com/partner";
const CACHE_SECONDS = 60 * 60;

export type ViatorResolvedPick = {
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
};

type ViatorProduct = {
  productCode?: string;
  title?: string;
  description?: string;
  images?: Array<{
    isCover?: boolean;
    variants?: Array<{ width?: number; height?: number; url?: string }>;
  }>;
  reviews?: {
    totalReviews?: number;
    combinedAverageRating?: number;
  };
  productUrl?: string;
  flags?: string[];
};

type ScheduleResult = {
  available: boolean;
  fromPrice: number | null;
  currency: string | null;
  priceBasis: string | null;
  startTimes: string[];
};

function headers(apiKey: string) {
  return {
    "Accept-Language": "en-US",
    Accept: "application/json;version=2.0",
    "exp-api-key": apiKey,
  };
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function pickImage(product: ViatorProduct) {
  const image = product.images?.find((candidate) => candidate.isCover) ?? product.images?.[0];
  if (!image?.variants?.length) return null;

  const variants = image.variants
    .filter((variant) => Boolean(variant.url))
    .sort((a, b) => (b.width ?? 0) - (a.width ?? 0));

  const preferred = variants.find((variant) => (variant.width ?? 0) <= 720 && (variant.width ?? 0) >= 540);
  return preferred?.url ?? variants[0]?.url ?? null;
}

function safeProductUrl(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !/(^|\.)viator\.com$/i.test(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function dateInRange(date: string, start?: string, end?: string) {
  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
}

const weekdayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

function retailPrice(detail: Record<string, unknown>, travelDate: string) {
  const price = detail.price && typeof detail.price === "object" ? (detail.price as Record<string, unknown>) : null;
  if (!price) return null;

  const original = price.original && typeof price.original === "object"
    ? (price.original as Record<string, unknown>)
    : null;
  const special = price.special && typeof price.special === "object"
    ? (price.special as Record<string, unknown>)
    : null;

  const today = new Date().toISOString().slice(0, 10);
  const specialPrice = special?.recommendedRetailPrice;
  const specialApplies =
    typeof specialPrice === "number" &&
    dateInRange(
      today,
      typeof special?.offerStartDate === "string" ? special.offerStartDate : undefined,
      typeof special?.offerEndDate === "string" ? special.offerEndDate : undefined,
    ) &&
    dateInRange(
      travelDate,
      typeof special?.travelStartDate === "string" ? special.travelStartDate : undefined,
      typeof special?.travelEndDate === "string" ? special.travelEndDate : undefined,
    );

  if (specialApplies) return specialPrice;
  return typeof original?.recommendedRetailPrice === "number" ? original.recommendedRetailPrice : null;
}

function priceForDate(details: Array<Record<string, unknown>>, travelDate: string) {
  const candidates = details.flatMap((detail) => {
    const value = retailPrice(detail, travelDate);
    if (value == null) return [];

    return [{
      value,
      packageType: typeof detail.pricingPackageType === "string" ? detail.pricingPackageType : "",
      ageBand: typeof detail.ageBand === "string" ? detail.ageBand : "",
      unitType: typeof detail.unitType === "string" ? detail.unitType : "",
      minTravelers: typeof detail.minTravelers === "number" ? detail.minTravelers : 1,
      maxTravelers: typeof detail.maxTravelers === "number" ? detail.maxTravelers : Number.POSITIVE_INFINITY,
    }];
  });

  const perPerson = candidates.filter(
    (candidate) =>
      candidate.packageType === "PER_PERSON" &&
      (!candidate.ageBand || candidate.ageBand === "ADULT" || candidate.ageBand === "TRAVELER"),
  );

  if (perPerson.length) {
    const bookableForTwo = perPerson.filter(
      (candidate) => candidate.minTravelers <= 2 && candidate.maxTravelers >= 2,
    );
    const pool = bookableForTwo.length
      ? bookableForTwo
      : perPerson.filter(
          (candidate) => candidate.minTravelers === Math.min(...perPerson.map((item) => item.minTravelers)),
        );

    return {
      value: Math.min(...pool.map((candidate) => candidate.value)),
      basis: "per person",
    };
  }

  const unit = candidates.filter((candidate) => candidate.packageType === "UNIT");
  if (unit.length) {
    const cheapest = unit.reduce((best, candidate) => (candidate.value < best.value ? candidate : best));
    return {
      value: cheapest.value,
      basis: cheapest.unitType ? `per ${cheapest.unitType.toLowerCase()}` : "per group",
    };
  }

  return null;
}

function analyzeSchedule(payload: unknown, date: string): ScheduleResult {
  if (!payload || typeof payload !== "object") {
    return { available: false, fromPrice: null, currency: null, priceBasis: null, startTimes: [] };
  }

  const data = payload as Record<string, unknown>;
  const currency = typeof data.currency === "string" ? data.currency : null;
  const summary = data.summary && typeof data.summary === "object" ? (data.summary as Record<string, unknown>) : null;
  const summaryFromPrice = typeof summary?.fromPrice === "number" ? summary.fromPrice : null;
  const bookableItems = Array.isArray(data.bookableItems)
    ? (data.bookableItems as Array<Record<string, unknown>>)
    : [];

  const weekday = weekdayNames[new Date(`${date}T12:00:00Z`).getUTCDay()];
  const startTimes = new Set<string>();
  const applicablePricing: Array<Record<string, unknown>> = [];
  let available = false;

  for (const item of bookableItems) {
    if (!Array.isArray(item.seasons)) continue;

    for (const season of item.seasons as Array<Record<string, unknown>>) {
      const startDate = typeof season.startDate === "string" ? season.startDate : undefined;
      const endDate = typeof season.endDate === "string" ? season.endDate : undefined;
      if (!dateInRange(date, startDate, endDate) || !Array.isArray(season.pricingRecords)) continue;

      for (const record of season.pricingRecords as Array<Record<string, unknown>>) {
        const days = Array.isArray(record.daysOfWeek) ? (record.daysOfWeek as string[]) : [];
        if (days.length && !days.includes(weekday)) continue;

        const timedEntries = Array.isArray(record.timedEntries)
          ? (record.timedEntries as Array<Record<string, unknown>>)
          : [];

        if (timedEntries.length) {
          let validTimedEntry = false;
          for (const entry of timedEntries) {
            const unavailable = Array.isArray(entry.unavailableDates)
              ? (entry.unavailableDates as Array<Record<string, unknown>>)
              : [];
            const unavailableOnDate = unavailable.some((unavailableDate) => unavailableDate.date === date);
            if (unavailableOnDate) continue;

            validTimedEntry = true;
            if (typeof entry.startTime === "string" && entry.startTime) startTimes.add(entry.startTime);
          }
          if (!validTimedEntry) continue;
        }

        available = true;
        if (Array.isArray(record.pricingDetails)) {
          applicablePricing.push(...(record.pricingDetails as Array<Record<string, unknown>>));
        }
      }
    }
  }

  const datedPrice = priceForDate(applicablePricing, date);
  return {
    available,
    fromPrice: datedPrice?.value ?? (available ? summaryFromPrice : null),
    currency,
    priceBasis: datedPrice?.basis ?? (summaryFromPrice != null ? "per person" : null),
    startTimes: [...startTimes].sort(),
  };
}

async function fetchProduct(apiKey: string, productCode: string, portSlug: string) {
  const url = new URL(`${VIATOR_BASE_URL}/products/${encodeURIComponent(productCode)}`);
  url.searchParams.set("campaign-value", `shoreexcursions-${portSlug}`);

  const response = await fetch(url, {
    headers: headers(apiKey),
    next: { revalidate: CACHE_SECONDS },
  });

  if (response.status === 401) throw new Error("VIATOR_KEY_NOT_ACTIVE");
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`VIATOR_PRODUCT_${response.status}`);
  return (await response.json()) as ViatorProduct;
}

async function fetchSchedule(apiKey: string, productCode: string, date: string) {
  const response = await fetch(`${VIATOR_BASE_URL}/availability/schedules/${encodeURIComponent(productCode)}`, {
    headers: headers(apiKey),
    next: { revalidate: CACHE_SECONDS },
  });

  if (response.status === 401) throw new Error("VIATOR_KEY_NOT_ACTIVE");
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`VIATOR_SCHEDULE_${response.status}`);
  return analyzeSchedule(await response.json(), date);
}

async function resolveCuratedSlot(
  apiKey: string,
  portSlug: string,
  slot: CuratedViatorSlot,
  date: string,
): Promise<ViatorResolvedPick | null> {
  for (const productCode of slot.productCodes) {
    const [product, schedule] = await Promise.all([
      fetchProduct(apiKey, productCode, portSlug),
      fetchSchedule(apiKey, productCode, date),
    ]);

    if (!product || !schedule?.available) continue;

    const exactProductCode = product.productCode ?? productCode;
    const productUrl = safeProductUrl(product.productUrl);
    if (!product.title || !productUrl || exactProductCode !== productCode) continue;

    return {
      conceptTitle: slot.conceptTitle,
      productCode,
      title: cleanText(product.title),
      description: cleanText(product.description ?? slot.conceptTitle),
      imageUrl: pickImage(product),
      productUrl: viatorAffiliateUrl(productUrl),
      fromPrice: schedule.fromPrice,
      currency: schedule.currency,
      priceBasis: schedule.priceBasis,
      rating: product.reviews?.combinedAverageRating ?? null,
      reviewCount: product.reviews?.totalReviews ?? null,
      startTimes: schedule.startTimes,
      freeCancellation: Boolean(product.flags?.includes("FREE_CANCELLATION")),
    };
  }

  return null;
}

export async function resolveViatorPicks(port: Port, date: string): Promise<ViatorResolvedPick[]> {
  const apiKey = process.env.VIATOR_API_KEY;
  if (!apiKey) throw new Error("VIATOR_NOT_CONFIGURED");

  const curatedSet = getCuratedViatorSet(port.slug);
  if (!curatedSet) throw new Error("VIATOR_CURATION_NOT_READY");

  const resolved = await Promise.all(
    curatedSet.map((slot) => resolveCuratedSlot(apiKey, port.slug, slot, date)),
  );

  const picks = resolved.filter((pick): pick is ViatorResolvedPick => pick !== null);
  const uniqueCodes = new Set(picks.map((pick) => pick.productCode));
  if (uniqueCodes.size !== picks.length) throw new Error("VIATOR_DUPLICATE_CURATED_PRODUCT");

  return picks;
}
