import type { Metadata } from "next";
import { Feedback } from "@/components/Feedback";
import { Partners } from "@/components/Partners";

export const metadata: Metadata = {
  title: "Work — Whyte Films",
};

export default function WorkPage() {
  return (
    <>
      <div className="pt-20" />
      <Feedback />
      <Partners />
    </>
  );
}
