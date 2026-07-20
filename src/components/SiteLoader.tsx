"use client";

import { useEffect, useLayoutEffect, useState } from "react";

const MIN_MS = 4500;
const EXIT_MS = 550;
const STORAGE_KEY = "whyte-films-loaded";

function shouldSkipLoader() {
  if (typeof window === "undefined") return false;
  if (sessionStorage.getItem(STORAGE_KEY) === "1") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function SiteLoader() {
  const [phase, setPhase] = useState<"loading" | "exiting" | "done">("loading");
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    if (shouldSkipLoader()) {
      setPhase("done");
      return;
    }
    document.documentElement.classList.add("is-site-loading");
  }, []);

  useEffect(() => {
    if (shouldSkipLoader()) return;

    const started = performance.now();
    let frame = 0;
    let exitTimer = 0;

    const tick = (now: number) => {
      const elapsed = now - started;
      const t = Math.min(elapsed / MIN_MS, 1);
      const eased = 1 - (1 - t) ** 2.4;
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }

      sessionStorage.setItem(STORAGE_KEY, "1");
      setPhase("exiting");
      exitTimer = window.setTimeout(() => {
        setPhase("done");
        document.documentElement.classList.remove("is-site-loading");
      }, EXIT_MS);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(exitTimer);
      document.documentElement.classList.remove("is-site-loading");
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`site-loader${phase === "exiting" ? " is-exiting" : ""}`}
      role="status"
      aria-live="polite"
      aria-busy={phase === "loading"}
    >
      <div className="site-loader__row">
        <div className="site-loader__line">
          <div className="site-loader__dots" aria-hidden />
          <div
            className="site-loader__progress"
            style={{ width: `${progress}%` }}
          />
          <p className="site-loader__label">
            Loading <span>{progress}%</span>
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
