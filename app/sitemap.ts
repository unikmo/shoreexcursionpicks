import type { MetadataRoute } from "next";
import { ports } from "./ports/port-data";
import { regionGuides } from "./ports/region-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://shoreexcursionsguide.com";

  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/ports`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/methodology`, changeFrequency: "monthly", priority: 0.65 },
    ...regionGuides.map((region) => ({
      url: `${baseUrl}/ports/regions/${region.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...ports.map((port) => ({
      url: `${baseUrl}/ports/${port.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
