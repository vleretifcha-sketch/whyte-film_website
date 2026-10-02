"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { formatAud, getPackage } from "@/lib/booking";
import { Button } from "./ui/Button";
import { ArrowUpRight } from "./icons/ArrowUpRight";

const HERO_VIDEO = "/assets/hero.mp4?v=landscape-ad";

gsap.registerPlugin(useGSAP);

const WORDS = [
  {
    src: "/assets/logo-word-whyte.svg",
    alt: "whyte",
    width: 576,
    height: 159,
    flex: "55%",
  },
  {
    src: "/assets/logo-word-films.svg",
    alt: "films",
    width: 433,
    height: 159,
    flex: "41%",
  },
] as const;

const ROTATING_WORDS = [
  "Greatness.",
  "Success.",
  "Progress.",
  "Award.",
] as const;

const ROTATE_WIDEST = "Greatness.";

const FLEX_PACKAGE = getPackage("flex")!;

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const rotateRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [wordmarkLit, setWordmarkLit] = useState(false);
  const [wordmarkSpot, setWordmarkSpot] = useState({ x: "50%", y: "50%" });

  const onWordmarkMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setWordmarkSpot({
      x: `${event.clientX - rect.left}px`,
      y: `${event.clientY - rect.top}px`,
    });
    setWordmarkLit(true);
  }, []);

  const onWordmarkLeave = useCallback(() => {
    setWordmarkLit(false);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Safari shows its native player when a video has audio or the muted
    // attribute is missing at first paint. Force a silent inline loop.
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "true");
    video.controls = false;
    video.removeAttribute("controls");
    video.disablePictureInPicture = true;

    const tryPlay = () => {
      if (!video.paused) return;
      const play = video.play();
      if (play !== undefined) play.catch(() => {});
    };

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("pause", tryPlay);

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("pause", tryPlay);
    };
  }, []);

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>(".hero-word");
      const inks = gsap.utils.toArray<HTMLElement>(".hero-word-ink");
      const rotating = rotateRef.current
        ? Array.from(
            rotateRef.current.querySelectorAll<HTMLElement>(".hero-rotate-word"),
          )
        : [];
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) {
        gsap.set([words, inks], { yPercent: 0 });
      } else {
        // Clip + translate only — never opacity: 0 on wordmark
        gsap.set([words, inks], { yPercent: 115 });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        words.forEach((word, i) => {
          tl.to(
            [word, inks[i]].filter(Boolean),
            { yPercent: 0, duration: 1.05 },
            i * 0.18,
          );
        });
        tl.from(
          ".hero-copy-block",
          { opacity: 0, y: 28, duration: 0.8, stagger: 0.12 },
          "-=0.45",
        ).from(".hero-card", { opacity: 0, y: 24, duration: 0.7 }, "-=0.4");
      }

      if (rotating.length < 2) return;

      gsap.set(rotating, { yPercent: 100, opacity: 0 });
      gsap.set(rotating[0], { yPercent: 0, opacity: 1 });

      let index = 0;
      const hold = 1.8;
      const dur = 0.55;

      const swap = () => {
        const current = rotating[index];
        const next = rotating[(index + 1) % rotating.length];

        gsap
          .timeline({
            onComplete: () => {
              index = (index + 1) % rotating.length;
              gsap.delayedCall(hold, swap);
            },
          })
          .to(current, {
            yPercent: -105,
            opacity: 0,
            duration: dur,
            ease: "power3.inOut",
          })
          .fromTo(
            next,
            { yPercent: 105, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: dur,
              ease: "power3.inOut",
            },
            0,
          );
      };

      gsap.delayedCall(reduced ? hold : hold + 0.6, swap);
    },
    { scope: root },
  );

  return (
    <section
      id="home"
      ref={root}
      className="relative flex min-h-[100svh] flex-col justify-end px-[var(--pad)] pb-16 pt-28 md:pb-24 md:pt-32"
    >
      <div className="absolute inset-0 overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="hero-video pointer-events-none absolute inset-0 h-full w-full object-cover"
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/hero.jpg"
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          aria-hidden
        />
        {/* Black overlay + bottom fade for copy readability */}
        <div className="pointer-events-none absolute inset-0 bg-black/60" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[65%] to-black" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1408px] flex-col gap-16 md:gap-[min(18vw,296px)]">
        <h1 className="sr-only">whyte films</h1>
        <div
          aria-hidden
          className={`hero-wordmark relative w-full max-w-[1049px] ${
            wordmarkLit ? "is-lit" : ""
          }`}
          style={
            {
              "--mx": wordmarkSpot.x,
              "--my": wordmarkSpot.y,
            } as CSSProperties
          }
          onMouseMove={onWordmarkMove}
          onMouseEnter={onWordmarkMove}
          onMouseLeave={onWordmarkLeave}
        >
          <div className="hero-wordmark__base flex w-full items-end gap-[3.8%]">
            {WORDS.map((word) => (
              <span
                key={word.alt}
                className="inline-block overflow-hidden"
                style={{ flex: `0 1 ${word.flex}` }}
              >
                <span className="hero-word block will-change-transform">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={word.src}
                    alt=""
                    width={word.width}
                    height={word.height}
                    className="h-auto w-full"
                  />
                </span>
              </span>
            ))}
          </div>

          {/* Solid black under cursor */}
          <div className="hero-wordmark__fill" aria-hidden>
            <div className="flex w-full items-end gap-[3.8%]">
              {WORDS.map((word) => (
                <span
                  key={`ink-${word.alt}`}
                  className="inline-block overflow-hidden"
                  style={{ flex: `0 1 ${word.flex}` }}
                >
                  <span
                    className="hero-word-ink block will-change-transform"
                    style={
                      {
                        aspectRatio: `${word.width} / ${word.height}`,
                        WebkitMaskImage: `url(${word.src})`,
                        maskImage: `url(${word.src})`,
                        WebkitMaskSize: "100% 100%",
                        maskSize: "100% 100%",
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                      } as CSSProperties
                    }
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-stretch justify-between gap-10 lg:flex-row lg:items-end">
          <div className="hero-copy flex w-full max-w-[555px] flex-col gap-10">
            <div className="hero-copy-block flex flex-col gap-4">
              <p className="text-[clamp(1.75rem,4vw,2.5rem)] font-medium leading-none text-white">
                <span className="text-white/40">Built to Capture</span>{" "}
                <span
                  ref={rotateRef}
                  className="hero-rotate relative inline-block h-[1em] overflow-hidden align-bottom"
                  aria-live="polite"
                >
                  <span className="invisible whitespace-nowrap" aria-hidden>
                    {ROTATE_WIDEST}
                  </span>
                  {ROTATING_WORDS.map((word) => (
                    <span
                      key={word}
                      className="hero-rotate-word absolute inset-x-0 top-0 block whitespace-nowrap will-change-transform"
                    >
                      {word}
                    </span>
                  ))}
                </span>
              </p>
              <p className="text-lg font-medium leading-normal text-white">
                Every brand and athlete has a story. We bring yours to life
                through powerful visuals that capture the passion, discipline
                and emotion behind every performance.
              </p>
            </div>
            <div className="hero-copy-block">
              <Button href="/packages">Book Now</Button>
            </div>
          </div>

          <Link
            href={`/book/addons?package=${FLEX_PACKAGE.id}`}
            className="hero-card flex w-[min(100%,340px)] gap-4 rounded-2xl border border-white/15 bg-white/15 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl backdrop-saturate-150 transition-[transform,background-color] duration-300 hover:scale-[1.02] hover:bg-white/20 supports-[backdrop-filter]:bg-white/10"
            aria-label={`Book ${FLEX_PACKAGE.name} package — most popular`}
          >
            <div className="flex min-w-0 flex-1 gap-4">
              <div className="relative size-[72px] shrink-0 overflow-hidden rounded-xl">
                <Image
                  src="/assets/service-1.jpg"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <span className="inline-flex w-fit items-center rounded-lg border border-white/25 bg-white/10 px-2.5 py-1 text-[11px] font-semibold normal-case tracking-normal text-white/90">
                  Most Popular
                </span>
                <div>
                  <p className="text-lg font-bold text-white">
                    {FLEX_PACKAGE.name} Package
                  </p>
                  <p className="text-sm font-medium text-white/60">
                    {FLEX_PACKAGE.durationLabel} · {formatAud(FLEX_PACKAGE.price)}
                  </p>
                </div>
              </div>
            </div>

            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#010101]">
              <ArrowUpRight color="#010101" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
