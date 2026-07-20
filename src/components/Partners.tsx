const PARTNERS = Array.from({ length: 5 }, (_, i) => ({
  id: `partner-${i + 1}`,
}));

function PartnerSlot({ id }: { id: string }) {
  return (
    <div
      className="h-[120px] w-[min(42vw,260px)] shrink-0 rounded-2xl bg-[#1e1e1e] md:h-[154px] md:w-[280px]"
      aria-hidden
      data-partner={id}
    />
  );
}

export function Partners() {
  const sequence = [...PARTNERS, ...PARTNERS];

  return (
    <section className="overflow-hidden pb-[var(--section-y)] pt-2">
      <div className="mx-auto flex max-w-[1408px] flex-col gap-10 px-[var(--pad)]">
        <div className="flex items-center justify-between border-b border-white pb-6 text-base font-bold text-white">
          <span>PARTNERS</span>
          <span>©2023</span>
        </div>

        <p className="max-w-full text-right text-[clamp(1.25rem,2.5vw,2rem)] font-normal leading-[1.5] tracking-[-0.02em] text-white">
          Partnering with visionary brands
          <br />
          to create meaningful and lasting impact.
        </p>
      </div>

      <div
        className="mt-10"
        aria-label="Partner logos"
      >
        <div className="partners-marquee flex w-max items-center gap-4 will-change-transform">
          {sequence.map((partner, i) => (
            <PartnerSlot key={`${partner.id}-${i}`} id={partner.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
