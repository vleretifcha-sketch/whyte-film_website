"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookingNextBar } from "@/components/booking/BookingNextBar";
import { BookingStepper } from "@/components/booking/BookingStepper";
import { PackageSummaryCard } from "@/components/booking/PackageSummaryCard";
import { usePageTransition } from "@/components/PageTransition";
import { useBookingState } from "@/hooks/useBookingState";
import {
  BOOKING_ADDONS,
  bookingSubtotal,
  formatAud,
  formatSlotLabel,
  getPackage,
  isDateBookable,
  slotsForDate,
  toIsoDate,
} from "@/lib/booking";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const WEEKDAYS_SHORT = ["M", "T", "W", "T", "F", "S", "S"] as const;

function monthLabel(year: number, month: number) {
  return new Intl.DateTimeFormat("en-AU", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));
}

function buildCalendarDays(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<Date | null> = [];

  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function TimeStep() {
  const router = useRouter();
  const { navigate } = usePageTransition();
  const { state, ready, update } = useBookingState();
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  useEffect(() => {
    if (!ready) return;
    if (!state.packageId) router.replace("/packages");
  }, [ready, state.packageId, router]);

  const pkg = getPackage(state.packageId);
  const selectedAddons = BOOKING_ADDONS.filter((a) =>
    state.addonIds.includes(a.id),
  );
  const cells = useMemo(
    () => buildCalendarDays(viewYear, viewMonth),
    [viewYear, viewMonth],
  );
  const availableSlots = slotsForDate(state.date);
  const subtotal = bookingSubtotal(state);

  if (!ready || !pkg) {
    return (
      <section className="bg-[#010101] px-[var(--pad)] pb-28 pt-24 md:pt-32">
        <p className="text-white/60">Loading booking…</p>
      </section>
    );
  }

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const canContinue = Boolean(state.date && state.time);

  return (
    <section className="bg-[#010101] px-[var(--pad)] pb-28 pt-24 md:pb-32 md:pt-32">
      <div className="mx-auto flex w-full max-w-[1408px] flex-col gap-6 md:gap-10">
        <BookingStepper current="time" />

        <Link
          href="/book/addons"
          className="w-fit text-sm font-medium text-white/70 transition-colors hover:text-white"
        >
          ← Back
        </Link>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:gap-14">
          <div className="order-1 flex flex-col gap-4 lg:order-2 lg:sticky lg:top-28">
            <PackageSummaryCard pkg={pkg} addons={selectedAddons} />
            <div className="hidden lg:block">
              <BookingNextBar
                durationLabel={pkg.durationLabel}
                subtotalLabel={formatAud(subtotal)}
                disabled={!canContinue}
                onNext={() => navigate("/book/client")}
              />
            </div>
          </div>

          <div className="order-2 flex flex-col gap-5 rounded-2xl border border-white/20 bg-white/[0.03] p-4 sm:gap-8 sm:p-6 md:p-10 lg:order-1">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                className="rounded-xl border border-white/20 px-3 py-2 text-xs text-white/70 transition-colors hover:border-white/50 hover:text-white sm:text-sm"
              >
                ← Prev
              </button>
              <h1 className="font-display text-center text-lg font-medium tracking-[-0.03em] text-white sm:text-2xl md:text-3xl">
                {monthLabel(viewYear, viewMonth)}
              </h1>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                className="rounded-xl border border-white/20 px-3 py-2 text-xs text-white/70 transition-colors hover:border-white/50 hover:text-white sm:text-sm"
              >
                Next →
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center sm:gap-2">
              {WEEKDAYS.map((day, i) => (
                <p
                  key={day}
                  className={`text-[10px] font-bold uppercase tracking-[0.06em] sm:text-xs sm:tracking-[0.08em] ${
                    day === "Sat" || day === "Sun"
                      ? "text-white/35"
                      : "text-white/55"
                  }`}
                >
                  <span className="sm:hidden">{WEEKDAYS_SHORT[i]}</span>
                  <span className="hidden sm:inline">{day}</span>
                </p>
              ))}
              {cells.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} />;
                }
                const iso = toIsoDate(date);
                const bookable = isDateBookable(date);
                const selected = state.date === iso;
                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={!bookable}
                    aria-pressed={selected}
                    onClick={() => update({ date: iso, time: null })}
                    className={`book-day ${
                      selected
                        ? "book-day--selected"
                        : bookable
                          ? "book-day--available"
                          : "book-day--disabled"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-white/15 pt-5 sm:pt-8">
              <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <h2 className="text-base font-bold text-white sm:text-lg">
                  Available start times
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-white/55 sm:gap-4 sm:text-sm">
                  <p className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full border border-white/50 bg-white/15" />
                    Available
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-white" />
                    Selected
                  </p>
                </div>
              </div>

              {!state.date ? (
                <p className="text-sm text-white/50">
                  Select a date to see available times.
                </p>
              ) : availableSlots.length === 0 ? (
                <p className="text-sm text-white/50">
                  No times available on this date.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
                  {availableSlots.map((slot) => {
                    const selected = state.time === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => update({ time: slot })}
                        className={`book-slot w-full sm:w-auto ${
                          selected ? "book-slot--selected" : ""
                        }`}
                      >
                        {formatSlotLabel(slot)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <BookingNextBar
          durationLabel={pkg.durationLabel}
          subtotalLabel={formatAud(subtotal)}
          disabled={!canContinue}
          onNext={() => navigate("/book/client")}
        />
      </div>
    </section>
  );
}
