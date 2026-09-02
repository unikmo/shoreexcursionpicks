import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NearbyPortGuides } from "../../components/nearby-port-guides";
import { SiteFooter, SiteHeader } from "../../components/site-shell";
import ViatorPortPicks from "../../components/viator-port-picks";
import { getPort, getRegionTone, ports } from "../port-data";
import { getPortGuideDetail } from "../port-guide-data";
import { getPortHistory } from "../port-history-data";
import { getActivityImage, getPortImage } from "../port-images";
import { getRegionSlug } from "../region-data";
import { getCuratedViatorSet } from "../viator-curation";
import type { Port } from "../port-data";

type PortPageProps = { params: Promise<{ slug: string }> };

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

  const history = getPortHistory(port.slug);

  // Product promise: exactly three primary activity concepts + exactly three alternatives.
  // Only locked product codes in viator-curation.ts can become bookable cards.
  const topActivities = port.topActivities.slice(0, 3);
  const alternativeActivities = port.nicheActivities.slice(0, 3);
  const allActivities = [...topActivities, ...alternativeActivities];
  const curatedSet = getCuratedViatorSet(port.slug);
  const liveConcepts = allActivities.map((item, index) => ({
    title: curatedSet?.[index]?.conceptTitle ?? item.title,
    note: item.note,
    placeholderImage: getActivityImage(port, item, index).src,
    group: index < 3 ? ("top" as const) : ("alternative" as const),
  }));

  const siteUrl = "https://shoreexcursionsguide.com";
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
        }]
      : [];
  });

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Six curated shore excursion ideas in ${port.name}`,
    numberOfItems: 6,
    itemListElement: allActivities.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: curatedSet?.[index]?.conceptTitle ?? item.title,
      description: item.note,
      url: `${siteUrl}/ports/${port.slug}#picks`,
    })),
  };

  const destinationSchema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: `${port.name} cruise port guide`,
    description: history?.summary ?? port.heroLine,
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
      answer: `Our first curated theme is ${curatedSet?.[0]?.conceptTitle ?? topActivities[0].title}. ${topActivities[0].note} Select your port date to see the exact current Viator excursion, price and start times.`,
    },
    {
      question: `What should cruise passengers know about ${port.name}?`,
      answer: port.portNote,
    },
    {
      question: `What are important places to see in ${port.name}?`,
      answer: `Start with ${guide.importantPlaces.join(", ")}.`,
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
    <main className="cse-page cse-editorial-port-page">
      <SiteHeader />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className={`cse-editorial-port-hero cse-region-${getRegionTone(port.region)}`}>
        <div className="cse-editorial-port-title">
          <p className="cse-eyebrow">{port.country} · {port.region}</p>
          <h1>{port.name}</h1>
          <p>{port.heroLine}</p>
        </div>

        <div className="cse-editorial-port-image">
          <img src={heroImage.src} alt={heroImage.alt} width="1440" height="820" fetchPriority="high" />
          {heroImage.sourceUrl ? (
            <a href={heroImage.sourceUrl} target="_blank" rel="noreferrer noopener" className="cse-port-image-credit">
              Image source ↗
            </a>
          ) : null}
        </div>

        <div className="cse-editorial-port-facts" aria-label={`${port.name} guide summary`}>
          <div><span>01</span><strong>3 standout picks</strong><small>Our short list</small></div>
          <div><span>02</span><strong>3 alternatives</strong><small>No endless catalogue</small></div>
          <div><span>03</span><strong>{guide.importantPlaces[0]}</strong><small>Key place to know</small></div>
        </div>
      </section>

      <nav className="cse-editorial-tabs" aria-label={`${port.name} page sections`}>
        <a href="#picks">Top picks</a>
        <a href="#alternatives">Alternatives</a>
        <a href="#port-notes">Port notes</a>
        <a href="#history">History</a>
        <span>3 + 3 only</span>
      </nav>

      <ViatorPortPicks portSlug={port.slug} portName={port.name} concepts={liveConcepts} />

      <section className="cse-editorial-port-note" id="port-notes">
        <div>
          <p className="cse-eyebrow">Before you book</p>
          <h2>{port.name} port note.</h2>
        </div>
        <div>
          <p>{port.portNote}</p>
          <a href="#picks">Return to picks ↗</a>
        </div>
      </section>

      <section className="cse-port-history" id="history">
        <div className="cse-port-history-copy">
          <p className="cse-eyebrow">Know {port.name}</p>
          <h2>A little context changes the day.</h2>
          <p className="cse-port-history-summary">{history?.summary ?? guide.history}</p>

          {history ? (
            <details className="cse-port-history-more">
              <summary>More <span aria-hidden="true">+</span></summary>
              <div>
                <p>{history.more}</p>
                <p className="cse-port-history-sources">
                  <span>Research references:</span>{" "}
                  <a href={history.wikipediaUrl} target="_blank" rel="noreferrer noopener">Wikipedia</a>
                  {history.officialSource ? (
                    <> · <a href={history.officialSource.url} target="_blank" rel="noreferrer noopener">{history.officialSource.label}</a></>
                  ) : null}
                </p>
              </div>
            </details>
          ) : null}
        </div>

        <aside className="cse-port-history-places" aria-label={`Important places in ${port.name}`}>
          <p className="cse-eyebrow">Important places</p>
          <ol>
            {guide.importantPlaces.map((place, index) => (
              <li key={place}><span>{String(index + 1).padStart(2, "0")}</span><strong>{place}</strong></li>
            ))}
          </ol>
        </aside>
      </section>

      <NearbyPortGuides currentSlug={port.slug} ports={nearbyPorts} />

      <section className="cse-partner-note" aria-label="Affiliate disclosure">
        <strong>Booking partner: Viator.</strong>
        <span>Six exact excursion listings per selected date: three standout picks and three alternatives.</span>
        <small>We may earn a commission from qualifying bookings, at no extra cost to you.</small>
      </section>

      <div className="cse-next-port">
        <Link href={regionSlug ? `/ports/regions/${regionSlug}` : "/ports"}>← Choose another cruise port</Link>
      </div>

      <SiteFooter />
    </main>
  );
}
