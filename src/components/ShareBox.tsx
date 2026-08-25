"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

/**
 * Self-contained share control — no third-party services. Uses the native share
 * sheet when available (phones), plus SMS, email, a copy-link button, and a QR
 * code generated locally (qrcode lib, rendered to a data URL) so someone can
 * scan the page from another phone.
 */
export default function ShareBox({
  url,
  title = "CT Battery Solutions",
  text = "Home battery backup for qualifying Connecticut homes — check your address:",
}: {
  url: string;
  title?: string;
  text?: string;
}) {
  const [canNative, setCanNative] = useState(false);
  const [qr, setQr] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCanNative(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const shareText = `${text} ${url}`;
  const smsHref = `sms:?&body=${encodeURIComponent(shareText)}`;
  const mailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText)}`;

  async function nativeShare() {
    try {
      await navigator.share({ title, text, url });
    } catch {
      /* user cancelled */
    }
  }

  async function toggleQr() {
    if (!qr) {
      try {
        const data = await QRCode.toDataURL(url, { width: 240, margin: 1, color: { dark: "#1a1a1a", light: "#ffffff" } });
        setQr(data);
      } catch {
        /* ignore */
      }
    }
    setShowQr((s) => !s);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div style={box}>
      <div style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", color: MUTED, marginBottom: 10 }}>
        Share this page
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {canNative && (
          <button type="button" onClick={nativeShare} style={{ ...btn, ...btnPrimary }}>
            <ShareIcon /> Share
          </button>
        )}
        <a href={smsHref} style={btn}>
          <MsgIcon /> Text
        </a>
        <a href={mailHref} style={btn}>
          <MailIcon /> Email
        </a>
        <button type="button" onClick={toggleQr} style={{ ...btn, ...(showQr ? btnOn : null) }}>
          <QrIcon /> QR code
        </button>
        <button type="button" onClick={copy} style={btn}>
          <LinkIcon /> {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
      {showQr && qr && (
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="QR code linking to this page" width={180} height={180} style={{ borderRadius: 8, border: `1px solid ${BORDER}` }} />
          <span style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>Scan to open on another phone</span>
        </div>
      )}
    </div>
  );
}

const BRAND = "#2f5d4e";
const BORDER = "#d8d6ce";
const MUTED = "#6b6b66";
const INK2 = "#3a3a37";
const MONO = "'JetBrains Mono',ui-monospace,monospace";

const box: React.CSSProperties = { marginTop: 20, padding: "16px 18px", background: "#f2f1ec", border: `1px solid ${BORDER}`, borderRadius: 12 };
const btn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  background: "#fff",
  color: INK2,
  border: `1px solid ${BORDER}`,
  borderRadius: 8,
  padding: "9px 13px",
  fontSize: 14,
  fontWeight: 500,
  fontFamily: "'DM Sans',system-ui,sans-serif",
  cursor: "pointer",
  textDecoration: "none",
};
const btnPrimary: React.CSSProperties = { background: BRAND, color: "#fff", border: `1px solid ${BRAND}` };
const btnOn: React.CSSProperties = { background: "#e6eeea", borderColor: BRAND, color: "#234a3e" };

const IC = { width: 16, height: 16, fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const ShareIcon = () => (<svg viewBox="0 0 24 24" {...IC}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5" /></svg>);
const MsgIcon = () => (<svg viewBox="0 0 24 24" {...IC}><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4L3 21l1.3-4.4A8.4 8.4 0 1 1 21 11.5Z" /></svg>);
const MailIcon = () => (<svg viewBox="0 0 24 24" {...IC}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>);
const QrIcon = () => (<svg viewBox="0 0 24 24" {...IC}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3M21 14v7M14 21h3" /></svg>);
const LinkIcon = () => (<svg viewBox="0 0 24 24" {...IC}><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" /><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" /></svg>);
