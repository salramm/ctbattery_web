import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in — CT Battery Solutions",
  description: "CT Battery Solutions management portal sign in.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
