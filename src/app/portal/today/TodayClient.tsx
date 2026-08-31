"use client";

/**
 * Today — the action queue (03 §Today, 05-UI-DELTA D8).
 *
 * The server composes the whole queue; this screen renders it. Sections arrive
 * in priority order and empty ones never arrive at all, so there is no
 * client-side filtering, sorting or counting to get out of step with the API.
 * One row, one action, no charts.
 *
 * The date block is the SERVER's clock rendered America/New_York (D8) — not the
 * browser's, so a laptop in another timezone still shows the fleet's day.
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { isApiError, lcGet, lcPost, type ApiError } from "@/lib/lifecycle";

type RowAction = { label: string; href?: string; endpoint?: string; method?: "POST" | "PATCH" };

type TodayRow = {
  id: string;
  system_id: string | null;
  address: string | null;
  label: string;
  detail: string;
  metric: string;
  severity: "FAULT" | "WATCH" | "DUE" | "INFO";
  action: RowAction;
};

type TodaySection = { key: string; title: string; rows: TodayRow[] };

type Today = {
  date: { weekday: string; date: string; time: string; tz: string; iso: string };
  total: number;
  sections: TodaySection[];
};

const BAR: Record<string, string> = {
  FAULT: "var(--r)",
  DUE: "var(--r)",
  WATCH: "#c08a2e",
  INFO: "var(--b)",
};

/** Only the health section carries a severity chip in the mock. */
function severityChip(section: string, severity: string) {
  if (section !== "health") return null;
  const cls = severity === "FAULT" ? "h-fault" : "h-watch";
  return (
    <span className={`hchip ${cls}`}>
      <i />
      {severity}
    </span>
  );
}

export default function TodayClient() {
  const [today, setToday] = useState<Today | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      setToday(await lcGet<Today>("/api/today"));
    } catch (e) {
      setError(isApiError(e) ? e.message : "Failed to load the queue");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /** Mutating actions POST, then recompose — the row leaves when its cause does. */
  async function runAction(row: TodayRow) {
    if (!row.action.endpoint) return;
    setBusy(row.id);
    setNote("");
    try {
      await lcPost(row.action.endpoint, {});
      await load();
    } catch (e) {
      const err = e as ApiError;
      // These endpoints land with their features (alerts P7, envelopes P8+).
      setNote(
        err?.status === 404
          ? `${row.action.label} isn't wired yet — ${row.action.endpoint} arrives with that feature.`
          : isApiError(e)
            ? e.message
            : "Action failed",
      );
    } finally {
      setBusy(null);
    }
  }

  if (error) {
    return (
      <div className="lc">
        <div className="ltoast" style={{ borderLeftColor: "var(--r)" }}>
          {error}
        </div>
      </div>
    );
  }
  if (!today) {
    return (
      <div className="lc">
        <div className="stamp">Loading the queue…</div>
      </div>
    );
  }

  const { date } = today;

  return (
    <div className="lc">
      <div className="shead">
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 27, fontWeight: 400, margin: 0 }}>Today</h1>
          <div className="sub">
            {today.total === 0
              ? "Nothing needs a human. Everything is running itself."
              : `${today.total} item${today.total === 1 ? "" : "s"} need${today.total === 1 ? "s" : ""} a human. Everything else is running itself.`}
          </div>
        </div>
        <div className="right">
          {/* D8 — server clock, America/New_York */}
          <div className="datebig">
            <div className="dl1">Today · {date.weekday}</div>
            <div className="dl2">
              {date.date}
              <span>
                {date.time} {date.tz}
              </span>
            </div>
          </div>
          <div className="principle">One row · one action · no charts</div>
        </div>
      </div>

      {note && (
        <div className="sec ltoast" style={{ borderLeftColor: "var(--a)" }}>
          {note}
        </div>
      )}

      {today.sections.map((section) => (
        <div className="sec" key={section.key}>
          <div className="seclbl">
            {section.title} <span className="n">{section.rows.length}</span>
          </div>
          <div className="card">
            {section.rows.map((row) => (
              <div className="trow" key={row.id}>
                <span className="bar" style={{ background: BAR[row.severity] ?? "var(--bd2)" }} />
                <div className="body">
                  <div className="who">
                    {row.address ? `${row.address} — ` : ""}
                    {row.label}
                  </div>
                  {row.detail && <div className="what">{row.detail}</div>}
                </div>

                {severityChip(section.key, row.severity)}
                {section.key === "blocked" && <span className="blockedtag">{row.label}</span>}
                <span className="meta">{row.metric}</span>

                {row.action.endpoint ? (
                  <button
                    type="button"
                    className="btn sm"
                    disabled={busy === row.id}
                    onClick={() => runAction(row)}
                  >
                    {busy === row.id ? "…" : row.action.label}
                  </button>
                ) : (
                  <Link className="btn sm" href={row.action.href ?? "#"}>
                    {row.action.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {today.sections.length === 0 && (
        <div className="card pad">
          <div className="stamp">The queue is empty — every section collapsed.</div>
        </div>
      )}
    </div>
  );
}
