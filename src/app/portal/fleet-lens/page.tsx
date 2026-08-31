import type { Metadata } from "next";
import FleetLensClient from "./FleetLensClient";

export const metadata: Metadata = {
  title: "Fleet — CT Battery Solutions Portal",
  robots: { index: false, follow: false },
};

export default function FleetLensPage() {
  return <FleetLensClient />;
}
