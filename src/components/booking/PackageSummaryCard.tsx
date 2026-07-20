import {
  formatAud,
  type BookingAddon,
  type BookingPackage,
} from "@/lib/booking";

type Props = {
  pkg: BookingPackage;
  addons?: BookingAddon[];
  dateLabel?: string | null;
};

export function PackageSummaryCard({ pkg, addons = [], dateLabel }: Props) {
  return (
    <aside className="flex flex-col gap-4">
      {/* Mobile: collapsible summary */}
      <details className="overflow-hidden rounded-2xl border border-white/20 bg-white/[0.04] lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-white px-4 py-3 text-[#010101] [&::-webkit-details-marker]:hidden">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em]">
              Whyte Films
            </p>
            <p className="font-display truncate text-xl font-medium tracking-[-0.02em]">
              {pkg.name}
            </p>
          </div>
          <p className="shrink-0 text-sm font-bold">{formatAud(pkg.price)}</p>
        </summary>
        <div className="flex flex-col gap-3 p-4">
          <p className="text-sm leading-relaxed text-white/75">
            Includes: {pkg.includes}
          </p>
          {dateLabel ? (
            <p className="text-sm text-white/70">
              <span className="text-white/45">Date: </span>
              {dateLabel}
            </p>
          ) : null}
          {addons.length > 0 ? (
            <ul className="flex flex-col gap-2 border-t border-white/10 pt-3">
              {addons.map((addon) => (
                <li
                  key={addon.id}
                  className="flex items-start justify-between gap-3 text-sm text-white/70"
                >
                  <span>{addon.title}</span>
                  <span className="shrink-0 font-medium text-white">
                    {formatAud(addon.price)}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </details>

      {/* Desktop: full card */}
      <div className="hidden overflow-hidden rounded-2xl border border-white/20 bg-white/[0.04] lg:block">
        <div className="bg-white px-5 py-6 text-[#010101]">
          <p className="text-xs font-bold uppercase tracking-[0.14em]">
            Whyte Films
          </p>
          <p className="font-display mt-2 text-3xl font-medium leading-none tracking-[-0.03em]">
            {pkg.name}
          </p>
        </div>
        <div className="flex flex-col gap-4 p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/45">
              {pkg.name} package
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              Includes: {pkg.includes}
            </p>
          </div>
          {dateLabel ? (
            <p className="text-sm text-white/70">
              <span className="text-white/45">Date: </span>
              {dateLabel}
            </p>
          ) : null}
          {addons.length > 0 ? (
            <ul className="flex flex-col gap-2 border-t border-white/10 pt-4">
              {addons.map((addon) => (
                <li
                  key={addon.id}
                  className="flex items-start justify-between gap-3 text-sm text-white/70"
                >
                  <span>{addon.title}</span>
                  <span className="shrink-0 font-medium text-white">
                    {formatAud(addon.price)}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="flex items-end justify-between border-t border-white/10 pt-4">
            <p className="text-sm text-white/50">{pkg.durationLabel}</p>
            <p className="text-xl font-bold text-white">{formatAud(pkg.price)}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
