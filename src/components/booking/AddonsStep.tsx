"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookingNextBar } from "@/components/booking/BookingNextBar";
import { BookingStepper } from "@/components/booking/BookingStepper";
import { PackageSummaryCard } from "@/components/booking/PackageSummaryCard";
import { useBookingState } from "@/hooks/useBookingState";
import {
  BOOKING_ADDONS,
  bookingSubtotal,
  formatAud,
  getPackage,
  isPackageId,
} from "@/lib/booking";

export function AddonsStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, ready, setPackage, toggleAddon } = useBookingState();

  useEffect(() => {
    if (!ready) return;
    const fromQuery = searchParams.get("package");
    if (fromQuery && isPackageId(fromQuery)) {
      if (state.packageId !== fromQuery) setPackage(fromQuery);
      return;
    }
    if (!state.packageId) router.replace("/packages");
  }, [ready, searchParams, state.packageId, setPackage, router]);

  const pkg = getPackage(state.packageId);
  if (!ready || !pkg) {
    return (
      <section className="bg-[#010101] px-[var(--pad)] pb-28 pt-24 md:pt-32">
        <p className="text-white/60">Loading booking…</p>
      </section>
    );
  }

  const subtotal = bookingSubtotal(state);

  return (
    <section className="bg-[#010101] px-[var(--pad)] pb-28 pt-24 md:pb-32 md:pt-32">
      <div className="mx-auto flex w-full max-w-[1408px] flex-col gap-6 md:gap-10">
        <BookingStepper current="addons" />

        <Link
          href="/packages"
          className="w-fit text-sm font-medium text-white/70 transition-colors hover:text-white"
        >
          ← Back
        </Link>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:gap-14">
          {/* Summary first on mobile so context is clear */}
          <div className="order-1 flex flex-col gap-4 lg:order-2 lg:sticky lg:top-28">
            <PackageSummaryCard pkg={pkg} />
            <div className="hidden lg:block">
              <BookingNextBar
                durationLabel={pkg.durationLabel}
                subtotalLabel={formatAud(subtotal)}
                onNext={() => router.push("/book/time")}
              />
            </div>
          </div>

          <div className="order-2 flex flex-col gap-5 rounded-2xl border border-white/20 bg-white/[0.03] p-4 sm:gap-8 sm:p-6 md:p-10 lg:order-1">
            <div>
              <h1 className="font-display text-xl font-medium leading-[1.2] tracking-[-0.02em] text-white sm:text-[1.75rem]">
                Feel like adding something a little extra?
              </h1>
              <p className="mt-2 text-sm text-white/55">
                Optional — skip anytime and continue to pick a time.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {BOOKING_ADDONS.map((addon) => {
                const selected = state.addonIds.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className={`flex gap-3 rounded-2xl border p-3 text-left transition-colors sm:flex-col sm:gap-4 sm:p-5 ${
                      selected
                        ? "border-white bg-white/10"
                        : "border-white/20 hover:border-white/45"
                    }`}
                  >
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl sm:aspect-[16/9] sm:h-auto sm:w-full">
                      <Image
                        src={addon.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 96px, 280px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                      <p className="font-display absolute bottom-2 left-2 text-sm font-medium leading-none tracking-[-0.02em] text-white sm:bottom-3 sm:left-3 sm:text-lg">
                        {addon.label}
                      </p>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-3">
                      <p className="text-sm leading-snug text-white/85 sm:leading-relaxed">
                        {addon.title}
                      </p>
                      <div className="mt-auto flex items-center justify-between gap-3">
                        <p className="text-base font-bold text-white">
                          {formatAud(addon.price)}
                        </p>
                        <span
                          className={`flex size-6 items-center justify-center rounded border ${
                            selected
                              ? "border-white bg-white text-[#010101]"
                              : "border-white/35"
                          }`}
                          aria-hidden
                        >
                          {selected ? "✓" : ""}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile fixed dock */}
      <div className="lg:hidden">
        <BookingNextBar
          durationLabel={pkg.durationLabel}
          subtotalLabel={formatAud(subtotal)}
          onNext={() => router.push("/book/time")}
        />
      </div>
    </section>
  );
}
