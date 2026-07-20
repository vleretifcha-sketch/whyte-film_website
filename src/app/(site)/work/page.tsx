import type { Metadata } from "next";
import { WorkGallery } from "@/components/WorkGallery";
import { Cta } from "@/components/Cta";

export const metadata: Metadata = {
  title: "Work — Whyte Films",
};

export default function WorkPage() {
  return (
    <>
      <WorkGallery />
      <Cta />
    </>
  );
}
