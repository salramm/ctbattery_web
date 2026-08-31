"use client";

/**
 * Top-level route aliases for the D6 route map.
 *
 * 05-UI-DELTA D6 reads the mock's hashes as real routes: #today→/today,
 * #pipeline-deals→/pipeline?tab=deals, #system-op→/systems/[id]?lens=op. The
 * screens themselves live under /portal (that is where the authenticated shell
 * and sidebar are), so these thin pages forward to them, carrying the query
 * string through untouched — which is what makes the deep links work.
 *
 * `replace` rather than `push`, so an alias never becomes a back-button trap
 * between the link and its destination.
 */

import { useEffect } from "react";

export default function RouteAlias({ to }: { to: string }) {
  useEffect(() => {
    const search = window.location.search;
    window.location.replace(`${to}${search}`);
  }, [to]);

  return (
    <div style={{ padding: 40, fontFamily: "system-ui, sans-serif", color: "#8C887C", fontSize: 13 }}>
      Opening {to}…
    </div>
  );
}
