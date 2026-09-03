import type { Metadata } from "next";
import { Events } from "@/components/Events";

export const metadata: Metadata = {
  title: "Events — Whyte Films",
  description:
    "Wedding, brand and private event photo and film by Whyte Films — cinematic storytelling for the days that matter.",
};

export default function EventsPage() {
  return <Events />;
}
