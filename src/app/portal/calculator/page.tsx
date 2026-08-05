import type { Metadata } from "next";
import "./calc.css";
import Calculator from "./Calculator";

export const metadata: Metadata = {
  title: "Project Calculator v9 — CT Battery Solutions Portal",
  robots: { index: false, follow: false },
};

export default function CalculatorPage() {
  return <Calculator />;
}
