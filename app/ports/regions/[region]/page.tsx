import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "../../../components/site-shell";
import { ports } from "../../port-data";
import { getPortImage } from "../../port-images";
import { getRegionGuide, regionGuides } from "../../region-data";

type RegionPageProps = { params: Promise<{ region: string }> };

export function generateStaticParams() {
  return regionGuides.map((region) => ({ region: region.slug }));
}

export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const { region: slug } = await params;
  const region = getRegionGuide(slug);
  if (!region) return {};

  return {
    title: region.title,
    description: region.description,
    alternates: { canonical: `/ports/regions/${region.slug}` },
    openGraph: {
      title: region.title,
      description: region.description,
      url: `/ports/regions/${region.slug}`,
      images: [{ url: region.image.src, alt: region.image.alt }],
    },
  };
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { region: slug } = await params;
  const region = getRegionGuide(slug);
  if (!region) notFound();

  const regionPorts = ports.filter((port) => port.region === region.name);
  if (!regionPorts.length) notFound();

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: region.title,
    numberOfItems: regionPorts.length,
    itemListElement: regionPorts.map((port, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: port.name,
      url: `https://shoreexcursionsguide.com/ports/${port.slug}`,
    })),
  };

  return (
    <main className="cse-page">
      <SiteHeader />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <div className="cse-breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span>/</span><Link href="/ports">Ports</Link><span>/</span><span>{region.name}</span>
      </div>

      <section className="cse-region-page-hero">
        <img src={region.image.src} alt={region.image.alt} width="1800" height="980" fetchPriority="high" />
        <div className="cse-region-page-hero-shade" aria-hidden="true" />
        <div className="cse-region-page-hero-copy">
          <p className="cse-eyebrow">{region.eyebrow}</p>
          <h1>{region.title}</h1>
          <p>{region.description}</p>
          <span>{regionPorts.length} curated port guides</span>
        </div>
      </section>

      <section className="cse-region-port-section">
        <div className="cse-region-port-heading">
          <div>
            <p className="cse-eyebrow">Choose your cruise port</p>
            <h2>One port. Six useful ideas.</h2>
          </div>
          <p>Each guide leads with three standout experiences and keeps three niche alternatives secondary.</p>
        </div>

        <div className="cse-region-port-grid">
          {regionPorts.map((port) => {
            const image = getPortImage(port);
            return (
              <Link className="cse-destination-card" href={`/ports/${port.slug}`} key={port.slug}>
                <div className="cse-destination-card-media">
                  <img src={image.src} alt={image.alt} width="900" height="620" loading="lazy" />
                </div>
                <div className="cse-destination-card-copy">
                  <span>{port.country}</span>
                  <h2>{port.name}</h2>
                  <p>{port.topActivities[0].title}</p>
                  <strong>See the 6 picks <b aria-hidden="true">↗</b></strong>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="cse-image-source-note">
          Destination images are individually sourced. <Link href="/image-credits">View image sources and licences.</Link>
        </p>
      </section>

      <aside className="cse-region-switch">
        <div><p className="cse-eyebrow">Another itinerary?</p><strong>Explore a different cruise region.</strong></div>
        <Link href="/ports">View all regions →</Link>
      </aside>

      <SiteFooter />
    </main>
  );
}
