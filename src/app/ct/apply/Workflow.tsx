"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { AppNav } from "./AppNav";
import { Stepper } from "./Stepper";

type Screen =
  | "s01"
  | "s02"
  | "s03a"
  | "s03b"
  | "s03c"
  | "s04"
  | "s05"
  | "s05b"
  | "s06"
  | "s07"
  | "s08"
  | "s09";

type EligibilityResult = {
  kind: "standard" | "priority" | "ineligible";
  utility?: string;
  city?: string;
  formattedAddress?: string;
  reason?: string;
};

const ArrowRight = () => (
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
);

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function Workflow({ initialAddress }: { initialAddress: string }) {
  const [screen, setScreen] = useState<Screen>("s01");

  // s01
  const [address, setAddress] = useState(initialAddress);
  const [utility, setUtility] = useState("Eversource");
  const [dwelling, setDwelling] = useState("Single-family detached");
  const [isOwner, setIsOwner] = useState(true);

  // eligibility
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);

  // s04
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [utilityAccount, setUtilityAccount] = useState("");
  const [hasMedicalEquip, setHasMedicalEquip] = useState(false);
  const [language, setLanguage] = useState("English");

  // s05
  const [installLocation, setInstallLocation] = useState("Garage");
  const [panelAmps, setPanelAmps] = useState("200 amp (most common)");
  const [panelAge, setPanelAge] = useState("5–15 years");
  const [solar, setSolar] = useState("No");
  const [accessNotes, setAccessNotes] = useState("");

  // s05b
  const [ownerName, setOwnerName] = useState("");
  const [ownerOrg, setOwnerOrg] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerOutreachMode, setOwnerOutreachMode] = useState<"we" | "self">("we");
  const [ownerNote, setOwnerNote] = useState("");
  const [renterSubmitted, setRenterSubmitted] = useState(false);

  // s06
  const [surveyDate, setSurveyDate] = useState<string | null>("Thu 8");
  const [surveySlot, setSurveySlot] = useState<string | null>("1 – 3pm");

  // s08
  const [agreeReadESA, setAgreeReadESA] = useState(false);
  const [agreeAuthEnroll, setAgreeAuthEnroll] = useState(false);
  const [agreeESign, setAgreeESign] = useState(false);
  const [signedName, setSignedName] = useState("");

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [appNumber, setAppNumber] = useState("");

  // Real eligibility: POST the address to the backend, which resolves CT service
  // territory + priority-municipality tier. Falls back to a safe STANDARD path if
  // the API is unreachable so the flow never dead-ends.
  useEffect(() => {
    if (screen !== "s02") return;
    let cancelled = false;

    (async () => {
      try {
        const data: any = await apiFetch("/api/lookup", {
          method: "POST",
          body: JSON.stringify({ address }),
        });
        if (cancelled) return;
        const kind = String(
          data?.eligibility?.kind ?? "STANDARD"
        ).toLowerCase() as EligibilityResult["kind"];
        setEligibility({
          kind,
          utility:
            data?.utility?.utility_name ??
            (utility === "I'm not sure" ? "Eversource" : utility),
          formattedAddress: data?.address ?? address,
          city: data?.eligibility?.city ?? undefined,
          reason: data?.eligibility?.reason,
        });
        setScreen(kind === "ineligible" ? "s03c" : kind === "priority" ? "s03b" : "s03a");
      } catch {
        if (cancelled) return;
        setEligibility({
          kind: "standard",
          utility: utility === "I'm not sure" ? "Eversource" : utility,
          formattedAddress: address,
        });
        setScreen("s03a");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [screen, address, utility]);

  // Persist the application. Used by the owner sign step (s08) and the renter
  // owner-outreach step (s05b). Advances to `nextScreen` on success.
  async function submitApplication(
    nextScreen: Screen,
    overrides: Record<string, unknown> = {},
  ) {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await apiFetch<{ applicationNumber: string }>("/api/applications", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          preferredLanguage: language,
          formattedAddress: eligibility?.formattedAddress || address,
          city: eligibility?.city,
          utility: eligibility?.utility || utility,
          dwellingType: dwelling,
          isOwner,
          utilityAccount,
          hasMedicalEquipment: hasMedicalEquip,
          eligibilityKind: eligibility?.kind,
          resolvedUtility: eligibility?.utility,
          resolvedCity: eligibility?.city,
          installLocation,
          panelAmps,
          panelAge,
          solarStatus: solar,
          accessNotes,
          ownerName,
          ownerOrg,
          ownerEmail,
          ownerPhone,
          ownerOutreachMode,
          ownerNote,
          surveyDate,
          surveySlot,
          agreeReadEsa: agreeReadESA,
          agreeAuthEnroll,
          agreeESign,
          signedName,
          esaVersion: "v2026.04",
          source: "web",
          ...overrides,
        }),
      });
      setAppNumber(res.applicationNumber);
      setScreen(nextScreen);
      return true;
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong submitting your application.",
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  // Step index for the stepper (0–5 mapped to 6 visible labels)
  const stepIndex = (() => {
    switch (screen) {
      case "s01":
      case "s02":
      case "s03a":
      case "s03b":
      case "s03c":
        return 0;
      case "s04":
        return 1;
      case "s05":
      case "s05b":
        return 2;
      case "s06":
        return 3;
      case "s07":
        return 4;
      case "s08":
        return 5;
      case "s09":
        return 5;
    }
  })();

  const stepLabel =
    screen === "s09"
      ? undefined
      : screen === "s05b"
        ? "Step 3 of 6 · renter path"
        : `Step ${stepIndex + 1} of 6`;

  return (
    <div className="ctapp">
      <AppNav
        step={screen === "s02" ? "Verifying…" : stepLabel}
        rightAction={
          screen !== "s02" && screen !== "s09" ? (
            <button type="button" onClick={() => setScreen("s01")}>
              Save &amp; finish later
            </button>
          ) : screen === "s09" ? (
            <a href="#">Sign in to portal</a>
          ) : undefined
        }
      />

      {screen !== "s02" && screen !== "s03c" && screen !== "s09" && (
        <Stepper current={stepIndex} />
      )}

      {screen === "s01" && (
        <div className="body narrow">
          <p className="eyebrow">Eligibility · about 2 minutes</p>
          <h1 className="screen-h1">
            Let&apos;s check if your home <em>qualifies</em>.
          </h1>
          <p className="lead">
            We&apos;ll verify your utility territory, ownership type, and which
            program tier you qualify for. Nothing on your credit, no commitment.
          </p>

          <div className="field">
            <label htmlFor="addr">Service address</label>
            <input
              id="addr"
              className="mono"
              type="text"
              autoComplete="street-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="field-help">
              The address where the battery would be installed. Must be in
              Connecticut.
            </div>
          </div>

          <div className="row2">
            <div className="field">
              <label htmlFor="util">Electric utility</label>
              <select
                id="util"
                value={utility}
                onChange={(e) => setUtility(e.target.value)}
              >
                <option>Eversource</option>
                <option>United Illuminating (UI)</option>
                <option>Norwich Public Utilities</option>
                <option>I&apos;m not sure</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="dwelling">Dwelling type</label>
              <select
                id="dwelling"
                value={dwelling}
                onChange={(e) => setDwelling(e.target.value)}
              >
                <option>Single-family detached</option>
                <option>Townhouse / row house</option>
                <option>Condo</option>
                <option>Multi-family (2–4 units)</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Are you the homeowner?</label>
            <div className="seg">
              <button
                type="button"
                aria-pressed={isOwner}
                onClick={() => setIsOwner(true)}
              >
                Yes — I own
              </button>
              <button
                type="button"
                aria-pressed={!isOwner}
                onClick={() => setIsOwner(false)}
              >
                No — I rent
              </button>
            </div>
            <div className="field-help">
              Renters can qualify with the property owner&apos;s written consent.
              We&apos;ll help with that paperwork on a later step.
            </div>
          </div>

          <div className="actions">
            <button
              className="btn-primary"
              onClick={() => setScreen("s02")}
              disabled={!address.trim()}
            >
              Check eligibility
              <ArrowRight />
            </button>
            <span className="footnote right">
              No credit check · No payment required
            </span>
          </div>
        </div>
      )}

      {screen === "s02" && (
        <div className="body">
          <div className="loading">
            <div className="pulse" aria-hidden="true" />
            <div className="loading-text">
              Checking your home against the CT Energy Storage Solutions
              program…
            </div>
            <ul className="loading-list">
              <li className="done">Address normalized · USPS</li>
              <li className="done">Utility territory · resolving</li>
              <li className="cur">Distressed-municipality lookup</li>
              <li className="pending">Income-qualified tier (optional)</li>
              <li className="pending">Panel-capacity flags</li>
            </ul>
          </div>
        </div>
      )}

      {screen === "s03a" && (
        <ResultStandard
          eligibility={eligibility}
          isOwner={isOwner}
          onContinue={() => setScreen("s04")}
        />
      )}

      {screen === "s03b" && (
        <ResultPriority
          eligibility={eligibility}
          isOwner={isOwner}
          onContinue={() => setScreen("s04")}
        />
      )}

      {screen === "s03c" && (
        <ResultIneligible
          eligibility={eligibility}
          address={address}
          onBack={() => setScreen("s01")}
        />
      )}

      {screen === "s04" && (
        <div className="body narrow">
          <p className="eyebrow">Step 2 of 6</p>
          <h1 className="screen-h1">A few details about you.</h1>
          <p className="lead">
            Used only for enrollment with{" "}
            {eligibility?.utility ?? "your utility"} and the state program. We
            don&apos;t share with anyone else.
          </p>

          <div className="row2">
            <div className="field">
              <label htmlFor="first">First name</label>
              <input
                id="first"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="last">Last name</label>
              <input
                id="last"
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="row2">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                className="mono"
                placeholder="(860) 555 0140"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="utility-acct">
              {eligibility?.utility ?? "Utility"} account number
            </label>
            <input
              id="utility-acct"
              type="text"
              className="mono"
              placeholder="Format: 12 digits, no dashes"
              value={utilityAccount}
              onChange={(e) => setUtilityAccount(e.target.value)}
            />
            <div className="field-help">
              Top-right of your bill. We use this to enroll your meter in the
              program — there&apos;s no change to your existing electric account.
            </div>
          </div>

          <div className="field">
            <label>
              Anyone in the household have life-sustaining medical equipment?
            </label>
            <div className="radio-cards">
              <button
                type="button"
                className={`radio-card ${!hasMedicalEquip ? "selected" : ""}`}
                onClick={() => setHasMedicalEquip(false)}
              >
                <span className="dot" />
                <div>
                  <strong>No</strong>
                  <span className="desc">Standard install scheduling.</span>
                </div>
              </button>
              <button
                type="button"
                className={`radio-card ${hasMedicalEquip ? "selected" : ""}`}
                onClick={() => setHasMedicalEquip(true)}
              >
                <span className="dot" />
                <div>
                  <strong>Yes — please flag this</strong>
                  <span className="desc">
                    We&apos;ll prioritize and notify your utility of your
                    medical-baseline status.
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div className="field">
            <label htmlFor="lang">
              Preferred language for installer communication
            </label>
            <select
              id="lang"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Español</option>
              <option>Português</option>
              <option>Kreyòl Ayisyen</option>
              <option>Tiếng Việt</option>
              <option>Polski</option>
              <option>中文</option>
              <option>Other (we&apos;ll arrange)</option>
            </select>
          </div>

          <div className="actions">
            <button
              className="btn-primary"
              onClick={() => setScreen(isOwner ? "s05" : "s05b")}
              disabled={!firstName || !lastName || !email}
            >
              Continue
              <ArrowRight />
            </button>
            <button
              className="btn-ghost"
              onClick={() =>
                setScreen(
                  eligibility?.kind === "priority" ? "s03b" : "s03a",
                )
              }
            >
              Back
            </button>
          </div>
        </div>
      )}

      {screen === "s05" && (
        <div className="body narrow">
          <p className="eyebrow">Step 3 of 6</p>
          <h1 className="screen-h1">About the property.</h1>
          <p className="lead">
            Helps our crew arrive prepared. None of this is binding — your site
            survey is the source of truth.
          </p>

          <div className="field">
            <label>Where would the battery go?</label>
            <div className="radio-cards three">
              {[
                {
                  k: "Garage",
                  desc: "Most common. Unconditioned space is fine.",
                },
                { k: "Basement", desc: "Dry basement, near the panel." },
                { k: "Utility room", desc: "Or other interior space." },
              ].map((opt) => (
                <button
                  key={opt.k}
                  type="button"
                  className={`radio-card ${installLocation === opt.k ? "selected" : ""}`}
                  onClick={() => setInstallLocation(opt.k)}
                >
                  <span className="dot" />
                  <div>
                    <strong>{opt.k}</strong>
                    <span className="desc">{opt.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="row2">
            <div className="field">
              <label htmlFor="panel-amps">Main panel amperage</label>
              <select
                id="panel-amps"
                value={panelAmps}
                onChange={(e) => setPanelAmps(e.target.value)}
              >
                <option>200 amp (most common)</option>
                <option>150 amp</option>
                <option>100 amp</option>
                <option>I&apos;m not sure — we&apos;ll confirm on-site</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="panel-age">Approximate age of electrical panel</label>
              <select
                id="panel-age"
                value={panelAge}
                onChange={(e) => setPanelAge(e.target.value)}
              >
                <option>Less than 5 years</option>
                <option>5–15 years</option>
                <option>15–30 years</option>
                <option>30+ years</option>
                <option>I&apos;m not sure</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="solar">Existing solar panels on the home?</label>
            <select
              id="solar"
              value={solar}
              onChange={(e) => setSolar(e.target.value)}
            >
              <option>No</option>
              <option>Yes — Enphase microinverters</option>
              <option>Yes — string inverter (SolarEdge, SMA, etc.)</option>
              <option>Yes — I&apos;m not sure of the brand</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="access">
              Anything our crew should know about site access?
            </label>
            <textarea
              id="access"
              rows={3}
              placeholder="Gate codes, dogs, narrow stairs, parking notes — anything that helps us arrive prepared."
              value={accessNotes}
              onChange={(e) => setAccessNotes(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Optional · upload a photo of your electrical panel</label>
            <div className="upload">
              <div className="row">
                Drop an image here or{" "}
                <button className="btn-link" type="button">
                  browse files
                </button>
              </div>
              <div className="meta">Speeds up site survey · JPG / PNG · max 10MB</div>
            </div>
          </div>

          <div className="actions">
            <button className="btn-primary" onClick={() => setScreen("s06")}>
              Continue
              <ArrowRight />
            </button>
            <button className="btn-ghost" onClick={() => setScreen("s04")}>
              Back
            </button>
          </div>
        </div>
      )}

      {screen === "s05b" && !renterSubmitted && (
        <div className="body narrow">
          <p className="eyebrow">Renter path</p>
          <h1 className="screen-h1">
            We&apos;ll loop in your <em>property owner</em>.
          </h1>
          <p className="lead">
            The battery is permanently mounted, so we need your landlord&apos;s
            written consent. We do most of the work — you give us their contact
            info and we send a one-page form.
          </p>

          <div className="banner">
            <span className="ico">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 22V11l9-6 9 6v11" />
                <path d="M10 22v-7h8v7" />
              </svg>
            </span>
            <div>
              <h4>About two-thirds of consents come back signed</h4>
              <p>
                Most owners say yes — we mount it on the wall, we maintain it for
                10 years, and we remove it at our cost if anything changes. No
                risk to the property.
              </p>
            </div>
          </div>

          <div className="row2">
            <div className="field">
              <label htmlFor="owner-name">Owner / landlord name</label>
              <input
                id="owner-name"
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="owner-org">
                Property management company (if any)
              </label>
              <input
                id="owner-org"
                type="text"
                value={ownerOrg}
                onChange={(e) => setOwnerOrg(e.target.value)}
              />
            </div>
          </div>

          <div className="row2">
            <div className="field">
              <label htmlFor="owner-email">Owner email</label>
              <input
                id="owner-email"
                type="email"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="owner-phone">Owner phone (optional)</label>
              <input
                id="owner-phone"
                type="tel"
                className="mono"
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label>How would you like us to reach out?</label>
            <div className="radio-cards">
              <button
                type="button"
                className={`radio-card ${ownerOutreachMode === "we" ? "selected" : ""}`}
                onClick={() => setOwnerOutreachMode("we")}
              >
                <span className="dot" />
                <div>
                  <strong>We email them directly</strong>
                  <span className="desc">
                    Standard one-pager + e-sign link. We CC you.
                  </span>
                </div>
              </button>
              <button
                type="button"
                className={`radio-card ${ownerOutreachMode === "self" ? "selected" : ""}`}
                onClick={() => setOwnerOutreachMode("self")}
              >
                <span className="dot" />
                <div>
                  <strong>I&apos;ll deliver it myself</strong>
                  <span className="desc">
                    We email you the PDF; you handle the conversation.
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div className="field">
            <label htmlFor="owner-note">
              Anything you&apos;d like us to mention to them?
            </label>
            <textarea
              id="owner-note"
              rows={3}
              placeholder="Optional. e.g. 'My landlord knows me as Jamie, not James.'"
              value={ownerNote}
              onChange={(e) => setOwnerNote(e.target.value)}
            />
          </div>

          <div className="actions">
            <button
              className="btn-primary"
              onClick={async () => {
                const ok = await submitApplication("s05b", {
                  renterPendingConsent: true,
                });
                if (ok) setRenterSubmitted(true);
              }}
              disabled={submitting || !ownerName || !ownerEmail}
            >
              {submitting ? "Sending…" : "Send consent request"}
            </button>
            <button className="btn-ghost" onClick={() => setScreen("s04")}>
              Back
            </button>
          </div>
          {submitError && (
            <p className="footnote" style={{ color: "#b91c1c" }}>
              {submitError}
            </p>
          )}
          <p className="footnote">
            We&apos;ll pause your application here. Once consent is signed,
            you&apos;ll get an email and pick up where you left off — usually
            within 3–7 days.
          </p>
        </div>
      )}

      {screen === "s05b" && renterSubmitted && (
        <div className="body narrow">
          <p className="eyebrow">Application paused</p>
          <h1 className="screen-h1">
            Consent request sent to <em>{ownerName}</em>.
          </h1>
          <p className="lead">
            We&apos;ll email you the moment they sign. Most owners reply within
            3–7 days.
          </p>
          <div className="data-block">
            <div className="k">What happens next</div>
            <div
              style={{
                fontSize: 14,
                color: "var(--ink-2)",
                lineHeight: 1.7,
                marginTop: 8,
              }}
            >
              We send a one-page consent form to {ownerEmail}. You&apos;re CC&apos;d
              on the email. Once they sign, you&apos;ll get a link to pick up at
              the property-details step.
            </div>
          </div>
          <div className="actions">
            <a className="btn-primary" href="/ct">
              Return home
            </a>
          </div>
        </div>
      )}

      {screen === "s06" && (
        <div className="body narrow">
          <p className="eyebrow">Step 4 of 6</p>
          <h1 className="screen-h1">
            Pick a time for the <em>15-minute</em> site survey.
          </h1>
          <p className="lead">
            A licensed CT electrician confirms install location and panel
            compatibility. No tools, no install — just a look.
          </p>

          <div className="map" aria-hidden="true">
            <span className="pin">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12Z"
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
            <span className="map-label">{eligibility?.formattedAddress ?? address}</span>
          </div>

          <div className="label">Select a date</div>
          <div className="cal-grid">
            {[
              { dow: "Mon", num: 5, disabled: true },
              { dow: "Tue", num: 6 },
              { dow: "Wed", num: 7 },
              { dow: "Thu", num: 8 },
              { dow: "Fri", num: 9 },
              { dow: "Sat", num: 10, disabled: true },
              { dow: "Mon", num: 12 },
            ].map((d) => {
              const key = `${d.dow} ${d.num}`;
              return (
                <button
                  key={key}
                  type="button"
                  className={`cal-day ${d.disabled ? "disabled" : ""} ${
                    surveyDate === key ? "selected" : ""
                  }`}
                  disabled={d.disabled}
                  onClick={() => !d.disabled && setSurveyDate(key)}
                >
                  <div className="dow">{d.dow}</div>
                  <div className="num">{d.num}</div>
                </button>
              );
            })}
          </div>

          <div className="label">
            Available windows · {surveyDate ? `${surveyDate} May` : "select a date"}
          </div>
          <div className="slots">
            {[
              { t: "8 – 10am" },
              { t: "10am – 12pm", unavail: true },
              { t: "1 – 3pm" },
              { t: "3 – 5pm" },
            ].map((s) => (
              <button
                key={s.t}
                type="button"
                className={`slot ${s.unavail ? "unavail" : ""} ${
                  surveySlot === s.t ? "selected" : ""
                }`}
                disabled={s.unavail}
                onClick={() => !s.unavail && setSurveySlot(s.t)}
              >
                {s.t}
              </button>
            ))}
          </div>

          <div className="banner" style={{ marginTop: 28 }}>
            <span className="ico">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 2" />
              </svg>
            </span>
            <div>
              <h4>15 minutes, no install on this visit</h4>
              <p>
                The electrician confirms placement, panel capacity, and Wi-Fi
                reach. Install is scheduled separately, typically 2–4 weeks
                later.
              </p>
            </div>
          </div>

          <div className="actions">
            <button
              className="btn-primary"
              onClick={() => setScreen("s07")}
              disabled={!surveyDate || !surveySlot}
            >
              Hold this window
              <ArrowRight />
            </button>
            <button className="btn-ghost" onClick={() => setScreen("s05")}>
              Back
            </button>
            <span className="footnote right">
              You can reschedule any time before 24 hours prior.
            </span>
          </div>
        </div>
      )}

      {screen === "s07" && (
        <div className="body narrow">
          <p className="eyebrow">Step 5 of 6 · plain English</p>
          <h1 className="screen-h1">
            The full <em>agreement</em>, in plain language.
          </h1>
          <p className="lead">
            Read all the way through. Email yourself a copy if you want to
            discuss with family before signing.
          </p>

          <div className="esa-doc">
            <div className="esa-inner">
              <div className="esa-head">
                <div className="name">
                  CT Battery <em>Solutions</em>
                </div>
                <div className="tag">Energy Storage Agreement · v2026.04</div>
              </div>

              <h4>1. Parties</h4>
              <p>
                <strong>Provider:</strong> CT Battery Solutions, Inc., a
                Delaware C-Corporation operating in Connecticut.
                <br />
                <strong>Customer:</strong>{" "}
                <span className="fill">
                  {firstName || "—"} {lastName}
                </span>
              </p>

              <h4>2. Property &amp; utility</h4>
              <p>
                Service address:{" "}
                <span className="fill">
                  {eligibility?.formattedAddress ?? address}
                </span>
                <br />
                Utility account:{" "}
                <span className="fill">
                  {utilityAccount || "12-digit account"}
                </span>
                <br />
                Tier:{" "}
                <span className="fill">
                  {eligibility?.kind === "priority"
                    ? "Distressed-municipality (priority)"
                    : "Standard"}
                </span>
              </p>

              <h4>3. What we install</h4>
              <table className="spec">
                <thead>
                  <tr>
                    <td>Component</td>
                    <td>Model</td>
                    <td>Spec</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Battery</td>
                    <td>Enphase IQ Battery 10C</td>
                    <td>10.5 kWh / 7.08 kW continuous</td>
                  </tr>
                  <tr>
                    <td>Combiner</td>
                    <td>IQ Combiner 6C</td>
                    <td>240VAC / 48A max</td>
                  </tr>
                  <tr>
                    <td>Meter</td>
                    <td>IQ Meter Collar</td>
                    <td>Revenue-grade metering</td>
                  </tr>
                </tbody>
              </table>

              <h4>4. Term</h4>
              <p>10 years from the day the system is commissioned.</p>

              <h4>5. Cost to you</h4>
              <p>
                <strong>$0.00.</strong> No payments, no fees, no balloon at year
                ten. We don&apos;t charge you for installation, monitoring,
                repairs, or removal.
              </p>

              <h4>6. Who owns the battery</h4>
              <p>
                We do, for the term. We&apos;re responsible for monitoring,
                maintenance, and replacement. You have full use of it the entire
                time, including during every outage.
              </p>

              <h4>7. Program enrollment</h4>
              <p>
                You authorize us to enroll your meter in the Connecticut Energy
                Storage Solutions program. You designate us as the direct
                payment recipient for all enrollment and performance incentives.
              </p>

              <h4>8. Backup power</h4>
              <p>
                The battery senses an outage and starts powering your essential
                circuits within seconds. Your guaranteed minimum runtime depends
                on your tier (8 hours for priority tier; 6 hours for standard
                tier).
              </p>

              <h4>9. Grid dispatch</h4>
              <p>
                The battery participates in dispatch events called by your
                utility through the program&apos;s DERMS platform — typically
                30–60 events per year, mostly hot summer afternoons. The battery
                recharges automatically afterward.
              </p>

              <h4>10. Maintenance</h4>
              <p>
                Included for the full term at no cost: annual inspection,
                firmware updates, remote monitoring, and warranty claims.
                Equipment carries a 15-year manufacturer warranty.
              </p>

              <h4>11. Charging electricity</h4>
              <p>
                The battery uses electricity from your panel to charge.
                Estimated cost: about $9 / month, on your existing electric bill.
              </p>

              <h4>12. Internet</h4>
              <p>
                You keep an active Wi-Fi connection at the property. Loss of
                internet may impair dispatch participation but does not affect
                backup operation.
              </p>

              <h4>13. Ending the agreement early</h4>
              <p>
                Email us with 90 days&apos; notice. We remove the system at our
                cost within 60 days. No penalty, no clawback, no fee.
              </p>

              <h4>14. If you sell or move</h4>
              <p>
                The agreement transfers to the next occupant if they want it. If
                they don&apos;t, we remove it at our cost.
              </p>
            </div>
          </div>

          <div className="actions">
            <button className="btn-ghost" type="button">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Email me a copy
            </button>
            <button
              className="btn-primary right"
              onClick={() => setScreen("s08")}
            >
              Continue to signature
              <ArrowRight />
            </button>
          </div>
        </div>
      )}

      {screen === "s08" && (
        <div className="body narrow">
          <p className="eyebrow">Final step</p>
          <h1 className="screen-h1">
            Confirm and <em>sign</em>.
          </h1>
          <p className="lead">
            Three short confirmations and your signature. ESIGN-Act compliant.
            We&apos;ll email you a signed PDF immediately.
          </p>

          <div style={{ marginBottom: 24 }}>
            <div
              className={`check-row ${agreeReadESA ? "checked" : ""}`}
              onClick={() => setAgreeReadESA((v) => !v)}
              role="checkbox"
              aria-checked={agreeReadESA}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  setAgreeReadESA((v) => !v);
                }
              }}
            >
              <span className="box" />
              <div className="text">
                <strong>I&apos;ve read the Energy Storage Agreement.</strong> I
                understand the system is owned and operated by CT Battery Solutions for the
                10-year term, at no cost to me.
              </div>
            </div>
            <div
              className={`check-row ${agreeAuthEnroll ? "checked" : ""}`}
              onClick={() => setAgreeAuthEnroll((v) => !v)}
              role="checkbox"
              aria-checked={agreeAuthEnroll}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  setAgreeAuthEnroll((v) => !v);
                }
              }}
            >
              <span className="box" />
              <div className="text">
                <strong>I authorize enrollment</strong> of my meter in the
                Connecticut Energy Storage Solutions program and designate
                CT Battery Solutions as the program payment recipient.
              </div>
            </div>
            <div
              className={`check-row ${agreeESign ? "checked" : ""}`}
              onClick={() => setAgreeESign((v) => !v)}
              role="checkbox"
              aria-checked={agreeESign}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  setAgreeESign((v) => !v);
                }
              }}
            >
              <span className="box" />
              <div className="text">
                <strong>I agree to electronic signature.</strong> I have read the{" "}
                <a href="#">ESIGN consent disclosure</a> and consent to signing
                this agreement electronically.
              </div>
            </div>
          </div>

          <div className={`signature ${signedName.trim() ? "signed" : ""}`}>
            <div className="label" style={{ marginBottom: 12 }}>
              Sign in the box · type your full legal name
            </div>
            <div className="pad">
              {signedName.trim() ? (
                <span className="sig">{signedName}</span>
              ) : (
                <input
                  className="sig-input"
                  type="text"
                  placeholder="Type your full legal name"
                  value={signedName}
                  onChange={(e) => setSignedName(e.target.value)}
                />
              )}
            </div>
            {signedName.trim() && (
              <div style={{ marginTop: 8 }}>
                <button
                  className="btn-link"
                  type="button"
                  onClick={() => setSignedName("")}
                >
                  Clear &amp; re-sign
                </button>
              </div>
            )}
            <div className="signature-meta">
              <div>
                <div className="k">Signed name</div>
                <div className="v">{signedName || "—"}</div>
              </div>
              <div>
                <div className="k">Signed at</div>
                <div className="v">
                  {new Date().toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    timeZoneName: "short",
                  })}
                </div>
              </div>
              <div>
                <div className="k">IP / device</div>
                <div className="v">— · this browser</div>
              </div>
            </div>
          </div>

          <div className="actions">
            <button className="btn-ghost" onClick={() => setScreen("s07")}>
              Back
            </button>
            <button
              className="btn-primary right"
              disabled={
                submitting ||
                !agreeReadESA ||
                !agreeAuthEnroll ||
                !agreeESign ||
                !signedName.trim()
              }
              onClick={() =>
                submitApplication("s09", { renterPendingConsent: false })
              }
            >
              {submitting ? "Submitting…" : "Sign & submit application"}
              <CheckIcon />
            </button>
          </div>
          {submitError && (
            <p className="footnote" style={{ color: "#b91c1c" }}>
              {submitError}
            </p>
          )}
          <p className="footnote">
            By signing, you agree to the Energy Storage Agreement. You can cancel
            at any time during the 10-year term with 90 days&apos; notice and no
            penalty.
          </p>
        </div>
      )}

      {screen === "s09" && (
        <div className="body narrow">
          <p className="eyebrow">
            Application #{appNumber || "pending"} · received
          </p>
          <h1 className="screen-h1">
            You&apos;re in. <em>Welcome.</em>
          </h1>
          <p className="lead">
            We&apos;ve emailed your signed agreement to {email || "your inbox"}.
            Add hello@gridshift.energy to your contacts so our updates don&apos;t
            end up in spam.
          </p>

          <h2 className="screen-h2" style={{ marginTop: 16 }}>
            What happens next
          </h2>

          <div className="timeline" style={{ marginTop: 20 }}>
            <div className="tl-item done">
              <div className="tl-when">Today · just now</div>
              <div className="tl-title">Application submitted</div>
              <div className="tl-desc">
                Signed agreement on file. We&apos;ve enrolled your meter request
                with {eligibility?.utility ?? "your utility"}.
              </div>
            </div>
            <div className="tl-item cur">
              <div className="tl-when">
                {surveyDate ?? "Soon"} · {surveySlot ?? "TBD"}
              </div>
              <div className="tl-title">Site survey · Marcus from our crew</div>
              <div className="tl-desc">
                15 minutes. He&apos;ll text 30 min before arrival. Calendar
                invite already in your inbox.
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-when">Within 5 business days after survey</div>
              <div className="tl-title">Permits filed</div>
              <div className="tl-desc">
                We pull electrical and ESS permits with your municipality. You
                don&apos;t do anything.
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-when">2–4 weeks out</div>
              <div className="tl-title">Install day · half a workday</div>
              <div className="tl-desc">
                Our crew installs the battery, commissions it, and walks you
                through the app. You&apos;ll be able to schedule that on the
                portal once permits clear.
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-when">5–7 days after install</div>
              <div className="tl-title">Utility enrollment finalized</div>
              <div className="tl-desc">
                Your meter joins the program. Backup power is live from install
                day; dispatch participation begins after enrollment.
              </div>
            </div>
          </div>

          <div className="actions">
            <a className="btn-primary" href="#">
              Go to your portal
            </a>
            <a className="btn-ghost" href="#">
              Add survey to calendar
            </a>
          </div>

          <div className="data-block" style={{ marginTop: 32 }}>
            <div className="k" style={{ marginBottom: 8 }}>
              Questions?
            </div>
            <div
              style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.7 }}
            >
              Call{" "}
              <strong style={{ color: "var(--ink)", fontFamily: "var(--mono)" }}>
                (860) 555 0140
              </strong>{" "}
              · email{" "}
              <a
                href="mailto:hello@gridshift.energy"
                style={{
                  color: "var(--accent-ink)",
                  fontFamily: "var(--mono)",
                }}
              >
                hello@gridshift.energy
              </a>
              <br />
              Mon–Fri, 8am – 6pm ET · Spanish-fluent intake on staff
            </div>
          </div>
        </div>
      )}

      <ApplyFooter />
    </div>
  );
}

function ApplyFooter() {
  return (
    <footer
      style={{
        padding: "32px 28px 40px",
        borderTop: "1px solid var(--rule)",
        display: "flex",
        justifyContent: "space-between",
        gap: 24,
        flexWrap: "wrap",
        fontFamily: "var(--mono)",
        fontSize: 12,
        color: "var(--ink-3)",
        letterSpacing: "0.02em",
      }}
    >
      <div>© 2026 CT Battery Solutions, Inc.</div>
      <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
        <a href="/ct/about" style={{ color: "var(--ink-3)", textDecoration: "none" }}>
          About
        </a>
        <a href="/ct/contact" style={{ color: "var(--ink-3)", textDecoration: "none" }}>
          Contact
        </a>
        <a href="/ct/privacy" style={{ color: "var(--ink-3)", textDecoration: "none" }}>
          Privacy
        </a>
        <a href="/ct/terms" style={{ color: "var(--ink-3)", textDecoration: "none" }}>
          Terms
        </a>
      </div>
      <div>
        <a
          href="mailto:hello@ctbatterysolutions.com"
          style={{ color: "var(--ink-3)", textDecoration: "none" }}
        >
          hello@ctbatterysolutions.com
        </a>
      </div>
    </footer>
  );
}

/* ─── Result sub-screens ────────────────────────────────── */

function ResultStandard({
  eligibility,
  isOwner,
  onContinue,
}: {
  eligibility: EligibilityResult | null;
  isOwner: boolean;
  onContinue: () => void;
}) {
  return (
    <div className="body narrow">
      <p className="eyebrow">Result</p>
      <h1 className="screen-h1">
        Your home <em>qualifies</em>.
      </h1>
      <p className="lead">
        Standard tier of the CT Energy Storage Solutions program. Free Enphase
        IQ Battery 10C, installed by us, operated for 10 years.
      </p>

      <div className="data-block">
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <div>
            <div className="k">Address</div>
            <div className="v">
              {eligibility?.formattedAddress ?? "—"}
            </div>
          </div>
          <div>
            <div className="k">Utility</div>
            <div className="v">{eligibility?.utility ?? "—"}</div>
          </div>
          <div>
            <div className="k">Tier</div>
            <div className="v">Standard</div>
          </div>
        </div>
      </div>

      <ul className="checks-list">
        <li>
          <span className="ok" />
          <div className="body-text">
            <strong>{eligibility?.utility ?? "Utility"} territory confirmed</strong>
            <span>
              You&apos;re in the service area for the Energy Storage Solutions
              program.
            </span>
          </div>
        </li>
        <li>
          <span className="ok" />
          <div className="body-text">
            <strong>
              {isOwner ? "Single-family ownership confirmed" : "Renter path noted"}
            </strong>
            <span>
              {isOwner
                ? "You can sign the agreement directly. No landlord consent needed."
                : "We'll handle the landlord consent step after we collect a few details."}
            </span>
          </div>
        </li>
        <li>
          <span className="ok" />
          <div className="body-text">
            <strong>Utility panel meets program minimum</strong>
            <span>
              Subject to a 15-minute on-site confirmation by our electrician.
            </span>
          </div>
        </li>
      </ul>

      <div className="data-grid">
        <div>
          <div className="k">Your cost</div>
          <div className="v">$0</div>
          <div className="sub">Install · operation · removal</div>
        </div>
        <div>
          <div className="k">Capacity</div>
          <div className="v">10.5 kWh</div>
          <div className="sub">Enphase IQ Battery 10C</div>
        </div>
        <div>
          <div className="k">Term</div>
          <div className="v">10 years</div>
          <div className="sub">90-day exit notice, no penalty</div>
        </div>
      </div>

      <div className="actions">
        <button className="btn-primary" onClick={onContinue}>
          Continue
          <ArrowRight />
        </button>
        <button className="btn-ghost" type="button">
          Email me a summary
        </button>
        <span className="footnote right">Reservation expires in 14 days</span>
      </div>
    </div>
  );
}

function ResultPriority({
  eligibility,
  isOwner,
  onContinue,
}: {
  eligibility: EligibilityResult | null;
  isOwner: boolean;
  onContinue: () => void;
}) {
  const city = eligibility?.city ?? "Your municipality";
  return (
    <div className="body narrow">
      <p className="eyebrow">Result · priority community</p>
      <h1 className="screen-h1">
        Your home qualifies for the <em>strongest tier</em>.
      </h1>
      <p className="lead">
        {city} is on the state&apos;s distressed-municipality list. That means a
        longer guaranteed backup window and faster install scheduling at no
        additional cost.
      </p>

      <div className="banner">
        <span className="ico">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12Z" />
            <circle cx="12" cy="9.5" r="2.5" />
          </svg>
        </span>
        <div>
          <h4>{city} is a priority municipality</h4>
          <p>
            Households here automatically qualify for the program&apos;s enhanced
            performance tier. You&apos;ll get the same equipment, with a
            guaranteed minimum 8-hour outage runtime and priority scheduling.
          </p>
        </div>
      </div>

      <ul className="checks-list">
        <li className="priority">
          <span className="ok" />
          <div className="body-text">
            <strong>Distressed-municipality tier · {city}</strong>
            <span>
              Enhanced backup runtime guarantee · priority installation queue.
            </span>
          </div>
        </li>
        <li>
          <span className="ok" />
          <div className="body-text">
            <strong>{eligibility?.utility ?? "Utility"} territory confirmed</strong>
            <span>
              You&apos;re in the service area for the Energy Storage Solutions
              program.
            </span>
          </div>
        </li>
        <li>
          <span className="ok" />
          <div className="body-text">
            <strong>
              {isOwner ? "Optional · income-qualified tier" : "Renter path noted"}
            </strong>
            <span>
              {isOwner
                ? "You may also qualify based on household income. We'll ask on the next step (one optional question, or skip)."
                : "We'll handle the landlord consent step after we collect a few details."}
            </span>
          </div>
        </li>
      </ul>

      <div className="data-grid">
        <div>
          <div className="k">Your cost</div>
          <div className="v">$0</div>
          <div className="sub">Install · operation · removal</div>
        </div>
        <div>
          <div className="k">Capacity</div>
          <div className="v">10.5 kWh</div>
          <div className="sub">Enphase IQ Battery 10C</div>
        </div>
        <div>
          <div className="k">Backup runtime</div>
          <div className="v">≥ 8 hrs</div>
          <div className="sub">Essentials · guaranteed minimum</div>
        </div>
      </div>

      <div className="actions">
        <button className="btn-primary" onClick={onContinue}>
          Continue
          <ArrowRight />
        </button>
        <button className="btn-ghost" type="button">
          Email me a summary
        </button>
      </div>
    </div>
  );
}

function ResultIneligible({
  eligibility,
  address,
  onBack,
}: {
  eligibility: EligibilityResult | null;
  address: string;
  onBack: () => void;
}) {
  return (
    <div className="body narrow">
      <p className="eyebrow">Result</p>
      <h1 className="screen-h1">
        We can&apos;t enroll your address <em>today</em>.
      </h1>
      <p className="lead">
        The CT Energy Storage Solutions program is currently limited to Eversource
        and United Illuminating customers in Connecticut. Your address falls
        outside both territories.
      </p>

      <div className="banner warn">
        <span className="ico">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </span>
        <div>
          <h4>Why this happened</h4>
          <p>
            {eligibility?.reason ??
              "We couldn't match your address to a participating utility."}
          </p>
        </div>
      </div>

      <div className="data-block">
        <div className="k" style={{ marginBottom: 10 }}>
          What we found
        </div>
        <div style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: "1px solid var(--rule)",
            }}
          >
            <span>Address</span>
            <span style={{ fontFamily: "var(--mono)", color: "var(--ink)" }}>
              {eligibility?.formattedAddress ?? address}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: "1px solid var(--rule)",
            }}
          >
            <span>Utility</span>
            <span style={{ fontFamily: "var(--mono)", color: "var(--ink)" }}>
              {eligibility?.utility ?? "Not detected"}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
            }}
          >
            <span>Program coverage</span>
            <span style={{ fontFamily: "var(--mono)", color: "var(--err)" }}>
              Not currently included
            </span>
          </div>
        </div>
      </div>

      <div className="field">
        <label htmlFor="notify-email">Email me when this changes</label>
        <input id="notify-email" type="email" placeholder="you@example.com" />
        <div className="field-help">
          We&apos;ll email once. No newsletter, no marketing list.
        </div>
      </div>

      <div className="actions">
        <button className="btn-primary">Notify me</button>
        <a className="btn-ghost" href="/ct/about">
          Read about the program
        </a>
        <button className="btn-link" onClick={onBack} style={{ marginLeft: 8 }}>
          Try a different address
        </button>
      </div>
    </div>
  );
}
