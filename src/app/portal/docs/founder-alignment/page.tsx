import type { Metadata } from "next";
import "./fa.css";
import FounderAlignmentClient from "./FounderAlignmentClient";

export const metadata: Metadata = {
  title: "Founder Alignment — CT Battery Solutions Portal",
  robots: { index: false, follow: false },
};

export default function FounderAlignmentPage() {
  return <FounderAlignmentClient />;
}
