import type { Metadata } from "next";
import Image from "next/image";
import "./landing.css";

export const metadata: Metadata = {
  title: "CT Battery Solutions — A free battery for your Connecticut home",
  description:
    "A free battery for your Connecticut home, paid for by Connecticut's Energy Storage Solutions program. Check your address in 2 minutes.",
};

const PinIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

function AddressForm({ id }: { id: string }) {
  return (
    <form className="address-form" id={id} action="/ct/apply" method="get">
      <div className="address-row">
        <label className="address-input-wrap" htmlFor={`${id}-input`}>
          <span className="pin" aria-hidden="true">
            <PinIcon />
          </span>
          <input
            id={`${id}-input`}
            name="address"
            type="text"
            inputMode="text"
            autoComplete="street-address"
            placeholder="123 Main St, Hartford, CT 06103"
            required
          />
        </label>
        <button type="submit" className="btn-primary">
          Check your address
          <ArrowIcon />
        </button>
      </div>
      <p className="form-note">
        <span>Connecticut residents only</span> · Takes 2 minutes · No credit check.
      </p>
    </form>
  );
}

export default function CtLandingPage() {
  return (
    <div className="ctp">
      {/* ─── Header ───────────────────────────────────────── */}
      <header className="site">
        <div className="wrap row">
          <a className="brand" href="/ct">
            <span className="mark" aria-hidden="true"></span>
            <span className="name">
              CT Battery Solutions
            </span>
          </a>
          <div className="header-meta" aria-hidden="true">
            <span className="dot"></span>CT Energy Storage Solutions partner
          </div>
        </div>
      </header>

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">For Connecticut homeowners &amp; tenants</p>
          <h1>
            A free battery for your <em>Connecticut</em> home.
          </h1>
          <p className="subhead">
            Paid for by Connecticut&apos;s Energy Storage Solutions program — not by
            you. We install it, we operate it, and you keep the lights on when the
            power goes out.
          </p>
          <AddressForm id="hero-form" />
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────── */}
      <section id="how">
        <div className="wrap">
          <p className="section-label">How it works</p>
          <h2 className="section-title">
            Three steps to reliable, backup power.
          </h2>

          <div className="steps">
            <div className="step">
              <div className="num">01</div>
              <h3>Check your address</h3>
              <p>Confirm your home qualifies in under two minutes.</p>
            </div>

            <div className="step">
              <div className="num">02</div>
              <h3>We install at no cost</h3>
              <p>Our crew mounts and wires the battery — you pay nothing.</p>
            </div>

            <div className="step">
              <div className="num">03</div>
              <h3>You get backup power</h3>
              <p>You use it during outages. We operate it for the grid.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── What you get ─────────────────────────────────── */}
      <section id="what-you-get">
        <div className="wrap">
          <p className="section-label">What you get</p>
          <h2 className="section-title">
            Real backup power, on your wall, at no cost — ever.
          </h2>

          <div className="benefits">
            <div className="benefit">
              <div className="icon" aria-hidden="true">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3 6 16h6l-1 9 9-13h-6l1-9Z" />
                </svg>
              </div>
              <div>
                <h3>Backup power during outages</h3>
                <p>
                  When the power goes out, your battery keeps essentials running
                  automatically.
                </p>
              </div>
            </div>

            <div className="benefit">
              <div className="icon" aria-hidden="true">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="14" cy="14" r="10" />
                  <path d="M8 14h12" />
                  <path d="m18 10 4 4-4 4" />
                </svg>
              </div>
              <div>
                <h3>Zero upfront cost</h3>
                <p>
                  No down payment, no monthly bill. The price is zero.
                </p>
              </div>
            </div>

            <div className="benefit">
              <div className="icon" aria-hidden="true">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 22V11l9-6 9 6v11" />
                  <path d="M10 22v-7h8v7" />
                </svg>
              </div>
              <div>
                <h3>Professional installation by our crew</h3>
                <p>
                  Licensed Connecticut electricians on staff. We pull the permits
                  and clean up after.
                </p>
              </div>
            </div>

            <div className="benefit">
              <div className="icon" aria-hidden="true">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="14" cy="14" r="10" />
                  <path d="M14 8v6l4 2" />
                </svg>
              </div>
              <div>
                <h3>10 years of operation included</h3>
                <p>
                  We monitor, maintain, and warranty the system for a full decade.
                  You don&apos;t lift a finger.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Why it's free ────────────────────────────────── */}
      <section id="why-free">
        <div className="wrap">
          <p className="section-label">Why it&apos;s free</p>

          <div className="why">
            <h2 className="lead">
              A state program to help buildout Connecticut energy storage —
              and pays us to install batteries.
            </h2>

            <div className="body">
              <p>
                It&apos;s called{" "}
                <strong>Energy Storage Solutions</strong>. It exists to put
                backup power in more Connecticut homes. We install the
                batteries; the program pays us for it.
              </p>
              <p>
                You get the battery on your wall and the backup power when the
                lights go out. Nothing hidden behind an asterisk.
              </p>
              <p className="pullquote">
                &ldquo;We make money from the program, not from you.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Renters + landlords ─────────────────────────── */}
      <section className="stronger">
        <div className="wrap">
          <h2 className="stronger-h2">
            Renters and landlords welcome.
          </h2>
          <div className="stronger-pair">
            <div className="stronger-card">
              <h3>Renters qualify too.</h3>
              <p>
                With your landlord&apos;s written consent, we&apos;ll install the
                battery at your home. We send the one-page consent form to them
                ourselves and CC you. About two-thirds come back signed; we
                handle the back-and-forth.
              </p>
            </div>
            <div className="stronger-card">
              <h3>For landlords: value added, no tax bump.</h3>
              <p>
                A permanently-mounted battery is real equipment that improves
                the property — but Connecticut law excludes residential energy
                storage from property tax assessment. The upgrade goes on the
                wall, not on your tax bill. We install at no cost, maintain it
                for the 10-year term, and remove it at our cost if anything
                changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── What it looks like ───────────────────────────── */}
      <section id="equipment">
        <div className="wrap">
          <div className="equipment">
            <a
              className="photo"
              href="https://enphase.com/store/storage/gen4/iq-battery-10c"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Enphase IQ Battery 10C — view product details"
            >
              <Image
                src="/ct/iq-battery-10c.png"
                alt="Enphase IQ Battery 10C, wall-mount"
                fill
                sizes="(max-width: 880px) 100vw, 600px"
                style={{ objectFit: "contain", padding: "8%" }}
                priority={false}
              />
              <div className="photo-tag">View on Enphase →</div>
            </a>

            <div className="info">
              <p className="section-label">What it looks like</p>
              <h2>
                One battery, mounted on the wall of your garage, basement, or
                utility room.
              </h2>
              <ul className="spec-list">
                <li>
                  <span className="k">Equipment</span>
                  <span className="v">Enphase IQ Battery 10C</span>
                </li>
                <li>
                  <span className="k">Capacity</span>
                  <span className="v">10.5 kWh</span>
                </li>
                <li>
                  <span className="k">Certification</span>
                  <span className="v">UL-listed</span>
                </li>
                <li>
                  <span className="k">Warranty</span>
                  <span className="v">15 years</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Where the battery lives ──────────────────────── */}
      <section id="where-it-lives">
        <div className="wrap">
          <p className="section-label">Where it lives</p>
          <h2 className="section-title">
            Slim and wall-mounted. Silent. Mounts indoors.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--ink-2)",
              lineHeight: 1.65,
              maxWidth: "60ch",
              marginBottom: 32,
            }}
          >
            The battery mounts flat on an interior wall — about 24.5&Prime; H
            × 28&Prime; W × 14.4&Prime; D (621 × 708 × 365 mm). It runs
            silently, with no fans or moving parts.
          </p>

          <div className="placement-grid">
            <div className="placement-col placement-yes">
              <h3>Best places in your home</h3>
              <ul>
                <li>
                  <span className="mark" aria-hidden="true">
                    ✓
                  </span>
                  <div>
                    <strong>Basement</strong> — ideal. Stable temperature
                    year-round.
                  </div>
                </li>
                <li>
                  <span className="mark" aria-hidden="true">
                    ✓
                  </span>
                  <div>
                    <strong>Insulated garage</strong> — works well in CT.
                  </div>
                </li>
                <li>
                  <span className="mark" aria-hidden="true">
                    ✓
                  </span>
                  <div>
                    <strong>Uninsulated garage</strong> — works fine; may
                    charge a bit slower on the coldest days.
                  </div>
                </li>
                <li>
                  <span className="mark" aria-hidden="true">
                    ✓
                  </span>
                  <div>
                    <strong>Utility or mechanical room</strong> — common in
                    townhomes.
                  </div>
                </li>
              </ul>
            </div>
            <div className="placement-col placement-no">
              <h3>Not recommended</h3>
              <ul>
                <li>
                  <span className="mark" aria-hidden="true">
                    ✕
                  </span>
                  <div>Attic or unconditioned space</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Safety & certifications ──────────────────────── */}
      <section id="safety">
        <div className="wrap">
          <p className="section-label">Safety &amp; certifications</p>
          <h2 className="section-title">
            Certified to the strictest U.S. and international standards.
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "var(--ink-2)",
              lineHeight: 1.65,
              maxWidth: "62ch",
              marginBottom: 32,
            }}
          >
            The Enphase IQ Battery 10C is certified to the strictest U.S. and
            international standards for residential energy storage. Modern home
            batteries are engineered with multiple layers of safety protection
            — and the 10C carries every certification that applies.
          </p>

          <div className="cert-grid">
            {[
              {
                code: "UL 9540",
                desc: "Listed for energy storage systems — the U.S. baseline standard. Required for permit approval in every state.",
              },
              {
                code: "UL 9540A",
                desc: "Tested for thermal runaway fire propagation. Allows reduced separation distances per 2021 IFC and 2023 NFPA 855.",
              },
              {
                code: "UL 1741-SA & SB",
                desc: "Grid-interactive inverter standards. Confirms compatibility with utility safety protocols.",
              },
              {
                code: "IEEE 1547:2018",
                desc: "Interconnection and interoperability with utility distribution systems.",
              },
              {
                code: "CSA C22.2",
                desc: "Canadian safety standard (applies to all North American installs).",
              },
              {
                code: "FCC Part 15B",
                desc: "Electromagnetic emissions compliance.",
              },
              {
                code: "NFPA 855",
                desc: "National Fire Protection Association standard for stationary energy storage.",
              },
              {
                code: "2021 IRC R328 / 2021 IFC 1207",
                desc: "Residential and fire code compliance for installed location.",
              },
            ].map((c) => (
              <div key={c.code} className="cert-card">
                <div className="cert-code">{c.code}</div>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="layers-card">
            <p className="layers-h">Layers of protection</p>
            <ul>
              <li>
                <strong>Battery Management System (BMS)</strong> — monitors
                every cell continuously for voltage, current, and temperature
                anomalies.
              </li>
              <li>
                <strong>Thermal management</strong> — passively cooled with no
                fans (fewer parts that can fail); thermal sensors trigger
                automatic shutoff if any cell heats abnormally.
              </li>
              <li>
                <strong>LFP chemistry</strong> — stable under puncture, impact,
                overcharge, and over-discharge conditions where older
                chemistries can fail.
              </li>
              <li>
                <strong>Automatic shutoffs</strong> — multiple independent
                fail-safes, including ground-fault protection, arc-fault
                detection, and remote disconnect via the Enphase Gateway.
              </li>
              <li>
                <strong>Four embedded grid-forming microinverters</strong> per
                battery — no single point of failure; if one microinverter
                fails, the others continue operating.
              </li>
            </ul>
          </div>

          <div className="safety-stats">
            <div className="stat-hero">
              <div className="stat-hero-v">Zero</div>
              <div className="stat-hero-d">
                documented thermal runaway events in Enphase battery
                deployments
              </div>
            </div>
            <div className="stat-row">
              <div className="stat-mini">
                <div className="stat-mini-v">4.9M</div>
                <div className="stat-mini-d">
                  Enphase energy systems deployed globally
                </div>
              </div>
              <div className="stat-mini">
                <div className="stat-mini-v">15 yr</div>
                <div className="stat-mini-d">warranty on the IQ Battery 10C</div>
              </div>
              <div className="stat-mini">
                <div className="stat-mini-v">96%</div>
                <div className="stat-mini-d">DC round-trip efficiency</div>
              </div>
              <div className="stat-mini">
                <div className="stat-mini-v">No cobalt</div>
                <div className="stat-mini-d">
                  eliminates the most volatile failure mode of older lithium
                  chemistries
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How it stacks up ─────────────────────────────── */}
      <section id="comparison">
        <div className="wrap">
          <p className="section-label">How it stacks up</p>
          <h2 className="section-title">
            How the IQ Battery 10C compares.
          </h2>

          <div className="compare-wrap">
            <table className="compare">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Enphase IQ 10C</th>
                  <th>Older NMC batteries</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Chemistry</td>
                  <td>LFP (lithium iron phosphate)</td>
                  <td>NMC (nickel manganese cobalt)</td>
                </tr>
                <tr>
                  <td>Thermal runaway risk</td>
                  <td>Minimal under failure conditions</td>
                  <td>Higher — requires more containment</td>
                </tr>
                <tr>
                  <td>Cobalt content</td>
                  <td>None</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>Architecture</td>
                  <td>4 microinverters per battery (no single point of failure)</td>
                  <td>Single inverter per battery</td>
                </tr>
                <tr>
                  <td>U.S. manufactured option</td>
                  <td>Yes (DOM SKU)</td>
                  <td>Limited</td>
                </tr>
                <tr>
                  <td>Sunlight backup (charge from solar while grid is down)</td>
                  <td>Yes (with IQ8 system)</td>
                  <td>Varies</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="cert-footnote">
            Certifications and statistics current as of May 2026. Enphase
            product specifications and certifications may be verified at{" "}
            <a
              href="https://enphase.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              enphase.com
            </a>
            .
          </p>
        </div>
      </section>

      {/* ─── Battery vs. gas generator ────────────────────── */}
      <section id="vs-generator">
        <div className="wrap">
          <p className="section-label">Battery vs. gas generator</p>
          <h2 className="section-title">
            Most CT homeowners think generator for backup. Here&apos;s why a
            battery wins.
          </h2>

          <div className="compare-wrap">
            <table className="compare">
              <thead>
                <tr>
                  <th></th>
                  <th>CT Battery Solutions</th>
                  <th>Gas Generator</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Switchover</td>
                  <td>Under 1 second, automatic</td>
                  <td>10–30 sec or manual start</td>
                </tr>
                <tr>
                  <td>Fuel</td>
                  <td>Recharges from grid daily</td>
                  <td>Refills during outages</td>
                </tr>
                <tr>
                  <td>Noise</td>
                  <td>Silent</td>
                  <td>65–80 dB</td>
                </tr>
                <tr>
                  <td>Emissions</td>
                  <td>None</td>
                  <td>Carbon monoxide</td>
                </tr>
                <tr>
                  <td>Maintenance</td>
                  <td>None</td>
                  <td>$200–400/yr + service</td>
                </tr>
                <tr>
                  <td>Daily value</td>
                  <td>Earns dispatch revenue</td>
                  <td>Sits idle</td>
                </tr>
                <tr className="row-total">
                  <td>
                    <strong>Your cost</strong>
                  </td>
                  <td>
                    <strong>$0 upfront, $0/month</strong>
                  </td>
                  <td>
                    <strong>$5K–15K + fuel + maintenance</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="closer">
            A generator costs you $11K–22K over 15 years and runs maybe a few
            days a year. The battery costs you nothing, runs every day, and is
            online before you notice the lights flickered.
          </p>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────── */}
      <section id="faq">
        <div className="wrap">
          <div className="faq">
            <div>
              <p className="section-label">FAQ</p>
              <h2 className="section-title tight">Questions people ask first.</h2>
            </div>

            <div className="faq-list">
              <details className="qa">
                <summary>
                  Who qualifies?<span className="toggle" aria-hidden="true"></span>
                </summary>
                <div className="answer">
                  <p>
                    You need to be a Connecticut resident with a home that has
                    compatible electrical service — most do. The address check
                    confirms it in about a minute.
                  </p>
                  <p>
                    CT Battery Solutions serves single-family homes and individually-metered
                    townhomes up to 4 units per building. Larger apartment
                    buildings (5+ units, master-metered, or shared electrical
                    service) are not currently eligible.
                  </p>
                  <p>
                    Renters can qualify too, with the property owner&apos;s
                    written consent. We help with that paperwork.
                  </p>
                </div>
              </details>

              <details className="qa">
                <summary>
                  Who owns the battery?
                  <span className="toggle" aria-hidden="true"></span>
                </summary>
                <div className="answer">
                  <p>
                    We do, for the duration of the program agreement. We&apos;re
                    responsible for monitoring, maintenance, and replacement if
                    anything fails.
                  </p>
                  <p>
                    You have full use of it the entire time — including during every
                    outage.
                  </p>
                </div>
              </details>

              <details className="qa">
                <summary>
                  Why did you choose Enphase?
                  <span className="toggle" aria-hidden="true"></span>
                </summary>
                <div className="answer">
                  <p>
                    We evaluated every major residential battery — Tesla
                    Powerwall, LG, SunPower, Generac, FranklinWH — and picked
                    the Enphase IQ Battery 10C for three reasons:
                  </p>
                  <p>
                    <strong>Built in America.</strong> The DOM SKU we install
                    is U.S.-manufactured and qualifies for federal Domestic
                    Content tax credits.{" "}
                    <strong>Safest chemistry.</strong> Lithium iron phosphate
                    (LFP) — cobalt-free and the most thermally stable lithium
                    chemistry; the same chemistry the U.S. military and
                    hospitals use.{" "}
                    <strong>Most certified.</strong> Every applicable U.S.
                    residential safety certification (UL 9540, UL 9540A, NFPA
                    855, IEEE 1547, and more — see the Safety section above).
                  </p>
                </div>
              </details>

              <details className="qa">
                <summary>
                  What happens during a power outage?
                  <span className="toggle" aria-hidden="true"></span>
                </summary>
                <div className="answer">
                  <p>
                    The battery senses the outage and starts powering your essential
                    circuits within seconds. No buttons, no apps. You&apos;ll
                    typically be able to run your lights, fridge, internet, and small
                    electronics for many hours, depending on usage.
                  </p>
                </div>
              </details>

              <details className="qa">
                <summary>
                  How long does the battery power my home during an outage?
                  <span className="toggle" aria-hidden="true"></span>
                </summary>
                <div className="answer">
                  <p>
                    A standard CT Battery Solutions install is two Enphase IQ Battery 10C
                    units (20 kWh total). That&apos;s enough to run your
                    essential circuits — refrigerator, lights, Wi-Fi, garage
                    door, one HVAC zone — for about{" "}
                    <strong>2 to 3 days</strong>.
                  </p>
                  <p>
                    Running heavier loads like central AC, an electric range,
                    or electric heat shortens that to{" "}
                    <strong>8–16 hours</strong>, depending on the season and
                    how cold or hot it is.
                  </p>
                  <p>
                    You&apos;ll work with us during install to choose which
                    circuits you want backed up. Most customers pick a
                    &ldquo;critical loads&rdquo; setup: fridge, freezer,
                    internet/router, a few lights, a phone charger, and one
                    HVAC zone. We size your backup panel accordingly.
                  </p>
                  <p>
                    If you want longer backup, we can add more batteries. Each
                    additional IQ Battery 10C adds roughly{" "}
                    <strong>one more day</strong> of essential-load runtime.
                  </p>
                  <p className="fineprint">
                    Actual backup duration depends on your home&apos;s energy
                    use, the weather during the outage, and which appliances you
                    keep running. A typical CT home uses 5–8 kWh per day on
                    essential loads; a 20 kWh battery supports that for 2.5–4
                    days.
                  </p>
                </div>
              </details>

              <details className="qa">
                <summary>
                  Does it have to be in a heated space?
                  <span className="toggle" aria-hidden="true"></span>
                </summary>
                <div className="answer">
                  <p>
                    Not heated, but climate-stable. The battery operates safely
                    from −4°F to 131°F, but it performs best between 60°F and
                    95°F. In CT, an uninsulated garage can drop below the
                    optimal range during winter cold snaps, which slows
                    charging temporarily. It still works — just less
                    efficiently on the coldest days.
                  </p>
                  <p>
                    If your only option is an uninsulated space, we&apos;ll
                    discuss it during the site assessment and recommend the
                    best location for your specific home.
                  </p>
                </div>
              </details>

              <details className="qa">
                <summary>
                  What happens if I sell my home?
                  <span className="toggle" aria-hidden="true"></span>
                </summary>
                <div className="answer">
                  <p>
                    The agreement transfers to the new owner if they want to keep
                    the battery. If they don&apos;t, we remove it at our cost and
                    patch the wall.
                  </p>
                </div>
              </details>

              <details className="qa">
                <summary>
                  Is there really no cost or hidden fee?
                  <span className="toggle" aria-hidden="true"></span>
                </summary>
                <div className="answer">
                  <p>
                    No cost. No fee. No deposit. No payment at the end. We
                    don&apos;t charge you for installation, monitoring, repairs, or
                    removal. The full agreement is in plain English and can be
                    found in the signup documents before you commit.
                  </p>
                </div>
              </details>

              <details className="qa">
                <summary>
                  What&apos;s the catch?
                  <span className="toggle" aria-hidden="true"></span>
                </summary>
                <div className="answer">
                  <p>
                    The honest answer: we get paid by the state when your battery
                    dispatches when electricity demand is high. Those events are
                    infrequent and the battery recharges automatically afterward,
                    so your backup capacity is restored well before the next
                    outage.
                  </p>
                  <p>
                    That&apos;s the whole arrangement. The program covers the cost,
                    we handle the work, you get the battery.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ────────────────────────────────────── */}
      <section className="final">
        <div className="wrap">
          <h2>Check your address. See if your home qualifies.</h2>
          <p className="sub">
            Two minutes. No credit check. No commitment until you&apos;ve read the
            agreement.
          </p>

          <AddressForm id="final-form" />

          <p className="service-area">
            CT Battery Solutions · Hartford · New Haven · Bridgeport ·
            Waterbury · and surrounding areas.
          </p>
        </div>
      </section>

      {/* ─── Referral / partner program callout ─────────── */}
      <section className="referral">
        <div className="wrap">
          <p>
            Electrician, realtor, property manager, or community org?{" "}
            <a href="/ct/partners">See our partner program →</a>
          </p>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────── */}
      <footer className="site">
        <div className="wrap row">
          <div className="col copyright">
            © 2026 CT Battery Solutions, Inc.
          </div>
          <div className="col links">
            <a href="/ct/about">About</a>
            <a href="/ct/contact">Contact</a>
            <a href="/ct/privacy">Privacy</a>
            <a href="/ct/terms">Terms</a>
            <a href="/login" className="btn-login">
              System login
            </a>
          </div>
          <div className="col">
            <a href="mailto:hello@ctbatterysolutions.com">hello@ctbatterysolutions.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
