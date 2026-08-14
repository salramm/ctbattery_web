#!/usr/bin/env bash
# Build the Eversource Grid Edge vector-tile archive (public/tiles/grid_edge.pmtiles)
# from the two large source GeoJSONs. The raw GeoJSON is gitignored (700 MB+); only
# the built .pmtiles is committed and shipped in the web image (served static by
# nginx with byte-range requests, read client-side via the pmtiles protocol).
#
# Two named layers: "streets" (MV hosting-capacity zones) and "parcels"
# (parcel-level). Both carry val_load + val_gen_{spring,summer,autumn,winter};
# parcels also carry parcel_id + size. Capacity is in kW.
#
# Requires: tippecanoe (brew install tippecanoe). Re-run when source data changes.
set -euo pipefail
export PATH="/opt/homebrew/bin:$PATH"

here="$(cd "$(dirname "$0")/.." && pwd)"; cd "$here"
SRC="../backend/data/ess/Eversource_grid_map_data"
OUT="public/tiles/grid_edge.pmtiles"

# Max zoom 13 keeps the committed archive < ~95 MB (GitHub's per-file cap); the
# GL renderer overzooms z13 tiles when the user zooms past it, so parcel fills
# stay per-parcel across suburban/rural CT and coalesce only in dense cores.
tippecanoe -o "$OUT" --force \
  -Z9 -z13 -d11 \
  --drop-densest-as-needed --coalesce-densest-as-needed --drop-smallest-as-needed \
  --extend-zooms-if-still-dropping \
  --no-tile-stats --name "Eversource Grid Edge" \
  -L "streets:$SRC/grid_edge_streets.geojson" \
  -L "parcels:$SRC/grid_edge_parcels.geojson"

ls -lh "$OUT"
