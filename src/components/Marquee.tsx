const items = ["Collaborate", "Capture", "Create"];

export function Marquee() {
  const sequence = [...items, ...items, ...items, ...items];

  return (
    <section
      className="overflow-hidden bg-[#010101] py-16 md:py-[66px]"
      aria-label="Collaborate, Capture, Create"
    >
      <div className="marquee-track flex items-center gap-10 whitespace-nowrap">
        {sequence.map((word, i) => (
          <div key={`${word}-${i}`} className="flex items-center gap-10">
            <span className="font-display text-[clamp(2.5rem,6vw,4rem)] font-medium text-white">
              {word}
            </span>
            <span
              className="inline-block size-2 shrink-0 rounded-full bg-white"
              aria-hidden
            />
          </div>
        ))}
      </div>
    </section>
  );
}
