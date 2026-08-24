import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — CT Battery Solutions",
  description:
    "What information CT Battery Solutions collects through this site, how we use it, and your choices.",
};

const FONTS =
  "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500&display=swap";

const SANS =
  "'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
const SERIF = "'DM Serif Display',Georgia,serif";
const MONO = "'JetBrains Mono',ui-monospace,Menlo,monospace";

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={FONTS} />
      <div
        style={{
          background: "#fafaf8",
          color: "#1a1a1a",
          fontFamily: SANS,
          fontSize: 17,
          lineHeight: 1.55,
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <header style={{ background: "#fafaf8", borderBottom: "1px solid #e5e3dc", padding: "20px 0" }}>
          <div
            style={{
              maxWidth: 1120,
              margin: "0 auto",
              padding: "0 clamp(20px,5vw,56px)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <a href="/" aria-label="CT Battery Solutions" style={{ display: "inline-flex", alignItems: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-3.png" alt="CT Battery Solutions" style={{ height: "clamp(29px,4.8vw,50px)", width: "auto", display: "block" }} />
            </a>
            <a href="/" style={{ fontFamily: MONO, fontSize: 12, color: "#6b6b66", textDecoration: "none" }}>
              &larr; Back to home
            </a>
          </div>
        </header>

        {/* Body */}
        <section style={{ padding: "clamp(40px,6vw,72px) 0 clamp(56px,8vw,96px)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 clamp(20px,5vw,56px)" }}>
            <p
              style={{
                margin: "0 0 16px",
                fontFamily: MONO,
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: ".13em",
                textTransform: "uppercase",
                color: "#6b6b66",
              }}
            >
              Privacy Policy
            </p>
            <h1
              style={{
                margin: "0 0 20px",
                fontFamily: SERIF,
                fontWeight: 400,
                fontSize: "clamp(30px,5vw,52px)",
                lineHeight: 1.08,
                letterSpacing: "-.02em",
              }}
            >
              How we handle your information.
            </h1>
            <p style={{ margin: "0 0 32px", fontFamily: MONO, fontSize: 12, color: "#6b6b66" }}>
              Effective August 2026
            </p>

            <p style={{ margin: "0 0 20px", fontSize: 17, lineHeight: 1.7, color: "#3a3a37" }}>
              Information you submit through this site may include your name, email address, city or
              ZIP code, telephone number, housing type, and other information you choose to provide.
            </p>
            <p style={{ margin: "0 0 20px", fontSize: 17, lineHeight: 1.7, color: "#3a3a37" }}>
              We use this information to respond to your inquiry, contact you about CT Battery
              Solutions&rsquo; proposed battery offering, and understand where interest is located.
              We do not sell your personal information.
            </p>
            <p style={{ margin: "0 0 20px", fontSize: 17, lineHeight: 1.7, color: "#3a3a37" }}>
              You may contact us to request correction or deletion of your information, subject to
              applicable legal, contractual, and recordkeeping requirements.
            </p>

            <div
              style={{
                borderLeft: "3px solid #2f5d4e",
                background: "#f2f1ec",
                borderRadius: "0 8px 8px 0",
                padding: "14px 17px",
                marginTop: 28,
                fontSize: 15,
                lineHeight: 1.6,
                color: "#3a3a37",
              }}
            >
              Questions or requests:{" "}
              <a href="mailto:info@ctbatterysolutions.com" style={{ color: "#234a3e" }}>
                info@ctbatterysolutions.com
              </a>
              . See also our Legal &amp; Program Disclosures on the{" "}
              <a href="/" style={{ color: "#234a3e" }}>
                home page
              </a>
              .
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: "clamp(32px,4vw,48px) 0", borderTop: "1px solid #e5e3dc" }}>
          <div
            style={{
              maxWidth: 1120,
              margin: "0 auto",
              padding: "0 clamp(20px,5vw,56px)",
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
              flexWrap: "wrap",
              fontFamily: MONO,
              fontSize: 12,
              color: "#6b6b66",
            }}
          >
            <span>&copy; 2026 CT Battery Solutions, Inc.</span>
            <a href="/" style={{ color: "#2f5d4e", textDecoration: "none" }}>
              ctbatterysolutions.com
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
