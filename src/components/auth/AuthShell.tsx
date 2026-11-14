import Link from "next/link";
import { ArrowLeft, Quote } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 aurora" />
        <div className="absolute inset-0 grid-noise opacity-50" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://picsum.photos/seed/lumina-auth/1100/1400"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base via-base/60 to-base/20" />

        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Logo />
          <div className="max-w-md">
            <Quote className="h-8 w-8 text-brand-light/70" />
            <p className="font-display mt-4 text-2xl font-medium leading-snug text-ink">
              &ldquo;Lumina turned my rough script into a finished trailer in an
              afternoon. It doesn&apos;t feel like a tool — it feels like a crew.&rdquo;
            </p>
            <div className="mt-5 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://picsum.photos/seed/avatar-dir/80/80"
                alt="Creator"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-brand/30"
              />
              <div>
                <p className="text-sm font-semibold text-ink">Rhea Kapoor</p>
                <p className="text-xs text-muted">Independent filmmaker</p>
              </div>
            </div>
          </div>
          <div className="flex gap-6 text-xs text-faint">
            <span>2M+ renders</span>
            <span>12,000+ creators</span>
            <span>4.9/5 rating</span>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="relative flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="absolute left-1/2 top-10 -z-10 h-56 w-80 -translate-x-1/2 rounded-full bg-brand/10 blur-[90px] lg:hidden" />
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Logo />
          </div>
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </div>
  );
}
