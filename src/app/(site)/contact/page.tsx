import type { Metadata } from "next";
import { Cta } from "@/components/Cta";

export const metadata: Metadata = {
  title: "Contact — Whyte Films",
};

export default function ContactPage() {
  return <Cta />;
}
