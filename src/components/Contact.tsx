"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { SectionHeader } from "./SectionHeader";
import { ButtonLabel } from "./ui/Button";

const fieldClass =
  "h-12 w-full rounded-2xl border border-white/25 bg-transparent px-4 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-white";

export function Contact() {
  return (
    <section className="bg-[#010101] px-[var(--pad)] pb-[var(--section-y)] pt-28 md:pt-32">
      <div className="mx-auto flex w-full max-w-[1408px] flex-col gap-12 md:gap-16">
        <SectionHeader left="CONTACT" right="SAY HELLO" />

        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.03em] text-white">
                Contact us
              </h1>
              <div className="mt-6 flex max-w-[520px] flex-col gap-4 text-base leading-relaxed text-white/70">
                <p>
                  Have questions, suggestions, or just want to say hello? We’d
                  love to hear from you! Drop us a message using the form below,
                  and our team will get back to you as soon as possible.
                </p>
                <p>
                  Thank you for reaching out, and we look forward to connecting
                  with you!
                </p>
              </div>
            </div>

            <form
              className="flex flex-col gap-5"
              onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-first"
                    className="text-xs font-bold uppercase tracking-[0.08em] text-white/50"
                  >
                    First name <span className="text-white/30">(required)</span>
                  </label>
                  <input
                    id="contact-first"
                    name="firstName"
                    required
                    autoComplete="given-name"
                    className={fieldClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-last"
                    className="text-xs font-bold uppercase tracking-[0.08em] text-white/50"
                  >
                    Last name <span className="text-white/30">(required)</span>
                  </label>
                  <input
                    id="contact-last"
                    name="lastName"
                    required
                    autoComplete="family-name"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-email"
                  className="text-xs font-bold uppercase tracking-[0.08em] text-white/50"
                >
                  Email <span className="text-white/30">(required)</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={fieldClass}
                />
                <label className="mt-1 flex items-center gap-2 text-sm text-white/60">
                  <input
                    type="checkbox"
                    name="newsletter"
                    className="size-4 rounded border-white/40 bg-transparent"
                  />
                  Sign up for news and updates
                </label>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-subject"
                  className="text-xs font-bold uppercase tracking-[0.08em] text-white/50"
                >
                  Subject <span className="text-white/30">(required)</span>
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  required
                  className={fieldClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-message"
                  className="text-xs font-bold uppercase tracking-[0.08em] text-white/50"
                >
                  Message <span className="text-white/30">(required)</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  className="w-full resize-y rounded-2xl border border-white/25 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-white"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="btn btn-secondary inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl !border !border-solid !border-white !bg-transparent px-6 text-base font-bold !text-white"
                >
                  <ButtonLabel>Submit</ButtonLabel>
                </button>
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-6">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl">
              <Image
                src="/assets/contact.jpg"
                alt="Whyte Films on set"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.08em] text-white">
                Email
              </p>
              <a
                href="mailto:management@whytefilms.com.au"
                className="mt-2 inline-block text-base text-white/75 transition-opacity hover:text-white hover:opacity-100"
              >
                management@whytefilms.com.au
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
