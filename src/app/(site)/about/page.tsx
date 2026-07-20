import type { Metadata } from "next";
import { AboutStory } from "@/components/AboutStory";
import { About } from "@/components/About";

export const metadata: Metadata = {
  title: "About — Whyte Films",
};

export default function AboutPage() {
  return (
    <>
      <AboutStory />
      <About showHeader={false} />
    </>
  );
}
