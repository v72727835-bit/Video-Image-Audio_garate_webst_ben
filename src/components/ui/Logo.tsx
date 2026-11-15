import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({
  className,
  href = "/",
  compact = false,
}: {
  className?: string;
  href?: string;
  compact?: boolean;
}) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-light via-brand to-indigo shadow-[0_6px_20px_-6px_rgba(139,92,246,0.8)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none">
          <path
            d="M12 2.5l2.6 6.3 6.8.5-5.2 4.4 1.7 6.6L12 16.9 6.3 20.8l1.7-6.6L2.8 9.8l6.8-.5L12 2.5z"
            fill="currentColor"
            opacity="0.95"
          />
        </svg>
        <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/20" />
      </span>
      {!compact && (
        <span className="font-display text-[1.15rem] font-bold tracking-tight text-ink">
          aivideo<span className="text-brand-light">creat</span>
        </span>
      )}
    </Link>
  );
}
