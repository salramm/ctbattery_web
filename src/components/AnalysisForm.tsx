"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

interface AnalysisFormProps {
  utilityName: string;
  defaultDemandCharge: number;
  defaultTouSpread?: number;
  defaultRatchet: number;
  defaultDrRevenue: number;
  defaultIncentive: number;
  onResult: (data: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const facilityTypes = [
  { value: "cold_storage", label: "Cold Storage" },
  { value: "grocery", label: "Grocery / Supermarket" },
  { value: "healthcare", label: "Healthcare" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "hotel", label: "Hotel / Hospitality" },
  { value: "office", label: "Office" },
  { value: "retail", label: "Retail" },
  { value: "warehouse", label: "Warehouse / Distribution" },
];

export default function AnalysisForm({
  utilityName,
  defaultDemandCharge,
  defaultTouSpread = 0.05,
  defaultRatchet,
  defaultDrRevenue,
  defaultIncentive,
  onResult,
  isLoading,
  setIsLoading,
}: AnalysisFormProps) {
  const [form, setForm] = useState({
    peak_demand_kw: 500,
    monthly_bill: 15000,
    facility_type: "cold_storage",
    demand_charge_per_kw: defaultDemandCharge || 20,
    tou_spread_per_kwh: defaultTouSpread,
    dr_revenue_per_kw_year: defaultDrRevenue || 0,
    incentive_per_kwh: defaultIncentive || 0,
    ratchet_percentage: defaultRatchet || 0,
  });

  function update(key: string, value: string | number) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await apiFetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ ...form, utility_name: utilityName }),
      });
      onResult(data);
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="gs-card animate-in">
      <div className="gs-card-header">
        <span className="gs-card-title">Savings Analysis</span>
        <span className="gs-card-badge gs-pill-amber">Configure &amp; Run</span>
      </div>
      <form onSubmit={handleAnalyze}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <NumberInput
            label="Peak Demand (kW)"
            value={form.peak_demand_kw}
            onChange={(v) => update("peak_demand_kw", v)}
          />
          <NumberInput
            label="Monthly Bill ($)"
            value={form.monthly_bill}
            onChange={(v) => update("monthly_bill", v)}
          />
          <div>
            <label className="gs-label">Facility Type</label>
            <select
              value={form.facility_type}
              onChange={(e) => update("facility_type", e.target.value)}
              className="gs-select"
            >
              {facilityTypes.map((ft) => (
                <option key={ft.value} value={ft.value}>
                  {ft.label}
                </option>
              ))}
            </select>
          </div>
          <NumberInput
            label="Demand Charge ($/kW)"
            value={form.demand_charge_per_kw}
            onChange={(v) => update("demand_charge_per_kw", v)}
            step={0.01}
          />
          <NumberInput
            label="TOU Spread ($/kWh)"
            value={form.tou_spread_per_kwh}
            onChange={(v) => update("tou_spread_per_kwh", v)}
            step={0.001}
          />
          <NumberInput
            label="DR Revenue ($/kW-yr)"
            value={form.dr_revenue_per_kw_year}
            onChange={(v) => update("dr_revenue_per_kw_year", v)}
          />
          <NumberInput
            label="Incentive ($/kWh)"
            value={form.incentive_per_kwh}
            onChange={(v) => update("incentive_per_kwh", v)}
            step={0.01}
          />
          <NumberInput
            label="Ratchet %"
            value={form.ratchet_percentage}
            onChange={(v) => update("ratchet_percentage", v)}
            step={0.01}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="gs-btn gs-btn-primary w-full py-3 text-sm font-semibold disabled:opacity-50"
        >
          {isLoading ? "Calculating..." : "Run Full Analysis →"}
        </button>
      </form>
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <div>
      <label className="gs-label">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        step={step}
        className="gs-input"
      />
    </div>
  );
}
