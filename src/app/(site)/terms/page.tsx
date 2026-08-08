import type { Metadata } from "next";
import { Terms } from "@/components/Terms";

export const metadata: Metadata = {
  title: "Terms & Conditions — Whyte Films",
  description:
    "Terms & Conditions and general terms of sale for Whyte Films packages and bookings.",
};

export default function TermsPage() {
  return <Terms />;
}
