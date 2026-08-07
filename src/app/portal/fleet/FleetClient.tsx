"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useRef, useState } from "react";
import { API_BASE } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";

declare global {
  interface Window {
    L?: any;
  }
}

type Kpi = { label: string; value: string; sub: string; tone?: string };
type System = {
  projectId: string;
  customer: string;
  town: string;
  lat: number | null;
  lng: number | null;
  hw: string;
  provider: string;
  soc: number | null;
  mode: string;
  status: string;
  state: "ONLINE" | "OFFLINE" | "FAULT";
};
type Fleet = { stats: Kpi[]; systems: System[] };

// Marker colors tuned for the light-gray basemap.
const MARKER: Record<string, string> = { ONLINE: "#16a34a", OFFLINE: "#d97706", FAULT: "#dc2626" };
const STATE_BG: Record<string, string> = { ONLINE: "var(--c-green-l)", FAULT: "var(--c-red-l)", OFFLINE: "var(--c-amber-l)" };
const STATE_FG: Record<string, string> = { ONLINE: "var(--c-green)", FAULT: "var(--c-red)", OFFLINE: "var(--c-amber)" };

function socColor(soc: number | null): string {
  if (soc == null) return "var(--ink-5)";
  if (soc >= 70) return "var(--c-green)";
  if (soc >= 40) return "var(--c-teal)";
  return "var(--c-red)";
}

// Load Leaflet (JS + CSS) from CDN once; resolve with window.L.
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
      existing.addEventListener("error", () => reject(new Error("map failed to load")));
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

function popupHtml(s: System): string {
  const soc = s.soc == null ? "—" : `${s.soc}%`;
  return `<div style="font-family:var(--font-dm-sans),system-ui,sans-serif;min-width:150px">
    <div style="font-weight:600;font-size:13.5px;color:#1c1c1a">${s.customer}</div>
    <div style="font-size:11px;color:#8a8a82;margin:2px 0 6px">${s.town}, CT · ${s.hw}</div>
    <div style="font-family:ui-monospace,monospace;font-size:11px;color:#55554f">SOC ${soc} · ${s.mode}</div>
    <div style="font-family:ui-monospace,monospace;font-size:11px;font-weight:600;color:${MARKER[s.state]};margin-top:3px">${s.status}</div>
  </div>`;
}

async function opsFetch<T>(path: string): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE}${path}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  const json = await res.json();
  if (!res.ok || json?.success === false) throw new Error(json?.message || `Request failed (${res.status})`);
  return json.data as T;
}

export default function FleetClient() {
  const [fleet, setFleet] = useState<Fleet | null>(null);
  const [error, setError] = useState("");
  const [mapError, setMapError] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  const mapEl = useRef<HTMLDivElement>(null);
  const mapObj = useRef<any>(null);
  const markers = useRef<Record<string, any>>({});

  const load = useCallback(async () => {
    setError("");
    try {
      setFleet(await opsFetch<Fleet>("/api/ops/fleet"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load fleet");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Build the Leaflet map once fleet data is in.
  useEffect(() => {
    if (!fleet) return;
    let cancelled = false;
    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapEl.current || mapObj.current) return;
        const map = L.map(mapEl.current, { zoomControl: true, scrollWheelZoom: true }).setView([41.6, -72.7], 8);
        mapObj.current = map;
        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
          attribution: '&copy; <a href="https://openstreetmap.org">OSM</a> &copy; <a href="https://carto.com">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }).addTo(map);
        const pts: [number, number][] = [];
        fleet.systems.forEach((s) => {
          if (s.lat == null || s.lng == null) return;
          const m = L.circleMarker([s.lat, s.lng], {
            radius: 8,
            color: "#ffffff",
            weight: 2,
            fillColor: MARKER[s.state] ?? "#34d17a",
            fillOpacity: 0.95,
          }).addTo(map);
          m.bindPopup(popupHtml(s));
          m.on("mouseover", () => setHover(s.projectId));
          m.on("mouseout", () => setHover(null));
          markers.current[s.projectId] = m;
          pts.push([s.lat, s.lng]);
        });
        if (pts.length) map.fitBounds(pts, { padding: [40, 40], maxZoom: 11 });
        setTimeout(() => map.invalidateSize(), 120);
      })
      .catch(() => setMapError(true));
    return () => {
      cancelled = true;
      if (mapObj.current) {
        mapObj.current.remove();
        mapObj.current = null;
        markers.current = {};
      }
    };
  }, [fleet]);

  // Sync table-row hover → open the marker popup.
  useEffect(() => {
    if (!hover) return;
    const m = markers.current[hover];
    if (m && mapObj.current) m.openPopup();
  }, [hover]);

  return (
    <>
      <div className="page-head">
        <p className="eyebrow">Assets · Fleet</p>
        <h1>Fleet monitoring.</h1>
        <p className="lead">
          Live status of every commissioned system across Connecticut — state of charge, operating mode, and open
          faults. Pan the map or hover a row to locate a system.
        </p>
        <span style={demoNote}>✳ Demo purposes — sample telemetry</span>
      </div>

      {error && <p style={{ color: "var(--c-red)", fontFamily: "var(--mono)", fontSize: 13 }}>{error}</p>}
      {!fleet && !error && <p style={{ color: "var(--ink-3)", fontFamily: "var(--mono)", fontSize: 13 }}>Loading…</p>}

      {fleet && (
        <>
          <div className="kpi-row">
            {fleet.stats.map((k) => (
              <div className="kpi" key={k.label}>
                <div className="l">{k.label}</div>
                <div className={k.tone === "bad" && k.value !== "0" ? "v rp" : "v"}>{k.value}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", marginTop: 6 }}>{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Real map */}
          <div style={{ position: "relative", marginTop: 20, borderRadius: 10, overflow: "hidden", border: "1px solid var(--rule)" }}>
            <div ref={mapEl} style={{ height: 480, width: "100%", background: "#e9e9e6" }} />
            {mapError && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-3)", fontFamily: "var(--mono)", fontSize: 12, background: "#e9e9e6" }}>
                Map failed to load — see the table below.
              </div>
            )}
            {/* Legend overlay */}
            <div style={legend}>
              {(["ONLINE", "OFFLINE", "FAULT"] as const).map((s) => (
                <span key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 999, background: MARKER[s], boxShadow: "0 0 0 1.5px rgba(0,0,0,.12)" }} />
                  {s[0] + s.slice(1).toLowerCase()} · {fleet.systems.filter((x) => x.state === s).length}
                </span>
              ))}
            </div>
          </div>

          {/* Fleet table */}
          <div style={{ ...panel, marginTop: 16 }}>
            <div style={panelHead}>
              <span style={panelTitle}>Systems</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)" }}>{fleet.systems.length} monitored</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={table}>
                <thead>
                  <tr>{["Customer", "Town", "Hardware", "State of charge", "Mode", "Status"].map((h) => <th key={h} style={th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {fleet.systems.map((s) => (
                    <tr
                      key={s.projectId}
                      onMouseEnter={() => setHover(s.projectId)}
                      onMouseLeave={() => setHover(null)}
                      style={{ borderTop: "1px solid var(--rule-2)", background: hover === s.projectId ? "var(--bg-soft)" : "transparent", cursor: "pointer" }}
                    >
                      <td style={td}>{s.customer}</td>
                      <td style={td}>{s.town}</td>
                      <td style={{ ...td, fontFamily: "var(--mono)", fontSize: 12 }}>{s.hw}</td>
                      <td style={{ ...td, minWidth: 150 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ flex: 1, height: 7, background: "var(--bg-soft)", borderRadius: 999, overflow: "hidden", maxWidth: 90 }}>
                            <span style={{ display: "block", height: "100%", width: `${s.soc ?? 0}%`, background: socColor(s.soc), borderRadius: 999 }} />
                          </span>
                          <span style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--ink-2)", width: 34 }}>{s.soc == null ? "—" : `${s.soc}%`}</span>
                        </div>
                      </td>
                      <td style={{ ...td, fontFamily: "var(--mono)", fontSize: 11 }}>{s.mode === "SELF_CONSUMPTION" ? "SELF-CONSUME" : s.mode}</td>
                      <td style={td}>
                        <span style={{ display: "inline-block", fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: ".04em", padding: "3px 8px", borderRadius: 5, background: STATE_BG[s.state], color: STATE_FG[s.state] }}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}

const demoNote: React.CSSProperties = { display: "inline-block", marginTop: 10, fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: ".04em", color: "var(--c-amber)", background: "var(--c-amber-l)", padding: "4px 9px", borderRadius: 4 };
const legend: React.CSSProperties = { position: "absolute", top: 12, right: 12, zIndex: 500, display: "flex", flexDirection: "column", gap: 6, background: "rgba(255,255,255,.92)", color: "var(--ink-2)", padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,.08)", boxShadow: "0 2px 10px rgba(0,0,0,.08)", fontFamily: "var(--mono)", fontSize: 10.5, backdropFilter: "blur(4px)" };
const panel: React.CSSProperties = { background: "#fff", border: "1px solid var(--rule-2)", borderRadius: 8, padding: "16px 18px" };
const panelHead: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, gap: 12, flexWrap: "wrap" };
const panelTitle: React.CSSProperties = { fontFamily: "var(--serif)", fontSize: 17 };
const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 13 };
const th: React.CSSProperties = { textAlign: "left", padding: "8px 12px", fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-3)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "10px 12px", verticalAlign: "middle", color: "var(--ink-2)" };
