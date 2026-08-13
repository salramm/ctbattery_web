import type { Metadata } from "next";
import EssContractorsClient from "./EssContractorsClient";

export const metadata: Metadata = {
  title: "ESS contractors — CT Battery Solutions Portal",
  robots: { index: false, follow: false },
};

export default function EssContractorsPage() {
  return <EssContractorsClient />;
}
