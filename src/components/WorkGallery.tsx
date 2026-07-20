"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionHeader } from "./SectionHeader";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const shots = [
  {
    src: "/assets/about-4.jpg",
    alt: "Athlete portrait in red",
    className: "md:col-span-2 md:row-span-2 aspect-[4/5] md:aspect-auto md:min-h-[560px]",
  },
  {
    src: "/assets/service-2.jpg",
    alt: "Training session still",
    className: "aspect-[4/3]",
  },
  {
    src: "/assets/about-1.jpg",
    alt: "Fitness lifestyle frame",
    className: "aspect-[3/4]",
  },
  {
    src: "/assets/about-2.jpg",
    alt: "Strength photography",
    className: "md:col-span-2 aspect-[16/10]",
  },
  {
    src: "/assets/about-3.jpg",
    alt: "Studio athlete shot",
    className: "aspect-[3/4]",
  },
  {
    src: "/assets/service-1.jpg",
    alt: "Campaign visual",
    className: "aspect-[4/5]",
  },
  {
    src: "/assets/feedback-photo.jpg",
    alt: "Brand collaboration still",
    className: "md:col-span-2 aspect-[16/9]",
  },
  {
    src: "/assets/hero.jpg",
    alt: "Dramatic athlete portrait",
    className: "aspect-[4/5]",
  },
] as const;

export function WorkGallery() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(".work-shot", {
        opacity: 0,
        y: 40,
        duration: 0.85,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root.current,
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
              className={`work-shot relative overflow-hidden rounded-xl bg-[#1e1e1e] ${shot.className}`}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
