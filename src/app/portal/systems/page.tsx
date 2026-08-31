import type { Metadata } from "next";
import SystemClient from "./SystemClient";

export const metadata: Metadata = {
  title: "System — CT Battery Solutions Portal",
  robots: { index: false, follow: false },
};

export default function SystemPage() {
  return <SystemClient />;
}
