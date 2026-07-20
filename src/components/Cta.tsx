"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "./ui/Button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const lines = [
  ["FEEL", "LIKE"],
  ["COLLABORATE?"],
];

export function Cta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const words = gsap.utils.toArray<HTMLElement>(".cta-word", section);
      const rest = gsap.utils.toArray<HTMLElement>(".cta-rest", section);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([words, rest], {
          clearProps: "all",
          opacity: 1,
          yPercent: 0,
          y: 0,
        });
        return;
      }

      gsap.set(words, { yPercent: 115, opacity: 0 });
      gsap.set(rest, { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=120%",
          scrub: 0.65,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(
        words,
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.14,
          duration: 0.45,
        },
        0.1,
      ).to(
        rest,
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.4,
        },
        0.55,
      );
    },
    { scope: root },
  );

  return (
    <section
      id="contact"
      ref={root}
      className="flex min-h-[100svh] flex-col items-center justify-center gap-8 bg-[#010101] px-[var(--pad)] py-[var(--section-y)] text-center"
    >
      <p className="cta-rest text-base font-normal text-white">(LET’S TALK)</p>
      <h2 className="text-[clamp(2.75rem,8vw,7rem)] font-black uppercase leading-none tracking-[-0.04em] text-white">
        {lines.map((line) => (
          <span
            key={line.join("-")}
            className="mb-[0.08em] flex flex-wrap justify-center gap-x-[0.28em] last:mb-0"
          >
            {line.map((word) => (
              <span
                key={word}
                className="inline-block overflow-hidden pb-[0.08em]"
              >
                <span className="cta-word inline-block will-change-transform">
                  {word}
                </span>
              </span>
            ))}
          </span>
        ))}
      </h2>
      <p className="cta-rest max-w-[554px] text-lg font-normal text-[#8e8e8e]">
        Every brand and athlete has a story. We bring yours to life through
        powerful visuals that capture the passion, discipline and emotion
        behind every performance.
      </p>
      <div className="cta-rest flex flex-wrap items-center justify-center gap-4">
        <Button href="/packages">Book Now</Button>
        <Button href="/work" variant="outline">
          View our work
        </Button>
      </div>
    </section>
  );
}
