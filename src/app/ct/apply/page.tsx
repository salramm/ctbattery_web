"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import "./apply.css";
import Workflow from "./Workflow";

function Inner() {
  const sp = useSearchParams();
  const address = sp.get("address") ?? "";
  return <Workflow initialAddress={address} />;
}

export default function ApplyPage() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
