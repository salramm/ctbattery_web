"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession } from "@/lib/auth";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onClick() {
    if (loading) return;
    setLoading(true);
    await clearSession();
    router.push("/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={onClick} disabled={loading}>
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
