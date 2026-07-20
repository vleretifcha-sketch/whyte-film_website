import Link from "next/link";

type Variant = "solid" | "outline" | "outline-dark";

const styles: Record<Variant, string> = {
  solid: "bg-white !text-[#010101] hover:!text-[#010101]",
  outline: "btn-secondary !border !border-solid !border-white !bg-transparent !text-white",
  "outline-dark":
    "btn-secondary-dark !border !border-solid !border-[#010101] !bg-transparent !text-[#010101]",
};

type Props = {
  href: string;
  children: string;
  variant?: Variant;
  className?: string;
};

/** Label that rolls bottom→top on hover */
export function ButtonLabel({ children }: { children: string }) {
  return (
    <span className="btn-roll">
      <span className="btn-roll__line">{children}</span>
      <span className="btn-roll__line" aria-hidden>
        {children}
      </span>
    </span>
  );
}

export function Button({
  href,
  children,
  variant = "solid",
  className = "",
}: Props) {
  return (
    <Link
      href={href}
      className={`btn inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl px-4 text-base font-bold ${styles[variant]} ${className}`}
    >
      <ButtonLabel>{children}</ButtonLabel>
    </Link>
  );
}
