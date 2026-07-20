import type { Metadata } from "next";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact — Whyte Films",
  description: "Get in touch with Whyte Films — management@whytefilms.com.au",
};

export default function ContactPage() {
  return <Contact />;
}
