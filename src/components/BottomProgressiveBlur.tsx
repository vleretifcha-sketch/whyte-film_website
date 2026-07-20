"use client";

import { useEffect, useState } from "react";
import { ProgressiveBlur } from "./NavProgressiveBlur";

/** Bottom blur — hidden while the footer is on screen. */
export function BottomProgressiveBlur() {
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

  if (inFooter) return null;

  return <ProgressiveBlur edge="bottom" />;
}
