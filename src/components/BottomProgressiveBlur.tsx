"use client";

import { useEffect, useState } from "react";
import { ProgressiveBlur } from "./NavProgressiveBlur";
import { useIsLightTheme } from "@/hooks/useIsLightTheme";

/** Bottom blur — hidden while the footer is on screen, or on light pages. */
export function BottomProgressiveBlur() {
  const light = useIsLightTheme();
  const [inFooter, setInFooter] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const io = new IntersectionObserver(
      ([entry]) => setInFooter(entry.isIntersecting),
      { threshold: 0.05 },
    );

    io.observe(footer);
    return () => io.disconnect();
  }, []);

  if (light || inFooter) return null;

  return <ProgressiveBlur edge="bottom" />;
}
