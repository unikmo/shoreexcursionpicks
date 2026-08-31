import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/site-shell";

export const metadata: Metadata = {
  title: "How We Choose Shore Excursion Picks",
  description:
    "How Shore Excursion Picks selects port-day experience types, handles affiliate links, and keeps cruise-port guidance separate from live operator terms.",
  alternates: { canonical: "/methodology" },
};

export default function MethodologyPage() {
  const methodologySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "How Shore Excursion Picks chooses excursions",
    url: "https://shoreexcursionsguide.com/methodology",
    description:
      "Editorial methodology for selecting six cruise-port experience ideas and separating guide recommendations from live marketplace inventory and operator terms.",
  };

  return (
    <main className="cse-page">
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(methodologySchema) }} />

      <section className="cse-methodology-hero">
        <p className="cse-eyebrow">How we pick</p>
        <h1>Six ideas. Port context first.</h1>
        <p>
          Shore Excursion Picks is an independent cruise-port guide. We narrow each port to three strong experience types and three less-obvious alternatives so visitors can decide without reopening an endless catalogue.
        </p>
      </section>

      <section className="cse-methodology-grid">
        <article>
          <span>01</span>
          <h2>Start with the port</h2>
          <p>Meeting points, tendering, transfer distance and the practical shape of the port day come before the activity list.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Choose distinct experiences</h2>
          <p>The six picks are meant to represent meaningfully different ways to spend the call—not six near-identical listings from the same marketplace.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Keep live terms with the seller</h2>
          <p>Prices, review counts, availability, cancellation rules, pickup instructions and the actual local operator can change. Viator displays those live booking details.</p>
        </article>
        <article>
          <span>04</span>
          <h2>Do not invent guarantees</h2>
          <p>We do not claim that a ship will wait for an independently booked excursion. Any return-to-ship or cancellation protection must be read from the current product terms.</p>
        </article>
        <article>
          <span>05</span>
          <h2>Affiliate relationship</h2>
          <p>We may earn a commission when a visitor follows an eligible Viator link and completes a qualifying booking. That does not add a charge to the visitor.</p>
        </article>
        <article>
          <span>06</span>
          <h2>Keep the guide inspectable</h2>
          <p>Port pages show the reasoning in plain language: what the experience is, why it fits the port, what local context matters, and which places are worth understanding before booking.</p>
        </article>
      </section>

      <section className="cse-methodology-note">
        <div>
          <p className="cse-eyebrow">Important boundary</p>
          <h2>We are the guide, not the tour operator.</h2>
        </div>
        <p>
          Shore Excursion Picks does not operate tours, collect the booking payment, control the local supplier, or replace the booking terms shown by Viator and the selected operator. Always confirm the exact meeting point, timing, inclusions and cancellation terms before purchase.
        </p>
      </section>

      <div className="cse-next-port">
        <Link href="/ports">Browse all cruise ports →</Link>
      </div>

      <SiteFooter />
    </main>
  );
}
