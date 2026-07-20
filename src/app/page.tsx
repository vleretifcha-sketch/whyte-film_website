import { Navbar } from "@/components/Navbar";
import { BottomProgressiveBlur } from "@/components/BottomProgressiveBlur";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { Statement } from "@/components/Statement";
import { Services } from "@/components/Services";
import { Partners } from "@/components/Partners";
import { Feedback } from "@/components/Feedback";
import { Cta } from "@/components/Cta";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <BottomProgressiveBlur />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Statement />
        <Services />
        <Partners />
        <Feedback />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
