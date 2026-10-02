import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingSuccess } from "@/components/booking/BookingSuccess";

export const metadata: Metadata = {
  title: "Booking confirmed — Whyte Films",
};

export default function BookSuccessPage() {
  return (
    <Suspense
      fallback={
        <section className="bg-[#010101] px-[var(--pad)] pb-28 pt-28">
          <p className="text-white/60">Loading…</p>
        </section>
      }
    >
      <BookingSuccess />
    </Suspense>
  );
}
