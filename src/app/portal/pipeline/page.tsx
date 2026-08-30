import type { Metadata } from "next";
import PipelineClient from "./PipelineClient";

export const metadata: Metadata = {
  title: "Pipeline — CT Battery Solutions Portal",
  robots: { index: false, follow: false },
};

export default function PipelinePage() {
  return <PipelineClient />;
}
