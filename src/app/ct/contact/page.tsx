import type { Metadata } from "next";
import "./contact.css";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact — CT Battery Solutions",
  description:
    "Reach a real person at CT Battery Solutions. Phone, email, and office in Hartford.",
};

const PhoneIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
);

const MailIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const ChatIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
  </svg>
);

export default function ContactPage() {
  return (
    <div className="ctc">
      <header className="site">
        <div className="wrap row">
          <a className="brand" href="/ct">
            <span className="mark" aria-hidden="true" />
            <span className="name">
              CT Battery Solutions
            </span>
          </a>
          <nav className="site-nav" aria-label="Primary">
            <a href="/ct">Homeowners</a>
            <a href="/ct/partners">Partners</a>
            <a href="/ct/about">About</a>
            <a href="/ct/contact" className="cur">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <section>
        <div className="wrap">
          <p className="eyebrow">Contact</p>
          <h1 className="page-h1">
            A real person, <em>same day</em>.
          </h1>
          <p className="lead">
            Mon–Fri, 8am–6pm ET. Spanish-fluent intake. If we miss you, you hear
            back same business day. For service issues with an installed system,
            text the support line for fastest response.
          </p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="channels">
            <div className="channel">
              <div className="ico">
                <PhoneIcon />
              </div>
              <div className="k">Phone</div>
              <div className="v">
                <a href="tel:+18605550140">(860) 555 0140</a>
              </div>
              <div className="sub">
                Mon–Fri, 8am – 6pm ET. Voicemail returned same day.
              </div>
            </div>
            <div className="channel">
              <div className="ico">
                <MailIcon />
              </div>
              <div className="k">Email</div>
              <div className="v">
                <a href="mailto:hello@ctbatterysolutions.com">
                  hello@ctbatterysolutions.com
                </a>
              </div>
              <div className="sub">
                Replies within one business day. For media:{" "}
                <a href="mailto:press@ctbatterysolutions.com">
                  press@ctbatterysolutions.com
                </a>
                .
              </div>
            </div>
            <div className="channel">
              <div className="ico">
                <ChatIcon />
              </div>
              <div className="k">Customer support · text</div>
              <div className="v">
                Text SUPPORT to{" "}
                <a href="sms:+18605550140">(860) 555 0140</a>
              </div>
              <div className="sub">
                For installed customers with an issue. Tracked, ticketed, and
                on-call after hours for outages.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="form-grid">
            <div>
              <p className="section-label">Or send a note</p>
              <h2 className="section-title">Tell us what you need.</h2>
              <ContactForm />
            </div>
            <aside>
              <div className="info-card">
                <h3>Response times</h3>
                <div className="row-i">
                  <span className="k">Phone</span>
                  <span className="v">Live during hours</span>
                </div>
                <div className="row-i">
                  <span className="k">Email</span>
                  <span className="v">Within 1 business day</span>
                </div>
                <div className="row-i">
                  <span className="k">Support text</span>
                  <span className="v">Within 2 hours</span>
                </div>
                <div className="row-i">
                  <span className="k">After-hours outage</span>
                  <span className="v">On-call rotation</span>
                </div>
                <div className="row-i">
                  <span className="k">Press</span>
                  <span className="v">Within 4 hours</span>
                </div>
              </div>
              <div className="info-card" style={{ marginTop: 16 }}>
                <h3>Already a customer?</h3>
                <p
                  style={{
                    margin: 0,
                    color: "var(--ink-2)",
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  Text SUPPORT to{" "}
                  <strong
                    style={{ color: "var(--ink)", fontFamily: "var(--mono)" }}
                  >
                    (860) 555 0140
                  </strong>{" "}
                  for the fastest response. Or sign in to your{" "}
                  <a href="/ct">member portal</a> to view dispatch activity,
                  schedule maintenance, or open a ticket.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section style={{ borderBottom: 0 }}>
        <div className="wrap">
          <p className="section-label">Where we are</p>
          <h2 className="section-title">Hartford office.</h2>
          <div className="office-grid">
            <div className="map" aria-hidden="true">
              <span className="pin">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12Z"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </svg>
              </span>
              <span className="map-label">42 Pratt Street · Hartford</span>
            </div>
            <div className="office-text">
              <h3>42 Pratt Street, Suite 300</h3>
              <address>
                Hartford, CT 06103
                <br />
                Mon–Fri, 9am – 5pm ET
              </address>
              <p>
                Drop-in welcome, but please call ahead — most of the team is in
                the field on any given day. Free 90-minute parking on Pratt and
                Asylum; metered street parking on Trumbull.
              </p>
              <p
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 13,
                  color: "var(--ink-3)",
                }}
              >
                Mailing &amp; legal · CT Battery Solutions, Inc. · 42 Pratt
                St STE 300 · Hartford, CT 06103
              </p>
            </div>
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
