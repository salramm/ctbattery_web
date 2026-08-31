// Lifecycle surfaces — shared types, stage constants and API helpers.
//
// The client never decides a gate: it POSTs /advance and renders whatever the
// server says (05-UI-DELTA §4 shim #1). The only thing computed here is board
// geometry — which column is stage+1 — and that comes from the server's own
// transition map order, not from a second copy of the rules.

import { authedFetch } from "./auth";

export const STAGE_ORDER = [
  "S01_LEAD",
  "S02_QUALIFIED",
  "S03_COMMITTED",
  "S04_APPLIED",
  "S05_ENTITLED",
  "S06_SCHEDULED",
  "S07_INSTALLED",
  "S08_COMMISSIONED",
  "S09_LIVE",
  "OPERATING",
] as const;

export type Stage = (typeof STAGE_ORDER)[number];

/** Short display name per stage, as the mock's column headers read. */
export const STAGE_NAME: Record<string, string> = {
  S01_LEAD: "Lead",
  S02_QUALIFIED: "Qualified",
  S03_COMMITTED: "Committed",
  S04_APPLIED: "Applied",
  S05_ENTITLED: "Entitled",
  S06_SCHEDULED: "Scheduled",
  S07_INSTALLED: "Installed",
  S08_COMMISSIONED: "Commiss.",
  S09_LIVE: "Live",
  OPERATING: "Operating",
};

/** Stage ramp var name for a stage — the shared semantic progression. */
export function stageVar(stage: string): string {
  if (stage === "OPERATING") return "var(--sop)";
  const n = STAGE_ORDER.indexOf(stage as Stage) + 1;
  return n >= 1 && n <= 9 ? `var(--s${n})` : "var(--bd)";
}

export type Unmet = { key: string; label: string; owner_role: string | null };

export type BoardCard = {
  id: string;
  address_line: string | null;
  unit_label: string | null;
  property: { id: string; name: string | null; town: string | null } | null;
  source: string | null;
  pills: string[];
  days_in_stage: number | null;
  blocked_code: string | null;
  blocked_note: string | null;
  unmet: Unmet[];
  installer: string | null;
  s08_dots: Array<{ key: string; label: string; done: boolean }> | null;
};

export type BoardColumn = {
  stage: Stage;
  code: string;
  label: string;
  momentary: boolean;
  count: number;
  cards: BoardCard[];
};

export type Board = {
  lens: string;
  columns: BoardColumn[];
  totals: { systems: number; blocked: number };
};

export type BoardFilterOptions = {
  properties: Array<{ id: string; label: string }>;
  towns: string[];
  tiers: string[];
  installers: string[];
};

export type Deal = {
  id: string;
  name: string;
  type: string;
  deal_state: string | null;
  notes: string | null;
  properties: Array<{ id: string; name: string | null; town: string | null; units: number }>;
  units: number;
  release: { esas_signed: number; committed: number; applied: number; live: number; blocked: number };
  contacts: Array<{ id: string; name: string | null; role: string | null }>;
};

export type PropertyUnit = {
  id: string;
  unit_label: string | null;
  address_line: string | null;
  stage: Stage;
  stage_code: string;
  stage_label: string;
  blocked_code: string | null;
  terminal_state: string | null;
  health: string | null;
  resident: string | null;
  flags: string[];
};

export type BatchAction =
  | "qualify_all"
  | "generate_esas"
  | "submit_cgb_apps"
  | "build_install_week"
  | "submit_completion_pkgs";

export type PropertyDetail = {
  property: {
    id: string;
    name: string | null;
    address: string;
    town: string | null;
    account: { id: string; name: string; type: string; deal_state: string | null } | null;
    master_agreement: { doc_id: string; status: string | null; signed_at: string | null } | null;
    geo: Record<string, unknown> | null;
  };
  release_meter: {
    units: number;
    active: number;
    esas_signed: number;
    applied: number;
    rof: number;
    installed: number;
    live: number;
    blocked: number;
    terminal: number;
    by_stage: Array<{ stage: Stage; code: string; count: number }>;
  };
  units: PropertyUnit[];
  contacts: Array<{ id: string; name: string | null; role: string | null; phone: string | null; email: string | null }>;
  batch_counts: Record<BatchAction, number>;
};

export type UnitResult = {
  system_id: string;
  unit_label: string | null;
  address_line: string | null;
  result: "applied" | "skipped";
  detail: string;
};

export type BatchRun = {
  action: BatchAction;
  ran_at: string;
  eligible: number;
  applied: number;
  skipped: number;
  results: UnitResult[];
};

export type InventorySummary = {
  skus: Array<{
    sku: string;
    kind: string;
    label: string;
    qty_per_system: number;
    available: number;
    allocated: number;
    on_hand: number;
  }>;
  buildable: number;
  constraint_sku: string | null;
  allocated_note: string;
  next_po: {
    po_no: string;
    vendor: string | null;
    due_at: string | null;
    status: string;
    qty: number;
    lines: Array<{ sku?: string; qty?: number; kind?: string }>;
  } | null;
};

/** The server's error envelope, kept whole so callers can render `unmet`. */
export type ApiError = {
  status: number;
  code: string;
  message: string;
  gate?: string;
  unmet?: Unmet[];
  [k: string]: unknown;
};

export function isApiError(e: unknown): e is ApiError {
  return typeof e === "object" && e !== null && "code" in e && "status" in e;
}

/** GET returning `data`, throwing the full error envelope on failure. */
export async function lcGet<T>(path: string): Promise<T> {
  const res = await authedFetch(path);
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.success === false) {
    throw { status: res.status, ...(json ?? { code: "REQUEST_FAILED", message: `Request failed (${res.status})` }) } as ApiError;
  }
  return json.data as T;
}

export async function lcPost<T>(path: string, body: unknown): Promise<T> {
  const res = await authedFetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.success === false) {
    throw { status: res.status, ...(json ?? { code: "REQUEST_FAILED", message: `Request failed (${res.status})` }) } as ApiError;
  }
  return json.data as T;
}

/** Advance one stage. The server owns the verdict; we just relay it. */
export function advanceSystem(id: string) {
  return lcPost<{ system: { stage: Stage }; history: { from: string; to: string; via: string } }>(
    `/api/systems/${id}/advance`,
    { via: "MANUAL" },
  );
}

/** D5 — Pipeline ITC thread strip aggregates (GET /api/itc/thread). */
export type ItcThread = {
  stages: Array<{ status: string; count: number; credit: number; current: boolean }>;
  current: string | null;
  total_claims: number;
  allocation: {
    program_year: number;
    category: string;
    kw_awarded: number;
    kw_consumed: number;
    kw_remaining: number;
    award_doc_id: string | null;
  } | null;
  cohorts: Record<string, number>;
};
