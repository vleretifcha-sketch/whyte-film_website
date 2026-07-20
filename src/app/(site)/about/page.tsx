import type { Metadata } from "next";
import { About } from "@/components/About";

export const metadata: Metadata = {
  title: "About — Whyte Films",
};

export default function AboutPage() {
  return (
    <div className="pt-16 md:pt-20">
      <About />
    </div>
  );
}
