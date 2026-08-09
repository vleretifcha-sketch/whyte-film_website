import type { Metadata } from "next";
import { Wedding } from "@/components/Wedding";

export const metadata: Metadata = {
  title: "Wedding — Whyte Films",
  description:
    "Wedding photo and film by Whyte Films — cinematic storytelling for your day.",
};

export default function WeddingPage() {
  return <Wedding />;
}
