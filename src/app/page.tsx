import type { Metadata } from "next";
import PreApprovalLanding from "./PreApprovalLanding";

export const metadata: Metadata = {
  title: "CT Battery Solutions — Residential battery storage at no cost",
  description:
    "Connecticut's Energy Storage Solutions program covers home battery storage through approved providers. Join the list and we'll email you when enrollment opens where you live.",
};

export default function Page() {
  return <PreApprovalLanding />;
}
