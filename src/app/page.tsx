import type { Metadata } from "next";
import PreApprovalLanding from "./PreApprovalLanding";

export const metadata: Metadata = {
  title: "CT Battery Solutions — Residential battery storage with no upfront cost",
  description:
    "We're developing a third-party ownership model to offer qualifying Connecticut households battery backup with no upfront cost, supported in part by Connecticut's Energy Storage Solutions program. Join the list and we'll contact you if and when we're approved and begin enrolling in your area.",
};

export default function Page() {
  return <PreApprovalLanding />;
}
