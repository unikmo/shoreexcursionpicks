import type { Metadata } from "next";
import "./globals.css";
import "./shore-excursions.css";
import "./launch-overrides.css";
import "./home-hero.css";
import "./methodology.css";

const siteUrl = "https://shoreexcursionsguide.com";
const siteDescription =
  "Cruise-port guides with six curated shore excursion ideas, port logistics, short history and important places to visit.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shore Excursion Picks",
    template: "%s | Shore Excursion Picks",
  },
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Shore Excursion Picks",
    description: "The best shore excursions—without endless searching.",
    url: siteUrl,
    siteName: "Shore Excursion Picks",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Shore Excursion Picks",
    url: siteUrl,
    description: siteDescription,
    inLanguage: "en",
  };

  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        {children}
      </body>
    </html>
  );
}
