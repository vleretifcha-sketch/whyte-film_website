import type { Metadata } from "next";
import { Suspense } from "react";
import { AddonsStep } from "@/components/booking/AddonsStep";

export const metadata: Metadata = {
  title: "Add-ons — Book — Whyte Films",
};

export default function BookAddonsPage() {
  return (
    <Suspense
      fallback={
        <section className="bg-[#010101] px-[var(--pad)] pb-[var(--section-y)] pt-28 md:pt-32">
          <p className="text-white/60">Loading booking…</p>
        </section>
      }
    >
      <AddonsStep />
    </Suspense>
  );
}
