import type { Metadata } from "next";
import FleetClient from "./FleetClient";

export const metadata: Metadata = {
  title: "Fleet monitoring — CT Battery Solutions Portal",
  robots: { index: false, follow: false },
};

export default function FleetPage() {
  return <FleetClient />;
}
