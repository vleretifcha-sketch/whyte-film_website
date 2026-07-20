import type { Metadata } from "next";
import { Packages } from "@/components/Packages";

export const metadata: Metadata = {
  title: "Packages — Whyte Films",
  description:
    "Book a photography, video or content package with Whyte Films.",
};

export default function PackagesPage() {
  return <Packages />;
}
