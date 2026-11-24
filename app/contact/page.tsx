import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/site-shell";
import ContactForm from "./ContactForm";
import "./contact.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions, corrections or ideas for Shore Excursion Picks? Write to us.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="cse-page">
      <SiteHeader />
      <section className="cse-contact">
        <p className="cse-eyebrow">Contact</p>
        <h1>Write to us.</h1>
        <p>
          A question about a port guide, a correction, or an idea? Send a message and we will reply by email. You can also write to{" "}
          <a href="mailto:hello@shoreexcursionsguide.com">hello@shoreexcursionsguide.com</a>.
        </p>
        <ContactForm />
      </section>
      <SiteFooter />
    </main>
  );
}
