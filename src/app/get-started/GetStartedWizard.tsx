"use client";

import { useState, useRef, useEffect, type CSSProperties } from "react";
import { apiFetch } from "@/lib/api";
import AddressAutocomplete, { type PickedAddress } from "@/components/AddressAutocomplete";
import ShareBox from "@/components/ShareBox";

const C = {
  brand: "#2f5d4e",
  brandDark: "#234a3e",
  bg: "#fafaf8",
  panel: "#f2f1ec",
  border: "#d8d6ce",
  ink: "#1a1a1a",
  ink2: "#3a3a37",
  muted: "#6b6b66",
  gold: "#92600C",
  goldBg: "#FBF0DA",
  red: "#b91c1c",
  white: "#fff",
};

const FONTS =
  "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500&display=swap";

const mono: CSSProperties = { fontFamily: "'JetBrains Mono',ui-monospace,monospace" };
const serif: CSSProperties = { fontFamily: "'DM Serif Display',Georgia,serif", fontWeight: 400 };

type Eligibility = { kind: "STANDARD" | "PRIORITY" | "INELIGIBLE"; city?: string | null; reason?: string };
type LookupResult = { address: string | null; eligibility: Eligibility; utility: { utility_name: string } | null };

const STEPS = ["Eligibility", "Your info", "Letter of Intent"];

export default function GetStartedWizard() {
  const [step, setStep] = useState(1); // 1..3, 4 = done
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false); // step-1 evaluation animation
  const [error, setError] = useState("");

  // step 1
  const [address, setAddress] = useState("");
  const [utility, setUtility] = useState("");
  const [elig, setElig] = useState<LookupResult | null>(null);
  const [essEnhanced, setEssEnhanced] = useState(false);

  // step 2 (lead)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tenure, setTenure] = useState("homeowner");

  // step 3 (LOI)
  const [propertyAddress, setPropertyAddress] = useState("");
  const [timeframe, setTimeframe] = useState("flexible");
  const [signedName, setSignedName] = useState("");
  const [agree, setAgree] = useState(false);
  const [loiNumber, setLoiNumber] = useState("");

  // Coords captured when the user picks an autocomplete suggestion (address →
  // lat/lng); freeform text is geocoded server-side on submit.
  const pickedRef = useRef<PickedAddress | null>(null);

  // Run the eligibility lookup behind a processing animation (min display time
  // so the "evaluation" reads as deliberate, not a flash).
  async function runCheck(addr: string, coords?: { lat: number; lng: number }) {
    const value = addr.trim();
    if (!value) return;
    setChecking(true);
    setError("");
    setElig(null);
    try {
      const [res] = await Promise.all([
        apiFetch<LookupResult>("/api/lookup", {
          method: "POST",
          body: JSON.stringify({ address: value, ...(coords ?? {}) }),
        }),
        new Promise((r) => setTimeout(r, 2200)),
      ]);
      setElig(res);
      if (res.eligibility.kind !== "INELIGIBLE") {
        setPropertyAddress(res.address || value);
        setStep(2);
        // Non-blocking: check the enhanced ESS tier for a positive nudge.
        apiFetch<{ tier?: string }>("/api/ess/qualify", {
          method: "POST",
          body: JSON.stringify({ address: value, ...(coords ?? {}) }),
        })
          .then((e) => setEssEnhanced(!!e.tier && e.tier !== "STANDARD"))
          .catch(() => {});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setChecking(false);
    }
  }

  function checkEligibility(e: React.FormEvent) {
    e.preventDefault();
    const p = pickedRef.current;
    const coords = p && p.address === address.trim() ? { lat: p.lat, lng: p.lng } : undefined;
    runCheck(address, coords);
  }

  // If we arrived from the landing address field (?address=...), prefill the
  // address so the visitor just confirms their provider and runs the check.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const a = q.get("address");
    if (!a) return;
    setAddress(a);
    const lat = Number(q.get("lat"));
    const lng = Number(q.get("lng"));
    if (q.get("lat") && q.get("lng") && !Number.isNaN(lat) && !Number.isNaN(lng)) {
      pickedRef.current = { lat, lng, address: a };
    }
  }, []);

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiFetch("/api/leads", {
        method: "POST",
        body: JSON.stringify({
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          email: email.trim(),
          phone: phone.trim() || undefined,
          tenure,
          utility: utility || undefined,
          cityOrZip: elig?.eligibility.city || undefined,
          source: "get-started",
        }),
      });
      setSignedName([firstName, lastName].filter(Boolean).join(" ").trim());
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your info");
    } finally {
      setLoading(false);
    }
  }

  async function submitLoi(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch<{ id: number; loiNumber: string; pdfBase64: string }>("/api/loi", {
        method: "POST",
        body: JSON.stringify({
          siteOwnerName: signedName.trim(),
          propertyAddress: propertyAddress.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          batteryCount: "two", // default; final sizing happens at property evaluation
          timeframe,
          signedName: signedName.trim(),
          source: "get-started",
        }),
      });
      setLoiNumber(res.loiNumber);
      downloadPdf(res.pdfBase64, `${res.loiNumber}.pdf`);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit your Letter of Intent");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.ink, fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={FONTS} />
      <style>{`
        .gs-in{font-family:'DM Sans',sans-serif;font-size:16px;color:#1a1a1a;background:#fff;border:1px solid ${C.border};border-radius:6px;padding:12px 13px;outline:none;width:100%;box-sizing:border-box}
        .gs-in:focus{border-color:${C.brand};box-shadow:0 0 0 3px #e6eeea}
        .gs-lb{${mono2()};font-size:10.5px;font-weight:500;letter-spacing:.09em;text-transform:uppercase;color:${C.muted};display:block;margin-bottom:6px}
        .pac-container{z-index:10050;border-radius:8px;border:1px solid ${C.border};box-shadow:0 12px 32px rgba(26,26,24,.16);font-family:'DM Sans',sans-serif;margin-top:4px}
        .pac-item{padding:8px 12px;font-size:14px;cursor:pointer}
        @keyframes gs-spin{to{transform:rotate(360deg)}}
        @keyframes gs-bar{0%{left:-40%}100%{left:100%}}
        @keyframes gs-fade{0%,100%{opacity:.35}50%{opacity:1}}
      `}</style>

      <header style={{ borderBottom: `1px solid ${C.border}`, padding: "16px 0" }}>
        <div style={wrap}>
          <a href="/" aria-label="CT Battery Solutions" style={{ display: "inline-flex" }}>
            <img src="/logo-3.png" alt="CT Battery Solutions" style={{ height: 30, width: "auto", display: "block" }} />
          </a>
        </div>
      </header>

      <main style={{ ...wrap, paddingTop: 32, paddingBottom: 64, maxWidth: 760 }}>
        <Stepper step={Math.min(step, 3)} />

        {error && (
          <div style={{ background: "#fdecec", border: `1px solid ${C.red}`, color: "#7a1f1f", borderRadius: 8, padding: "12px 15px", margin: "16px 0", fontSize: 14.5 }}>
            {error}
          </div>
        )}

        {/* STEP 1 — eligibility */}
        {step === 1 && checking && (
          <Panel eyebrow="Step 1 · Eligibility" title="Checking your address…">
            <Evaluating address={address} />
          </Panel>
        )}
        {step === 1 && !checking && (
          <Panel eyebrow="Step 1 · Eligibility" title="Is your Connecticut home eligible?">
            <p style={lead}>
              Enter your address. This program is Connecticut-only right now — we&apos;ll check your
              address before anything else. No cost, no obligation.
            </p>
            {elig?.eligibility.kind === "INELIGIBLE" ? (
              <div style={{ background: C.goldBg, border: `1px solid #E8CE85`, borderRadius: 10, padding: "18px 20px", marginTop: 8 }}>
                <p style={{ ...serif, fontSize: 22, margin: "0 0 8px" }}>Connecticut only, for now.</p>
                <p style={{ margin: 0, color: C.ink2, lineHeight: 1.6 }}>
                  {elig.eligibility.reason || "This address is outside our Connecticut service area."} Try a
                  different address, or check back as we expand.
                </p>
                <button style={{ ...btnGhost, marginTop: 16 }} onClick={() => setElig(null)}>
                  ← Try another address
                </button>
              </div>
            ) : (
              <form onSubmit={checkEligibility}>
                <label className="gs-lb" htmlFor="addr">Service address (Connecticut)</label>
                <AddressAutocomplete
                  id="addr"
                  value={address}
                  onChange={setAddress}
                  onPick={(p) => (pickedRef.current = p)}
                  placeholder="100 Main St, Hartford, CT 06103"
                  ariaLabel="Service address"
                  autoFocus
                  inputClassName="gs-in"
                />
                <label className="gs-lb" htmlFor="util" style={{ marginTop: 16 }}>Your electric provider</label>
                <select id="util" className="gs-in" value={utility} onChange={(e) => setUtility(e.target.value)} required>
                  <option value="">Select your provider…</option>
                  <option value="Eversource">Eversource (CL&amp;P)</option>
                  <option value="United Illuminating">United Illuminating (UI)</option>
                  <option value="Norwich Public Utilities">Norwich Public Utilities</option>
                  <option value="Other / Not sure">Other / Not sure</option>
                </select>
                <button type="submit" style={{ ...btnPrimary, marginTop: 18 }} disabled={!address.trim() || !utility}>
                  See if I qualify →
                </button>
              </form>
            )}
          </Panel>
        )}

        {/* STEP 2 — join */}
        {step === 2 && (
          <Panel eyebrow="Step 2 · Your info" title="You're in the service area.">
            <div style={{ ...eligBadge(elig!.eligibility.kind) }}>
              {elig?.eligibility.kind === "PRIORITY" ? "Priority area" : "Eligible"} · {elig?.address}
              {elig?.utility ? ` · ${elig.utility.utility_name}` : ""}
            </div>
            {essEnhanced && (
              <div style={{ fontSize: 14, color: C.brandDark, background: "#e6eeea", border: "1px solid #bcd", borderRadius: 8, padding: "10px 13px", marginBottom: 14 }}>
                ✓ Good news — your area qualifies for the program&apos;s <strong>enhanced compensation tier</strong>.
              </div>
            )}
            <p style={lead}>A few details so we can keep you posted and prepare your Letter of Intent.</p>
            <form onSubmit={submitLead}>
              <div style={row2}>
                <div><label className="gs-lb">First name</label><input className="gs-in" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
                <div><label className="gs-lb">Last name</label><input className="gs-in" value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
              </div>
              <div style={{ marginTop: 14 }}><label className="gs-lb">Email · required</label><input className="gs-in" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div style={{ ...row2, marginTop: 14 }}>
                <div><label className="gs-lb">Phone · optional</label><input className="gs-in" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                <div><label className="gs-lb">I am a</label>
                  <select className="gs-in" value={tenure} onChange={(e) => setTenure(e.target.value)}>
                    <option value="homeowner">Homeowner</option>
                    <option value="renter">Renter</option>
                    <option value="other">Organization</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button type="button" style={btnGhost} onClick={() => setStep(1)}>← Back</button>
                <button type="submit" style={btnPrimary} disabled={loading || !email.trim()}>{loading ? "Saving…" : "Continue →"}</button>
              </div>
            </form>
          </Panel>
        )}

        {/* STEP 3 — LOI */}
        {step === 3 && (
          <Panel eyebrow="Step 3 · Letter of Intent" title="Sign a (non-binding) Letter of Intent.">
            <p style={lead}>
              This confirms your good-faith interest so we can include it in our program application. It&apos;s
              <strong> non-binding</strong> — it isn&apos;t a contract and commits you to nothing.
            </p>
            <form onSubmit={submitLoi}>
              <label className="gs-lb">Property address</label>
              <input className="gs-in" value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} required />

              <div style={{ marginTop: 16 }}><span className="gs-lb">Desired timeframe</span>
                <Choices name="tf" value={timeframe} onChange={setTimeframe} opts={[["asap", "As soon as possible"], ["flexible", "Flexible"]]} />
              </div>

              <div style={{ marginTop: 20, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                <label className="gs-lb">Type your full name to sign</label>
                <input className="gs-in" value={signedName} onChange={(e) => setSignedName(e.target.value)} placeholder="Full legal name" required />
                <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 12, fontSize: 14.5, color: C.ink2 }}>
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ marginTop: 3 }} />
                  <span>I am the site owner (or authorized), and I sign this non-binding Letter of Intent electronically.</span>
                </label>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button type="button" style={btnGhost} onClick={() => setStep(2)}>← Back</button>
                <button type="submit" style={btnPrimary} disabled={loading || !signedName.trim() || !agree}>{loading ? "Submitting…" : "Sign & download LOI"}</button>
              </div>
            </form>
          </Panel>
        )}

        {/* DONE */}
        {step === 4 && (
          <Panel eyebrow="Done" title="You're on the list — thank you.">
            <p style={lead}>
              Your Letter of Intent was created and downloaded to your device. We&apos;ve got your interest on
              record and will email you as the program moves forward.
            </p>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", margin: "0 0 4px" }}>
              <div style={{ ...mono, fontSize: 10.5, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", color: C.muted, marginBottom: 6 }}>
                Letter of Intent no.
              </div>
              <div style={{ ...mono, fontSize: 18, color: C.ink }}>{loiNumber}</div>
            </div>
            <ShareBox url={shareUrl()} />
            <a href="/" style={{ ...btnPrimary, display: "inline-block", textDecoration: "none", marginTop: 18 }}>← Back to home</a>
          </Panel>
        )}

        <FlowDisclaimer step={step} />
      </main>
    </div>
  );
}

/* ---- little pieces ---- */
function Stepper({ step }: { step: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 8 }}>
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < step;
        const cur = n === step;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "none" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: done || cur ? "#fff" : C.muted, background: done ? C.brand : cur ? C.gold : "#fff", border: `2px solid ${done ? C.brand : cur ? C.gold : C.border}` }}>
                {done ? "✓" : n}
              </div>
              <span style={{ ...mono, fontSize: 11, letterSpacing: ".05em", color: cur ? C.gold : done ? C.brand : C.muted, whiteSpace: "nowrap" }}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 3, margin: "0 12px", background: done ? C.brand : C.border, borderRadius: 2 }} />}
          </div>
        );
      })}
    </div>
  );
}

function Evaluating({ address }: { address: string }) {
  const messages = [
    "Locating your address…",
    "Matching your utility territory…",
    "Confirming Connecticut program eligibility…",
    "Preparing your result…",
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => Math.min(i + 1, messages.length - 1)), 560);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div style={{ padding: "12px 0 8px" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", border: `4px solid ${C.border}`, borderTopColor: C.brand, animation: "gs-spin .9s linear infinite" }} />
      </div>
      {address && (
        <p style={{ ...mono, textAlign: "center", fontSize: 12, color: C.muted, margin: "0 0 6px", wordBreak: "break-word" }}>{address}</p>
      )}
      <p style={{ textAlign: "center", fontSize: 17, color: C.ink2, margin: "0 0 20px", minHeight: 24 }}>{messages[idx]}</p>
      <div style={{ position: "relative", height: 6, background: C.panel, borderRadius: 999, overflow: "hidden", maxWidth: 360, margin: "0 auto" }}>
        <div style={{ position: "absolute", top: 0, height: "100%", width: "40%", background: C.brand, borderRadius: 999, animation: "gs-bar 1.1s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

function Panel({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: "clamp(22px,4vw,36px)", marginTop: 20 }}>
      <p style={{ ...mono, fontSize: 11, fontWeight: 500, letterSpacing: ".13em", textTransform: "uppercase", color: C.muted, margin: "0 0 12px" }}>{eyebrow}</p>
      <h1 style={{ ...serif, fontSize: "clamp(26px,3.4vw,38px)", lineHeight: 1.15, letterSpacing: "-.01em", margin: "0 0 14px" }}>{title}</h1>
      {children}
    </div>
  );
}

function Choices({ value, onChange, opts }: { name: string; value: string; onChange: (v: string) => void; opts: readonly (readonly [string, string])[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {opts.map(([v, l]) => <Chip key={v} on={value === v} onClick={() => onChange(v)}>{l}</Chip>)}
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} style={{ padding: "9px 14px", borderRadius: 999, border: `1px solid ${on ? C.brand : C.border}`, background: on ? "#e6eeea" : "#fff", color: on ? C.brandDark : C.ink2, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
      {children}
    </button>
  );
}

function mono2() {
  return "font-family:'JetBrains Mono',ui-monospace,monospace";
}

// Persistent disclaimer shown on every step of the flow; adds LOI-specific
// language once the visitor reaches the Letter of Intent steps.
function FlowDisclaimer({ step }: { step: number }) {
  const loi = step >= 3;
  return (
    <p style={{ ...mono, fontSize: 11.5, lineHeight: 1.75, color: C.muted, margin: "18px 4px 0", maxWidth: 720 }}>
      Joining the list places you under no obligation. It is not an application, enrollment, or contract, and it
      does not guarantee eligibility, program approval, incentives, or service. Connecticut only.
      {loi
        ? " A Letter of Intent is non-binding — it is not a contract, reserves no incentive funds, and commits you to nothing. Any project depends on CT Battery Solutions receiving program approval, your eligibility, and a separate written agreement."
        : ""}{" "}
      Program terms are set by the administrators; see{" "}
      <a href="https://energystoragect.com" target="_blank" rel="noopener" style={{ color: C.brandDark }}>
        energystoragect.com
      </a>
      .
    </p>
  );
}

function shareUrl() {
  return typeof window !== "undefined" ? `${window.location.origin}/` : "https://ctbatterysolutions.com/";
}

// base64 → Blob → trigger a client-side download
function downloadPdf(base64: string, filename: string) {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const wrap: CSSProperties = { maxWidth: 1120, margin: "0 auto", padding: "0 clamp(20px,5vw,56px)" };
const lead: CSSProperties = { fontSize: 16.5, lineHeight: 1.6, color: C.ink2, margin: "0 0 20px" };
const row2: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14 };
const btnPrimary: CSSProperties = { background: C.brand, color: "#fff", border: "none", borderRadius: 6, padding: "14px 24px", fontSize: 16, fontWeight: 500, cursor: "pointer" };
const btnGhost: CSSProperties = { background: "#fff", color: C.ink2, border: `1px solid ${C.border}`, borderRadius: 6, padding: "14px 20px", fontSize: 15, cursor: "pointer" };
const eligBadge = (kind: string): CSSProperties => ({ ...mono, display: "inline-block", fontSize: 12, color: kind === "PRIORITY" ? "#1a5cff" : C.brand, background: kind === "PRIORITY" ? "#eaf0ff" : "#e6eeea", border: `1px solid ${kind === "PRIORITY" ? "#c7d6ff" : "#bcd"}`, borderRadius: 6, padding: "6px 10px", marginBottom: 14 });
