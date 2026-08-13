import type { Metadata } from "next";
import ContractorProfileClient from "./ContractorProfileClient";

export const metadata: Metadata = {
  title: "Contractor profile — CT Battery Solutions Portal",
  robots: { index: false, follow: false },
};

export default function ContractorProfilePage() {
  return <ContractorProfileClient />;
}
