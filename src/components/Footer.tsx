"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import { ButtonLabel } from "./ui/Button";
import { footerLinks } from "@/lib/nav";

const socials = [
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://twitter.com", label: "Twitter" },
  { href: "https://www.behance.net", label: "Behance" },
  { href: "mailto:hello@whytefilms.com.au", label: "Contact" },
];

const metaLinks = [
  { href: "#", label: "Style Guide" },
  { href: "#", label: "Changelog" },
  { href: "#", label: "Licenses" },
  { href: "#", label: "Instructions" },
];

export function Footer() {
  return (
    <footer className="bg-[#010101] px-[var(--pad)] pb-8 pt-16 text-white md:pb-10 md:pt-24">
      <div className="mx-auto flex max-w-[1408px] flex-col">
        {/* Top bar */}
        <div className="flex items-end justify-between border-b border-white pb-4 text-sm font-medium lowercase tracking-wide md:text-base">
          <span>contact</span>
          <span className="normal-case">©2026</span>
        </div>

        {/* Main columns */}
        <div className="grid grid-cols-1 gap-12 py-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 lg:py-20">
          <div className="flex max-w-[320px] flex-col">
            <Link
              href="/"
              aria-label="Whyte Films home"
              className="inline-flex transition-opacity hover:opacity-70"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/logo-nav.svg"
                alt="whyte films"
                width={148}
                height={16}
                className="h-3.5 w-auto md:h-4"
              />
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-white/60 md:text-base">
              Every brand, every athletes have a story. We bring yours to life
              through powerful visuals that capture the passion, discipline and
              emotion behind every performance.
            </p>

            <div className="mt-10">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.08em]">
                Newsletter
              </p>
              <p className="mb-5 text-sm leading-relaxed text-white/60 md:text-base">
                Subscribe for special offers and other content.
              </p>
              <form
                className="flex items-center gap-3"
                onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}
              >
                <label htmlFor="footer-newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="Your email"
                  className="h-12 min-w-0 flex-1 rounded-2xl border border-white/30 bg-transparent px-4 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-white"
                />
                <button
                  type="submit"
                  className="btn btn-secondary inline-flex h-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl !border !border-solid !border-white !bg-transparent px-4 text-base font-bold !text-white"
                >
                  <ButtonLabel>Subscribe</ButtonLabel>
                </button>
              </form>
            </div>
          </div>

          {/* Pages + Social side by side on mobile */}
          <div className="col-span-full grid grid-cols-2 gap-8 sm:col-span-2 lg:contents">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.08em]">
                Pages
              </p>
              <nav className="flex flex-col gap-2" aria-label="Footer pages">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-white/80 transition-opacity hover:opacity-100 hover:text-white md:text-base"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.08em]">
                Social
              </p>
              <nav className="flex flex-col gap-2" aria-label="Social">
                {socials.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="text-sm text-white/80 transition-opacity hover:opacity-100 hover:text-white md:text-base"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Gradient wordmark */}
        <div className="pointer-events-none relative select-none py-10 md:py-16">
          <Image
            src="/assets/logo-wordmark-footer.svg"
            alt="whyte films"
            width={1409}
            height={214}
            className="mx-auto h-auto w-full max-w-[1409px]"
          />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-white/20 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between md:text-sm">
          <p>Whyte Films — Collaborate. Capture. Create.</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Legal">
            {metaLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-opacity hover:text-white/80"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
