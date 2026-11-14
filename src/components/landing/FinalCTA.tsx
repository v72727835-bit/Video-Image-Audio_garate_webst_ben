import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-brand/30 bg-gradient-to-br from-surface via-base to-surface p-10 text-center sm:p-16">
          <div className="absolute inset-0 -z-10 aurora opacity-80" />
          <div className="absolute left-1/2 top-0 -z-10 h-64 w-[560px] -translate-x-1/2 rounded-full bg-brand/20 blur-[110px]" />

          <h2 className="font-display mx-auto max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            Make something that doesn&apos;t look like everyone else&apos;s.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted">
            Join thousands of creators turning ideas into cinema. Your first 150
            credits are on us.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/signup" size="lg">
              Create your first render <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/login" variant="outline" size="lg">
              I already have an account
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
