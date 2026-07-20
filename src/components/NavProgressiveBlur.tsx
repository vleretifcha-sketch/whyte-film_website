/**
 * Progressive blur (iOS style) — overlapping full-size layers + exponential masks.
 */

const BLURS = [1, 2, 4, 8, 16, 24, 32, 48, 64] as const;

type Edge = "top" | "bottom";

/** Multi-stop ease-out mask across the FULL height (overlaps every other layer). */
function exponentialMask(layerIndex: number, total: number, edge: Edge): string {
  const intensity = layerIndex / (total - 1); // 0 = weakest, 1 = strongest
  const exponent = 1.15 + intensity * 3.8;
  const stops: string[] = [];

  for (let i = 0; i <= 14; i++) {
    const p = i / 14;
    const opacity = Math.pow(1 - p, exponent);
    stops.push(`rgba(0,0,0,${opacity.toFixed(4)}) ${(p * 100).toFixed(2)}%`);
  }

  // Top: strong at top → fade down. Bottom: strong at bottom → fade up.
  const dir = edge === "bottom" ? "to top" : "to bottom";
  return `linear-gradient(${dir}, ${stops.join(", ")})`;
}

export function ProgressiveBlur({ edge = "top" }: { edge?: Edge }) {
  return (
    <div
      className={
        edge === "bottom"
          ? "progressive-blur progressive-blur--bottom"
          : "progressive-blur progressive-blur--top"
      }
      aria-hidden
    >
      {BLURS.map((blur, index) => {
        const mask = exponentialMask(index, BLURS.length, edge);
        return (
          <div
            key={`${edge}-${blur}`}
            className="progressive-blur__layer"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
    </div>
  );
}
