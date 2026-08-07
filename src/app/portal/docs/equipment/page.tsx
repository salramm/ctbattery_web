import type { Metadata } from "next";
import Image from "next/image";
import "./equipment.css";

export const metadata: Metadata = {
  title: "Battery Systems — CT Battery Solutions Portal",
  robots: { index: false, follow: false },
};

const SIZINGS = [
  {
    units: "1×",
    capacity: "10 kWh",
    power: "7.08 kW",
    use: "Single-fridge + lights backup. Smaller homes / starter system.",
    cost: "$7,900",
  },
  {
    units: "2×",
    capacity: "20 kWh",
    power: "14.16 kW",
    use: "Whole essential-circuit backup. The recommended residential default.",
    cost: "$13,500",
    recommended: true,
  },
  {
    units: "4×",
    capacity: "40 kWh",
    power: "28.32 kW",
    use: "Larger homes, all-load backup, or multi-day resilience.",
    cost: "$25,000",
  },
  {
    units: "8×",
    capacity: "80 kWh",
    power: "56.64 kW",
    use: "Light commercial, multifamily, or extended outage coverage.",
    cost: "$44,000",
  },
];

export default function EquipmentPage() {
  return (
    <div className="eq-page">
      <div className="hdr">
        <div className="brand">
          Grid<strong>Shift</strong> · Battery Systems · April 2026
        </div>
        <h1>
          Enphase IQ Battery <em>10C</em>
        </h1>
        <p className="sub">
          Our standard residential battery system. Stackable in 1×, 2×, 4×, or
          8× configurations to scale capacity and continuous power. The 2×
          configuration is the recommended residential default. All systems
          ship with the required Enphase combiner and metering hardware listed
          below.
        </p>
      </div>

      <div className="hero-card">
        <div className="hero-photo">
          <Image
            src="/ct/iq-battery-10c.png"
            alt="Enphase IQ Battery 10C, wall-mount"
            width={280}
            height={280}
            style={{
              maxWidth: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
          <div className="photo-tag">Photo · IQ Battery 10C</div>
        </div>
        <div className="hero-info">
          <span className="badge">Primary system · DOM SKU</span>
          <h2>Enphase IQ Battery 10C</h2>
          <div className="vendor">
            Enphase Energy ·{" "}
            <a
              href="https://enphase.com/store/storage/gen4/iq-battery-10c"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Enphase →
            </a>
          </div>
          <p className="hero-desc">
            UL-9540 listed AC-coupled battery. Full domestic-content build
            (B05-C01-US00-1-3-DOM SKU) qualifies for the +10% federal ITC adder.
            Integrates natively with Enphase Enlighten + EnergyHub DERMS, so
            program dispatch requires no third-party aggregator. 15-year
            manufacturer warranty.
          </p>

          <div className="specs">
            <div className="spec">
              <div className="k">Capacity</div>
              <div className="v">10.08 kWh</div>
            </div>
            <div className="spec">
              <div className="k">Continuous power</div>
              <div className="v">3.84 kW</div>
            </div>
            <div className="spec">
              <div className="k">Usable @ 80% DoD</div>
              <div className="v">8.06 kWh</div>
            </div>
            <div className="spec">
              <div className="k">Warranty</div>
              <div className="v">15 yr</div>
            </div>
            <div className="spec">
              <div className="k">Chemistry</div>
              <div className="v">LFP</div>
            </div>
            <div className="spec">
              <div className="k">CT ESS</div>
              <div className="v" style={{ color: "var(--green)" }}>
                Eligible
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sec-l">
        1 · <span>System sizing</span>
      </div>
      <div className="card">
        <div className="card-title">Stack configurations</div>
        <table>
          <thead>
            <tr>
              <th>Units</th>
              <th>Total capacity</th>
              <th>Continuous power</th>
              <th>Use case</th>
              <th className="r">Installed cost</th>
            </tr>
          </thead>
          <tbody>
            {SIZINGS.map((s) => (
              <tr
                key={s.units}
                className={s.recommended ? "recommended" : undefined}
              >
                <td className="m b">{s.units}</td>
                <td className="m">{s.capacity}</td>
                <td className="m">{s.power}</td>
                <td>{s.use}</td>
                <td className="r m b">{s.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="note">
          <strong>Cost basis:</strong> all-in installed (battery + IQ Combiner
          6C + IQ Meter Collar + install labor + permits + interconnection).
          Fleet pricing (50+ deployments) lowers per-unit cost ~15% — see the{" "}
          <strong>Project Calculator</strong> for the exact retail vs fleet
          breakout.
        </div>
      </div>

      <div className="sec-l">
        2 · <span>Required ancillary hardware</span>
      </div>
      <div className="hw-list">
        <div className="hw-item">
          <h4>IQ Combiner 6C</h4>
          <div className="part">
            Enphase · 240VAC / 48A max · X-IQ-AM1-240-3-DOM
          </div>
          <p>
            Aggregation point between the IQ Battery, the home&apos;s electrical
            service, and the dispatch network. Provides surge protection and
            the production CT for revenue-grade metering. Required for every
            install regardless of stack size.
          </p>
        </div>
        <div className="hw-item">
          <h4>IQ Meter Collar</h4>
          <div className="part">Enphase · revenue-grade metering</div>
          <p>
            Sits on the utility meter base. Monitors site-level production and
            consumption for the program&apos;s performance verification. One per
            install.
          </p>
        </div>
        <div className="hw-item">
          <h4>IQ Gateway / Envoy</h4>
          <div className="part">Enphase · cellular + Wi-Fi</div>
          <p>
            On-site controller that handles communication with Enphase Enlighten
            and the EnergyHub DERMS platform. Dispatch commands and operational
            telemetry flow through the gateway. Cellular fallback included.
          </p>
        </div>
        <div className="hw-item">
          <h4>Mounting + conduit kit</h4>
          <div className="part">Wall-mount kit · code-compliant conduit</div>
          <p>
            Standard wall-mount bracket plus the conduit and disconnect
            hardware required by NEC and the local electrical inspector.
            Sourced through our regular distributor; standard line item on
            every BOM.
          </p>
        </div>
      </div>

      <div className="sec-l">
        3 · <span>Notes</span>
      </div>
      <div className="card">
        <div className="card-title">Why only 10C</div>
        <p style={{ margin: 0, fontSize: 14, color: "var(--text-2)" }}>
          The IQ Battery 10C is the only system on our installation list. It
          carries domestic-content qualification (the +10% federal ITC adder),
          is on the Connecticut ESS approved-equipment list, and integrates
          natively with the EnergyHub DERMS platform — meaning no third-party
          aggregator vendor fee. The 5P, Tesla Powerwall, Generac PWRcell, and
          others are out of scope for the CT Battery Solutions fleet because they break at
          least one of those three constraints (DOM, ESS approval, or
          aggregator-free dispatch).
        </p>
      </div>
    </div>
  );
}
