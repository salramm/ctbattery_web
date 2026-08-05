"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/ct");
  }, [router]);
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAFAF8",
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        color: "#1A1A1A",
      }}
    >
      <a
        href="/ct"
        style={{ color: "#234A3E", textDecoration: "underline" }}
      >
        Continue to CT Battery Solutions →
      </a>
    </main>
  );
}
