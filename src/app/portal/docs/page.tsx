"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Direct visits to /portal/docs land on the first tab.
export default function DocsIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/portal/docs/nonprofits");
  }, [router]);
  return null;
}
