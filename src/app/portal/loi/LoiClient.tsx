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
        Non-binding LOIs signed through the get-started flow.
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
              {["Signed", "LOI #", "Signed by", "Property", "Email", "System", "PDF"].map((h) => (
                <th key={h} style={th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderTop: "1px solid #eee" }}>
                <td style={td}>{new Date(r.signedAt || r.createdAt).toLocaleDateString()}</td>
                <td style={{ ...td, fontFamily: "ui-monospace,monospace", whiteSpace: "nowrap" }}>{r.loiNumber}</td>
                <td style={td}>{r.signedName || r.siteOwnerName}</td>
                <td style={td}>{r.propertyAddress}</td>
                <td style={td}>{r.email}</td>
                <td style={td}>{batteryLabel(r.batteryCount)}</td>
                <td style={td}>
                  <button style={linkBtn} onClick={() => downloadPdf(r)} disabled={downloading === r.id}>
                    {downloading === r.id ? "…" : "Download"}
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && !loading && (
              <tr>
                <td style={{ ...td, color: "#999" }} colSpan={7}>
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

function batteryLabel(v: string | null): string {
  if (v === "one") return "1 battery";
  if (v === "two") return "2 batteries";
  if (v === "three_plus") return "3+ batteries";
  return "—";
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
