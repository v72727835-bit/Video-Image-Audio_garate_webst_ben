import { Star } from "lucide-react";
import { SectionHeading } from "./ToolsShowcase";

const quotes = [
  {
    text: "The node pipeline is genius — I can see exactly how a prompt becomes a scene, and fix one shot without re-rendering everything.",
    name: "Rhea Kapoor",
    role: "Independent filmmaker",
    seed: "t1",
  },
  {
    text: "We replaced three tools with Lumina. Credits are transparent, the output is cinematic, and clients think we hired a studio.",
    name: "Daniel Osei",
    role: "Creative director, Fold",
    seed: "t2",
  },
  {
    text: "From script to a finished trailer in an afternoon. It genuinely feels like having a crew on tap.",
    name: "Mika Tan",
    role: "Content lead, Northwind",
    seed: "t3",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Loved by creators"
          title="Studios ship faster with Lumina"
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {quotes.map((q) => (
            <figure
              key={q.seed}
              className="card flex flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40"
            >
              <div className="flex gap-0.5 text-accent">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
                “{q.text}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-light to-indigo text-xs font-bold text-white">
                  {q.name.split(" ").map((n) => n[0]).join("")}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{q.name}</p>
                  <p className="text-xs text-muted">{q.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
