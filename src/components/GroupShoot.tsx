"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { SectionHeader } from "./SectionHeader";
import { ButtonLabel } from "./ui/Button";
import { NEXT_GROUP_SHOOT } from "@/lib/group-shoot";

const fieldClass =
  "h-12 w-full rounded-2xl border border-white/25 bg-transparent px-4 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-white";

const labelClass =
  "text-xs font-bold uppercase tracking-[0.08em] text-white/50";

export function GroupShoot() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("fullName") ?? "");
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/group-shoot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? ""),
          instagram: String(form.get("instagram") ?? ""),
          marketingConsent: form.get("marketingConsent") === "on",
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Could not complete registration");
      }
      setName(fullName.trim());
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete registration");
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-[#010101] px-[var(--pad)] pb-[var(--section-y)] pt-28 md:pt-32">
      <div className="mx-auto flex w-full max-w-[1408px] flex-col gap-12 md:gap-16">
        <SectionHeader left="GROUP SHOOT" right="21 NOV 2026" />

        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.03em] text-white">
                Group Shoot
              </h1>
              <p className="mt-6 max-w-[520px] text-base leading-relaxed text-white/70">
                A shared session for athletes and creators. Register below to
                express your interest.
              </p>
            </div>

            <dl className="grid gap-4 rounded-2xl border border-white/15 bg-white/[0.03] p-5 sm:grid-cols-3 sm:p-6">
              <Detail label="Date" value={NEXT_GROUP_SHOOT.dateLabel} />
              <Detail label="Time" value={NEXT_GROUP_SHOOT.timeLabel} />
              <Detail label="Where" value={NEXT_GROUP_SHOOT.venue} />
            </dl>

            {done ? (
              <div className="rounded-2xl border border-white/20 bg-white/[0.04] px-5 py-6">
                <p className="text-lg font-medium text-white">You&apos;re registered.</p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Thanks{name ? `, ${name}` : ""}. We&apos;ve sent your details
                  through for the {NEXT_GROUP_SHOOT.dateLabel} group shoot at{" "}
                  {NEXT_GROUP_SHOOT.venue}, {NEXT_GROUP_SHOOT.timeLabel}.
                </p>
              </div>
            ) : (
              <form className="flex flex-col gap-5" onSubmit={onSubmit}>
                <div className="flex flex-col gap-2">
                  <label htmlFor="group-name" className={labelClass}>
                    Full name <span className="text-white/30">(required)</span>
                  </label>
                  <input
                    id="group-name"
                    name="fullName"
                    required
                    autoComplete="name"
                    placeholder="Your full name"
                    className={fieldClass}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="group-email" className={labelClass}>
                      Email <span className="text-white/30">(required)</span>
                    </label>
                    <input
                      id="group-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@email.com"
                      className={fieldClass}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="group-phone" className={labelClass}>
                      Phone number <span className="text-white/30">(required)</span>
                    </label>
                    <input
                      id="group-phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="04xx xxx xxx"
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="group-instagram" className={labelClass}>
                    Instagram handle <span className="text-white/30">(required)</span>
                  </label>
                  <input
                    id="group-instagram"
                    name="instagram"
                    required
                    autoComplete="off"
                    placeholder="@yourhandle"
                    className={fieldClass}
                  />
                </div>

                <label className="flex items-start gap-3 text-sm leading-relaxed text-white/70">
                  <input
                    type="checkbox"
                    name="marketingConsent"
                    className="mt-1 size-4 rounded border-white/40 bg-transparent"
                  />
                  <span>
                    I agree to receive marketing emails and updates from Whyte Films.
                  </span>
                </label>

                {error ? (
                  <p className="text-sm text-red-300/90" role="alert">
                    {error}
                  </p>
                ) : null}

                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-secondary inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl !border !border-solid !border-white !bg-transparent px-6 text-base font-bold !text-white disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ButtonLabel>{submitting ? "Sending…" : "Register"}</ButtonLabel>
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl">
            <Image
              src="/assets/service-workshops-group.jpg"
              alt="Whyte Films group shoot"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs font-bold uppercase tracking-[0.08em] text-white/45">
        {label}
      </dt>
      <dd className="text-sm font-medium leading-snug text-white">{value}</dd>
    </div>
  );
}
