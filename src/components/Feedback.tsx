"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionHeader } from "./SectionHeader";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const testimonials = [
  {
    name: "Kristen Ellis",
    brand: "Elite Supps",
    photo: "/assets/feedback-1.jpg",
    quote:
      "Their professionalism and attention to detail made the entire process seamless and stress-free.",
  },
  {
    name: "Jollie Dwayne",
    brand: "Elite Supps",
    photo: "/assets/feedback-2.jpg",
    quote:
      "Bayley's ability to create memorable moments is what makes him so great to work with.",
  },
];

export function Feedback() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".feedback-card", {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
        },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="bg-white px-[var(--pad)] py-[var(--section-y)] text-[#010101]"
    >
      <div className="mx-auto flex max-w-[1408px] flex-col gap-10">
        <SectionHeader
          left="CLIENTS FEEDBACKS"
          right="2023 - 2026"
          className="!border-[#010101] !text-[#010101]"
        />

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_minmax(0,1.2fr)]">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="feedback-card flex min-h-[320px] flex-col justify-between gap-10 rounded-2xl bg-[#f6f6f6] p-6 md:min-h-[474px]"
            >
              <div className="flex items-start gap-4">
                <div className="relative size-[109px] shrink-0 overflow-hidden rounded-xl bg-white">
                  <Image
                    src={item.photo}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="109px"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-base font-bold">{item.name}</p>
                  <p className="text-sm font-medium text-[#706c6c]">
                    {item.brand}
                  </p>
                </div>
              </div>
              <p className="text-lg leading-[1.5] tracking-[-0.02em]">
                {item.quote}
              </p>
            </article>
          ))}

          <div className="feedback-card relative min-h-[320px] overflow-hidden rounded-2xl md:min-h-[474px]">
            <Image
              src="/assets/feedback-photo.jpg"
              alt="Client session"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
