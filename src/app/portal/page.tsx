import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Operations dashboard — CT Battery Solutions Portal",
  robots: { index: false, follow: false },
};

export default function PortalOverviewPage() {
  return <DashboardClient />;
}
