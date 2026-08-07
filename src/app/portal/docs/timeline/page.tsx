import type { Metadata } from "next";
import "./tl.css";
import TimelineClient from "./TimelineClient";

export const metadata: Metadata = {
  title: "Formation & Development Timeline — CT Battery Solutions Portal",
  robots: { index: false, follow: false },
};

export default function TimelinePage() {
  return <TimelineClient />;
}
