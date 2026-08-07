"use client";

import { useState, useRef, useEffect } from "react";

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

/**
 * The landing's primary conversion widget: an address field with Google Places
 * autocomplete. On submit it hands off to /get-started (carrying the address +
 * coords), which runs the eligibility evaluation. Mounted into the static
 * landing markup via a portal (see PreApprovalLanding).
 */
export default function HeroAddressSearch() {
  const [address, setAddress] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const acRef = useRef<unknown>(null);
  const pickedRef = useRef<{ lat: number; lng: number; address: string } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!MAPS_KEY || typeof window === "undefined") return;
    if (window.google?.maps?.places) {
      setLoaded(true);
      return;
    }
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      const t = setInterval(() => {
        if (window.google?.maps?.places) {
          setLoaded(true);
          clearInterval(t);
        }
      }, 120);
      return () => clearInterval(t);
    }
    window.initCtbsMaps = () => setLoaded(true);
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places&callback=initCtbsMaps`;
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
    return () => {
      window.initCtbsMaps = undefined;
    };
  }, []);

  useEffect(() => {
    if (!loaded || !inputRef.current || acRef.current) return;
    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "us" },
      fields: ["formatted_address", "geometry"],
    });
    ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      if (!place?.formatted_address) return;
      setAddress(place.formatted_address);
      const loc = place.geometry?.location;
      pickedRef.current = loc
        ? { lat: loc.lat(), lng: loc.lng(), address: place.formatted_address }
        : null;
    });
    acRef.current = ac;
  }, [loaded]);

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
      <style>{`.pac-container{z-index:10050;border-radius:8px;border:1px solid #d8d6ce;box-shadow:0 12px 32px rgba(26,26,24,.16);font-family:'DM Sans',sans-serif;margin-top:4px}.pac-item{padding:8px 12px;font-size:14px;cursor:pointer}`}</style>
      <p style={{ margin: "0 0 16px", fontSize: 16, lineHeight: 1.6, color: "#3a3a37" }}>
        Start with your address — we serve Connecticut only right now, so we check eligibility
        first. About a minute, no obligation.
      </p>
      <form onSubmit={go} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          ref={inputRef}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="100 Main St, Hartford, CT 06103"
          autoComplete="off"
          aria-label="Service address"
          style={inp}
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
