"use client";

import Image from "next/image";
import { SectionHeader } from "./SectionHeader";

const PARTNERS = [
  {
    id: "primabolics",
    name: "Primabolics",
    src: "/assets/partners/primabolics.png",
    width: 300,
    height: 23,
  },
  {
    id: "greenstreat",
    name: "Greenstreat",
    src: "/assets/partners/greenstreat.png",
    width: 300,
    height: 83,
  },
  {
    id: "ignite",
    name: "Ignite",
    src: "/assets/partners/ignite.png",
    width: 300,
    height: 115,
  },
  {
    id: "musclenation",
    name: "Muscle Nation",
    src: "/assets/partners/musclenation.png",
    width: 300,
    height: 52,
  },
  {
    id: "elite-supplements",
    name: "Elite Supplements",
    src: "/assets/partners/elite-supplements.png",
    width: 300,
    height: 59,
  },
  {
    id: "dayone",
    name: "Day One",
    src: "/assets/partners/dayone.png",
    width: 300,
    height: 44,
  },
  {
    id: "anytime-fitness",
    name: "Anytime Fitness",
    src: "/assets/partners/anytime-fitness.png",
    width: 300,
    height: 81,
  },
  {
    id: "heavyset-gym",
    name: "Heavyset Gym",
    src: "/assets/partners/heavyset-gym.png",
    width: 150,
    height: 150,
  },
] as const;

function PartnerSlot({
  name,
  src,
  width,
  height,
}: {
  name: string;
  src: string;
  width: number;
  height: number;
}) {
  return (
    <div
      className="flex h-[120px] w-[min(42vw,260px)] shrink-0 items-center justify-center rounded-2xl bg-[#1e1e1e] px-6 md:h-[154px] md:w-[280px] md:px-8"
      aria-label={name}
    >
      <Image
        src={src}
        alt={name}
        width={width}
        height={height}
        className="h-auto max-h-12 w-auto max-w-full object-contain md:max-h-14"
      />
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
              src={partner.src}
              width={partner.width}
              height={partner.height}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
