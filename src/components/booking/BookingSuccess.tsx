"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ActionButton } from "@/components/ui/ActionButton";
import { usePageTransition } from "@/components/PageTransition";
import { useBookingState } from "@/hooks/useBookingState";
import {
  BOOKING_ADDONS,
  formatAud,
  formatBookingDateTime,
  getPackage,
  type AddonId,
  type PackageId,
} from "@/lib/booking";

type Snapshot = {
  packageId: PackageId | null;
  addonIds: AddonId[];
  date: string | null;
  time: string | null;
};

export function BookingSuccess() {
  const searchParams = useSearchParams();
  const { navigate } = usePageTransition();
  const { state, ready, clearBooking } = useBookingState();
  const snapshotRef = useRef<Snapshot | null>(null);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!ready) return;
    if (!snapshotRef.current) {
      const next: Snapshot = {
        packageId: state.packageId,
        addonIds: state.addonIds,
        date: state.date,
        time: state.time,
      };
      snapshotRef.current = next;
      setSnapshot(next);
    }
    clearBooking();
  }, [ready, state, clearBooking]);

  const pkg = getPackage(snapshot?.packageId);
  const addons = BOOKING_ADDONS.filter((a) =>
    (snapshot?.addonIds ?? []).includes(a.id),
  );
  const when =
    snapshot?.date && snapshot?.time
      ? formatBookingDateTime(snapshot.date, snapshot.time)
      : null;

  return (
    <section className="bg-[#010101] px-[var(--pad)] pb-[var(--section-y)] pt-28 md:pt-32">
      <div className="mx-auto flex w-full max-w-[720px] flex-col items-start gap-6">
        <p className="text-sm font-bold uppercase tracking-[0.1em] text-white/50">
          Booking confirmed
        </p>
        <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[0.95] tracking-[-0.03em] text-white">
          Payment received — you&apos;re booked in.
        </h1>
        <p className="max-w-[520px] text-base leading-relaxed text-white/65">
          A confirmation email is on its way. Your shoot is blocked on our
          calendar so that time can&apos;t be double-booked.
        </p>
        {pkg ? (
          <ul className="w-full max-w-[520px] rounded-2xl border border-white/15 bg-white/[0.03] p-5 text-sm text-white/70">
            <li className="flex justify-between gap-3">
              <span>Package</span>
              <span className="text-white">{pkg.name}</span>
            </li>
            {when ? (
              <li className="mt-2 flex justify-between gap-3">
                <span>When</span>
                <span className="text-white">{when}</span>
              </li>
            ) : null}
            {addons.map((addon) => (
              <li key={addon.id} className="mt-2 flex justify-between gap-3">
                <span>{addon.title}</span>
                <span className="text-white">{formatAud(addon.price)}</span>
              </li>
            ))}
            {sessionId ? (
              <li className="mt-3 border-t border-white/10 pt-3 text-xs text-white/40">
                Ref: {sessionId}
              </li>
            ) : null}
          </ul>
        ) : null}
        <ActionButton onClick={() => navigate("/")}>Back to home</ActionButton>
      </div>
    </section>
  );
}
