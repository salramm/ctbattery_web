import type { Metadata } from "next";
import TodayClient from "./TodayClient";

export const metadata: Metadata = {
  title: "Today — CT Battery Solutions Portal",
  robots: { index: false, follow: false },
};

export default function TodayPage() {
  return <TodayClient />;
}
