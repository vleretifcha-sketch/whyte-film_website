"use client";

import type { ReactNode } from "react";
import { SectionHeader } from "./SectionHeader";

const PARTNERS = [
  {
    id: "apex-fuel",
    name: "Apex Fuel",
    logo: (
      <svg viewBox="0 0 160 48" fill="none" aria-hidden className="h-10 w-auto md:h-12">
        <path
          d="M8 36L24 8h12l16 28h-12l-2.5-4.5H22.5L20 36H8zm18.5-12h9.2L31 14.5 26.5 24z"
          fill="currentColor"
        />
        <path d="M58 8h10v28H58V8z" fill="currentColor" />
        <path
          d="M78 36V8h14c8 0 13 4.5 13 11.5S100 31 92 31h-4v5H78zm10-13h3.5c3.2 0 5-1.6 5-4s-1.8-4-5-4H88v8z"
          fill="currentColor"
        />
        <path
          d="M114 36V8h10v11h.3L136 8h12l-14 14 15 14h-13l-11.5-11H124v11h-10z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    id: "ironform",
    name: "Ironform",
    logo: (
      <svg viewBox="0 0 180 48" fill="none" aria-hidden className="h-9 w-auto md:h-11">
        <circle cx="18" cy="24" r="10" stroke="currentColor" strokeWidth="2.5" />
        <path d="M12 24h12M18 18v12" stroke="currentColor" strokeWidth="2.5" />
        <text
          x="38"
          y="31"
          fill="currentColor"
          fontFamily="Satoshi, Segoe UI, sans-serif"
          fontSize="20"
          fontWeight="700"
          letterSpacing="0.12em"
        >
          IRONFORM
        </text>
      </svg>
    ),
  },
  {
    id: "pulse-lab",
    name: "Pulse Lab",
    logo: (
      <svg viewBox="0 0 170 48" fill="none" aria-hidden className="h-10 w-auto md:h-12">
        <path
          d="M6 28h18l6-16 8 32 8-20 5 10h23"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="78"
          y="32"
          fill="currentColor"
          fontFamily="Satoshi, Segoe UI, sans-serif"
          fontSize="18"
          fontWeight="700"
          letterSpacing="0.08em"
        >
          PULSE
        </text>
      </svg>
    ),
  },
  {
    id: "northgrip",
    name: "Northgrip",
    logo: (
      <svg viewBox="0 0 170 48" fill="none" aria-hidden className="h-10 w-auto md:h-12">
        <path d="M14 36V12l16 24V12" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <text
          x="42"
          y="31"
          fill="currentColor"
          fontFamily="Satoshi, Segoe UI, sans-serif"
          fontSize="18"
          fontWeight="600"
          letterSpacing="0.16em"
        >
          NORTHGRIP
        </text>
      </svg>
    ),
  },
  {
    id: "voltwear",
    name: "Voltwear",
    logo: (
      <svg viewBox="0 0 160 48" fill="none" aria-hidden className="h-10 w-auto md:h-12">
        <path d="M22 8L10 26h12l-4 14 18-22H24l4-10H22z" fill="currentColor" />
        <text
          x="42"
          y="31"
          fill="currentColor"
          fontFamily="Satoshi, Segoe UI, sans-serif"
          fontSize="18"
          fontWeight="700"
          letterSpacing="0.1em"
        >
          VOLTWEAR
        </text>
      </svg>
    ),
  },
] as const;

function PartnerSlot({
  name,
  logo,
}: {
  name: string;
  logo: ReactNode;
}) {
  return (
    <div
      className="flex h-[120px] w-[min(42vw,260px)] shrink-0 items-center justify-center rounded-2xl bg-[#1e1e1e] text-white/85 md:h-[154px] md:w-[280px]"
      aria-label={name}
    >
      {logo}
    </div>
  );
}

export function Partners() {
  const sequence = [...PARTNERS, ...PARTNERS];

  return (
    <section className="overflow-hidden pb-[var(--section-y)] pt-2">
      <div className="mx-auto flex max-w-[1408px] flex-col gap-10 px-[var(--pad)]">
        <SectionHeader left="PARTNERS" />

        <p className="max-w-full text-right text-[clamp(1.25rem,2.5vw,2rem)] font-normal leading-[1.5] tracking-[-0.02em] text-white">
          Partnering with visionary brands
          <br />
          to create meaningful and lasting impact.
        </p>
      </div>

      <div className="mt-10" aria-label="Partner logos">
        <div className="partners-marquee flex w-max items-center gap-4 will-change-transform">
          {sequence.map((partner, i) => (
            <PartnerSlot
              key={`${partner.id}-${i}`}
              name={partner.name}
              logo={partner.logo}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
