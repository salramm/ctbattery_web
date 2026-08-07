import type { Metadata } from "next";
import "./roles.css";
import RolesClient from "./RolesClient";

export const metadata: Metadata = {
  title: "Roles & Assignments — CT Battery Solutions Portal",
  robots: { index: false, follow: false },
};

export default function RolesPage() {
  return <RolesClient />;
}
