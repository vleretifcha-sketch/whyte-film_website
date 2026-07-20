import { ActionButton } from "@/components/ui/ActionButton";

type Props = {
  durationLabel: string;
  subtotalLabel: string;
  onNext: () => void;
  disabled?: boolean;
  nextLabel?: string;
};

/** Mobile: fixed dock. Desktop: card under package summary */
export function BookingNextBar({
  durationLabel,
  subtotalLabel,
  onNext,
  disabled,
  nextLabel = "Next",
}: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/20 bg-[#010101]/95 px-[var(--pad)] py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md supports-[backdrop-filter]:bg-[#010101]/88 lg:static lg:inset-auto lg:z-30 lg:rounded-2xl lg:border lg:border-white/25 lg:bg-white/[0.07] lg:p-5 lg:pb-5 lg:backdrop-blur-none">
      <div className="mx-auto flex max-w-[1408px] items-center gap-3 lg:mx-0 lg:max-w-none lg:flex-col lg:items-stretch lg:gap-4">
        <div className="min-w-0 flex-1 lg:flex-none">
          <p className="truncate text-sm text-white/75 lg:hidden">
            <span className="font-bold text-white">{durationLabel}</span>
            <span className="mx-2 text-white/30">·</span>
            <span className="font-bold text-white">{subtotalLabel}</span>
          </p>
          <div className="hidden flex-col gap-2 text-sm text-white/75 lg:flex">
            <p>
              Total duration:{" "}
              <span className="font-bold text-white">{durationLabel}</span>
            </p>
            <p>
              Subtotal:{" "}
              <span className="text-lg font-bold text-white">
                {subtotalLabel}
              </span>
            </p>
          </div>
        </div>
        <ActionButton
          onClick={onNext}
          disabled={disabled}
          variant="solid"
          className="min-w-[7.5rem] shrink-0 lg:w-full"
        >
          {nextLabel}
        </ActionButton>
      </div>
    </div>
  );
}
