import type { Metadata } from "next";
import ApplicationsClient from "./ApplicationsClient";

export const metadata: Metadata = {
  title: "Applications — CT Battery Solutions Portal",
};

export default function ApplicationsPage() {
  return <ApplicationsClient />;
}
