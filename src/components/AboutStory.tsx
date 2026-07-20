import Image from "next/image";
import { SectionHeader } from "./SectionHeader";

const paragraphs = [
  "Established in 2023. Whyte Films was the brainchild of freelance fitness videographer Bayley Whyte and long-time friend Ben Warhurst.",
  "A creative media agency built for the fitness industry, Bayley and his growing team produce premium content that grows and enhances the presence of fitness influencers and their brands.",
  "Whyte Films works with the likes of Anytime Fitness, Muscle Nation, Elite Supplements, Primabolics, BFT, Day1Performance, Superior Formulations & Greenstreat Australia.",
];

export function AboutStory() {
  return (
    <section className="bg-[#010101] px-[var(--pad)] pb-[var(--section-y)] pt-28 md:pt-32">
      <div className="mx-auto flex w-full max-w-[1408px] flex-col gap-12 md:gap-16">
        <SectionHeader left="ABOUT US" />

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          <div className="flex flex-col gap-8 md:gap-10">
            <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] font-medium leading-[0.95] tracking-[-0.03em] text-white">
              Established &apos;23
            </h1>
            <div className="flex max-w-[520px] flex-col gap-5 text-base leading-[1.6] text-white/75 md:text-lg">
              {paragraphs.map((text) => (
                <p key={text.slice(0, 32)}>{text}</p>
              ))}
            </div>
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl md:aspect-[5/6]">
            <Image
              src="/assets/about-founders.jpg"
              alt="Bayley Whyte and Ben Warhurst"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
