import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply — CT Battery Solutions",
  description:
    "Two-minute eligibility check, then walk through enrollment, property details, scheduling, and signing the Energy Storage Agreement.",
};

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
