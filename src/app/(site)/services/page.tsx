import type { Metadata } from "next";
import { Services } from "@/components/Services";

export const metadata: Metadata = {
  title: "Services — Whyte Films",
};

export default function ServicesPage() {
  return (
    <div className="pt-16 md:pt-20">
      <Services />
    </div>
  );
}
