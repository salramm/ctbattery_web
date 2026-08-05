"use client";

import { useCallback, useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";

// The list endpoint is admin-gated (Bearer JWT). In production the token comes
// from the Firebase login exchange; until that's wired we read/store it in
// localStorage so the two admins can connect the dashboard directly.
const TOKEN_KEY = "ctbs_api_jwt";

type Application = {
  id: number;
  applicationNumber: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string | null;
  utility: string | null;
  resolvedUtility: string | null;
  eligibilityKind: string | null;
  isOwner: boolean;
  createdAt: string;
};

const STATUSES = ["LEAD", "SUBMITTED", "RENTER_PENDING", "SURVEY_SCHEDULED", "SIGNED"];
const LIMIT = 20;

export default function ApplicationsClient() {
  const [token, setToken] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [rows, setRows] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem(TOKEN_KEY));
  }, []);

  const load = useCallback(async () => {
    if (!token) {
      setNeedsAuth(true);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
      if (statusFilter) qs.set("status", statusFilter);
      const res = await fetch(`${API_BASE}/api/applications?${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        setNeedsAuth(true);
        setError("Session expired or invalid token — please reconnect.");
        return;
      }
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || `Request failed (${res.status})`);
      }
      setRows(json.data ?? []);
      setTotal(json.pagination?.total ?? 0);
      setNeedsAuth(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [token, page, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: number, status: string) {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch {
      setError("Could not update status.");
    }
  }

  function connect() {
    const t = tokenInput.trim();
    if (!t) return;
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    setTokenInput("");
    setNeedsAuth(false);
  }

  function disconnect() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setRows([]);
    setNeedsAuth(true);
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div style={{ padding: "8px 4px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>Applications</h1>
        {token && (
          <button onClick={disconnect} style={btnGhost}>
            Disconnect
          </button>
        )}
      </div>
      <p style={{ color: "#666", marginTop: 6 }}>
        Consumer battery applications submitted through the /ct/apply flow.
      </p>

      {needsAuth && (
        <div style={panel}>
          <strong>Connect the admin API</strong>
          <p style={{ color: "#666", margin: "6px 0 12px" }}>
            This dashboard reads from the admin API, which requires a bearer token.
            In production the token is issued by the Firebase login exchange
            (<code>POST /api/auth/login</code>). Paste a token to connect now.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Paste API JWT"
              style={{ flex: 1, padding: "8px 10px", border: "1px solid #ccc", borderRadius: 6 }}
            />
            <button onClick={connect} style={btnPrimary}>
              Connect
            </button>
          </div>
        </div>
      )}

      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}

      {token && !needsAuth && (
        <>
          <div style={{ display: "flex", gap: 12, alignItems: "center", margin: "16px 0" }}>
            <label style={{ fontSize: 13, color: "#666" }}>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value);
              }}
              style={{ padding: "6px 10px", border: "1px solid #ccc", borderRadius: 6 }}
            >
              <option value="">All</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span style={{ marginLeft: "auto", fontSize: 13, color: "#666" }}>
              {loading ? "Loading…" : `${total} total`}
            </span>
          </div>

          <div style={{ overflowX: "auto", border: "1px solid #eee", borderRadius: 8 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left", background: "#fafafa" }}>
                  {["App #", "Received", "Name", "City", "Utility", "Tier", "Type", "Status"].map((h) => (
                    <th key={h} style={th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} style={{ borderTop: "1px solid #eee" }}>
                    <td style={td}>
                      <code>{r.applicationNumber}</code>
                    </td>
                    <td style={td}>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td style={td}>
                      {r.firstName} {r.lastName}
                      <div style={{ color: "#999", fontSize: 11 }}>{r.email}</div>
                    </td>
                    <td style={td}>{r.city ?? "—"}</td>
                    <td style={td}>{r.resolvedUtility ?? r.utility ?? "—"}</td>
                    <td style={td}>{r.eligibilityKind ?? "—"}</td>
                    <td style={td}>{r.isOwner ? "Owner" : "Renter"}</td>
                    <td style={td}>
                      <select
                        value={r.status}
                        onChange={(e) => updateStatus(r.id, e.target.value)}
                        style={{ padding: "4px 6px", border: "1px solid #ddd", borderRadius: 5 }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && !loading && (
                  <tr>
                    <td style={{ ...td, color: "#999" }} colSpan={8}>
                      No applications yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} style={btnGhost}>
              ← Prev
            </button>
            <span style={{ fontSize: 13, color: "#666" }}>
              Page {page} of {totalPages}
            </span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={btnGhost}>
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const th: React.CSSProperties = { padding: "10px 12px", fontWeight: 600, whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "10px 12px", verticalAlign: "top" };
const panel: React.CSSProperties = {
  border: "1px solid #e5e5e5",
  borderRadius: 8,
  padding: 16,
  margin: "16px 0",
  background: "#fbfbfb",
};
const btnPrimary: React.CSSProperties = {
  padding: "8px 16px",
  background: "#111",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
const btnGhost: React.CSSProperties = {
  padding: "6px 12px",
  background: "#fff",
  border: "1px solid #ccc",
  borderRadius: 6,
  cursor: "pointer",
};
