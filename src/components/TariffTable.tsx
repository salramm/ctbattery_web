"use client";

interface Tariff {
  id: number;
  label: string;
  rate_name: string;
  sector: string;
  service_type: string;
  flat_demand_structure: any;
  demand_ratchet_percentage: number | null;
  energy_rate_structure: any;
  start_date: string;
  source_url: string;
  _effective_demand_charge?: number | null;
  _tou_spread?: number;
}

interface TariffTableProps {
  tariffs: Tariff[];
  onSelectTariff: (tariff: Tariff) => void;
  selectedLabel: string | null;
}

export default function TariffTable({
  tariffs,
  onSelectTariff,
  selectedLabel,
}: TariffTableProps) {
  if (!tariffs.length) {
    return (
      <div className="gs-card animate-in">
        <div className="gs-card-header">
          <span className="gs-card-title">Rate Tariffs</span>
        </div>
        <p className="text-sm text-ink3">
          No approved C&I tariffs found. Try refreshing rates via the OpenEI API.
        </p>
      </div>
    );
  }

  return (
    <div className="gs-card overflow-hidden animate-in p-0">
      <div className="px-5 py-3 border-b border-bg2 flex items-center justify-between">
        <span className="gs-card-title">Rate Tariffs</span>
        <span className="gs-pill gs-pill-blue">{tariffs.length} rates</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left">
              <th className="font-mono text-[10px] tracking-wide text-ink4 font-medium px-5 py-2.5 bg-bg border-b border-bg3">RATE NAME</th>
              <th className="font-mono text-[10px] tracking-wide text-ink4 font-medium px-5 py-2.5 bg-bg border-b border-bg3">SECTOR</th>
              <th className="font-mono text-[10px] tracking-wide text-ink4 font-medium px-5 py-2.5 bg-bg border-b border-bg3">DEMAND</th>
              <th className="font-mono text-[10px] tracking-wide text-ink4 font-medium px-5 py-2.5 bg-bg border-b border-bg3">RATCHET</th>
              <th className="font-mono text-[10px] tracking-wide text-ink4 font-medium px-5 py-2.5 bg-bg border-b border-bg3">DATE</th>
              <th className="font-mono text-[10px] tracking-wide text-ink4 font-medium px-5 py-2.5 bg-bg border-b border-bg3"></th>
            </tr>
          </thead>
          <tbody>
            {tariffs.map((t) => {
              const demandRate = t._effective_demand_charge ?? extractDemandRate(t.flat_demand_structure);
              const isSelected = selectedLabel === t.label;

              return (
                <tr
                  key={t.label}
                  className={`transition-colors cursor-pointer border-b border-[rgba(0,0,0,.03)] ${
                    isSelected
                      ? "bg-brand-light"
                      : "hover:bg-brand-glow"
                  }`}
                  onClick={() => onSelectTariff(t)}
                >
                  <td className="px-5 py-2.5 font-medium text-ink">
                    {t.rate_name}
                  </td>
                  <td className="px-5 py-2.5 text-ink3 text-xs">{t.sector}</td>
                  <td className="px-5 py-2.5">
                    {demandRate ? (
                      <span className="font-mono font-medium text-ink">
                        ${demandRate.toFixed(2)}/kW
                      </span>
                    ) : (
                      <span className="text-ink5">—</span>
                    )}
                  </td>
                  <td className="px-5 py-2.5">
                    {t.demand_ratchet_percentage ? (
                      <span className="gs-pill gs-pill-amber">
                        {(t.demand_ratchet_percentage * 100).toFixed(0)}%
                      </span>
                    ) : (
                      <span className="text-ink5">—</span>
                    )}
                  </td>
                  <td className="px-5 py-2.5 text-ink3 text-xs font-mono">
                    {t.start_date || "—"}
                  </td>
                  <td className="px-5 py-2.5">
                    {isSelected && (
                      <span className="gs-pill gs-pill-blue">Selected</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function extractDemandRate(structure: any): number | null {
  if (!structure) return null;
  try {
    // Handles both API format (array of tier arrays) and
    // bulk format ({flatDemandTiers: [...]}).
    // Per OpenEI docs: total = rate + adj
    if (Array.isArray(structure)) {
      let maxRate = 0;
      for (const period of structure) {
        const tiers = Array.isArray(period)
          ? period
          : period?.flatDemandTiers;
        if (!Array.isArray(tiers)) continue;
        for (const tier of tiers) {
          const rate = (tier.rate || 0) + (tier.adj || 0);
          if (rate > maxRate) maxRate = rate;
        }
      }
      return maxRate > 0 ? maxRate : null;
    }
  } catch {
    return null;
  }
  return null;
}
