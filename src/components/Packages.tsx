"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "./ui/Button";
import { SectionHeader } from "./SectionHeader";
import { BOOKING_PACKAGES, formatAud } from "@/lib/booking";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Packages() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(".packages-reveal", {
        opacity: 0,
        y: 36,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
        },
      });

      gsap.from(".packages-card", {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section.querySelector(".packages-grid"),
          start: "top 80%",
        },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="bg-[#010101] px-[var(--pad)] pb-[var(--section-y)] pt-28 md:pt-32"
    >
      <div className="mx-auto flex w-full max-w-[1408px] flex-col gap-12 md:gap-16">
        <SectionHeader left="PACKAGES" right="BOOK NOW" />

        <div className="packages-reveal max-w-[900px]">
          <h1 className="font-display text-[clamp(2.75rem,8vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.03em] text-white">
            Book your next
            <br />
            shoot
          </h1>
        </div>

        <div className="packages-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BOOKING_PACKAGES.map((item) => (
            <article
              key={item.id}
              className="packages-card flex flex-col justify-between gap-10 rounded-2xl border border-white/20 p-6 md:p-8"
            >
              <div className="flex flex-col gap-5">
                <h2 className="font-display text-2xl font-medium leading-none tracking-[-0.02em] text-white md:text-[1.75rem]">
                  {item.name}
                </h2>
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-white/45">
                    Includes
                  </p>
                  <p className="text-base leading-relaxed text-white/80">
                    {item.includes}
                  </p>
                </div>
                <div className="flex items-end justify-between gap-4 border-t border-white/15 pt-5">
                  <p className="text-sm font-medium text-white/50">
                    {item.durationLabel}
                  </p>
                  <p className="text-xl font-bold text-white md:text-2xl">
                    {formatAud(item.price)}
                  </p>
                </div>
              </div>
              <div>
                <Button href={`/book/addons?package=${item.id}`} variant="outline">
                  Select
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
