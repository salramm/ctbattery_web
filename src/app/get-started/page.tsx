import type { Metadata } from "next";
import GetStartedWizard from "./GetStartedWizard";

export const metadata: Metadata = {
  title: "Get started — CT Battery Solutions",
  description:
    "Check if your Connecticut address qualifies, join the list, and sign a (non-binding) Letter of Intent.",
};

export default function GetStartedPage() {
  return <GetStartedWizard />;
}
