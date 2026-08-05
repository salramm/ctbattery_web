"use client";

interface EnrichmentCardProps {
  enrichment: {
    utility_name: string;
    state: string;
    iso_rto: string;
    dr_program_name: string;
    dr_program_type: string;
    dr_revenue_per_kw_year: number;
    dr_season_start: string;
    dr_season_end: string;
    dr_events_per_year: number;
    dr_enrollment_method: string;
    incentive_program: string;
    incentive_rate_per_kwh: number;
    incentive_block_name: string;
    incentive_remaining_mwh: number;
    cpace_available: boolean;
    cpace_administrator: string;
    cpace_counties_opted_in: string[];
    interconnection_process: string;
    interconnection_timeline_weeks: number;
    green_button_cmd_available: boolean;
    avg_permit_timeline_weeks: number;
    fire_review_required: boolean;
    bess_score: number;
    primary_revenue_driver: string;
    notes: string;
  };
}

export default function EnrichmentCard({ enrichment }: EnrichmentCardProps) {
  const e = enrichment;

  return (
    <div className="gs-card overflow-hidden animate-in">
      <div className="gs-card-header">
        <span className="gs-card-title">CT Battery Solutions Intelligence</span>
        <ScoreBadge score={e.bess_score} />
      </div>

      <div className="p-6 space-y-6">
        {/* Demand Response */}
        <Section title="Demand Response" icon="bolt">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Program" value={e.dr_program_name} />
            <Field label="Type" value={e.dr_program_type} />
            <Field
              label="Revenue"
              value={
                e.dr_revenue_per_kw_year > 0
                  ? `$${e.dr_revenue_per_kw_year}/kW-yr`
                  : "N/A"
              }
              highlight={e.dr_revenue_per_kw_year > 0}
            />
            <Field
              label="Season"
              value={`${e.dr_season_start} - ${e.dr_season_end}`}
            />
            <Field
              label="Events/Year"
              value={e.dr_events_per_year?.toString() || "N/A"}
            />
            <Field label="Enrollment" value={e.dr_enrollment_method} />
          </div>
        </Section>

        {/* State Incentives */}
        <Section title="State Incentives" icon="currency">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Program" value={e.incentive_program} />
            <Field
              label="Rate"
              value={
                e.incentive_rate_per_kwh > 0
                  ? `$${e.incentive_rate_per_kwh}/kWh`
                  : "None"
              }
              highlight={e.incentive_rate_per_kwh > 0}
            />
            <Field label="Block" value={e.incentive_block_name} />
            <Field
              label="Remaining"
              value={
                e.incentive_remaining_mwh > 0
                  ? `${e.incentive_remaining_mwh} MWh`
                  : "N/A"
              }
            />
          </div>
        </Section>

        {/* C-PACE */}
        <Section title="C-PACE Financing" icon="bank">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field
              label="Available"
              value={e.cpace_available ? "Yes" : "No"}
              highlight={e.cpace_available}
            />
            <Field label="Administrator" value={e.cpace_administrator || "N/A"} />
            <Field
              label="Counties Opted In"
              value={e.cpace_counties_opted_in?.join(", ") || "N/A"}
            />
          </div>
        </Section>

        {/* Interconnection & Permitting */}
        <Section title="Interconnection & Permitting" icon="plug">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Process" value={e.interconnection_process} />
            <Field
              label="Timeline"
              value={`${e.interconnection_timeline_weeks} weeks`}
            />
            <Field
              label="Green Button CMD"
              value={e.green_button_cmd_available ? "Available" : "Not Available"}
            />
            <Field
              label="Permit Timeline"
              value={`${e.avg_permit_timeline_weeks} weeks`}
            />
            <Field
              label="Fire Review"
              value={e.fire_review_required ? "Required" : "Not Required"}
            />
            <Field label="Revenue Driver" value={formatDriver(e.primary_revenue_driver)} />
          </div>
        </Section>

        {/* Notes */}
        {e.notes && (
          <div className="bg-amber-bg border border-amber/20 rounded-lg p-3">
            <p className="text-[10px] font-mono font-medium text-amber tracking-wide mb-1 uppercase">
              Analyst Notes
            </p>
            <p className="text-xs text-ink2 leading-relaxed">{e.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 85
      ? "gs-pill-green"
      : score >= 70
        ? "gs-pill-blue"
        : score >= 50
          ? "gs-pill-amber"
          : "bg-bg2 text-ink4";

  return (
    <span className={`gs-pill font-bold text-xs ${color}`}>
      BESS {score}/100
    </span>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  const icons: Record<string, React.ReactNode> = {
    bolt: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
      />
    ),
    currency: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    bank: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
      />
    ),
    plug: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"
      />
    ),
  };

  return (
    <div>
      <div className="gs-divider">{title}</div>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] text-ink4 font-mono tracking-wide">{label}</p>
      <p className={`text-sm ${highlight ? "font-semibold text-green" : "text-ink"}`}>
        {value}
      </p>
    </div>
  );
}

function formatDriver(driver: string) {
  const map: Record<string, string> = {
    demand_charges: "Demand Charges",
    dr_revenue: "DR Revenue",
    "4cp": "4CP Transmission",
  };
  return map[driver] || driver;
}
