"use client";

import { useCallback, useEffect, useState } from "react";
import { authedFetch } from "@/lib/auth";

type Lead = {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  cityOrZip: string | null;
  phone: string | null;
  tenure: string | null;
  utility: string | null;
  source: string | null;
  createdAt: string;
};

const LIMIT = 20;

export default function LeadsClient() {
  const [rows, setRows] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await authedFetch(`/api/leads?page=${page}&limit=${LIMIT}`);
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || `Request failed (${res.status})`);
      }
      setRows(json.data ?? []);
      setTotal(json.pagination?.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div style={{ padding: "8px 4px" }}>
      <h1 style={{ fontSize: 28, margin: 0 }}>Waitlist leads</h1>
      <p style={{ color: "#666", marginTop: 6 }}>
        &ldquo;Join the list&rdquo; sign-ups from the pre-approval landing page.
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
              {["Received", "Name", "Email", "City / ZIP", "Phone", "Type", "Provider"].map((h) => (
                <th key={h} style={th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderTop: "1px solid #eee" }}>
                <td style={td}>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td style={td}>{[r.firstName, r.lastName].filter(Boolean).join(" ") || "—"}</td>
                <td style={td}>{r.email}</td>
                <td style={td}>{r.cityOrZip ?? "—"}</td>
                <td style={td}>{r.phone ?? "—"}</td>
                <td style={td}>{r.tenure ?? "—"}</td>
                <td style={td}>{r.utility ?? "—"}</td>
              </tr>
            ))}
            {rows.length === 0 && !loading && (
              <tr>
                <td style={{ ...td, color: "#999" }} colSpan={7}>
                  No sign-ups yet.
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

const th: React.CSSProperties = { padding: "10px 12px", fontWeight: 600, whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "10px 12px", verticalAlign: "top" };
const btn: React.CSSProperties = {
  padding: "6px 12px",
  background: "#fff",
  border: "1px solid #ccc",
  borderRadius: 6,
  cursor: "pointer",
};
