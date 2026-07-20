import Link from "next/link";

type Variant = "solid" | "outline" | "outline-dark";

const styles: Record<Variant, string> = {
  solid:
    "bg-white !text-[#010101] hover:bg-white/90 hover:!text-[#010101]",
  outline:
    "btn-secondary border border-white text-white hover:bg-white",
  "outline-dark":
    "border border-[#010101] text-[#010101] hover:bg-[#010101] hover:text-white",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
};

export function Button({
  href,
  children,
  variant = "solid",
  className = "",
}: Props) {
  return (
    <Link
      href={href}
      className={`inline-flex h-12 items-center justify-center rounded-2xl px-4 text-base font-bold transition-colors ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
