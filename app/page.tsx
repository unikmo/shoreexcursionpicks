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
    "Find six curated shore excursion ideas for 60 cruise ports, with port-specific logistics, short history, important places and nearby port guides.",
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
      "Independent cruise-port guides that narrow each destination to six shore excursion ideas and add port-specific context for planning the day.",
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
    <main className="cse-page">
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <section className="cse-home-hero">
        <div className="cse-home-hero-copy">
          <p className="cse-eyebrow">Independent cruise port guides</p>
          <h1>Find the best shore excursions for your next port</h1>
          <p className="cse-lead">
            Six curated ideas per port—three strong picks and three alternatives—plus local logistics, short history, important places and nearby port guides.
          </p>
          <div className="cse-actions">
            <Link className="cse-button cse-button-primary" href="#port-finder">Choose your port</Link>
            <Link className="cse-button cse-button-secondary" href="/ports">Browse all ports</Link>
          </div>
          <ul className="cse-trust-list" aria-label="What to expect">
            <li>{ports.length} major cruise ports</li>
            <li>6 excursion ideas per port</li>
            <li>Nearby ports by location</li>
          </ul>
        </div>

        <div className="cse-editorial-card" aria-label="How a port guide is organised">
          <div className="cse-editorial-visual">
            <img src={heroImage.src} alt={heroImage.alt} width="900" height="600" fetchPriority="high" />
            <div className="cse-editorial-topline">
              <span>Roatán</span>
              <span>3 top picks</span>
            </div>
          </div>
          <ol>
            <li><span>01</span><strong>Sloth sanctuary & island highlights</strong></li>
            <li><span>02</span><strong>West Bay reef snorkel & beach</strong></li>
            <li><span>03</span><strong>Custom private driver tour</strong></li>
          </ol>
          <p>Plus three quieter alternatives when the obvious choices are not your style.</p>
        </div>
      </section>

      <section className="cse-port-finder-section" id="port-finder">
        <div className="cse-port-finder-heading">
          <div>
            <p className="cse-eyebrow">All {ports.length} port guides</p>
            <h2>Where is your ship stopping?</h2>
          </div>
          <p>Search by port, country, region or the kind of experience you want.</p>
        </div>

        <PortFinder ports={searchablePorts} />

        <div className="cse-region-shortcuts">
          <div className="cse-region-shortcuts-heading">
            <strong>Browse {regions.length} cruise regions</strong>
            <Link href="/ports">Open the regional directory →</Link>
          </div>
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
        <span>Local context and six ideas.</span>
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
          <article><span>2</span><h3>Understand the day</h3><p>See local logistics, short history, key places and six distinct excursion ideas.</p></article>
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
