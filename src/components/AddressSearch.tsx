"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";

interface AddressSearchProps {
  onResult: (data: any) => void;
  onError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps: (() => void) | undefined;
  }
}

export default function AddressSearch({
  onResult,
  onError,
  isLoading,
  setIsLoading,
}: AddressSearchProps) {
  const [address, setAddress] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.google?.maps?.places) {
      setMapsLoaded(true);
      return;
    }

    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      const check = setInterval(() => {
        if (window.google?.maps?.places) {
          setMapsLoaded(true);
          clearInterval(check);
        }
      }, 100);
      return () => clearInterval(check);
    }

    window.initGoogleMaps = () => setMapsLoaded(true);

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      window.initGoogleMaps = undefined;
    };
  }, []);

  useEffect(() => {
    if (!mapsLoaded || !inputRef.current || autocompleteRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
        componentRestrictions: { country: "us" },
        fields: ["formatted_address", "geometry"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place?.formatted_address) {
        setAddress(place.formatted_address);
        const loc = place.geometry?.location;
        doLookup(
          place.formatted_address,
          loc ? loc.lat() : undefined,
          loc ? loc.lng() : undefined
        );
      }
    });

    autocompleteRef.current = autocomplete;
  }, [mapsLoaded]);

  // Geocode a typed address (manual submit path, where we have no geometry yet).
  const geocode = useCallback(
    (searchAddress: string): Promise<{ lat: number; lng: number; formatted: string }> =>
      new Promise((resolve, reject) => {
        if (!window.google?.maps) {
          reject(new Error("Address lookup is still loading — try again in a moment."));
          return;
        }
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { address: searchAddress, componentRestrictions: { country: "us" } },
          (results: any, status: string) => {
            if (status === "OK" && results?.[0]?.geometry?.location) {
              const l = results[0].geometry.location;
              resolve({ lat: l.lat(), lng: l.lng(), formatted: results[0].formatted_address });
            } else {
              reject(new Error("We couldn't locate that address. Try a full street address."));
            }
          }
        );
      }),
    []
  );

  const doLookup = useCallback(
    async (searchAddress: string, lat?: number, lng?: number) => {
      if (!searchAddress.trim()) return;
      setIsLoading(true);
      onError("");

      try {
        let coords = { lat, lng, address: searchAddress.trim() };
        if (coords.lat == null || coords.lng == null) {
          const g = await geocode(searchAddress.trim());
          coords = { lat: g.lat, lng: g.lng, address: g.formatted };
        }
        const data = await apiFetch("/api/lookup", {
          method: "POST",
          body: JSON.stringify(coords),
        });
        onResult(data);
      } catch (err) {
        onError(err instanceof Error ? err.message : "Lookup failed");
      } finally {
        setIsLoading(false);
      }
    },
    [onResult, onError, setIsLoading, geocode]
  );

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    doLookup(address);
  }

  return (
    <form onSubmit={handleSearch}>
      <label className="gs-label" htmlFor="address">
        Facility Address
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          ref={inputRef}
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g. 42 Industrial Blvd, Mount Vernon, NY 10550"
          className="gs-input flex-1"
          disabled={isLoading}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={isLoading || !address.trim()}
          className="gs-btn gs-btn-primary shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing...
            </span>
          ) : (
            "Run Analysis →"
          )}
        </button>
      </div>
    </form>
  );
}
