import type { Metadata } from "next";
import Link from "next/link";
import { PortFinder } from "./components/port-finder";
import { SiteFooter, SiteHeader } from "./components/site-shell";
import { getRegionTone, ports, regions } from "./ports/port-data";
import { getPortImage } from "./ports/port-images";
import { getRegionSlug } from "./ports/region-data";

export const metadata: Metadata = {
  title: "Curated Shore Excursions & Cruise Port Guides",
  description:
    "Save time choosing a shore excursion. We narrow each cruise port to six strong choices so you can compare less and find the right fit faster.",
};

const featuredSlugs = ["roatan", "cozumel", "barcelona", "santorini", "juneau", "civitavecchia-rome"];

export default function HomePage() {
  const featuredPorts = featuredSlugs.flatMap((slug) => {
    const match = ports.find((item) => item.slug === slug);
    return match ? [match] : [];
  });

  const heroImage = getPortImage({ slug: "roatan", name: "Roatán", region: "Caribbean & Bahamas" });
  const searchablePorts = ports.map((port) => ({
    slug: port.slug,
    name: port.name,
    country: port.country,
    region: port.region,
    topPick: port.topActivities[0].title,
  }));
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Shore Excursion Picks cruise port guides",
    url: "https://shoreexcursionsguide.com",
    description:
      "Independent cruise-port guides that save travelers time by narrowing each destination to six strong shore excursion choices with port-specific context.",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: ports.length,
      itemListElement: ports.map((port, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${port.name} shore excursions`,
        url: `https://shoreexcursionsguide.com/ports/${port.slug}`,
      })),
    },
  };

  return (
    <main className="cse-page cse-home-page">
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <section className="cse-home-image-hero" aria-labelledby="home-hero-title">
        <img
          className="cse-home-image-hero-media"
          src={heroImage.src}
          alt={heroImage.alt}
          width="1600"
          height="1000"
          fetchPriority="high"
        />
        <div className="cse-home-image-hero-shade" aria-hidden="true" />

        <div className="cse-home-image-hero-content">
          <p className="cse-home-image-hero-kicker">Shore Excursion Picks</p>
          <h1 id="home-hero-title">Your shore day, without the endless searching.</h1>
          <p className="cse-home-image-hero-promise">
            We narrow every port to six strong choices — enough variety to find what fits, without the comparison overload.
          </p>

          <div className="cse-home-hero-search">
            <PortFinder ports={searchablePorts} />
          </div>
        </div>

        <div className="cse-home-image-hero-meta" aria-label="Why use Shore Excursion Picks">
          <span>Save time</span>
          <span>Avoid choice overload</span>
          <span>Find the right fit faster</span>
        </div>

        {heroImage.sourceUrl ? (
          <a className="cse-home-image-credit" href={heroImage.sourceUrl} target="_blank" rel="noreferrer noopener">
            Image source ↗
          </a>
        ) : null}
      </section>

      <section className="cse-home-region-browser" aria-labelledby="region-browser-title">
        <div className="cse-home-region-browser-heading">
          <div>
            <p className="cse-eyebrow">Browse by region</p>
            <h2 id="region-browser-title">Or start with where you are sailing.</h2>
          </div>
          <Link href="/ports">All {ports.length} ports →</Link>
        </div>

        <div className="cse-region-shortcuts">
          <div>
            {regions.map((region) => {
              const regionSlug = getRegionSlug(region);
              if (!regionSlug) return null;

              return (
                <Link href={`/ports/regions/${regionSlug}`} key={region}>
                  <span>{ports.filter((port) => port.region === region).length} ports</span>
                  <strong>{region}</strong>
                  <b aria-hidden="true">→</b>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cse-model-strip" aria-label="How the guide works">
        <strong>Port first.</strong>
        <span>3 standout picks + 3 alternatives.</span>
        <span>Live booking details on Viator.</span>
      </section>

      <section className="cse-section">
        <div className="cse-section-heading">
          <div>
            <p className="cse-eyebrow">Six featured ports · not the full catalogue</p>
            <h2>Popular ports to start with.</h2>
          </div>
          <Link className="cse-text-link" href="/ports">Browse all {ports.length} ports →</Link>
        </div>
        <div className="cse-featured-grid">
          {featuredPorts.map((port) => (
            <Link className={`cse-featured-port cse-region-${getRegionTone(port.region)}`} href={`/ports/${port.slug}`} key={port.slug}>
              <img
                className="cse-featured-port-image"
                src={getPortImage(port).src}
                alt={getPortImage(port).alt}
                width="720"
                height="420"
                loading="lazy"
              />
              <span>{port.region}</span>
              <h3>{port.name}</h3>
              <p>{port.topActivities[0].title}</p>
              <strong>See the six picks →</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="cse-section cse-how" id="how-it-works">
        <div className="cse-section-heading cse-centered">
          <div>
            <p className="cse-eyebrow">How it works</p>
            <h2>Enough choice to decide. Not enough to get lost.</h2>
          </div>
        </div>
        <div className="cse-step-grid">
          <article><span>1</span><h3>Choose the port</h3><p>Start with the exact cruise call rather than a generic destination list.</p></article>
          <article><span>2</span><h3>See six ideas</h3><p>Three standout picks and three alternatives. Nothing more.</p></article>
          <article><span>3</span><h3>Check live tours</h3><p>Viator shows current operators, prices, reviews, availability and booking terms.</p></article>
        </div>
      </section>

      <section className="cse-section cse-affiliate-explainer">
        <div>
          <p className="cse-eyebrow">Independent guide · affiliate supported</p>
          <h2>We help you choose. The operator runs the tour.</h2>
        </div>
        <div>
          <p>
            Shore Excursion Picks does not operate excursions or take the booking payment. Viator displays the live listing and the selected local supplier delivers the experience.
          </p>
          <p className="cse-disclosure">We may earn a commission if you complete a qualifying booking after following one of our Viator links.</p>
          <Link className="cse-text-link" href="/methodology">See how we choose the picks →</Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
