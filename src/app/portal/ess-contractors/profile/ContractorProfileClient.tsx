"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/lib/api";

type Contractor = {
  id: number;
  name: string;
  contractorName: string | null;
  street1: string | null;
  street2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  lat: number | null;
  lng: number | null;
  awardWinner: boolean;
  propertyTypes: string[];
  services: string[];
  batteryTechnologies: string[];
  logoUrl: string | null;
};

export default function ContractorProfileClient() {
  const [c, setC] = useState<Contractor | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
      setError("No contractor selected.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/ess/contractors/${id}`);
        const json = await res.json();
        if (!res.ok || json?.success === false) throw new Error(json?.message || `Request failed (${res.status})`);
        setC(json.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load contractor");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addr = c ? [c.street1, c.street2, [c.city, c.state, c.zip].filter(Boolean).join(", ")].filter(Boolean).join(", ") : "";

  return (
    <>
      <Link href="/portal/ess-contractors" style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--accent-ink)", textDecoration: "none" }}>
        ← All contractors
      </Link>

      {loading && <p style={{ color: "var(--ink-3)", fontFamily: "var(--mono)", fontSize: 13, marginTop: 16 }}>Loading…</p>}
      {error && <p style={{ color: "var(--c-red)", fontFamily: "var(--mono)", fontSize: 13, marginTop: 16 }}>{error}</p>}

      {c && (
        <>
          <div style={{ display: "flex", gap: 16, alignItems: "center", margin: "16px 0 8px", flexWrap: "wrap" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {c.logoUrl ? <img src={c.logoUrl} alt={c.name} style={{ height: 56, width: "auto", maxWidth: 160, objectFit: "contain", borderRadius: 6, border: "1px solid var(--rule-2)", background: "#fff", padding: 4 }} /> : null}
            <div>
              <h1 style={{ margin: 0, fontFamily: "var(--serif)", fontSize: "clamp(24px,3vw,32px)" }}>{c.name}</h1>
              <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>
                {[c.city, c.state].filter(Boolean).join(", ")}
                {c.awardWinner && <span style={{ marginLeft: 10, color: "var(--c-amber)", background: "var(--c-amber-l)", padding: "2px 8px", borderRadius: 4 }}>★ Award winner</span>}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginTop: 16 }}>
            <div style={panel}>
              <div style={panelTitle}>Contact</div>
              {c.contractorName && <KV k="Contractor" v={c.contractorName} />}
              {addr && <KV k="Address" v={addr} />}
              {c.phone && <KV k="Phone" v={<a href={`tel:${c.phone}`} style={link}>{c.phone}</a>} />}
              {c.email && <KV k="Email" v={<a href={`mailto:${c.email}`} style={link}>{c.email}</a>} />}
              {c.website && <KV k="Website" v={<a href={c.website} target="_blank" rel="noreferrer" style={link}>{c.website.replace(/^https?:\/\//, "")}</a>} />}
              {c.lat != null && c.lng != null && (
                <KV k="Map" v={<a href={`https://www.google.com/maps?q=${c.lat},${c.lng}`} target="_blank" rel="noreferrer" style={link}>Open in Maps</a>} />
              )}
            </div>

            <div style={panel}>
              <div style={panelTitle}>Offerings</div>
              <ChipRow label="Property types" items={c.propertyTypes} />
              <ChipRow label="Services" items={c.services} />
              <ChipRow label="Battery technologies" items={c.batteryTechnologies} />
            </div>
          </div>
        </>
      )}
    </>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "space-between", padding: "5px 0", fontSize: 13.5, borderTop: "1px solid var(--rule-2)" }}>
      <span style={{ color: "var(--ink-3)", flex: "none" }}>{k}</span>
      <span style={{ color: "var(--ink)", textAlign: "right", wordBreak: "break-word" }}>{v}</span>
    </div>
  );
}

function ChipRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 6 }}>{label}</div>
      {items.length === 0 ? (
        <span style={{ color: "var(--ink-4)", fontSize: 13 }}>—</span>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {items.map((i) => (
            <span key={i} style={{ fontSize: 12.5, background: "var(--bg-soft)", border: "1px solid var(--rule-2)", borderRadius: 999, padding: "3px 10px", color: "var(--ink-2)" }}>{i}</span>
          ))}
        </div>
      )}
    </div>
  );
}

const panel: React.CSSProperties = { background: "#fff", border: "1px solid var(--rule-2)", borderRadius: 8, padding: "16px 18px" };
const panelTitle: React.CSSProperties = { fontFamily: "var(--serif)", fontSize: 16, marginBottom: 10 };
const link: React.CSSProperties = { color: "var(--accent-ink)", textDecoration: "none" };
