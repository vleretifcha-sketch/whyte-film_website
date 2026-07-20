import { ButtonLabel } from "./Button";

type Variant = "solid" | "outline";

const styles: Record<Variant, string> = {
  solid: "btn-primary",
  outline:
    "btn-secondary !border !border-solid !border-white !bg-transparent !text-white",
};

type Props = {
  children: string;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
};

export function ActionButton({
  children,
  variant = "solid",
  className = "",
  type = "button",
  disabled,
  onClick,
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl px-6 text-base font-bold shadow-none disabled:cursor-not-allowed disabled:opacity-35 ${styles[variant]} ${className}`}
    >
      <ButtonLabel>{children}</ButtonLabel>
    </button>
  );
}
