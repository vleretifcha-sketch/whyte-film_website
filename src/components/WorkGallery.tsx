"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionHeader } from "./SectionHeader";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const shots = [
  "5-2.jpg",
  "5-3.jpg",
  "dsc01096-enhanced-nr.jpg",
  "dsc01965.jpg",
  "dsc07003.jpg",
  "wf000058-2.jpg",
  "wf001618.jpg",
  "wf001715.jpg",
  "wf001919.jpg",
  "wf005159.jpg",
  "wf005559.jpg",
  "wf007014-2.jpg",
  "wf007087.jpg",
  "wf008904.jpg",
  "whyte-films-14.jpg",
  "whyte-films-25.jpg",
  "whyte-films-27.jpg",
  "whyte-films-631.jpg",
  "whyte-films-81.jpg",
].map((file) => ({
  src: `/assets/work/${file}`,
  alt: "Whyte Films — selected frame",
}));

export function WorkGallery() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Don't fade from opacity 0: on this page the grid is already in view,
      // and that tween was leaving the frames invisible.
      gsap.from(".work-shot", {
        y: 28,
        duration: 0.7,
        stagger: 0.04,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: root.current,
          start: "top 95%",
          once: true,
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
        <SectionHeader left="WORK" right="©2023" />

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h1 className="font-display max-w-[720px] text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.03em] text-white">
            Selected frames
          </h1>
          <p className="max-w-[360px] text-base leading-relaxed text-white/60 md:text-right">
            Photography and film for fitness brands, athletes and campaigns.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
          {shots.map((shot) => (
            <div
              key={shot.src}
              className="work-shot relative aspect-[2/3] overflow-hidden rounded-xl bg-[#1e1e1e]"
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                loading="eager"
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 480px"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
