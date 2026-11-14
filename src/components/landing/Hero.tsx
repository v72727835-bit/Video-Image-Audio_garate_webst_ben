"use client";

import { motion } from "framer-motion";
import { Sparkles, Play, Wand2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const previews = [
  { src: "https://picsum.photos/seed/lumina-a/400/520", tag: "Cinematic" },
  { src: "https://picsum.photos/seed/lumina-b/400/520", tag: "Product" },
  { src: "https://picsum.photos/seed/lumina-c/400/520", tag: "Portrait" },
  { src: "https://picsum.photos/seed/lumina-d/400/520", tag: "Anime" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* backdrop */}
      <div className="absolute inset-0 -z-10 aurora" />
      <div className="absolute inset-0 -z-10 grid-noise opacity-60" />
      <div className="absolute left-1/2 top-24 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand/20 blur-[130px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3.5 py-1.5 text-xs text-ink-soft backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-light" />
            Powered by Leonardo — now with Motion 2.0 video
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
          >
            <span className="text-gradient">Your imagination,</span>
            <br />
            <span className="text-gradient-brand">rendered in motion.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mx-auto mt-6 max-w-xl text-base text-muted sm:text-lg"
          >
            Turn a single line of text into studio-grade video and images. Lumina
            Studio is the creative engine for filmmakers, marketers and
            storytellers who refuse to look generic.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button href="/signup" size="lg">
              Start creating free <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="#tools" variant="outline" size="lg">
              <Play className="h-4 w-4" /> See the tools
            </Button>
          </motion.div>

          <p className="mt-4 text-xs text-faint">
            No credit card required · 150 free credits on sign-up
          </p>
        </div>

        {/* Prompt bar + preview stage */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative mx-auto mt-16 max-w-4xl"
        >
          <div className="card glow-brand p-3 sm:p-4">
            <div className="flex items-center gap-3 rounded-xl bg-base/70 p-2.5 pl-4">
              <Wand2 className="h-5 w-5 shrink-0 text-brand-light" />
              <p className="flex-1 truncate text-left text-sm text-ink-soft sm:text-base">
                A neon-lit Tokyo street at night, rain reflections, cinematic
                dolly shot…
              </p>
              <span className="hidden shrink-0 rounded-lg border border-line px-2.5 py-1 text-xs text-muted sm:block">
                16:9 · 6s
              </span>
              <Button size="sm" className="shrink-0">
                Generate
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {previews.map((p, i) => (
                <div
                  key={p.tag}
                  className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-line animate-float-slow"
                  style={{ animationDelay: `${i * 0.6}s` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.src}
                    alt={p.tag}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
                  <span className="absolute bottom-2 left-2 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                    {p.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute -inset-x-10 -bottom-10 -z-10 h-40 bg-brand/10 blur-3xl" />
        </motion.div>

        {/* trust row */}
        <div className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs uppercase tracking-widest text-faint">
          <span>Trusted by 12,000+ creators</span>
          <span className="hidden sm:block">·</span>
          <span>4.9/5 average rating</span>
          <span className="hidden sm:block">·</span>
          <span>2M+ renders delivered</span>
        </div>
      </div>
    </section>
  );
}
