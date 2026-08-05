"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent";

export default function PartnerForm() {
  const [status, setStatus] = useState<Status>("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status !== "idle") return;
    const form = e.currentTarget;
    setStatus("sending");
    // Stub: real backend would POST to /api/partners/apply with new FormData(form)
    setTimeout(() => {
      setStatus("sent");
      setTimeout(() => {
        form.reset();
        setStatus("idle");
      }, 2200);
    }, 700);
  }

  const buttonLabel =
    status === "sending"
      ? "Sending…"
      : status === "sent"
        ? "Application sent ✓"
        : "Send application";

  return (
    <form id="partner-form" onSubmit={onSubmit} noValidate>
      <div className="row2">
        <div className="field">
          <label htmlFor="p-name">Your name</label>
          <input id="p-name" name="name" type="text" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="p-business">Business / org name</label>
          <input
            id="p-business"
            name="business"
            type="text"
            autoComplete="organization"
            required
          />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="p-email">Email</label>
          <input
            id="p-email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="p-phone">Phone</label>
          <input id="p-phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="p-type">Partner type</label>
          <select id="p-type" name="type" defaultValue="Licensed electrician">
            <option>Licensed electrician</option>
            <option>Realtor / broker</option>
            <option>Property manager</option>
            <option>Community organization</option>
            <option>Home-services contractor</option>
            <option>Other</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="p-county">CT county / region served</label>
          <input
            id="p-county"
            name="county"
            type="text"
            placeholder="e.g. Hartford, New Haven"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="p-volume">Expected referral volume per month</label>
        <select id="p-volume" name="volume" defaultValue="1–2">
          <option>1–2</option>
          <option>3–10</option>
          <option>10–25</option>
          <option>25+</option>
          <option>Not sure yet</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="p-notes">Anything we should know?</label>
        <textarea
          id="p-notes"
          name="notes"
          placeholder="License number, brokerage, member list size, the kind of homes you work in — whatever helps us reply usefully."
        />
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={status !== "idle"}
      >
        {buttonLabel}
        {status === "idle" && (
          <svg
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
      <p className="form-foot">
        By submitting, you agree to be contacted about this program. We don&apos;t
        sell or share partner info. No newsletter sign-up — applying gets you
        partner emails only.
      </p>
    </form>
  );
}
