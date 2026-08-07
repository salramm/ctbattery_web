"use client";

import { useState, useRef } from "react";
import AddressAutocomplete, { type PickedAddress } from "@/components/AddressAutocomplete";

/**
 * The landing's primary conversion widget: a key-less address field with
 * typeahead suggestions. On submit it hands off to /get-started (carrying the
 * address + coords if a suggestion was picked), which runs the eligibility
 * evaluation. Mounted into the static landing markup via a portal.
 */
export default function HeroAddressSearch() {
  const [address, setAddress] = useState("");
  const pickedRef = useRef<PickedAddress | null>(null);

  function go(e: React.FormEvent) {
    e.preventDefault();
    const v = address.trim();
    if (!v) return;
    const params = new URLSearchParams({ address: v });
    const p = pickedRef.current;
    if (p && p.address === v) {
      params.set("lat", String(p.lat));
      params.set("lng", String(p.lng));
    }
    window.location.href = `/get-started/?${params.toString()}`;
  }

  return (
    <div style={card}>
      <p style={{ margin: "0 0 16px", fontSize: 16, lineHeight: 1.6, color: "#3a3a37" }}>
        Start with your address — we serve Connecticut only right now, so we check eligibility
        first. About a minute, no obligation.
      </p>
      <form onSubmit={go} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <AddressAutocomplete
          value={address}
          onChange={setAddress}
          onPick={(p) => (pickedRef.current = p)}
          placeholder="100 Main St, Hartford, CT 06103"
          ariaLabel="Service address"
          inputStyle={inp}
        />
        <button type="submit" disabled={!address.trim()} style={{ ...btn, opacity: address.trim() ? 1 : 0.55 }}>
          See if I qualify &rarr;
        </button>
      </form>
    </div>
  );
}

const card: React.CSSProperties = {
  background: "#fafaf8",
  border: "1px solid #d8d6ce",
  borderRadius: 12,
  padding: "clamp(24px,3vw,32px)",
};
const inp: React.CSSProperties = {
  fontFamily: "'DM Sans',sans-serif",
  fontSize: 16,
  color: "#1a1a1a",
  background: "#fff",
  border: "1px solid #d8d6ce",
  borderRadius: 6,
  padding: "13px 14px",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};
const btn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  background: "#2f5d4e",
  color: "#fff",
  fontSize: 16.5,
  fontWeight: 500,
  padding: "15px 26px",
  border: "none",
  borderRadius: 5,
  cursor: "pointer",
};
