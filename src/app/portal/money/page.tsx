import type { Metadata } from "next";
import MoneyClient from "./MoneyClient";

export const metadata: Metadata = {
  title: "Money — CT Battery Solutions Portal",
  robots: { index: false, follow: false },
};

export default function MoneyPage() {
  return <MoneyClient />;
}
