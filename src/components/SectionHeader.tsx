"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  left: string;
  right?: string;
  className?: string;
};

export function SectionHeader({
  left,
  right = "©2023",
  className = "",
}: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const leftLabel = el.querySelector(".section-label-left");
      const rightLabel = el.querySelector(".section-label-right");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([leftLabel, rightLabel], { clearProps: "all", x: 0, opacity: 1 });
        return;
      }

      gsap.from(leftLabel, {
        x: -48,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      });

      gsap.from(rightLabel, {
        x: 48,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className={`flex items-center justify-between overflow-hidden border-b border-white pb-6 text-base font-bold text-white ${className}`}
    >
      <span className="section-label-left inline-block">{left}</span>
      <span className="section-label-right inline-block">{right}</span>
    </div>
  );
}
