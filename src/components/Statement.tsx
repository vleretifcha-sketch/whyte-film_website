"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const phrases = [
  [
    ["Your", "Journey"],
    ["Deserves", "More", "Than"],
    ["JUST", "Content."],
  ],
  [
    ["Built", "To"],
    ["Capture", "True"],
    ["GREATNESS."],
  ],
  [
    ["Every", "Brand"],
    ["Has", "A"],
    ["STORY."],
  ],
] as const;

const phraseKeys = ["a", "b", "c"] as const;

function splitWord(word: string) {
  return word.split("").map((char, i) => ({
    char: char === " " ? "\u00A0" : char,
    key: `${word}-${i}-${char}`,
  }));
}

function Phrase({
  lines,
  letterClass,
  wordClass,
  hidden,
}: {
  lines: readonly (readonly string[])[];
  letterClass: string;
  wordClass: string;
  hidden?: boolean;
}) {
  return (
    <h2
      className={`text-[clamp(2.5rem,8vw,7rem)] font-black uppercase leading-none tracking-[-0.04em] ${
        hidden ? "pointer-events-none absolute inset-x-0 top-0" : "relative"
      }`}
      aria-hidden={hidden || undefined}
    >
      {lines.map((line) => (
        <span
          key={line.join("-")}
          className="mb-[0.08em] flex flex-wrap justify-center gap-x-[0.28em] last:mb-0"
        >
          {line.map((word) => (
            <span
              key={word}
              className="inline-block overflow-hidden pb-[0.08em] [perspective:900px]"
            >
              <span className={`${wordClass} inline-flex will-change-transform`}>
                {splitWord(word).map(({ char, key }) => (
                  <span
                    key={key}
                    className={`${letterClass} inline-block origin-center will-change-transform`}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </span>
      ))}
    </h2>
  );
}

export function Statement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const wordsA = gsap.utils.toArray<HTMLElement>(
        ".statement-word-a",
        section,
      );
      const letters = phraseKeys.map((key) =>
        gsap.utils.toArray<HTMLElement>(`.statement-letter-${key}`, section),
      );
      const phraseEls = phraseKeys
        .slice(1)
        .map((key) => section.querySelector(`.statement-phrase-${key}`));
      const eyebrow = section.querySelector(".statement-eyebrow");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([wordsA, eyebrow, ...letters.flat(), ...phraseEls], {
          clearProps: "all",
          opacity: 1,
          yPercent: 0,
          rotateX: 0,
        });
        return;
      }

      gsap.set(wordsA, { yPercent: 115, opacity: 0 });
      gsap.set(eyebrow, { opacity: 0, y: 16 });
      gsap.set(letters[0], { rotateX: 0, transformPerspective: 900 });
      letters.slice(1).forEach((group) => {
        gsap.set(group, {
          rotateX: 95,
          opacity: 0,
          transformPerspective: 900,
        });
      });
      gsap.set(phraseEls, { opacity: 1 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=320%",
          scrub: 0.65,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 1) Eyebrow + first phrase word reveal
      tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.35 }, 0).to(
        wordsA,
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.45,
        },
        0.15,
      );

      // 2) Flip A → B → C
      for (let i = 0; i < letters.length - 1; i++) {
        tl.to({}, { duration: 0.35 })
          .to(
            letters[i],
            {
              rotateX: -95,
              opacity: 0,
              stagger: 0.018,
              duration: 0.55,
            },
            ">",
          )
          .to(
            letters[i + 1],
            {
              rotateX: 0,
              opacity: 1,
              stagger: 0.018,
              duration: 0.55,
            },
            "<0.2",
          );
      }
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
        <div className="relative w-full">
          {phrases.map((lines, index) => {
            const key = phraseKeys[index];
            const phrase = (
              <Phrase
                lines={lines}
                wordClass={`statement-word-${key}`}
                letterClass={`statement-letter-${key}`}
                hidden={index > 0}
              />
            );

            if (index === 0) return <div key={key}>{phrase}</div>;

            return (
              <div key={key} className={`statement-phrase-${key}`}>
                {phrase}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
