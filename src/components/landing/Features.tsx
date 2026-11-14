import {
  BrainCircuit,
  Gauge,
  Layers,
  ShieldCheck,
  Palette,
  Download,
} from "lucide-react";
import { SectionHeading } from "./ToolsShowcase";

const features = [
  {
    icon: BrainCircuit,
    title: "The Intelligent Brain",
    desc: "Creative planning and automatic model routing pick the right engine for every shot — so you don't have to.",
  },
  {
    icon: Gauge,
    title: "Transparent credits",
    desc: "See the exact cost before you generate. No surprise bills, no uncapped spend — ever.",
  },
  {
    icon: Layers,
    title: "Project memory",
    desc: "Lumina remembers your characters, style and references across every scene and session.",
  },
  {
    icon: ShieldCheck,
    title: "Quality checks",
    desc: "Automatic QC flags weak frames and lets you regenerate a single scene without redoing the whole render.",
  },
  {
    icon: Palette,
    title: "Brand kits",
    desc: "Lock in your palette, logos and visual identity so every output stays unmistakably yours.",
  },
  {
    icon: Download,
    title: "Studio-ready export",
    desc: "Download in the resolution and aspect ratio you need, cleanly assembled and ready to publish.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-28">
      <div className="absolute inset-0 -z-10 grid-noise opacity-40" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Built to feel human"
          title="The craft behind every frame"
          subtitle="Lumina isn't a thin wrapper over an API. It's a production studio with the judgment of a creative director built in."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-line bg-surface/50 p-6 transition-all duration-300 hover:border-brand/40 hover:bg-surface"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 to-indigo/10 text-brand-light ring-1 ring-brand/20 transition-transform duration-300 group-hover:scale-110">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="font-display mt-4 text-lg font-semibold text-ink">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
