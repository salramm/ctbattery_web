"use client";

/**
 * Inventory rail widget (05-UI-DELTA D4). Persistent on every portal screen,
 * hidden below 960px by lifecycle.css.
 *
 * Reads GET /api/inventory/summary: per-SKU available / on-hand off the single
 * `equipment` table, the buildable count, and the next open PO. Available shows
 * green; the SKU that pins `buildable` shows amber — that one is the constraint.
 * Static numbers from the mock are not ported (§4 shim #5).
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { lcGet, type InventorySummary } from "@/lib/lifecycle";

export default function InventoryRail() {
  const [inv, setInv] = useState<InventorySummary | null>(null);

  useEffect(() => {
    let alive = true;
    lcGet<InventorySummary>("/api/inventory/summary")
      .then((d) => alive && setInv(d))
      .catch(() => {
        /* rail is ambient — never block the portal on it */
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!inv) return null;

  const due = inv.next_po?.due_at
    ? new Date(inv.next_po.due_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;
  const poBattery = inv.next_po?.lines?.find((l) => l.kind === "BATTERY") ?? inv.next_po?.lines?.[0];

  return (
    <div className="invbox">
      <div className="il">
        <span>Inventory · avail / on-hand</span>
        <Link href="/portal/docs/equipment" style={{ color: "var(--ink-3)" }} aria-label="Open equipment reference">
          →
        </Link>
      </div>

      {inv.skus.map((s) => (
        <div className="ir" key={s.sku}>
          <span>{s.label}</span>
          <b className={s.sku === inv.constraint_sku ? "lo" : "ok"}>
            {s.available} / {s.on_hand}
          </b>
        </div>
      ))}

      <div className="if">
        {inv.allocated_note}
        <br />= {inv.buildable} full system{inv.buildable === 1 ? "" : "s"} buildable
        {inv.next_po && (
          <>
            <br />
            {inv.next_po.po_no}
            {poBattery?.qty ? ` · ${poBattery.qty}× ${poBattery.sku ?? ""}` : ""}
            {inv.next_po.vendor ? ` · ${inv.next_po.vendor}` : ""}
            {due ? ` · ${due}` : ""}
          </>
        )}
      </div>
    </div>
  );
}
