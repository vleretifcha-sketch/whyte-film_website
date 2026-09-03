"use client";

import { usePathname } from "next/navigation";

export function useIsLightTheme() {
  const pathname = usePathname();
  return (
    pathname === "/wedding" ||
    pathname.startsWith("/wedding/") ||
    pathname === "/events" ||
    pathname.startsWith("/events/")
  );
}
