"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const lines = [
  ["Your", "Journey"],
  ["Deserves", "More", "Than"],
  ["JUST", "Content."],
];

export function Statement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const words = gsap.utils.toArray<HTMLElement>(".statement-word", section);
      const eyebrow = section.querySelector(".statement-eyebrow");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([words, eyebrow], { clearProps: "all", opacity: 1, yPercent: 0 });
        return;
      }

      gsap.set(words, { yPercent: 115, opacity: 0 });
      gsap.set(eyebrow, { opacity: 0, y: 16 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=140%",
          scrub: 0.65,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.35 }, 0).to(
        words,
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.45,
        },
        0.15,
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="flex min-h-[100svh] items-center justify-center bg-white px-[var(--pad)] py-24 text-center text-black"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-8">
        <p className="statement-eyebrow text-base font-normal">
          ( WE ARE <span className="font-bold">CREATIVE</span> )
        </p>
        <h2 className="text-[clamp(2.5rem,8vw,7rem)] font-black uppercase leading-none tracking-[-0.04em]">
          {lines.map((line) => (
            <span key={line.join("-")} className="mb-[0.08em] flex flex-wrap justify-center gap-x-[0.28em] last:mb-0">
              {line.map((word) => (
                <span key={word} className="inline-block overflow-hidden pb-[0.08em]">
                  <span className="statement-word inline-block will-change-transform">
                    {word}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
