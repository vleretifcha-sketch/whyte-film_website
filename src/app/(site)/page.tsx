import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { Statement } from "@/components/Statement";
import { Services } from "@/components/Services";
import { Partners } from "@/components/Partners";
import { Feedback } from "@/components/Feedback";
import { Cta } from "@/components/Cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Statement />
      <Services />
      <Partners />
      <Feedback />
      <Cta />
    </>
  );
}
