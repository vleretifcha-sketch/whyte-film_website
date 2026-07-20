"use client";

import Image from "next/image";
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
import { Button } from "./ui/Button";
import { ArrowUpRight } from "./icons/ArrowUpRight";

const HERO_VIDEO = "/assets/hero.mp4";

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

const TEAM = [
  {
    name: "Bayley Whyte",
    role: "Photographer - Videomaker",
    image: "/assets/team.jpg",
  },
  {
    name: "Ben Warhurst",
    role: "Co-Founder / VideoMaker",
    image: "/assets/team-ben.jpg",
  },
] as const;

function TeamCardContent({ member }: { member: (typeof TEAM)[number] }) {
  return (
    <div className="flex h-full w-full gap-4">
      <div className="relative h-[108px] w-[85px] shrink-0 overflow-hidden rounded-xl">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover"
          sizes="85px"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <p className="text-sm font-medium text-white/60">Team</p>
        <div>
          <p className="text-lg font-bold text-white">{member.name}</p>
          <p className="text-sm font-medium text-white/60">{member.role}</p>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const rotateRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [teamIndex, setTeamIndex] = useState(0);
  const [teamTick, setTeamTick] = useState(0);
  const [wordmarkLit, setWordmarkLit] = useState(false);
  const [wordmarkSpot, setWordmarkSpot] = useState({ x: "50%", y: "50%" });

  const selectTeam = (index: number) => {
    setTeamIndex(index);
    setTeamTick((t) => t + 1);
  };

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
    const id = window.setInterval(() => {
      setTeamIndex((prev) => (prev + 1) % TEAM.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [teamTick]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const tryPlay = () => {
      const play = video.play();
      if (play !== undefined) {
        play.catch(() => {
          // Autoplay blocked — retry on first interaction
        });
      }
    };

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);

    const unlock = () => tryPlay();
    window.addEventListener("touchstart", unlock, { once: true });
    window.addEventListener("click", unlock, { once: true });

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("click", unlock);
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
          className="absolute inset-0 h-full w-full object-cover"
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/hero.jpg"
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

          <div
            className="hero-card flex w-[min(100%,340px)] gap-4 rounded-2xl border border-white/15 bg-white/15 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/10"
            role="group"
            aria-roledescription="carousel"
            aria-label="Team"
          >
            <div
              className="relative h-[108px] min-w-0 flex-1 overflow-hidden [perspective:900px]"
              aria-live="polite"
            >
              {TEAM.map((person, index) => {
                const isActive = index === teamIndex;
                return (
                  <div
                    key={person.name}
                    className="absolute inset-0 origin-center transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none [backface-visibility:hidden]"
                    style={{
                      transform: isActive
                        ? "rotateX(0deg)"
                        : "rotateX(85deg)",
                      opacity: isActive ? 1 : 0,
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                    aria-hidden={!isActive}
                  >
                    <TeamCardContent member={person} />
                  </div>
                );
              })}
            </div>

            <div className="flex shrink-0 flex-col items-end justify-between">
              <a
                href="/about"
                className="flex size-12 items-center justify-center rounded-xl !bg-white !text-[#010101] transition-transform hover:scale-105"
                aria-label={`About ${TEAM[teamIndex].name}`}
              >
                <ArrowUpRight color="#010101" />
              </a>
              <div
                className="flex items-end gap-1"
                role="tablist"
                aria-label="Team members"
              >
                {TEAM.map((person, index) => {
                  const isActive = index === teamIndex;
                  return (
                    <button
                      key={person.name}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={person.name}
                      onClick={() => selectTeam(index)}
                      className="flex h-6 w-3 items-end justify-center"
                    >
                      <span
                        className={`block h-4 w-0.5 rounded-full ${
                          isActive ? "bg-white" : "bg-white/45"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
