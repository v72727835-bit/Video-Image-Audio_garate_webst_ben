import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "./ToolsShowcase";
import { cn } from "@/lib/cn";

const plans = [
  {
    name: "Free",
    price: "₹0",
    tagline: "Try the studio",
    credits: "150 credits",
    features: ["Image & short video", "Standard models", "Watermarked exports", "Community gallery"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Starter",
    price: "₹499",
    tagline: "For casual creators",
    credits: "1,200 credits / mo",
    features: ["Everything in Free", "Clean exports", "Basic templates", "Email support"],
    cta: "Choose Starter",
    highlight: false,
  },
  {
    name: "Premium",
    price: "₹1,499",
    tagline: "For active creators",
    credits: "4,500 credits / mo",
    features: [
      "Premium video models",
      "Storyboard & editor",
      "Priority render queue",
      "Project memory + brand kit",
    ],
    cta: "Go Premium",
    highlight: true,
  },
  {
    name: "Business",
    price: "₹3,999",
    tagline: "For teams & agencies",
    credits: "12,000 credits / mo",
    features: [
      "Everything in Premium",
      "Multiple projects & seats",
      "Approvals & collaboration",
      "Higher credit allowance",
    ],
    cta: "Choose Business",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-28">
      <div className="absolute left-1/2 top-24 -z-10 h-72 w-[680px] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Simple, predictable pricing"
          title="A plan that scales with your ambition"
          subtitle="Subscribe monthly and get a generous credit allowance. Need more? Top up anytime — you're always in control of spend."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-4">
          {plans.map((p) => (
            <div
              key={p.name}
              className={cn(
                "relative flex flex-col rounded-2xl border p-6 transition-all duration-300",
                p.highlight
                  ? "border-brand/50 bg-gradient-to-b from-brand/[0.12] to-surface shadow-[0_20px_60px_-24px_rgba(139,92,246,0.6)] lg:-translate-y-3"
                  : "border-line bg-surface/50 hover:border-brand/30"
              )}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-light to-indigo px-3 py-1 text-[11px] font-semibold text-white">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-lg font-semibold text-ink">{p.name}</h3>
              <p className="mt-1 text-xs text-muted">{p.tagline}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold text-ink">{p.price}</span>
                <span className="text-sm text-faint">/mo</span>
              </div>
              <p className="mt-1 text-xs font-medium text-brand-light">{p.credits}</p>

              <ul className="mt-5 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink-soft">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-2">
                <Button
                  href="/signup"
                  variant={p.highlight ? "primary" : "outline"}
                  className="w-full"
                >
                  {p.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-faint">
          Prices shown are launch plans for India. Credits roll over within your
          billing cycle.
        </p>
      </div>
    </section>
  );
}
