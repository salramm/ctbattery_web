"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { API_BASE } from "@/lib/api";

// ISO/RTO color palette
const ISO_COLORS: Record<string, string> = {
  NYISO: "#3b82f6",
  "ISO-NE": "#8b5cf6",
  ERCOT: "#f59e0b",
  PJM: "#10b981",
  MISO: "#ef4444",
  SPP: "#f97316",
  CAISO: "#06b6d4",
  WECC: "#ec4899",
  SERC: "#84cc16",
  default: "#94a3b8",
};

// BESS score color scale
function bessScoreColor(score: number | undefined): string {
  if (!score) return "#e2e8f0";
  if (score >= 90) return "#059669";
  if (score >= 80) return "#10b981";
  if (score >= 70) return "#3b82f6";
  if (score >= 50) return "#f59e0b";
  return "#94a3b8";
}

type LayerMode = "iso" | "bess" | "enriched";

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  markerPosition?: [number, number];
  markerLabel?: string;
  onTerritoryClick?: (properties: any) => void;
}

export default function MapView({
  center,
  zoom,
  markerPosition,
  markerLabel,
  onTerritoryClick,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geoLayerRef = useRef<L.GeoJSON | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [geojsonData, setGeojsonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [layerMode, setLayerMode] = useState<LayerMode>("iso");
  const [selectedTerritory, setSelectedTerritory] = useState<any>(null);

  // Fetch territory data
  useEffect(() => {
    fetch(`${API_BASE}/api/territories`)
      .then((r) => r.json())
      .then((data) => {
        setGeojsonData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: center || [39.5, -98.35],
      zoom: zoom || 5,
      zoomControl: false,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    // Clean dark tile layer
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }
    ).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Style function based on layer mode
  const getStyle = useCallback(
    (feature: any): L.PathOptions => {
      const props = feature?.properties || {};

      if (layerMode === "bess" && props.has_enrichment) {
        return {
          fillColor: bessScoreColor(props.bess_score),
          weight: 2,
          opacity: 1,
          color: "#fff",
          fillOpacity: 0.7,
        };
      }

      if (layerMode === "enriched") {
        return {
          fillColor: props.has_enrichment ? "#059669" : "#e2e8f0",
          weight: props.has_enrichment ? 2 : 0.5,
          opacity: 1,
          color: props.has_enrichment ? "#fff" : "#cbd5e1",
          fillOpacity: props.has_enrichment ? 0.6 : 0.15,
        };
      }

      // Default: ISO/RTO coloring
      const isoColor =
        ISO_COLORS[props.CNTRL_AREA] || ISO_COLORS.default;
      return {
        fillColor: isoColor,
        weight: 0.8,
        opacity: 1,
        color: "#fff",
        fillOpacity: 0.35,
      };
    },
    [layerMode]
  );

  // Render GeoJSON layer
  useEffect(() => {
    if (!mapRef.current || !geojsonData) return;

    // Remove old layer
    if (geoLayerRef.current) {
      mapRef.current.removeLayer(geoLayerRef.current);
    }

    const layer = L.geoJSON(geojsonData, {
      style: getStyle,
      onEachFeature: (feature, layer) => {
        const props = feature.properties || {};

        // Tooltip on hover
        const tooltipLines = [
          `<strong>${props.NAME || "Unknown"}</strong>`,
          `${props.STATE || ""} | ${props.CNTRL_AREA || "N/A"}`,
        ];
        if (props.has_enrichment) {
          tooltipLines.push(`BESS Score: <strong>${props.bess_score}/100</strong>`);
          if (props.dr_revenue_per_kw_year > 0)
            tooltipLines.push(`DR: $${props.dr_revenue_per_kw_year}/kW-yr`);
          if (props.incentive_rate_per_kwh > 0)
            tooltipLines.push(`Incentive: $${props.incentive_rate_per_kwh}/kWh`);
        }
        if (props.CUSTOMERS)
          tooltipLines.push(
            `${Number(props.CUSTOMERS).toLocaleString()} customers`
          );

        layer.bindTooltip(tooltipLines.join("<br>"), {
          sticky: true,
          className: "territory-tooltip",
        });

        // Click handler
        layer.on("click", () => {
          setSelectedTerritory(props);
          onTerritoryClick?.(props);
        });

        // Hover highlight
        layer.on("mouseover", (e: any) => {
          e.target.setStyle({ weight: 3, fillOpacity: 0.6 });
          e.target.bringToFront();
        });
        layer.on("mouseout", (e: any) => {
          geoLayerRef.current?.resetStyle(e.target);
        });
      },
    });

    layer.addTo(mapRef.current);
    geoLayerRef.current = layer;
  }, [geojsonData, getStyle, onTerritoryClick]);

  // Update center/zoom when props change
  useEffect(() => {
    if (!mapRef.current || !center) return;
    mapRef.current.flyTo(center, zoom || 12, { duration: 1.5 });
  }, [center, zoom]);

  // Update marker
  useEffect(() => {
    if (!mapRef.current) return;

    if (markerRef.current) {
      mapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }

    if (markerPosition) {
      const icon = L.divIcon({
        html: `<div style="background:#059669;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        className: "",
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker(markerPosition, { icon });
      if (markerLabel) {
        marker.bindPopup(
          `<div style="font-family:system-ui;font-size:13px;"><strong>${markerLabel}</strong></div>`
        );
        marker.openPopup();
      }
      marker.addTo(mapRef.current);
      markerRef.current = marker;
    }
  }, [markerPosition, markerLabel]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
      {/* Layer controls */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-1.5">
        <LayerButton
          active={layerMode === "iso"}
          onClick={() => setLayerMode("iso")}
          label="ISO/RTO Zones"
        />
        <LayerButton
          active={layerMode === "bess"}
          onClick={() => setLayerMode("bess")}
          label="BESS Score"
        />
        <LayerButton
          active={layerMode === "enriched"}
          onClick={() => setLayerMode("enriched")}
          label="CT Battery Solutions Coverage"
        />
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200 px-3 py-2 text-xs max-w-[200px]">
        {layerMode === "iso" && (
          <div>
            <p className="font-semibold text-gray-700 mb-1.5">ISO/RTO Regions</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              {Object.entries(ISO_COLORS)
                .filter(([k]) => k !== "default")
                .map(([name, color]) => (
                  <div key={name} className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-sm inline-block shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-gray-600">{name}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
        {layerMode === "bess" && (
          <div>
            <p className="font-semibold text-gray-700 mb-1.5">BESS Score</p>
            <div className="space-y-1">
              {[
                { label: "90-100", color: "#059669" },
                { label: "80-89", color: "#10b981" },
                { label: "70-79", color: "#3b82f6" },
                { label: "50-69", color: "#f59e0b" },
                { label: "No data", color: "#e2e8f0" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-sm inline-block"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {layerMode === "enriched" && (
          <div>
            <p className="font-semibold text-gray-700 mb-1.5">Coverage</p>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm inline-block bg-emerald-600" />
                <span className="text-gray-600">CT Battery Solutions analyzed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-sm inline-block"
                  style={{ backgroundColor: "#e2e8f0" }}
                />
                <span className="text-gray-600">Not yet covered</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected territory info panel */}
      {selectedTerritory && (
        <div className="absolute top-3 right-14 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg p-4 w-72">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm text-gray-900 truncate pr-2">
              {selectedTerritory.NAME}
            </h4>
            <button
              onClick={() => setSelectedTerritory(null)}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              x
            </button>
          </div>
          <div className="space-y-1.5 text-xs">
            <InfoRow label="State" value={selectedTerritory.STATE} />
            <InfoRow
              label="ISO/RTO"
              value={selectedTerritory.CNTRL_AREA || "N/A"}
            />
            <InfoRow
              label="Holding Co"
              value={selectedTerritory.HOLDING_CO || "N/A"}
            />
            {selectedTerritory.CUSTOMERS && (
              <InfoRow
                label="Customers"
                value={Number(selectedTerritory.CUSTOMERS).toLocaleString()}
              />
            )}
            {selectedTerritory.has_enrichment && (
              <>
                <div className="border-t border-gray-200 my-2" />
                <InfoRow
                  label="BESS Score"
                  value={`${selectedTerritory.bess_score}/100`}
                  highlight
                />
                <InfoRow
                  label="Revenue Driver"
                  value={formatDriver(selectedTerritory.primary_revenue_driver)}
                />
                {selectedTerritory.dr_revenue_per_kw_year > 0 && (
                  <InfoRow
                    label="DR Revenue"
                    value={`$${selectedTerritory.dr_revenue_per_kw_year}/kW-yr`}
                    highlight
                  />
                )}
                {selectedTerritory.incentive_rate_per_kwh > 0 && (
                  <InfoRow
                    label="Incentive"
                    value={`$${selectedTerritory.incentive_rate_per_kwh}/kWh`}
                    highlight
                  />
                )}
                <InfoRow
                  label="DR Program"
                  value={selectedTerritory.dr_program_name || "N/A"}
                />
                <InfoRow
                  label="C-PACE"
                  value={selectedTerritory.cpace_available ? "Available" : "No"}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-[1000] bg-white/80 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <svg
              className="animate-spin h-5 w-5 text-gs-emerald"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="text-sm text-gray-600">
              Loading 2,931 utility territories...
            </span>
          </div>
        </div>
      )}

      {/* Map container */}
      <div ref={mapContainerRef} className="w-full h-[65vh] md:h-[600px]" />
    </div>
  );
}

function LayerButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm ${
        active
          ? "bg-gs-emerald text-white shadow-md"
          : "bg-white/95 backdrop-blur-sm text-gray-700 hover:bg-gray-50 border border-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span
        className={`font-medium ${highlight ? "text-gs-emerald" : "text-gray-900"}`}
      >
        {value}
      </span>
    </div>
  );
}

function formatDriver(driver: string) {
  const map: Record<string, string> = {
    demand_charges: "Demand Charges",
    dr_revenue: "DR Revenue",
    "4cp": "4CP Transmission",
  };
  return map[driver] || driver || "N/A";
}
