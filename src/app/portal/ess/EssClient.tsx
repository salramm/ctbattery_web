"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useRef, useState } from "react";
import { API_BASE } from "@/lib/api";
import AddressAutocomplete, { type PickedAddress } from "@/components/AddressAutocomplete";

declare global {
  interface Window {
    L?: any;
  }
}

type LayerStatus = { name: string; label: string; loaded: boolean; features: number };
type Status = { layers: LayerStatus[]; gracePeriodTowns: number };
type Qualify = {
  located: boolean;
  address: string | null;
  coordinates: { lat: number; lng: number } | null;
  town?: string | null;
  tier?: string;
  tierLabel?: string;
  reasons?: string[];
  categories?: { inEjBlockGroup: boolean; inDistressedMuni: boolean; matchedMuni: string | null; inGracePeriod: boolean; underserved: boolean };
  compensation?: { oneTimeSignupUsd: number; performanceUsdPerKwhYear: number; enhanced: boolean };
  itc?: { basePct: number; confirmedPct: number; potentialPct: number; adders: { key: string; label: string; pct: number; basis: string; applies: boolean | null }[] };
  message?: string;
};

const LAYER_STYLE: Record<string, { color: string; label: string }> = {
  "ej-block-groups": { color: "#7c3aed", label: "EJ Block Groups" },
  "distressed-municipalities": { color: "#d97706", label: "Distressed Municipalities" },
  "energy-communities": { color: "#1d4e89", label: "Energy Communities (+10% ITC)" },
  "nmtc-low-income": { color: "#0f6b6b", label: "NMTC Low-Income Tracts (+10% ITC)" },
};

function loadLeaflet(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (window.L) return resolve(window.L);
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    const existing = document.getElementById("leaflet-js") as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(window.L));
      if (window.L) resolve(window.L);
      return;
    }
    const s = document.createElement("script");
    s.id = "leaflet-js";
    s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    s.async = true;
    s.onload = () => resolve(window.L);
    s.onerror = () => reject(new Error("map failed to load"));
    document.head.appendChild(s);
  });
}

async function opsFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  const json = await res.json();
  if (!res.ok || json?.success === false) throw new Error(json?.message || `Request failed (${res.status})`);
  return json.data as T;
}

export default function EssClient() {
  const [status, setStatus] = useState<Status | null>(null);
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<Qualify | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const pickedRef = useRef<PickedAddress | null>(null);

  const mapEl = useRef<HTMLDivElement>(null);
  const mapObj = useRef<any>(null);
  const overlays = useRef<Record<string, any>>({});
  const marker = useRef<any>(null);

  useEffect(() => {
    opsFetch<Status>("/api/ess/status")
      .then((s) => {
        setStatus(s);
        const v: Record<string, boolean> = {};
        s.layers.forEach((l) => (v[l.name] = l.loaded));
        setVisible(v);
      })
      .catch(() => setStatus(null));
  }, []);

  // Init map.
  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then((L) => {
      if (cancelled || !mapEl.current || mapObj.current) return;
      const map = L.map(mapEl.current, { zoomControl: true, scrollWheelZoom: true }).setView([41.6, -72.7], 8);
      mapObj.current = map;
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; OSM &copy; CARTO",
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);
      setTimeout(() => map.invalidateSize(), 120);
    });
    return () => {
      cancelled = true;
      if (mapObj.current) {
        mapObj.current.remove();
        mapObj.current = null;
        overlays.current = {};
        marker.current = null;
      }
    };
  }, []);

  // Add/remove overlays when visibility or map changes.
  const syncLayer = useCallback(async (name: string, show: boolean) => {
    const L = window.L;
    const map = mapObj.current;
    if (!L || !map) return;
    if (!show) {
      if (overlays.current[name]) {
        map.removeLayer(overlays.current[name]);
        delete overlays.current[name];
      }
      return;
    }
    if (overlays.current[name]) return;
    try {
      const res = await fetch(`${API_BASE}/api/ess/layers/${name}`);
      if (!res.ok) return;
      const gj = await res.json();
      const c = LAYER_STYLE[name]?.color ?? "#2f5d4e";
      const layer = L.geoJSON(gj, {
        style: { color: c, weight: 1, fillColor: c, fillOpacity: 0.15 },
      }).addTo(map);
      overlays.current[name] = layer;
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    Object.entries(visible).forEach(([name, show]) => syncLayer(name, show));
  }, [visible, status, syncLayer]);

  async function qualify(e?: React.FormEvent) {
    e?.preventDefault();
    const v = address.trim();
    if (!v) return;
    setChecking(true);
    setError("");
    try {
      const p = pickedRef.current;
      const body = p && p.address === v ? { lat: p.lat, lng: p.lng, address: v } : { address: v };
      const res = await fetch(`${API_BASE}/api/ess/qualify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Lookup failed");
      const data: Qualify = json.data;
      setResult(data);
      // Pin the location.
      const L = window.L;
      if (L && mapObj.current && data.coordinates) {
        if (marker.current) mapObj.current.removeLayer(marker.current);
        marker.current = L.circleMarker([data.coordinates.lat, data.coordinates.lng], {
          radius: 9,
          color: "#fff",
          weight: 2,
          fillColor: data.categories?.underserved ? "#16a34a" : "#1c1c1a",
          fillOpacity: 1,
        }).addTo(mapObj.current);
        mapObj.current.setView([data.coordinates.lat, data.coordinates.lng], 12);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setChecking(false);
    }
  }

  const anyLoaded = status?.layers.some((l) => l.loaded);

  return (
    <>
      <div className="page-head">
        <p className="eyebrow">Operations · ESS</p>
        <h1>ESS qualification.</h1>
        <p className="lead">
          Check an address against Connecticut Energy Storage Solutions compensation tiers and the federal
          ITC adder stack. Underserved geographies (EJ block groups, distressed municipalities, grace-period
          towns) unlock the enhanced ESS tier; IRA Energy Communities (coal-closure tracts + fossil-fuel
          employment areas) add the +10% ITC energy-community adder.
        </p>
        {!anyLoaded && (
          <span style={demoNote}>
            ✳ Underserved layers not uploaded yet — everything resolves to the base tier until the EJ /
            distressed-municipality GeoJSON is added.
          </span>
        )}
      </div>

      {/* Address qualification */}
      <div style={panel}>
        <div style={panelHead}><span style={panelTitle}>Qualify an address</span></div>
        <form onSubmit={qualify} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ flex: "1 1 300px", minWidth: 0 }}>
            <AddressAutocomplete
              value={address}
              onChange={setAddress}
              onPick={(p) => (pickedRef.current = p)}
              placeholder="100 Main St, Hartford, CT"
              ariaLabel="Address"
              inputStyle={inp}
            />
          </div>
          <button type="submit" disabled={checking || !address.trim()} style={btn}>
            {checking ? "Checking…" : "Check qualification"}
          </button>
        </form>
        {error && <p style={{ color: "var(--c-red)", fontFamily: "var(--mono)", fontSize: 13, marginTop: 10 }}>{error}</p>}
        {result && result.located && <QualifyResult r={result} />}
        {result && !result.located && <p style={{ color: "var(--ink-3)", marginTop: 12 }}>{result.message}</p>}
      </div>

      {/* Map + layers */}
      <div style={{ ...panel, marginTop: 16 }}>
        <div style={panelHead}>
          <span style={panelTitle}>Underserved map</span>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {status?.layers.map((l) => (
              <label key={l.name} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--mono)", fontSize: 11, color: l.loaded ? "var(--ink-2)" : "var(--ink-4)" }}>
                <input
                  type="checkbox"
                  disabled={!l.loaded}
                  checked={!!visible[l.name]}
                  onChange={(e) => setVisible((v) => ({ ...v, [l.name]: e.target.checked }))}
                />
                <span style={{ width: 10, height: 10, borderRadius: 2, background: LAYER_STYLE[l.name]?.color ?? "#2f5d4e", opacity: l.loaded ? 1 : 0.3 }} />
                {LAYER_STYLE[l.name]?.label ?? l.label} {l.loaded ? `(${l.features})` : "· not loaded"}
              </label>
            ))}
          </div>
        </div>
        <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid var(--rule)" }}>
          <div ref={mapEl} style={{ height: 460, width: "100%", background: "#e9e9e6" }} />
        </div>
      </div>
    </>
  );
}

function QualifyResult({ r }: { r: Qualify }) {
  const under = r.categories?.underserved;
  return (
    <div style={{ marginTop: 16, borderTop: "1px solid var(--rule-2)", paddingTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ ...tierPill, background: under ? "var(--c-green-l)" : "var(--bg-soft)", color: under ? "var(--c-green)" : "var(--ink-2)" }}>
          {r.tierLabel}
        </span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink-3)" }}>{r.address}</span>
      </div>
      {r.reasons && r.reasons.length > 0 && (
        <ul style={{ margin: "12px 0 0", paddingLeft: 18, color: "var(--ink-2)", fontSize: 13.5 }}>
          {r.reasons.map((x) => <li key={x} style={{ marginBottom: 3 }}>{x}</li>)}
        </ul>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginTop: 14 }}>
        <div style={sub}>
          <div style={subH}>ESS compensation</div>
          <KV k="One-time sign-up" v={`$${r.compensation?.oneTimeSignupUsd}`} />
          <KV k="Performance (yearly)" v={`$${r.compensation?.performanceUsdPerKwhYear} / kWh·yr`} />
          {r.compensation?.enhanced && <KV k="Tier" v="Enhanced (underserved)" />}
        </div>
        <div style={sub}>
          <div style={subH}>Federal ITC adder stack</div>
          <KV k="Base ITC" v={`${r.itc?.basePct}%`} />
          {r.itc?.adders.map((a) => (
            <KV
              key={a.key}
              k={a.label}
              v={a.applies === true ? `+${a.pct}% ✓` : a.applies === false ? "n/a" : `+${a.pct}% (review)`}
            />
          ))}
          <KV k="Total" v={`${r.itc?.confirmedPct}%${r.itc && r.itc.potentialPct > r.itc.confirmedPct ? ` – ${r.itc.potentialPct}%` : ""}`} />
        </div>
      </div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "4px 0", fontSize: 13 }}>
      <span style={{ color: "var(--ink-3)" }}>{k}</span>
      <span style={{ color: "var(--ink)", fontWeight: 500, textAlign: "right" }}>{v}</span>
    </div>
  );
}

const panel: React.CSSProperties = { background: "#fff", border: "1px solid var(--rule-2)", borderRadius: 8, padding: "16px 18px", marginTop: 20 };
const panelHead: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, gap: 12, flexWrap: "wrap" };
const panelTitle: React.CSSProperties = { fontFamily: "var(--serif)", fontSize: 17 };
const demoNote: React.CSSProperties = { display: "inline-block", marginTop: 10, fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: ".03em", color: "var(--c-amber)", background: "var(--c-amber-l)", padding: "6px 10px", borderRadius: 4, lineHeight: 1.5 };
const inp: React.CSSProperties = { fontFamily: "var(--sans)", fontSize: 15, color: "var(--ink)", background: "#fff", border: "1px solid var(--rule)", borderRadius: 6, padding: "12px 13px", outline: "none", width: "100%", boxSizing: "border-box" };
const btn: React.CSSProperties = { background: "var(--accent)", color: "#fff", border: "none", borderRadius: 6, padding: "12px 20px", fontSize: 14.5, fontWeight: 500, cursor: "pointer", flex: "0 0 auto" };
const tierPill: React.CSSProperties = { fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, letterSpacing: ".04em", padding: "5px 12px", borderRadius: 6 };
const sub: React.CSSProperties = { background: "var(--bg-soft)", borderRadius: 8, padding: "12px 14px" };
const subH: React.CSSProperties = { fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 8 };
