import type { Metadata } from "next";
import LoiClient from "./LoiClient";

export const metadata: Metadata = {
  title: "Letters of Intent — CT Battery Solutions Portal",
};

export default function LoiPage() {
  return <LoiClient />;
}
