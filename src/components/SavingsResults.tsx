"use client";

interface SavingsResultsProps {
  data: {
    system: { recommended_kw: number; recommended_kwh: number; duration_hrs: number };
    costs: { gross_cost: number; incentive_amount: number; itc_amount: number; net_cost: number };
    savings: {
      demand_supply_savings: number;
      demand_delivery_savings: number;
      tou_arbitrage_savings: number;
      dr_revenue: number;
      ratchet_avoidance_savings: number;
      coincident_peak_savings: number;
      resilience_value: number;
      tax_benefit_value: number;
      total_annual_savings: number;
    };
    financing: {
      cpace_annual_payment: number;
      net_annual_cashflow: number;
      simple_payback_years: number;
    };
    composite_score: number;
  };
}

const STREAMS = [
  { key: "demand_supply_savings", label: "Demand charge reduction (supply)", color: "#e03e3e", detail: "Battery shaves peak 15-min demand intervals" },
  { key: "demand_delivery_savings", label: "Demand charge reduction (delivery)", color: "#7c3aed", detail: "Same peak shave applies to delivery demand charges" },
  { key: "tou_arbitrage_savings", label: "TOU energy arbitrage", color: "#d97706", detail: "Charge off-peak, discharge on-peak for energy spread" },
  { key: "dr_revenue", label: "Demand response revenue", color: "#0891b2", detail: "Contracted load curtailment during grid events" },
  { key: "ratchet_avoidance_savings", label: "Ratchet avoidance", color: "#1a5cff", detail: "Prevents spike from setting trailing demand baseline" },
  { key: "coincident_peak_savings", label: "Coincident peak (1CP/4CP)", color: "#64748b", detail: "Dispatch during system peak to reduce transmission tag" },
  { key: "resilience_value", label: "Resilience value (avoided loss)", color: "#0fa958", detail: "Avoided outage cost based on facility type" },
  { key: "tax_benefit_value", label: "Tax savings (ITC + MACRS)", color: "#d946ef", detail: "Accelerated depreciation on net cost after ITC" },
];

export default function SavingsResults({ data }: SavingsResultsProps) {
  const { system, costs, savings, financing, composite_score } = data;
  const maxStream = Math.max(
    ...STREAMS.map((s) => savings[s.key as keyof typeof savings] as number)
  );
  const roi = costs.net_cost > 0 ? ((savings.total_annual_savings / costs.net_cost) * 100).toFixed(0) : "0";

  return (
    <div className="space-y-4">
      {/* Hero Score */}
      <div className="gs-result-hero animate-in d1">
        <h2 className="text-lg font-light relative" style={{ fontFamily: "var(--font-serif)" }}>
          BESS Composite Economic Score
        </h2>
        <div className="relative" style={{ fontFamily: "var(--font-serif)" }}>
          <span className="text-[56px] font-bold leading-none">{composite_score}</span>
          <span className="text-2xl font-light opacity-60">/100</span>
        </div>
        <div className="font-mono text-[10px] tracking-[.1em] opacity-50 relative uppercase mt-1">
          {composite_score >= 80 ? "Excellent" : composite_score >= 60 ? "Good" : "Moderate"} ROI
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 relative">
          <HeroKpi value={`$${savings.total_annual_savings.toLocaleString()}`} label="Annual Savings" highlight />
          <HeroKpi value={`${financing.simple_payback_years} yr`} label="Payback" highlight={financing.simple_payback_years < 3} />
          <HeroKpi value={`${system.recommended_kwh} kWh`} label="System Size" />
          <HeroKpi value={`$${costs.net_cost.toLocaleString()}`} label="Net Cost" />
          <HeroKpi value={`${roi}%`} label="Year 1 ROI" highlight />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Savings Waterfall */}
        <div className="gs-card animate-in d2">
          <div className="gs-card-header">
            <span className="gs-card-title">Annual Savings — 8 Revenue Streams</span>
          </div>
          {STREAMS.map((stream) => {
            const value = savings[stream.key as keyof typeof savings] as number;
            const pct = maxStream > 0 ? Math.round((value / maxStream) * 100) : 0;
            return (
              <div key={stream.key} className="gs-savings-bar">
                <div className="gs-sb-head">
                  <span className="gs-sb-name">
                    <span className="gs-sb-dot" style={{ backgroundColor: stream.color }} />
                    {stream.label}
                  </span>
                  <span className="gs-sb-val">${value.toLocaleString()}</span>
                </div>
                <div className="gs-sb-track">
                  <div
                    className="gs-sb-fill"
                    style={{ width: `${pct}%`, backgroundColor: stream.color }}
                  />
                </div>
                {value > 0 && (
                  <div className="gs-sb-detail">{stream.detail}</div>
                )}
              </div>
            );
          })}
          <div className="flex justify-between items-center pt-3 mt-2 border-t-2 border-ink text-[15px] font-semibold">
            <span>Total Annual Value</span>
            <span className="font-mono text-green">${savings.total_annual_savings.toLocaleString()}</span>
          </div>
        </div>

        {/* Right Column: System + Costs + Financing */}
        <div className="space-y-4">
          {/* System Recommendation */}
          <div className="gs-card animate-in d3">
            <div className="gs-card-header">
              <span className="gs-card-title">System Recommendation</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <SysBox label="Power" value={`${system.recommended_kw} kW`} />
              <SysBox label="Capacity" value={`${system.recommended_kwh} kWh`} />
              <SysBox label="Duration" value={`${system.duration_hrs} hours`} />
              <SysBox label="Chemistry" value="LFP" />
            </div>
            <p className="text-xs text-ink3 mt-3 leading-relaxed">
              Sized to shave top 15% of demand peaks. {system.duration_hrs}-hour duration covers peak window. LFP for 15+ year cycle life.
            </p>
          </div>

          {/* Cost Waterfall */}
          <div className="gs-card animate-in d4">
            <div className="gs-card-header">
              <span className="gs-card-title">Cost &amp; Incentive Waterfall</span>
            </div>
            <div className="text-sm space-y-1 leading-[2.2]">
              <CostRow label="Gross installed cost" value={costs.gross_cost} />
              {costs.incentive_amount > 0 && (
                <CostRow label="State incentive" value={-costs.incentive_amount} green />
              )}
              {costs.itc_amount > 0 && (
                <CostRow label="Federal ITC (30%)" value={-costs.itc_amount} green />
              )}
              <div className="border-t-2 border-ink pt-1 flex justify-between font-semibold">
                <span>Net cost to customer</span>
                <span className="font-mono">${costs.net_cost.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Financing Card */}
          <div
            className="gs-card animate-in d5 text-center"
            style={{
              background: financing.net_annual_cashflow > 0 ? "var(--color-green-bg)" : undefined,
              borderColor: financing.net_annual_cashflow > 0 ? "var(--color-green)" : undefined,
            }}
          >
            <div className="font-mono text-[10px] tracking-[.08em] text-green2 uppercase">
              With C-PACE Zero-Down Financing
            </div>
            <div
              className="text-[32px] font-bold my-1"
              style={{
                fontFamily: "var(--font-serif)",
                color: financing.net_annual_cashflow > 0 ? "var(--color-green)" : "var(--color-red)",
              }}
            >
              {financing.net_annual_cashflow > 0 ? "+" : ""}${financing.net_annual_cashflow.toLocaleString()}/yr
            </div>
            <div className="text-xs text-green2">
              {financing.net_annual_cashflow > 0 ? "positive cash flow from day one" : "negative cash flow — review sizing"}
            </div>
            <div className="text-[11px] text-green2 mt-1 opacity-75">
              ${savings.total_annual_savings.toLocaleString()} savings &minus; ${financing.cpace_annual_payment.toLocaleString()} C-PACE payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroKpi({
  value,
  label,
  highlight,
}: {
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg px-3 py-2.5 ${
        highlight
          ? "border border-green/40 bg-green/[.08]"
          : "border border-white/[.08] bg-white/[.06]"
      }`}
    >
      <div
        className={`text-xl font-semibold ${highlight ? "text-green-400" : ""}`}
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {value}
      </div>
      <div className="font-mono text-[9px] tracking-[.06em] opacity-50 mt-0.5 uppercase">
        {label}
      </div>
    </div>
  );
}

function SysBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg rounded-md px-3 py-2">
      <div className="text-[10px] text-ink4">{label}</div>
      <div className="font-mono font-semibold text-base">{value}</div>
    </div>
  );
}

function CostRow({
  label,
  value,
  green,
}: {
  label: string;
  value: number;
  green?: boolean;
}) {
  const isNeg = value < 0;
  return (
    <div className="flex justify-between">
      <span className={green ? "text-green" : ""}>{isNeg ? "− " : ""}{label}</span>
      <span className={`font-mono font-medium ${green ? "text-green" : ""}`}>
        {isNeg ? "−" : ""}${Math.abs(value).toLocaleString()}
      </span>
    </div>
  );
}
