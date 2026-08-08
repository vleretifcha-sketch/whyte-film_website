"use client";

import { SectionHeader } from "./SectionHeader";

const testimonials = [
  {
    name: "Eliza Heagney",
    quote:
      "Bayley from Whyte Films is beyond amazing. His knowledge in this field is exceptional. His attention to detail outstanding, and his passion for providing the highest quality work for his clients is remarkable.",
  },
  {
    name: "Phoebe Keir",
    quote:
      "We loved that you directed us, made it fun and pushed us out of our comfort zones to get shots, it was good! It turned out amazing.",
  },
  {
    name: "Morgan Dunham",
    brand: "Anytime Fitness",
    quote:
      "Awesome experience from start to finish! Bayley was great and really easy to work with, he had great ideas and was awesome at making it come to life. We love the video and photos :)",
  },
  {
    name: "Kacey Jackson",
    quote:
      "I absolutely loved my experience working with Bayley. Not only did he create photos and videos that were incredibly authentic and truly represented my personality, but he also made the entire experience such a memorable moment for me. He even incorporated my friends who were there, which made it so much fun. I can't wait to do it again.",
  },
  {
    name: "Charlotte Todros",
    quote:
      "We have a discussion and he is able to turn that idea into something unique and special. Bayley is always professional and makes you feel at ease when working with him.",
  },
  {
    name: "Chris Barnden",
    quote:
      "My shoot with Whyte Films was amazing. I couldn't even cut it down to my 10 favourite shots. Having someone with expert knowledge of bodybuilding poses—how to twist, where to crunch for the best lighting—on top of the high-level photography and videography made it, without a doubt, the best shoot I've ever done!",
  },
] as const;

function TestimonialCard({
  name,
  brand,
  quote,
}: {
  name: string;
  brand?: string;
  quote: string;
}) {
  return (
    <article className="flex h-full w-[min(85vw,380px)] shrink-0 flex-col justify-between gap-10 rounded-2xl bg-[#f6f6f6] p-6 md:w-[420px] md:p-8">
      <p className="text-base leading-[1.5] tracking-[-0.02em] text-[#010101] md:text-lg">
        “{quote}”
      </p>
      <div>
        <p className="text-sm font-bold text-[#010101] md:text-base">{name}</p>
        {brand ? (
          <p className="mt-1 text-sm font-medium text-[#706c6c]">{brand}</p>
        ) : null}
      </div>
    </article>
  );
}

export function Feedback() {
  const sequence = [...testimonials, ...testimonials];

  return (
    <section className="overflow-hidden bg-white py-[var(--section-y)] text-[#010101]">
      <div className="mx-auto flex max-w-[1408px] flex-col gap-10 px-[var(--pad)]">
        <SectionHeader
          left="CLIENTS FEEDBACKS"
          right="2023 - 2026"
          className="!border-[#010101] !text-[#010101]"
        />
      </div>

      <div
        className="feedback-marquee-wrap mt-10"
        aria-label="Client testimonials"
      >
        <div className="feedback-marquee flex w-max items-stretch gap-4 will-change-transform">
          {sequence.map((item, index) => (
            <TestimonialCard
              key={`${item.name}-${index}`}
              name={item.name}
              brand={"brand" in item ? item.brand : undefined}
              quote={item.quote}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
