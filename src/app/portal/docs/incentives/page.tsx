import type { Metadata } from "next";
import "./ice.css";
import IceClient from "./IceClient";

export const metadata: Metadata = {
  title: "ICE v3 — Incentives Classification Engine",
  robots: { index: false, follow: false },
};

export default function IncentivesPage() {
  return <IceClient />;
}
