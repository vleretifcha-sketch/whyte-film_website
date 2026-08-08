"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "./ui/Button";
import { SectionHeader } from "./SectionHeader";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const stats = [
  { value: 200, label: "Happy clients worldwide" },
  { value: 300, label: "Projects delivered" },
  { value: 20, label: "Brands partnered" },
];

const categories = [
  { label: "Athletes", src: "/assets/about/athletes.jpg" },
  { label: "Gyms", src: "/assets/about/gyms.jpg" },
  { label: "Products", src: "/assets/about/products.jpg" },
  { label: "Extras", src: "/assets/about/extras.jpg" },
] as const;

export function About({ showHeader = true }: { showHeader?: boolean }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".about-reveal", {
        opacity: 0,
        y: 36,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
        },
      });

      gsap.utils.toArray<HTMLElement>(".stat-count").forEach((el, index) => {
        const target = Number(el.dataset.target) || 0;
        const counter = { val: 0 };

        gsap.to(counter, {
          val: target,
          duration: 1.8,
          delay: index * 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
          onUpdate: () => {
            el.textContent = `+${Math.round(counter.val)}`;
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      id="about"
      ref={root}
      className="bg-[#010101] px-[var(--pad)] py-[var(--section-y)]"
    >
      <div className="mx-auto flex w-full max-w-[1408px] flex-col gap-10">
        {showHeader ? <SectionHeader left="ABOUT US" /> : null}

        <div className="about-reveal grid items-stretch gap-4 lg:grid-cols-[minmax(0,697px)_minmax(0,1fr)] lg:gap-[17px]">
          <div className="flex flex-col justify-between gap-16 rounded-3xl border border-[#565656] p-6 sm:p-10 lg:min-h-[722px]">
            <div className="flex flex-col gap-10">
              <p className="text-[clamp(1.25rem,2.5vw,2rem)] font-normal leading-[1.5] tracking-[-0.02em] text-white">
                Established in 2023, Whyte Films is a creative media agency
                built for the fitness industry. We produce premium content that
                grows and enhances the presence of athletes, influencers and
                brands.
              </p>
              <div>
                <Button href="/work" variant="outline">
                  View our work
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 text-white sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col rounded-2xl bg-[#1b1b1b] p-4"
                >
                  <p
                    className="stat-count text-[clamp(1.5rem,2.5vw,2rem)] font-black leading-[1.5] tabular-nums"
                    data-target={stat.value}
                  >
                    +0
                  </p>
                  <p className="text-sm font-medium sm:text-base">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-3xl lg:min-h-[722px]">
            <Image
              src="/assets/about/main.jpg"
              alt="Whyte Films — fitness content"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        <div className="about-reveal grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <article
              key={category.label}
              className="relative flex h-[320px] flex-col justify-end overflow-hidden rounded-3xl border border-[#6e6e6e] p-6 md:h-[445px]"
            >
              <Image
                src={category.src}
                alt={category.label}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-black"
                aria-hidden
              />
              <p className="relative text-[clamp(1.5rem,2.5vw,2rem)] font-medium leading-[1.5] tracking-[-0.02em] text-white">
                {category.label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
