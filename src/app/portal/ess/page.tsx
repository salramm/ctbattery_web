import type { Metadata } from "next";
import EssClient from "./EssClient";

export const metadata: Metadata = {
  title: "ESS qualification — CT Battery Solutions Portal",
  robots: { index: false, follow: false },
};

export default function EssPage() {
  return <EssClient />;
}
