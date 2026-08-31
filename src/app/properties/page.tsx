import type { Metadata } from "next";
import RouteAlias from "../RouteAlias";

export const metadata: Metadata = { title: "CT Battery Solutions", robots: { index: false, follow: false } };

/** D6 alias — /properties?… → /portal/properties?… with the query preserved. */
export default function Page() {
  return <RouteAlias to="/portal/properties" />;
}
