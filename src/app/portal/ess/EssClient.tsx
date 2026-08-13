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
  categories?: {
    inEjBlockGroup: boolean; inDistressedMuni: boolean; matchedMuni: string | null; inGracePeriod: boolean; underserved: boolean;
    inEnergyCommunity: boolean; inNmtcLowIncome: boolean; mfahQualifying?: boolean;
    mfah?: { projectName: string | null; units: number | null; sources: string[]; city: string } | null;
  };
  compensation?: { enhanced: boolean; enrollmentPerKwh: number; baseEnrollmentPerKwh?: number; gridEdgeEnrollmentPerKwh: number; gridEdge: string; gridEdgeCircuit?: string | null; performancePerKwYearMin: number; performancePerKwYearMax: number };
  itc?: { basePct: number; confirmedPct: number; potentialPct: number; adders: { key: string; label: string; pct: number; basis: string; applies: boolean | null }[] };
  message?: string;
};

type LayerMeta = { color: string; label: string; group: "ESS" | "ITC" | "MFAH" | "UTIL"; desc: string; point?: boolean; line?: boolean };
const LAYER_META: Record<string, LayerMeta> = {
  "ej-block-groups": {
    color: "#7c3aed", label: "EJ Block Groups", group: "ESS",
    desc: "Environmental Justice block groups → enhanced ESS compensation tier.",
  },
  "distressed-municipalities": {
    color: "#d97706", label: "Distressed Municipalities", group: "ESS",
    desc: "State distressed (& grace-period) towns → enhanced ESS compensation tier.",
  },
  "energy-communities": {
    color: "#1d4e89", label: "Energy Communities", group: "ITC",
    desc: "IRA energy communities (coal-closure + fossil-fuel employment) → +10% ITC.",
  },
  "nmtc-low-income": {
    color: "#0f6b6b", label: "NMTC Low-Income Tracts", group: "ITC",
    desc: "NMTC qualified low-income census tracts → §48(e) Cat 1, +10% ITC.",
  },
  "mfah-properties": {
    color: "#b8341f", label: "Affordable-housing (MFAH)", group: "MFAH", point: true,
    desc: "LIHTC / Section 8 / public housing (5+ units) → ESS Low-Income tier + ITC Cat 3.",
  },
  "ui-service-areas": {
    color: "#0891b2", label: "UI service territory", group: "UTIL",
    desc: "United Illuminating electric service territory (by town).",
  },
  "ui-grid-edge": {
    color: "#dc2626", label: "UI Grid Edge circuits", group: "UTIL", line: true,
    desc: "UI distribution circuits flagged Grid Edge → $130/kWh ESS enrollment when a site is on one.",
  },
};
const GROUP_LABEL = { ESS: "ESS compensation tier", ITC: "Federal ITC adders", MFAH: "Affordable housing", UTIL: "United Illuminating" } as const;

function addCss(id: string, href: string) {
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function loadScript(id: string, src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded) return resolve();
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error(`failed: ${src}`)));
      return;
    }
    const s = document.createElement("script");
    s.id = id;
    s.src = src;
    s.async = true;
    s.onload = () => { s.dataset.loaded = "1"; resolve(); };
    s.onerror = () => reject(new Error(`failed: ${src}`));
    document.head.appendChild(s);
  });
}

// Load Leaflet core + the markercluster plugin (for MFAH clustering).
function loadLeaflet(): Promise<any> {
  addCss("leaflet-css", "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
  addCss("mcluster-css", "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css");
  addCss("mcluster-css-def", "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css");
  return loadScript("leaflet-js", "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js")
    .then(() => loadScript("mcluster-js", "https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"))
    .then(() => window.L);
}

// Feature attributes we don't surface in popups (ids, geometry math, internal).
const POPUP_HIDE = new Set([
  "OBJECTID", "objectid", "objectid_1", "SHAPE_Length", "SHAPE_Area", "SHAPE__Length", "SHAPE__Area",
  "Shape_Length", "Shape_Area", "globalid", "GlobalID", "symbol", "label", "GEOIDFQ",
  "affgeoid_tract_2020", "affgeoid_cty_2020", "date_last_update", "date_record_added",
  "dataset_version", "TOWN_NO", "fipstate_2020", "fipcounty_2020", "fipscty_2020", "fiptract_2020",
  "FID", "ID", "TOWN_CODE", "CIS_TOWN_C", "SHAPE_AREA", "SHAPE_LEN", "Shape__Length",
]);

function prettyKey(k: string): string {
  return k.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b\w/g, (c) => c.toUpperCase());
}

function popupHtml(title: string, props: Record<string, any> | null): string {
  const rows = Object.entries(props ?? {})
    .filter(([k, v]) => v != null && v !== "" && !POPUP_HIDE.has(k))
    .map(
      ([k, v]) =>
        `<div style="display:flex;gap:10px;justify-content:space-between;padding:1px 0"><span style="color:#8a8a82">${prettyKey(k)}</span><span style="color:#1c1c1a;font-weight:500;text-align:right">${String(v)}</span></div>`,
    )
    .join("");
  return `<div style="font-family:system-ui,sans-serif;font-size:12.5px;min-width:190px"><div style="font-weight:700;font-size:13px;margin-bottom:6px;color:#1c1c1a">${title}</div>${rows || '<span style="color:#8a8a82">No attributes</span>'}</div>`;
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
      const meta = LAYER_META[name];
      const c = meta?.color ?? "#2f5d4e";
      const title = meta?.label ?? name;

      if (meta?.point) {
        // Cluster the MFAH points: counts when zoomed out, pins when zoomed in.
        const cluster = L.markerClusterGroup
          ? L.markerClusterGroup({ chunkedLoading: true, maxClusterRadius: 55, spiderfyOnMaxZoom: true })
          : L.layerGroup();
        (gj.features ?? []).forEach((f: any) => {
          const g = f.geometry;
          if (!g || g.type !== "Point") return;
          const [lng, lat] = g.coordinates;
          const m = L.circleMarker([lat, lng], { radius: 5, color: "#fff", weight: 1, fillColor: c, fillOpacity: 0.9 });
          m.bindPopup(popupHtml(title, f.properties), { maxWidth: 280 });
          cluster.addLayer(m);
        });
        cluster.addTo(map);
        overlays.current[name] = cluster;
      } else {
        // Lines (grid-edge circuits) get no fill and a heavier stroke.
        const style = meta?.line
          ? { color: c, weight: 3, opacity: 0.9 }
          : { color: c, weight: 1, fillColor: c, fillOpacity: 0.15 };
        const layer = L.geoJSON(gj, {
          style,
          onEachFeature: (f: any, lyr: any) => lyr.bindPopup(popupHtml(title, f.properties), { maxWidth: 280 }),
        }).addTo(map);
        overlays.current[name] = layer;
      }
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

      {/* Map + layers, grouped by what they qualify for */}
      <div style={{ ...panel, marginTop: 16 }}>
        <div style={{ marginBottom: 14 }}>
          <span style={panelTitle}>Qualification map</span>
          <p style={{ fontSize: 12.5, color: "var(--ink-3)", margin: "4px 0 0" }}>
            Toggle layers to see coverage. <strong>ESS</strong> layers set the compensation tier; <strong>ITC</strong> layers each add a federal tax-credit adder.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16, marginBottom: 14 }}>
          {(["ESS", "ITC", "MFAH", "UTIL"] as const).map((group) => (
            <div key={group} style={{ background: "var(--bg-soft)", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10 }}>
                {GROUP_LABEL[group]}
              </div>
              {(status?.layers ?? []).filter((l) => LAYER_META[l.name]?.group === group).map((l) => (
                <label key={l.name} style={{ display: "flex", gap: 9, alignItems: "flex-start", padding: "6px 0", cursor: l.loaded ? "pointer" : "default" }}>
                  <input
                    type="checkbox"
                    disabled={!l.loaded}
                    checked={!!visible[l.name]}
                    onChange={(e) => setVisible((v) => ({ ...v, [l.name]: e.target.checked }))}
                    style={{ marginTop: 3 }}
                  />
                  <span style={{ width: 11, height: 11, borderRadius: 3, background: LAYER_META[l.name]?.color ?? "#2f5d4e", opacity: l.loaded ? 1 : 0.3, marginTop: 3, flex: "none" }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500, color: l.loaded ? "var(--ink)" : "var(--ink-4)" }}>
                      {LAYER_META[l.name]?.label ?? l.label} {l.loaded ? <span style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--ink-3)", fontWeight: 400 }}>({l.features})</span> : "· not loaded"}
                    </span>
                    <span style={{ display: "block", fontSize: 11.5, color: "var(--ink-3)", marginTop: 1, lineHeight: 1.4 }}>{LAYER_META[l.name]?.desc}</span>
                  </span>
                </label>
              ))}
            </div>
          ))}
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
  const [domesticContent, setDomesticContent] = useState(false);
  const dcPct = r.itc?.adders.find((a) => a.key === "domestic_content")?.pct ?? 10;
  const confirmed = (r.itc?.confirmedPct ?? 0) + (domesticContent ? dcPct : 0);
  const potential = r.itc?.potentialPct ?? confirmed;
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
      {r.categories?.mfah && (
        <div style={{ marginTop: 10, fontSize: 12.5, color: "#7a2016", background: "#fbeae6", border: "1px solid #f0c4ba", borderRadius: 8, padding: "8px 11px" }}>
          🏢 Affordable-housing match: <strong>{r.categories.mfah.projectName}</strong> · {r.categories.mfah.units ?? "?"} units · {r.categories.mfah.sources.join(", ")}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginTop: 14 }}>
        <div style={sub}>
          <div style={subH}>ESS compensation</div>
          <KV k="Enrollment (one-time)" v={`$${r.compensation?.enrollmentPerKwh} / kWh`} />
          <KV
            k="Performance (10-yr)"
            v={
              r.compensation
                ? r.compensation.performancePerKwYearMin === r.compensation.performancePerKwYearMax
                  ? `$${r.compensation.performancePerKwYearMin} / kW·yr`
                  : `$${r.compensation.performancePerKwYearMin}–${r.compensation.performancePerKwYearMax} / kW·yr`
                : "—"
            }
          />
          <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>
            {r.compensation?.gridEdge === "likely" ? (
              <>Grid Edge: <span style={{ color: "var(--c-green)" }}>likely ✓</span>{r.compensation?.gridEdgeCircuit ? ` (UI circuit #${r.compensation.gridEdgeCircuit})` : ""} — enrollment ${r.compensation?.gridEdgeEnrollmentPerKwh}/kWh (verify with UI)</>
            ) : r.compensation?.gridEdge === "no" ? (
              <>Grid Edge: <span style={{ color: "var(--ink-3)" }}>not on a UI Grid Edge circuit</span> (would raise enrollment to ${r.compensation?.gridEdgeEnrollmentPerKwh}/kWh)</>
            ) : (
              <>Grid Edge: <span style={{ color: "var(--c-amber)" }}>unconfirmed</span> (outside UI territory; would raise enrollment to ${r.compensation?.gridEdgeEnrollmentPerKwh}/kWh)</>
            )}
          </div>
        </div>
        <div style={sub}>
          <div style={subH}>Federal ITC adder stack</div>
          <KV k="Base ITC" v={`${r.itc?.basePct}%`} />
          {r.itc?.adders.map((a) =>
            a.key === "domestic_content" ? (
              <div key={a.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "4px 0", fontSize: 13 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--ink-3)", cursor: "pointer" }}>
                  <input type="checkbox" checked={domesticContent} onChange={(e) => setDomesticContent(e.target.checked)} />
                  {a.label}
                </label>
                <span style={{ color: domesticContent ? "var(--c-green)" : "var(--ink-3)", fontWeight: 500 }}>
                  {domesticContent ? `+${a.pct}% ✓` : `+${a.pct}% (toggle)`}
                </span>
              </div>
            ) : (
              <KV key={a.key} k={a.label} v={a.applies === true ? `+${a.pct}% ✓` : a.applies === false ? "n/a" : `+${a.pct}% (review)`} />
            ),
          )}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "8px 0 0", marginTop: 4, borderTop: "1px solid var(--rule-2)", fontSize: 14 }}>
            <span style={{ color: "var(--ink-2)", fontWeight: 600 }}>Total ITC</span>
            <span style={{ color: "var(--accent-ink)", fontWeight: 700 }}>
              {confirmed}%{potential > confirmed ? ` – ${potential}%` : ""}
            </span>
          </div>
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
