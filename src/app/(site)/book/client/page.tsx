import type { Metadata } from "next";
import { ClientStep } from "@/components/booking/ClientStep";

export const metadata: Metadata = {
  title: "Client — Book — Whyte Films",
};

export default function BookClientPage() {
  return <ClientStep />;
}
