import type { Metadata } from "next";
import "./about.css";

export const metadata: Metadata = {
  title: "About — CT Battery Solutions",
  description:
    "A Connecticut company building local grid resilience under the state's Energy Storage Solutions program.",
};

const ArrowIcon = () => (
  <svg
    width="16"
    height="16"
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

export default function AboutPage() {
  return (
    <div className="cta">
      <header className="site">
        <div className="wrap row">
          <a className="brand" href="/ct">
            <span className="mark" aria-hidden="true"></span>
            <span className="name">
              CT Battery Solutions
            </span>
          </a>
          <nav className="site-nav" aria-label="Primary">
            <a href="/ct">Homeowners</a>
            <a href="/ct/partners">Partners</a>
            <a href="/ct/about" className="cur">
              About
            </a>
          </nav>
        </div>
      </header>

      <section>
        <div className="wrap">
          <p className="eyebrow">About</p>
          <h1 className="page-h1">
            A Connecticut company building <em>local</em> grid resilience.
          </h1>
          <p className="lead">
            We install free home batteries for Connecticut residents under the
            state&apos;s Energy Storage Solutions program. The state pays us to
            dispatch those batteries during peak grid events. Our job is to make
            that arrangement work for the household — clean installs, equipment
            that doesn&apos;t fail, paperwork in plain English, and a phone number
            a person actually picks up.
          </p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="two-col">
            <div>
              <p className="section-label">Why we exist</p>
              <h2 className="section-title">
                The grid is changing whether you opt in or not.
              </h2>
            </div>
            <div>
              <p>
                Connecticut&apos;s grid faces more strain every year — hotter
                summers, more electrified homes, more remote work. The old answer
                was to build more central power plants. The new answer is
                thousands of small batteries in homes, dispatched together when
                the grid is tight.
              </p>
              <p>
                That model only works if the households who host those batteries
                get something real out of it. So we built the company to deliver
                exactly that: backup power when the lights go out, a real human
                if anything breaks, and zero cost to the family. The state pays
                us. We share enough of that payment with our partners —
                electricians, realtors, community organizations — that the
                program reaches every neighborhood that needs it.
              </p>
              <p>
                We&apos;re not a startup chasing exit valuations. We&apos;re a
                Connecticut company building a long-lived business by doing one
                thing well in one state.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="section-label">Year one, by the numbers</p>
          <h2 className="section-title">What success looks like for us.</h2>
          <div className="stats">
            <div>
              <div className="k">Batteries installed</div>
              <div className="v">412</div>
              <div className="sub">Across 38 CT towns &amp; cities</div>
            </div>
            <div>
              <div className="k">Distressed-municipality installs</div>
              <div className="v">61%</div>
              <div className="sub">By share of total installs</div>
            </div>
            <div>
              <div className="k">Outage hours covered</div>
              <div className="v">2,840</div>
              <div className="sub">Cumulative across the fleet</div>
            </div>
            <div>
              <div className="k">Average install time</div>
              <div className="v">3h 40m</div>
              <div className="sub">Survey to commissioning</div>
            </div>
            <div>
              <div className="k">W-2 staff in CT</div>
              <div className="v">23</div>
              <div className="sub">Electricians, ops, support</div>
            </div>
            <div>
              <div className="k">Customer satisfaction target</div>
              <div className="v">
                ≥ 4.8
                <span style={{ fontSize: 26, color: "var(--ink-3)" }}> / 5</span>
              </div>
              <div className="sub">What we measure ourselves to</div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="section-label">How we work</p>
          <h2 className="section-title">Five things we hold ourselves to.</h2>
          <div className="values">
            <div className="value">
              <div className="num">01</div>
              <h3>W-2 crews, not subcontractors</h3>
              <p>
                Every electrician on a job is on our payroll, trained by us, and
                accountable to one quality bar. No marketplace, no rotating door
                of contractors.
              </p>
            </div>
            <div className="value">
              <div className="num">02</div>
              <h3>Plain-English everything</h3>
              <p>
                If our agreement isn&apos;t readable in ten minutes, it&apos;s not
                done. Same goes for emails, install plans, and outage reports.
              </p>
            </div>
            <div className="value">
              <div className="num">03</div>
              <h3>One state, done right</h3>
              <p>
                We&apos;re not expanding to fifteen states next year. Connecticut
                is the work. Local crews, local relationships, local
                accountability.
              </p>
            </div>
            <div className="value">
              <div className="num">04</div>
              <h3>Equity in where we install</h3>
              <p>
                More than half our installs are in distressed municipalities. We
                measure it, publish it, and act on it.
              </p>
            </div>
            <div className="value">
              <div className="num">05</div>
              <h3>The phone gets answered</h3>
              <p>
                Mon–Fri 8am to 6pm ET. Spanish-fluent intake on staff. If we miss
                you, you hear back same day.
              </p>
            </div>
            <div className="value">
              <div className="num">06</div>
              <h3>No extractive contracts</h3>
              <p>
                No clawbacks, no balloon payments, no penalty for leaving. If you
                ever want it gone, we remove it at our cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="section-label">Story so far</p>
          <h2 className="section-title">From paperwork to 400+ batteries.</h2>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-when">Spring 2024</div>
              <div className="tl-title">Founded in Hartford</div>
              <div className="tl-desc">
                Devin and Aisha leave Eversource and a residential-solar EPC
                respectively, and incorporate to participate in the newly-funded
                CT Energy Storage Solutions program.
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-when">Aug 2024</div>
              <div className="tl-title">First install · Bloomfield</div>
              <div className="tl-desc">
                A retired bus driver becomes our first customer. Battery rides
                through a 4-hour outage three weeks later. Photo on the wall.
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-when">Q1 2025</div>
              <div className="tl-title">100 installs · seven W-2 electricians</div>
              <div className="tl-desc">
                We pass the 100-install mark and bring the install crew fully
                in-house. No more rotating subcontractors.
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-when">Summer 2025</div>
              <div className="tl-title">Distressed-municipality majority</div>
              <div className="tl-desc">
                Partnerships with three Hartford and New Haven housing nonprofits
                push our distressed-municipality install share past 50% — and
                it&apos;s stayed there.
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-when">2026, today</div>
              <div className="tl-title">412 households · 38 towns</div>
              <div className="tl-desc">
                Our fleet has covered 2,840 hours of outages and dispatched into
                more than 90 grid events for the program. We hire two more
                electricians next month.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ borderBottom: 0 }}>
        <div className="wrap">
          <p className="section-label">Next step</p>
          <h2 className="section-title">
            Two minutes to see if your home qualifies.
          </h2>
          <p className="lead" style={{ marginBottom: 0 }}>
            Eligibility check is free, no credit pull, and you&apos;ll know in
            under two minutes whether the program covers your address.
          </p>
          <div className="cta-row">
            <a className="btn-primary" href="/ct#hero-form">
              Check your address
              <ArrowIcon />
            </a>
            <a className="btn-ghost" href="mailto:hello@ctbatterysolutions.com">
              Talk to us
            </a>
          </div>
        </div>
      </section>

      <footer className="site">
        <div className="wrap row">
          <div className="col">© 2026 CT Battery Solutions, Inc.</div>
          <div className="col links">
            <a href="/ct/about">About</a>
            <a href="/ct/contact">Contact</a>
            <a href="/ct/privacy">Privacy</a>
            <a href="/ct/terms">Terms</a>
          </div>
          <div className="col">
            <a href="mailto:hello@ctbatterysolutions.com">hello@ctbatterysolutions.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
