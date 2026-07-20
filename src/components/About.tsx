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
  { value: 50, label: "Brands partnered" },
];

const photos = [
  { src: "/assets/about-1.jpg", className: "left-0 top-0", strength: 18 },
  {
    src: "/assets/about-2.jpg",
    className: "left-[36%] top-[33%]",
    strength: 28,
  },
  { src: "/assets/about-3.jpg", className: "left-0 top-[67%]", strength: 14 },
  { src: "/assets/about-4.jpg", className: "left-[69%] top-0", strength: 22 },
];

export function About({ showHeader = true }: { showHeader?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
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

      const collage = collageRef.current;
      if (!collage) return;

      const items = gsap.utils.toArray<HTMLElement>(".about-photo", collage);
      const inners = gsap.utils.toArray<HTMLElement>(
        ".about-photo-inner",
        collage,
      );
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // Exit: one-by-one upward once "Established" hits mid-viewport
      const established = root.current?.querySelector(".about-established");
      if (!reduced && inners.length && established) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: established,
              start: "center center",
              endTrigger: collage,
              end: "bottom top",
              scrub: 0.65,
            },
          })
          .to(inners, {
            yPercent: -130,
            opacity: 0,
            stagger: 0.18,
            ease: "power2.in",
          });
      }

      if (reduced || !contextSafe) return;

      const onMove = contextSafe((event: MouseEvent) => {
        const rect = collage.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        items.forEach((item) => {
          const strength = Number(item.dataset.strength) || 16;
          gsap.to(item, {
            x: x * strength,
            y: y * strength,
            duration: 0.55,
            ease: "power3.out",
            overwrite: "auto",
          });
        });
      });

      const onLeave = contextSafe(() => {
        gsap.to(items, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          overwrite: "auto",
        });
      });

      collage.addEventListener("mousemove", onMove);
      collage.addEventListener("mouseleave", onLeave);

      return () => {
        collage.removeEventListener("mousemove", onMove);
        collage.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: root },
  );

  return (
    <section
      id="about"
      ref={root}
      className="px-[var(--pad)] py-[var(--section-y)]"
    >
      <div className="mx-auto grid max-w-[1408px] items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,554px)] lg:gap-[clamp(2rem,8vw,10rem)]">
        <div className="flex flex-col gap-16 lg:gap-64">
          <div className="flex flex-col gap-10">
            {showHeader ? <SectionHeader left="ABOUT US" /> : null}
            <div className="about-reveal flex flex-col gap-10">
              <p className="max-w-[697px] text-[clamp(1.25rem,2.5vw,2rem)] font-normal leading-[1.5] tracking-[-0.02em] text-white">
                <span className="about-established">Established</span> in 2023,
                Whyte Films is a creative media agency built for the fitness
                industry. We produce premium content that grows and enhances the
                presence of athletes, influencers and brands.
              </p>
              <div>
                <Button href="/work" variant="outline">
                  View our work
                </Button>
              </div>
            </div>
          </div>

          <div className="about-reveal grid grid-cols-3 gap-6 text-white sm:gap-10">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <p
                  className="stat-count text-[clamp(1.5rem,2.5vw,2rem)] font-black leading-[1.5] tabular-nums"
                  data-target={stat.value}
                >
                  +0
                </p>
                <p className="text-sm font-medium sm:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={collageRef}
          className="about-reveal relative mx-auto aspect-[554/712] w-full max-w-[554px]"
        >
          {photos.map((photo) => (
            <div
              key={photo.src + photo.className}
              className={`about-photo absolute h-[33%] w-[31%] will-change-transform overflow-hidden rounded ${photo.className}`}
              data-strength={photo.strength}
            >
              <div className="about-photo-inner absolute inset-0 will-change-transform">
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="170px"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
