import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline" | "soft";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none";

const variants: Record<Variant, string> = {
  primary:
    "btn-sheen bg-gradient-to-r from-brand-light via-brand to-indigo text-white shadow-[0_10px_30px_-10px_rgba(139,92,246,0.9)] hover:shadow-[0_14px_40px_-10px_rgba(139,92,246,1)] hover:-translate-y-0.5",
  soft: "bg-elevated text-ink hover:bg-[#241f33] border border-line",
  outline: "border border-line text-ink-soft hover:border-brand/60 hover:text-ink hover:bg-white/[0.03]",
  ghost: "text-ink-soft hover:text-ink hover:bg-white/[0.04]",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 h-9",
  md: "text-sm px-5 h-11",
  lg: "text-[0.95rem] px-7 h-13",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...rest
}: Props) {
  const classes = cn(base, variants[variant], sizes[size], className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
