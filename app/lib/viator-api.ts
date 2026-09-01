import type { Activity, Port } from "../ports/port-data";

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
  currency: string;
  rating: number | null;
  reviewCount: number | null;
  startTimes: string[];
  freeCancellation: boolean;
};

type ViatorSearchProduct = {
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
  pricing?: {
    summary?: {
      fromPrice?: number;
    };
    currency?: string;
  };
  productUrl?: string;
  flags?: string[];
};

function headers(apiKey: string) {
  return {
    "Accept-Language": "en-US",
    "Content-Type": "application/json",
    Accept: "application/json;version=2.0",
    "exp-api-key": apiKey,
  };
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function tokens(value: string) {
  const ignored = new Set([
    "and",
    "the",
    "with",
    "from",
    "tour",
    "trip",
    "day",
    "roatan",
    "island",
    "private",
    "visit",
    "excursion",
  ]);

  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !ignored.has(token));
}

function extractProducts(payload: unknown): ViatorSearchProduct[] {
  if (!payload || typeof payload !== "object") return [];
  const data = payload as Record<string, unknown>;

  if (Array.isArray(data.products)) return data.products as ViatorSearchProduct[];

  if (data.products && typeof data.products === "object") {
    const productsObject = data.products as Record<string, unknown>;
    if (Array.isArray(productsObject.results)) return productsObject.results as ViatorSearchProduct[];
  }

  if (Array.isArray(data.searchResults)) {
    for (const entry of data.searchResults as Array<Record<string, unknown>>) {
      if (entry.searchType === "PRODUCTS" && Array.isArray(entry.results)) {
        return entry.results as ViatorSearchProduct[];
      }
    }
  }

  if (Array.isArray(data.results)) return data.results as ViatorSearchProduct[];
  return [];
}

function productScore(product: ViatorSearchProduct, activity: Activity) {
  const title = (product.title ?? "").toLowerCase();
  const description = (product.description ?? "").toLowerCase();
  const wanted = [...new Set(tokens(`${activity.title} ${activity.search}`))];

  let score = 0;
  for (const token of wanted) {
    if (title.includes(token)) score += 5;
    else if (description.includes(token)) score += 1.5;
  }

  const rating = product.reviews?.combinedAverageRating ?? 0;
  const reviews = product.reviews?.totalReviews ?? 0;
  score += Math.max(0, rating - 4) * 1.5;
  score += Math.min(Math.log10(reviews + 1), 3) * 0.45;
  if (product.flags?.includes("FREE_CANCELLATION")) score += 0.2;
  if (product.flags?.includes("LIKELY_TO_SELL_OUT")) score += 0.15;

  return score;
}

function pickImage(product: ViatorSearchProduct) {
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

async function searchActivity(
  apiKey: string,
  port: Pick<Port, "name" | "searchName">,
  activity: Activity,
  date: string,
  currency: string,
) {
  const response = await fetch(`${VIATOR_BASE_URL}/search/freetext`, {
    method: "POST",
    headers: headers(apiKey),
    body: JSON.stringify({
      searchTerm: `${activity.search} in ${port.searchName || port.name}`,
      productFiltering: {
        dateRange: { from: date, to: date },
        includeAutomaticTranslations: true,
      },
      productSorting: { sort: "DEFAULT" },
      searchTypes: [
        {
          searchType: "PRODUCTS",
          pagination: { start: 1, count: 8 },
        },
      ],
      currency,
    }),
    next: { revalidate: CACHE_SECONDS },
  });

  if (response.status === 401) {
    throw new Error("VIATOR_KEY_NOT_ACTIVE");
  }
  if (!response.ok) {
    throw new Error(`VIATOR_SEARCH_${response.status}`);
  }

  const products = extractProducts(await response.json());
  return products
    .filter((product) => Boolean(product.productCode && safeProductUrl(product.productUrl)))
    .sort((a, b) => productScore(b, activity) - productScore(a, activity));
}

const weekdayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

function dateInRange(date: string, start?: string, end?: string) {
  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
}

function extractStartTimes(payload: unknown, date: string) {
  if (!payload || typeof payload !== "object") return [] as string[];
  const data = payload as Record<string, unknown>;
  if (!Array.isArray(data.bookableItems)) return [] as string[];

  const weekday = weekdayNames[new Date(`${date}T12:00:00Z`).getUTCDay()];
  const times = new Set<string>();

  for (const rawItem of data.bookableItems as Array<Record<string, unknown>>) {
    if (!Array.isArray(rawItem.seasons)) continue;

    for (const rawSeason of rawItem.seasons as Array<Record<string, unknown>>) {
      const startDate = typeof rawSeason.startDate === "string" ? rawSeason.startDate : undefined;
      const endDate = typeof rawSeason.endDate === "string" ? rawSeason.endDate : undefined;
      if (!dateInRange(date, startDate, endDate) || !Array.isArray(rawSeason.pricingRecords)) continue;

      for (const rawRecord of rawSeason.pricingRecords as Array<Record<string, unknown>>) {
        const days = Array.isArray(rawRecord.daysOfWeek) ? (rawRecord.daysOfWeek as string[]) : [];
        if (days.length && !days.includes(weekday)) continue;
        if (!Array.isArray(rawRecord.timedEntries)) continue;

        for (const rawEntry of rawRecord.timedEntries as Array<Record<string, unknown>>) {
          const time = typeof rawEntry.startTime === "string" ? rawEntry.startTime : null;
          if (!time) continue;
          const unavailable = Array.isArray(rawEntry.unavailableDates)
            ? (rawEntry.unavailableDates as Array<Record<string, unknown>>)
            : [];
          const unavailableOnDate = unavailable.some((entry) => entry.date === date);
          if (!unavailableOnDate) times.add(time);
        }
      }
    }
  }

  return [...times].sort();
}

async function fetchStartTimes(apiKey: string, productCode: string, date: string) {
  const response = await fetch(`${VIATOR_BASE_URL}/availability/schedules/${encodeURIComponent(productCode)}`, {
    headers: headers(apiKey),
    next: { revalidate: CACHE_SECONDS },
  });

  if (response.status === 401) throw new Error("VIATOR_KEY_NOT_ACTIVE");
  if (!response.ok) return [];
  return extractStartTimes(await response.json(), date);
}

export async function resolveViatorPicks(
  port: Port,
  date: string,
  currency = "USD",
): Promise<ViatorResolvedPick[]> {
  const apiKey = process.env.VIATOR_API_KEY;
  if (!apiKey) throw new Error("VIATOR_NOT_CONFIGURED");

  const concepts = [...port.topActivities, ...port.alternatives];
  const searches = await Promise.all(concepts.map((activity) => searchActivity(apiKey, port, activity, date, currency)));

  const selected: Array<{ activity: Activity; product: ViatorSearchProduct }> = [];
  const usedCodes = new Set<string>();

  searches.forEach((products, index) => {
    const product = products.find((candidate) => candidate.productCode && !usedCodes.has(candidate.productCode));
    if (!product?.productCode) return;
    usedCodes.add(product.productCode);
    selected.push({ activity: concepts[index], product });
  });

  const startTimes = await Promise.all(
    selected.map(({ product }) => fetchStartTimes(apiKey, product.productCode as string, date)),
  );

  return selected.flatMap(({ activity, product }, index) => {
    const productUrl = safeProductUrl(product.productUrl);
    if (!product.productCode || !productUrl || !product.title) return [];

    return [
      {
        conceptTitle: activity.title,
        productCode: product.productCode,
        title: cleanText(product.title),
        description: cleanText(product.description ?? activity.note),
        imageUrl: pickImage(product),
        productUrl,
        fromPrice: product.pricing?.summary?.fromPrice ?? null,
        currency: product.pricing?.currency ?? currency,
        rating: product.reviews?.combinedAverageRating ?? null,
        reviewCount: product.reviews?.totalReviews ?? null,
        startTimes: startTimes[index],
        freeCancellation: Boolean(product.flags?.includes("FREE_CANCELLATION")),
      },
    ];
  });
}
