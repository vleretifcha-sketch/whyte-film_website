import Link from "next/link";
import {
  BOOKING_STEPS,
  melbourneNowLabel,
  type BookingStepId,
} from "@/lib/booking";

type Props = {
  current: BookingStepId;
};

export function BookingStepper({ current }: Props) {
  const currentIndex = BOOKING_STEPS.findIndex((s) => s.id === current);
  const currentStep = BOOKING_STEPS[currentIndex];

  return (
    <div className="flex flex-col gap-4 border-b border-white/25 pb-5 md:gap-5 md:pb-6">
      {/* Mobile: compact progress */}
      <div className="flex flex-col gap-3 md:hidden">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-white/50">
              Step {currentIndex + 1} of {BOOKING_STEPS.length}
            </p>
            <p className="mt-1 text-base font-bold text-white">
              {currentStep?.label}
            </p>
          </div>
          <p className="max-w-[42%] text-right text-[11px] leading-snug text-white/50">
            {melbourneNowLabel()}
          </p>
        </div>
        <div className="flex gap-1.5" aria-hidden>
          {BOOKING_STEPS.map((step, index) => {
            const filled = index <= currentIndex;
            const reachable = index <= currentIndex;
            if (reachable && step.id !== current) {
              return (
                <Link
                  key={step.id}
                  href={step.href}
                  className={`h-1.5 flex-1 rounded-full ${
                    filled ? "bg-white" : "bg-white/20"
                  }`}
                  aria-label={step.label}
                />
              );
            }
            return (
              <span
                key={step.id}
                className={`h-1.5 flex-1 rounded-full ${
                  filled ? "bg-white" : "bg-white/20"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Desktop: full steps */}
      <div className="hidden md:flex md:flex-row md:items-center md:justify-between md:gap-5">
        <nav
          aria-label="Booking steps"
          className="flex w-full flex-wrap items-stretch gap-2"
        >
          {BOOKING_STEPS.map((step, index) => {
            const done = index < currentIndex;
            const active = index === currentIndex;
            const reachable = index <= currentIndex;

            const className = `inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-center text-sm font-bold tracking-[-0.01em] transition-colors sm:min-w-[8.5rem] sm:flex-none ${
              active
                ? "border-white bg-white text-[#010101]"
                : done
                  ? "border-white/70 bg-white/15 text-white"
                  : "border-white/35 bg-transparent text-white/70"
            }`;

            const content = (
              <>
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    active
                      ? "bg-[#010101] text-white"
                      : "bg-white/20 text-white"
                  }`}
                >
                  {index + 1}
                </span>
                <span>{step.label}</span>
              </>
            );

            if (reachable && step.id !== current) {
              return (
                <Link key={step.id} href={step.href} className={className}>
                  {content}
                </Link>
              );
            }

            return (
              <span
                key={step.id}
                className={className}
                aria-current={active ? "step" : undefined}
              >
                {content}
              </span>
            );
          })}
        </nav>
        <p className="shrink-0 text-sm font-medium text-white/70">
          Our time: {melbourneNowLabel()} · Melbourne
        </p>
      </div>
    </div>
  );
}
