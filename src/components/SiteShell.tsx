import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { BottomProgressiveBlur } from "./BottomProgressiveBlur";
import { CustomCursor } from "./CustomCursor";
import { PageTransition } from "./PageTransition";
import { SiteLoader } from "./SiteLoader";
import { Footer } from "./Footer";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <PageTransition>
      <SiteLoader />
      <CustomCursor />
      <Navbar />
      <BottomProgressiveBlur />
      <main className="min-h-[60svh]">{children}</main>
      <Footer />
    </PageTransition>
  );
}
