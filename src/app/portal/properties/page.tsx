import type { Metadata } from "next";
import PropertyClient from "./PropertyClient";

export const metadata: Metadata = {
  title: "Property — CT Battery Solutions Portal",
  robots: { index: false, follow: false },
};

export default function PropertyPage() {
  return <PropertyClient />;
}
