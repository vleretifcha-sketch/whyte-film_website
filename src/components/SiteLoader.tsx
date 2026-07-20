"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const MIN_MS = 4500;
const STORAGE_KEY = "whyte-films-loaded";

function shouldSkipLoader() {
  if (typeof window === "undefined") return false;
  if (sessionStorage.getItem(STORAGE_KEY) === "1") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function SiteLoader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useLayoutEffect(() => {
    if (shouldSkipLoader()) {
      setDone(true);
      return;
    }
    document.documentElement.classList.add("is-site-loading");
  }, []);

  useGSAP(
    () => {
      if (shouldSkipLoader()) return;

      const root = rootRef.current;
      const row = rowRef.current;
      const bar = progressBarRef.current;
      const percent = percentRef.current;
      if (!root || !row || !bar || !percent) return;

      const state = { p: 0, reveal: 0 };
      const maxHole = () =>
        Math.hypot(window.innerWidth, window.innerHeight) * 0.55;

      root.style.setProperty("--reveal", "0px");
      gsap.set(bar, { width: "0%" });

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem(STORAGE_KEY, "1");
          document.documentElement.classList.remove("is-site-loading");
          setDone(true);
        },
      });

      tl.to(state, {
        p: 100,
        duration: MIN_MS / 1000,
        ease: "power2.out",
        onUpdate: () => {
          const value = Math.round(state.p);
          bar.style.width = `${value}%`;
          percent.textContent = `${value}%`;
        },
      })
        .to(
          row,
          {
            opacity: 0,
            duration: 0.35,
            ease: "power2.in",
          },
          "+=0.05",
        )
        .to(
          state,
          {
            reveal: maxHole(),
            duration: 1.15,
            ease: "power3.inOut",
            onUpdate: () => {
              root.style.setProperty("--reveal", `${state.reveal}px`);
            },
          },
          "-=0.1",
        );

      return () => {
        document.documentElement.classList.remove("is-site-loading");
      };
    },
    { scope: rootRef },
  );

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="site-loader"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div ref={rowRef} className="site-loader__row">
        <div className="site-loader__line">
          <div className="site-loader__dots" aria-hidden />
          <div ref={progressBarRef} className="site-loader__progress" />
          <p className="site-loader__label">
            Loading <span ref={percentRef}>0%</span>
          </p>
        </div>

        <div className="site-loader__rec" aria-hidden>
          <span className="site-loader__rec-glow" />
          <span className="site-loader__rec-dot" />
          <span className="site-loader__rec-text">REC</span>
        </div>
      </div>
    </div>
  );
}
