"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ActionButton } from "@/components/ui/ActionButton";
import { BookingStepper } from "@/components/booking/BookingStepper";
import { useBookingState } from "@/hooks/useBookingState";
import {
  BOOKING_ADDONS,
  bookingSubtotal,
  formatAud,
  formatBookingDateTime,
  getPackage,
} from "@/lib/booking";

const fieldClass =
  "h-12 w-full rounded-2xl border border-white/25 bg-transparent px-4 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-white";

const areaClass =
  "min-h-[110px] w-full resize-y rounded-2xl border border-white/25 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-white";

const HEAR_OPTIONS = [
  "Instagram",
  "Facebook",
  "Google",
  "Referral",
  "Other",
] as const;

export function ClientStep() {
  const router = useRouter();
  const { state, ready, clearBooking } = useBookingState();
  const [submitted, setSubmitted] = useState(false);
  const [agreeWhyte, setAgreeWhyte] = useState(false);
  const [agreeCancel, setAgreeCancel] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!state.packageId) {
      router.replace("/packages");
      return;
    }
    if (!state.date || !state.time) {
      router.replace("/book/time");
    }
  }, [ready, state.packageId, state.date, state.time, router]);

  const pkg = getPackage(state.packageId);
  const selectedAddons = BOOKING_ADDONS.filter((a) =>
    state.addonIds.includes(a.id),
  );
  const total = bookingSubtotal(state);
  const dateLabel =
    state.date && state.time
      ? formatBookingDateTime(state.date, state.time)
      : null;

  if (!ready || !pkg || !dateLabel) {
    return (
      <section className="bg-[#010101] px-[var(--pad)] pb-[var(--section-y)] pt-28 md:pt-32">
        <p className="text-white/60">Loading booking…</p>
      </section>
    );
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!agreeWhyte || !agreeCancel) return;
    setSubmitted(true);
    clearBooking();
  };

  if (submitted) {
    return (
      <section className="bg-[#010101] px-[var(--pad)] pb-[var(--section-y)] pt-28 md:pt-32">
        <div className="mx-auto flex w-full max-w-[720px] flex-col items-start gap-6">
          <p className="text-sm font-bold uppercase tracking-[0.1em] text-white/50">
            Booking request
          </p>
          <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[0.95] tracking-[-0.03em] text-white">
            Thanks — we&apos;ll be in touch.
          </h1>
          <p className="max-w-[520px] text-base leading-relaxed text-white/65">
            Your {pkg.name} package request has been received. Our team will
            confirm availability shortly.
          </p>
          <ActionButton onClick={() => router.push("/")}>
            Back to home
          </ActionButton>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#010101] px-[var(--pad)] pb-28 pt-24 md:pb-32 md:pt-32">
      <div className="mx-auto flex w-full max-w-[1408px] flex-col gap-6 md:gap-10">
        <BookingStepper current="client" />

        <Link
          href="/book/time"
          className="w-fit text-sm font-medium text-white/70 transition-colors hover:text-white"
        >
          ← Back
        </Link>

        <form
          onSubmit={onSubmit}
          className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-14"
        >
          <div className="order-2 flex flex-col gap-5 rounded-2xl border border-white/15 bg-white/[0.03] p-4 sm:p-6 md:p-10 lg:order-1">
            <Field label="Name" required>
              <input
                name="name"
                required
                autoComplete="name"
                placeholder="Enter your name"
                className={fieldClass}
              />
            </Field>
            <Field label="Email" required>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Enter email address"
                className={fieldClass}
              />
            </Field>
            <Field label="Phone" required>
              <input
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="Enter phone number"
                className={fieldClass}
              />
            </Field>
            <Field label="Where would you like your shoot to take place?" required>
              <textarea
                name="location"
                required
                placeholder="Studio, gym, outdoor…"
                className={areaClass}
              />
            </Field>
            <Field label="What's the reason for your shoot?" required>
              <textarea
                name="reason"
                required
                placeholder="Campaign, personal brand, competition…"
                className={areaClass}
              />
            </Field>
            <Field label="Where did you hear about Whyte Films?" required>
              <select name="source" required defaultValue="" className={fieldClass}>
                <option value="" disabled className="bg-[#010101]">
                  Select an option
                </option>
                {HEAR_OPTIONS.map((option) => (
                  <option key={option} value={option} className="bg-[#010101]">
                    {option}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Is there anything else you'd like us to know before your shoot?">
              <textarea
                name="notes"
                placeholder="Optional details"
                className={areaClass}
              />
            </Field>
            <Field label="What's your Instagram OR Facebook username?">
              <input
                name="social"
                placeholder="@username"
                className={fieldClass}
              />
            </Field>
          </div>

          <aside className="order-1 flex flex-col gap-5 rounded-2xl border border-white/15 bg-white/[0.03] p-4 sm:gap-6 sm:p-6 md:p-8 lg:order-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/45">
                {pkg.name} package
              </p>
              <p className="mt-3 text-sm text-white/70">
                <span className="text-white/45">Date: </span>
                {dateLabel}
              </p>
              <p className="mt-1 text-sm text-white/70">
                <span className="text-white/45">Provider: </span>
                Whyte Films
              </p>
            </div>

            <details className="rounded-xl border border-white/15 p-4">
              <summary className="cursor-pointer text-sm font-bold text-white">
                Items
              </summary>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-white/70">
                <li className="flex justify-between gap-3">
                  <span>{pkg.name}</span>
                  <span>{formatAud(pkg.price)}</span>
                </li>
                {selectedAddons.map((addon) => (
                  <li key={addon.id} className="flex justify-between gap-3">
                    <span>{addon.title}</span>
                    <span>{formatAud(addon.price)}</span>
                  </li>
                ))}
              </ul>
            </details>

            <p className="text-right text-base text-white">
              Total for booking:{" "}
              <span className="text-xl font-bold">{formatAud(total)}</span>
            </p>

            <div className="flex flex-col gap-3 text-sm text-white/70">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  checked={agreeWhyte}
                  onChange={(e) => setAgreeWhyte(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  I agree with Whyte Films Terms &amp; Conditions{" "}
                  <span className="text-white/40">*</span>
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  checked={agreeCancel}
                  onChange={(e) => setAgreeCancel(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  I agree with cancellation policy{" "}
                  <span className="text-white/40">*</span>
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  Subscribe to be one of the first to receive our promotions
                </span>
              </label>
            </div>

            <div className="hidden pt-2 lg:block">
              <ActionButton
                type="submit"
                disabled={!agreeWhyte || !agreeCancel}
                className="w-full"
              >
                Confirm booking
              </ActionButton>
            </div>
          </aside>

          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/20 bg-[#010101]/95 px-[var(--pad)] py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
            <ActionButton
              type="submit"
              disabled={!agreeWhyte || !agreeCancel}
              className="w-full"
            >
              Confirm booking
            </ActionButton>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase tracking-[0.08em] text-white/50">
        {label}
        {required ? <span className="text-white/35"> *</span> : null}
      </span>
      {children}
    </label>
  );
}
