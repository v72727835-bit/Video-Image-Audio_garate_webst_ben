import { PenLine, Sparkles, Share2 } from "lucide-react";
import { SectionHeading } from "./ToolsShowcase";

const steps = [
  {
    icon: PenLine,
    step: "01",
    title: "Describe your vision",
    desc: "Type a prompt or paste a brief. Add references, pick an aspect ratio and set the mood.",
  },
  {
    icon: Sparkles,
    step: "02",
    title: "Lumina directs the shot",
    desc: "The Intelligent Brain plans the scene, routes to the best model and renders your result.",
  },
  {
    icon: Share2,
    step: "03",
    title: "Refine & export",
    desc: "Regenerate any frame, lock what you love, then download studio-ready files to publish.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Fast by design"
          title="From idea to finished cut in three steps"
        />

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent md:block" />
          {steps.map((s) => (
            <div key={s.step} className="relative text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-brand/30 bg-base text-brand-light shadow-[0_0_30px_-8px_rgba(139,92,246,0.6)]">
                <s.icon className="h-6 w-6" />
              </div>
              <div className="mt-5 font-display text-sm font-semibold tracking-widest text-faint">
                STEP {s.step}
              </div>
              <h3 className="font-display mt-1 text-xl font-semibold text-ink">
                {s.title}
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
