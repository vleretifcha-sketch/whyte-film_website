import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { BottomProgressiveBlur } from "./BottomProgressiveBlur";
import { Footer } from "./Footer";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <BottomProgressiveBlur />
      <main className="min-h-[60svh]">{children}</main>
      <Footer />
    </>
  );
}
