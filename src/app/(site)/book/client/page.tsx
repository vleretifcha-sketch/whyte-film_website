import type { Metadata } from "next";
import { Suspense } from "react";
import { ClientStep } from "@/components/booking/ClientStep";

export const metadata: Metadata = {
  title: "Client — Book — Whyte Films",
};

export default function BookClientPage() {
  return (
    <Suspense
      fallback={
        <section className="bg-[#010101] px-[var(--pad)] pb-28 pt-28">
          <p className="text-white/60">Loading booking…</p>
        </section>
      }
    >
      <ClientStep />
    </Suspense>
  );
}
