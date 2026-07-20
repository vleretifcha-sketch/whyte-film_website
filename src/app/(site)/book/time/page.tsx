import type { Metadata } from "next";
import { TimeStep } from "@/components/booking/TimeStep";

export const metadata: Metadata = {
  title: "Time — Book — Whyte Films",
};

export default function BookTimePage() {
  return <TimeStep />;
}
