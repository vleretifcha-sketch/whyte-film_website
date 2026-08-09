import Image from "next/image";
import { SectionHeader } from "./SectionHeader";
import { Button } from "./ui/Button";

const moments = [
  {
    src: "/assets/about/extras.jpg",
    alt: "Celebratory moment outdoors",
    label: "The day",
  },
  {
    src: "/assets/about/products.jpg",
    alt: "Detail stills",
    label: "Details",
  },
  {
    src: "/assets/workshop-visual.png",
    alt: "Gathered guests",
    label: "People",
  },
] as const;

export function Wedding() {
  return (
    <section className="bg-[#f6f6f6] px-[var(--pad)] pb-[var(--section-y)] pt-28 text-[#010101] md:pt-32">
      <div className="mx-auto flex w-full max-w-[1408px] flex-col gap-12 md:gap-16">
        <SectionHeader
          left="WEDDING"
          right="FILM & PHOTO"
          className="!border-[#010101] !text-[#010101]"
        />

        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <div className="flex flex-col gap-8">
            <h1 className="font-display text-[clamp(2.75rem,7vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
              Weddings,
              <br />
              captured with care
            </h1>
            <p className="max-w-[520px] text-base leading-relaxed text-[#010101]/70 md:text-lg">
              Cinematic photo and film for your day — honest moments, clean
              storytelling, and a calm presence so you can stay in the room.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/contact">Enquire</Button>
              <Button href="/work" variant="outline-dark">
                View our work
              </Button>
            </div>
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-white">
            <Image
              src="/assets/about/main.jpg"
              alt="Whyte Films wedding storytelling"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {moments.map((moment) => (
            <article
              key={moment.label}
              className="relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-3xl border border-[#010101]/10 p-5"
            >
              <Image
                src={moment.src}
                alt={moment.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/55"
                aria-hidden
              />
              <p className="relative text-lg font-medium text-white">
                {moment.label}
              </p>
            </article>
          ))}
        </div>

        <div className="flex flex-col gap-6 border-t border-[#010101]/15 pt-10 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[480px] text-base leading-relaxed text-[#010101]/70 md:text-lg">
            Looking for a wedding package or a full-day film? Tell us the date,
            venue and the feeling you want — we’ll shape the coverage around it.
          </p>
          <Button href="/contact" variant="outline-dark">
            Start the conversation
          </Button>
        </div>
      </div>
    </section>
  );
}
