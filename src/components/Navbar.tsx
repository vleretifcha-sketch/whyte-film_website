"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ProgressiveBlur } from "./NavProgressiveBlur";
import { ButtonLabel } from "./ui/Button";
import { navLinks } from "@/lib/nav";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 -mb-[60px] overflow-visible">
      <ProgressiveBlur edge="top" />

      <div className="relative z-[70] mx-auto flex h-[60px] max-w-[1728px] items-center justify-between px-[var(--pad)]">
        <Link href="/" aria-label="Whyte Films home" className="inline-flex">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo-nav.svg"
            alt="whyte films"
            width={148}
            height={16}
            className="h-3.5 w-auto md:h-4"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link text-base font-medium text-white ${
                  active ? "opacity-100" : "opacity-80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="btn btn-secondary inline-flex h-10 items-center justify-center overflow-hidden rounded-2xl !border !border-solid !border-white !bg-transparent px-4 text-sm font-medium !text-white"
          >
            <ButtonLabel>Contact</ButtonLabel>
          </Link>
        </nav>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/40 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3.5 w-5">
            <span
              className={`absolute left-0 h-px w-full bg-white transition-all ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 h-px w-full bg-white transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-full bg-white transition-all ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      {open && (
        <nav
          className="fixed inset-0 z-[60] flex flex-col bg-[#010101]/95 pt-[60px] backdrop-blur-3xl md:hidden"
          aria-label="Mobile"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[#010101]/70"
            aria-hidden
          />
          <div className="relative z-10 flex flex-col gap-4 px-[var(--pad)] pb-8 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xl font-medium text-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="btn btn-secondary mt-2 inline-flex h-10 w-fit items-center justify-center overflow-hidden rounded-2xl !border !border-solid !border-white !bg-transparent px-4 text-sm font-medium !text-white"
              onClick={() => setOpen(false)}
            >
              <ButtonLabel>Contact</ButtonLabel>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
