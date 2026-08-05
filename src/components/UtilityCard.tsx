"use client";

interface UtilityCardProps {
  utility: {
    utility_name: string;
    usurdb_name?: string;
    eia_id?: string;
    state: string;
    customers: number;
    control_area: string;
    holding_company: string;
    regulated?: string;
    website?: string;
  };
  coordinates: { lat: number; lng: number };
  address: string;
}

export default function UtilityCard({
  utility,
  coordinates,
  address,
}: UtilityCardProps) {
  return (
    <div className="gs-card animate-in">
      <div className="gs-card-header">
        <span className="gs-card-title">Auto-Detected Utility</span>
        <span className="gs-detected gs-detected-ok">Matched</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-ink" style={{ fontFamily: "var(--font-serif)" }}>
            {utility.utility_name}
          </h3>
          <p className="text-sm text-ink3 mt-0.5">{address}</p>
        </div>
        <div className="text-right font-mono text-xs text-ink4">
          {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Field label="ISO/RTO" value={utility.control_area || "N/A"} />
        <Field label="State" value={utility.state || "N/A"} />
        <Field
          label="Customers"
          value={utility.customers ? utility.customers.toLocaleString() : "N/A"}
        />
        <Field label="Holding Co" value={utility.holding_company || "N/A"} />
        {utility.usurdb_name && utility.usurdb_name !== utility.utility_name && (
          <Field label="USURDB Name" value={utility.usurdb_name} />
        )}
        {utility.regulated && <Field label="Regulated" value={utility.regulated} />}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg rounded-lg px-3 py-2">
      <p className="text-[10px] text-ink4 font-mono uppercase tracking-wide">{label}</p>
      <p className="text-sm text-ink font-medium mt-0.5 truncate" title={value}>{value}</p>
    </div>
  );
}
