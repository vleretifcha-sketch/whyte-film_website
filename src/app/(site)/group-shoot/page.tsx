import type { Metadata } from "next";
import { GroupShoot } from "@/components/GroupShoot";

export const metadata: Metadata = {
  title: "Group Shoot — Whyte Films",
  description:
    "Register for the next Whyte Films group shoot. Saturday 21 November 2026, 8:00am–9:30am at OneGym Flemington, Melbourne.",
};

export default function GroupShootPage() {
  return <GroupShoot />;
}
