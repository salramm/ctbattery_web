import type { Metadata } from "next";
import LeadsClient from "./LeadsClient";

export const metadata: Metadata = {
  title: "Waitlist Leads — CT Battery Solutions Portal",
};

export default function LeadsPage() {
  return <LeadsClient />;
}
