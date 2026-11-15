"use client";

import { Plus, Check, Type, Palette as PaletteIcon, Sparkles, Image as ImageIcon } from "lucide-react";
import { artGradient } from "@/lib/art";
import { Button } from "@/components/ui/Button";

const palettes = [
  { name: "Neon Noir", colors: ["#0b0b12", "#8b5cf6", "#22d3ee", "#f472b6", "#fbbf24"], active: true },
  { name: "Golden Hour", colors: ["#1a1208", "#f4d8a6", "#fb7185", "#a78bfa", "#2dd4bf"], active: false },
  { name: "Cold Steel", colors: ["#0a0f14", "#38bdf8", "#94a3b8", "#e2e8f0", "#6366f1"], active: false },
];

const styles = [
  { name: "Noir / Cinematic", desc: "High contrast, moody, 35mm grain", seed: "noir" },
  { name: "Product Studio", desc: "Clean light, soft shadows, premium", seed: "product" },
  { name: "Anime Pastel", desc: "Soft palette, bold lines, dreamy", seed: "anime" },
  { name: "Documentary", desc: "Natural light, realistic, handheld", seed: "doc" },
];

export default function BrandPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">Brand Kit</h1>
          <p className="mt-1.5 text-sm text-muted">
            Lock your identity so every render stays unmistakably yours.
          </p>
        </div>
        <Button size="md">
          <Plus className="h-4 w-4" /> New kit
        </Button>
      </div>

      {/* Palettes */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <PaletteIcon className="h-4 w-4 text-brand-light" />
          <h2 className="font-display text-base font-semibold text-ink">Color palettes</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {palettes.map((p) => (
            <div
              key={p.name}
              className={`card overflow-hidden p-0 transition-all ${p.active ? "ring-1 ring-brand/50" : "hover:border-brand/30"}`}
            >
              <div className="flex h-24">
                {p.colors.map((c) => (
                  <div key={c} className="flex-1" style={{ background: c }} />
                ))}
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-semibold text-ink">{p.name}</p>
                  <p className="text-xs text-faint">{p.colors.length} colors</p>
                </div>
                {p.active ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal/15 px-2.5 py-1 text-xs text-teal">
                    <Check className="h-3 w-3" /> Active
                  </span>
                ) : (
                  <button className="text-xs text-brand-light hover:text-brand">Apply</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Logos + Typography */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card p-5">
          <div className="mb-4 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-brand-light" />
            <h2 className="font-display text-base font-semibold text-ink">Logos</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["light", "dark", "mark"].map((v) => (
              <div key={v} className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-line bg-base/40">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-light to-indigo text-white">
                  <Sparkles className="h-5 w-5" />
                </span>
                <span className="text-[11px] capitalize text-faint">{v}</span>
              </div>
            ))}
            <button className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-line text-muted hover:border-brand/40 hover:text-ink">
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </section>

        <section className="card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Type className="h-4 w-4 text-brand-light" />
            <h2 className="font-display text-base font-semibold text-ink">Typography</h2>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-line bg-base/40 p-4">
              <p className="text-xs text-faint">Display · Sora</p>
              <p className="font-display text-2xl font-bold text-ink">The quick cut</p>
            </div>
            <div className="rounded-xl border border-line bg-base/40 p-4">
              <p className="text-xs text-faint">Body · Geist Sans</p>
              <p className="text-sm text-ink-soft">
                Narration and captions render in a clean, legible sans across every scene.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Style presets */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-light" />
          <h2 className="font-display text-base font-semibold text-ink">Style presets</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {styles.map((s) => (
            <div key={s.name} className="card group overflow-hidden transition-all hover:-translate-y-1 hover:border-brand/40">
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={artGradient(s.seed, 400, 300)} alt={s.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent" />
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-ink">{s.name}</p>
                <p className="mt-1 text-xs text-muted">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
