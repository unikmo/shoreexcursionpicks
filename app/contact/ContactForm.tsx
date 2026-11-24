"use client";

import { FormEvent, useState } from "react";

const topics = ["General question", "A port guide", "A correction", "Partnerships", "Something else"];

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "");
      form.reset();
      setStatus("sent");
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "Your message could not be sent. Please try again or email hello@shoreexcursionsguide.com.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="cse-contact-sent" role="status" aria-live="polite">
        <h2>Thank you. Your message is with us.</h2>
        <p>
          We will reply by email, usually within two working days. If you do not hear from us, check your spam folder or write to{" "}
          <a href="mailto:hello@shoreexcursionsguide.com">hello@shoreexcursionsguide.com</a>.
        </p>
      </div>
    );
  }

  return (
    <form className="cse-contact-form" onSubmit={submit}>
      <label>Name
        <input name="name" required maxLength={100} autoComplete="name" />
      </label>
      <label>Email
        <input name="email" type="email" required maxLength={254} autoComplete="email" />
      </label>
      <label>Topic
        <select name="topic">
          {topics.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>
      <label>Message
        <textarea name="message" required minLength={2} maxLength={5000} rows={6} />
      </label>
      {/* Honeypot: hidden from people, filled in by bots. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="cse-contact-hp" />
      <p className="cse-contact-note">We use these details only to answer your message. We cannot book or change excursions; bookings are made with the operator.</p>
      {status === "error" && <p role="alert" className="cse-contact-error">{error}</p>}
      <button type="submit" className="cse-nav-cta" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
