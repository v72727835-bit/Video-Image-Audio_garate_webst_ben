import { Plus } from "lucide-react";
import { SectionHeading } from "./ToolsShowcase";

const faqs = [
  {
    q: "How does the generation pipeline work?",
    a: "You write a prompt, and Lumina's Director AI plans the scene, configures subject, style and camera, routes to the best model, and renders your output — all visualised as a live node graph so you stay in control.",
  },
  {
    q: "What can I create?",
    a: "Cinematic text-to-video clips and high-quality images today, with voice & music coming soon. Every output is studio-ready and downloadable.",
  },
  {
    q: "How do credits work?",
    a: "Each plan includes a monthly credit allowance. You see the exact cost before you generate, and you can top up anytime. No uncapped spend, ever.",
  },
  {
    q: "Do I own what I create?",
    a: "Yes. Your creations are yours to use. Keep your references, style kits and project memory private to your workspace.",
  },
  {
    q: "Can I start for free?",
    a: "Absolutely — sign up and get 150 free credits, no credit card required.",
  },
];

export function FAQ() {
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading eyebrow="Questions" title="Everything you need to know" />
        <div className="mt-12 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group card overflow-hidden p-0 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 text-sm font-medium text-ink">
                {f.q}
                <Plus className="h-4 w-4 shrink-0 text-brand-light transition-transform group-open:rotate-45" />
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
