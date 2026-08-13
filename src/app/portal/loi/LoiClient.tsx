"use client";

import { useCallback, useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";

type Loi = {
  id: number;
  loiNumber: string;
  siteOwnerName: string;
  propertyAddress: string;
  email: string;
  phone: string | null;
  batteryCount: string | null;
  rooftopSolar: string | null;
  timeframe: string | null;
  signedName: string;
  signedAt: string;
  source: string | null;
  createdAt: string;
  essTier: string | null;
  underserved: boolean | null;
  energyCommunity: boolean | null;
  nmtcLowIncome: boolean | null;
  itcConfirmedPct: number | null;
  itcPotentialPct: number | null;
  lucrativeScore: number | null;
};

const LIMIT = 20;

export default function LoiClient() {
  const [rows, setRows] = useState<Loi[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState<number | null>(null);

  const load = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setError("Not signed in.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/loi?page=${page}&limit=${LIMIT}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || `Request failed (${res.status})`);
      }
      setRows(json.data ?? []);
      setTotal(json.pagination?.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load letters of intent");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const downloadPdf = useCallback(async (loi: Loi) => {
    const token = getAuthToken();
    if (!token) {
      setError("Not signed in.");
      return;
    }
    setDownloading(loi.id);
    try {
      const res = await fetch(`${API_BASE}/api/loi/${loi.id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`Download failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${loi.loiNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed");
    } finally {
      setDownloading(null);
    }
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div style={{ padding: "8px 4px" }}>
      <h1 style={{ fontSize: 28, margin: 0 }}>Letters of Intent</h1>
      <p style={{ color: "#666", marginTop: 6 }}>
        Non-binding LOIs signed through the get-started flow — <strong>prioritized by incentive value</strong> (ESS tier + ITC adders).
      </p>

      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}

      <div style={{ display: "flex", alignItems: "center", margin: "14px 0" }}>
        <span style={{ fontSize: 13, color: "#666" }}>
          {loading ? "Loading…" : `${total} total`}
        </span>
      </div>

      <div style={{ overflowX: "auto", border: "1px solid #eee", borderRadius: 8 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", background: "#fafafa" }}>
              {["Value", "ESS tier", "ITC", "Signed", "LOI #", "Signed by", "Property", "PDF"].map((h) => (
                <th key={h} style={th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderTop: "1px solid #eee" }}>
                <td style={td}><ValueBadge score={r.lucrativeScore} /></td>
                <td style={td}>{essTierBadge(r.essTier)}</td>
                <td style={{ ...td, fontFamily: "ui-monospace,monospace" }}>
                  {r.itcConfirmedPct != null ? `${r.itcConfirmedPct}%${r.itcPotentialPct && r.itcPotentialPct > r.itcConfirmedPct ? `–${r.itcPotentialPct}%` : ""}` : "—"}
                  {(r.energyCommunity || r.nmtcLowIncome) && (
                    <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>
                      {[r.nmtcLowIncome && "NMTC", r.energyCommunity && "Energy Comm"].filter(Boolean).join(" · ")}
                    </div>
                  )}
                </td>
                <td style={td}>{new Date(r.signedAt || r.createdAt).toLocaleDateString()}</td>
                <td style={{ ...td, fontFamily: "ui-monospace,monospace", whiteSpace: "nowrap" }}>{r.loiNumber}</td>
                <td style={td}>{r.signedName || r.siteOwnerName}</td>
                <td style={td}>{r.propertyAddress}</td>
                <td style={td}>
                  <button style={linkBtn} onClick={() => downloadPdf(r)} disabled={downloading === r.id}>
                    {downloading === r.id ? "…" : "Download"}
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && !loading && (
              <tr>
                <td style={{ ...td, color: "#999" }} colSpan={8}>
                  No letters of intent yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} style={btn}>
            ← Prev
          </button>
          <span style={{ fontSize: 13, color: "#666" }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            style={btn}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

function essTierBadge(tier: string | null) {
  if (!tier) return <span style={{ color: "#bbb" }}>—</span>;
  const map: Record<string, { label: string; bg: string; fg: string }> = {
    LOW_INCOME: { label: "Low-Income", bg: "#e1f5ee", fg: "#0f6e56" },
    UNDERSERVED: { label: "Underserved", bg: "#e6eeea", fg: "#2f5d4e" },
    STANDARD: { label: "Standard", bg: "#f1f1ec", fg: "#7a7a72" },
  };
  const m = map[tier] ?? map.STANDARD;
  return (
    <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, padding: "2px 7px", borderRadius: 5, background: m.bg, color: m.fg }}>
      {m.label}
    </span>
  );
}

function ValueBadge({ score }: { score: number | null }) {
  if (score == null) return <span style={{ color: "#bbb" }}>—</span>;
  const color = score >= 60 ? "#0f6e56" : score >= 45 ? "#9a6700" : "#7a7a72";
  const bg = score >= 60 ? "#e1f5ee" : score >= 45 ? "#faeeda" : "#f1f1ec";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 32, fontFamily: "ui-monospace,monospace", fontSize: 13, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: bg, color }}>
      {score}
    </span>
  );
}


const th: React.CSSProperties = { padding: "10px 12px", fontWeight: 600, whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "10px 12px", verticalAlign: "top" };
const btn: React.CSSProperties = {
  padding: "6px 12px",
  background: "#fff",
  border: "1px solid #ccc",
  borderRadius: 6,
  cursor: "pointer",
};
const linkBtn: React.CSSProperties = {
  padding: "5px 10px",
  background: "#2f5d4e",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 12.5,
  whiteSpace: "nowrap",
};
