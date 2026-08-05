"use client";

import { useState, type FormEvent } from "react";

const REASONS = [
  "I want to enroll my home (homeowner)",
  "I'm a renter and want to ask my landlord",
  "I'm a partner — electrician, realtor, or community organization",
  "I'm a nonprofit serving CT residents",
  "I have an installed system and need support",
  "Press / media inquiry",
  "Something else",
];

type Status = "idle" | "sending" | "sent";

export default function ContactForm() {
  const [reason, setReason] = useState(REASONS[0]);
  const [status, setStatus] = useState<Status>("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status !== "idle") return;
    const form = e.currentTarget;
    setStatus("sending");
    // Stub: real backend would POST /api/contact with new FormData(form)
    setTimeout(() => {
      setStatus("sent");
      setTimeout(() => {
        form.reset();
        setReason(REASONS[0]);
        setStatus("idle");
      }, 2400);
    }, 700);
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="field">
        <label>What&apos;s this about?</label>
        <div className="reasons">
          {REASONS.map((r) => (
            <button
              key={r}
              type="button"
              className={`reason ${reason === r ? "selected" : ""}`}
              onClick={() => setReason(r)}
              aria-pressed={reason === r}
            >
              <span className="dot" />
              <span>{r}</span>
            </button>
          ))}
        </div>
        <input type="hidden" name="reason" value={reason} />
      </div>
      <div className="row2">
        <div className="field">
          <label htmlFor="cf-name">Name</label>
          <input id="cf-name" name="name" type="text" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="cf-email">Email</label>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
      </div>
      <div className="row2">
        <div className="field">
          <label htmlFor="cf-phone">Phone (optional)</label>
          <input id="cf-phone" name="phone" type="tel" autoComplete="tel" />
        </div>
        <div className="field">
          <label htmlFor="cf-zip">CT zip code (optional)</label>
          <input id="cf-zip" name="zip" type="text" autoComplete="postal-code" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="cf-msg">Your message</label>
        <textarea
          id="cf-msg"
          name="message"
          rows={6}
          placeholder="Whatever's useful. We read every one."
        />
      </div>
      <button type="submit" className="btn-primary" disabled={status !== "idle"}>
        {status === "sending"
          ? "Sending…"
          : status === "sent"
            ? "Message sent ✓"
            : "Send message"}
        {status === "idle" && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        )}
      </button>
    </form>
  );
}
