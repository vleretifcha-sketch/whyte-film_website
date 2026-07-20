"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "./ui/Button";
import { SectionHeader } from "./SectionHeader";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const services = [
  {
    name: "PHOTOGRAPHY",
    description:
      "Cinematic stills that capture physique, product and brand energy — crafted for campaigns, socials and packaging.",
    image: "/assets/about-4.jpg",
  },
  {
    name: "VIDEOS",
    description:
      "High-impact film for launches, athlete stories and brand films — paced for feed, ads and long-form.",
    image: "/assets/about-1.jpg",
  },
  {
    name: "EDITING/POST-PROD",
    description:
      "Color, cut and sound designed to feel premium — consistent across every deliverable.",
    image: "/assets/about-3.jpg",
  },
  {
    name: "WORKSHOPS",
    description:
      "Hands-on sessions for creators and teams who want to raise the bar on fitness content.",
    image: "/assets/service-2.jpg",
  },
];

function ServiceVisual({
  image,
  priority = false,
}: {
  image: string;
  priority?: boolean;
}) {
  return (
    <div className="relative h-[55vh] w-full overflow-hidden rounded lg:h-[calc(100svh-6rem)]">
      <Image
        src={image}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 697px"
        priority={priority}
      />
    </div>
  );
}

export function Services() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(
          ".service-panel",
          section,
        );
        if (!panels.length) return;

        const triggers = panels.map((panel, index) =>
          ScrollTrigger.create({
            trigger: panel,
            start: "top center",
            end: "bottom center",
            onEnter: () => {
              if (activeRef.current !== index) {
                activeRef.current = index;
                setActive(index);
              }
            },
            onEnterBack: () => {
              if (activeRef.current !== index) {
                activeRef.current = index;
                setActive(index);
              }
            },
          }),
        );

        return () => {
          triggers.forEach((st) => st.kill());
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const goToService = (index: number) => {
    setActive(index);
    activeRef.current = index;

    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    const panel = root.current?.querySelector<HTMLElement>(
      `#service-panel-${index}`,
    );
    if (!panel) return;

    const top = panel.getBoundingClientRect().top + window.scrollY - 96;

    if (window.__lenis) {
      window.__lenis.scrollTo(top, { duration: 1.1 });
    } else {
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const current = services[active];

  return (
    <section
      id="services"
      ref={root}
      className="bg-[#010101] px-[var(--pad)] py-10 md:py-14"
    >
      <div className="mx-auto flex w-full max-w-[1408px] flex-col gap-10 md:gap-14">
        <SectionHeader left="SERVICES" />

        <div className="flex flex-col items-start gap-10 lg:flex-row lg:gap-4">
          <div className="flex w-full max-w-[697px] flex-col self-start lg:sticky lg:top-24 lg:max-h-[calc(100svh-6rem)]">
            <ul className="flex flex-col gap-6 md:gap-8" role="tablist">
              {services.map((service, index) => {
                const isActive = index === active;
                return (
                  <li key={service.name} role="presentation">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls="service-images"
                      id={`service-tab-${index}`}
                      onClick={() => goToService(index)}
                      className={`flex w-full items-center gap-6 text-left transition-opacity duration-300 ${
                        isActive
                          ? "opacity-100"
                          : "opacity-40 hover:opacity-70"
                      }`}
                    >
                      <span
                        className={`size-3 shrink-0 rounded-full transition-colors duration-300 ${
                          isActive ? "bg-white" : "bg-white/40"
                        }`}
                        aria-hidden
                      />
                      <span className="whitespace-nowrap text-[clamp(1.5rem,3.2vw,2.75rem)] font-black leading-[1.3] text-white">
                        {service.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-[56px] flex max-w-[410px] flex-col gap-4">
              <p
                key={current.name}
                className="text-lg leading-[1.5] tracking-[-0.02em] text-white transition-opacity duration-300"
              >
                {current.description}
              </p>
              <div>
                <Button href="#contact" variant="outline">
                  Book Now
                </Button>
              </div>
            </div>
          </div>

          <div id="work" className="w-full max-w-[697px]">
            {/* Mobile — active tab only */}
            <div
              id="service-images"
              role="tabpanel"
              aria-labelledby={`service-tab-${active}`}
              className="lg:hidden"
            >
              <ServiceVisual key={current.name} image={current.image} priority />
            </div>

            {/* Desktop — one full-height visual per tab */}
            <div className="hidden flex-col gap-6 lg:flex">
              {services.map((service, index) => (
                <div
                  key={service.name}
                  id={`service-panel-${index}`}
                  className="service-panel w-full"
                >
                  <ServiceVisual
                    image={service.image}
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
