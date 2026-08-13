"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ProgressiveBlur } from "./NavProgressiveBlur";
import { useIsLightTheme } from "@/hooks/useIsLightTheme";

/** Bottom blur — hidden while the footer is on screen, or on light / packages pages. */
export function BottomProgressiveBlur() {
  const light = useIsLightTheme();
  const pathname = usePathname();
  const [inFooter, setInFooter] = useState(false);
  const hideOnPage =
    light || pathname === "/packages" || pathname.startsWith("/packages/");

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

  if (hideOnPage || inFooter) return null;

  return <ProgressiveBlur edge="bottom" />;
}
