"use client";

import { useEffect } from "react";
import { useIsLightTheme } from "@/hooks/useIsLightTheme";

/** Syncs document theme class for light pages (e.g. Wedding). */
export function ThemeSync() {
  const light = useIsLightTheme();

  useEffect(() => {
    document.documentElement.classList.toggle("theme-light", light);
    return () => {
      document.documentElement.classList.remove("theme-light");
    };
  }, [light]);

  return null;
}
