import Image from "next/image";
import { SectionHeader } from "./SectionHeader";
import { Button } from "./ui/Button";

const moments = [
  {
    src: "/assets/about/extras.jpg",
    alt: "Celebratory moment outdoors",
    label: "Weddings",
  },
  {
    src: "/assets/about/products.jpg",
    alt: "Brand activation detail",
    label: "Brand events",
  },
  {
    src: "/assets/workshop-visual.png",
    alt: "Gathered guests",
    label: "Private days",
  },
] as const;

export function Events() {
  return (
    <section className="bg-[#f6f6f6] px-[var(--pad)] pb-[var(--section-y)] pt-28 text-[#010101] md:pt-32">
      <div className="mx-auto flex w-full max-w-[1408px] flex-col gap-12 md:gap-16">
        <SectionHeader
          left="EVENTS"
          right="FILM & PHOTO"
          className="!border-[#010101] !text-[#010101]"
        />

        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <div className="flex flex-col gap-8">
            <h1 className="font-display text-[clamp(2.75rem,7vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
              Events,
              <br />
              filmed with presence
            </h1>
            <p className="max-w-[520px] text-base leading-relaxed text-[#010101]/70 md:text-lg">
              Weddings, brand activations and private celebrations — cinematic
              photo and film with a calm crew so the room stays yours.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/contact">Enquire</Button>
              <Button href="/wedding" variant="outline-dark">
                Wedding coverage
              </Button>
            </div>
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-white">
            <Image
              src="/assets/about/extras-studio.jpg"
              alt="Whyte Films event storytelling"
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
            Planning a wedding or another event? Share the date, venue and the
            feeling you want — we’ll shape photo and film coverage around it.
          </p>
          <Button href="/contact" variant="outline-dark">
            Start the conversation
          </Button>
        </div>
      </div>
    </section>
  );
}
