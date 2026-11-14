"use client";

import { Check, Zap, Sparkles } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const plans = [
  { id: "free", name: "Free", price: "₹0", credits: "150", perks: ["Image & short video", "Standard models"] },
  { id: "starter", name: "Starter", price: "₹499", credits: "1,200 / mo", perks: ["Clean exports", "Basic templates"] },
  { id: "premium", name: "Premium", price: "₹1,499", credits: "4,500 / mo", perks: ["Premium video", "Priority queue"], popular: true },
  { id: "business", name: "Business", price: "₹3,999", credits: "12,000 / mo", perks: ["Multiple seats", "Approvals"] },
];

const packs = [
  { credits: "500", price: "₹199" },
  { credits: "1,500", price: "₹499" },
  { credits: "4,000", price: "₹1,199" },
];

export default function BillingPage() {
  const user = useAppSelector((s) => s.auth.user);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Billing &amp; Credits
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Manage your plan and top up credits anytime.
        </p>
      </div>

      {/* Current balance */}
      <div className="card flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/25 to-brand/15 text-accent ring-1 ring-accent/30">
            <Zap className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs text-muted">Available balance</p>
            <p className="font-display text-3xl font-bold text-ink">
              {user ? user.credits.toLocaleString() : "—"}{" "}
              <span className="text-base font-normal text-muted">credits</span>
            </p>
          </div>
        </div>
        <div className="rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-sm font-medium text-brand-light">
          {cap(user?.plan)} plan
        </div>
      </div>

      {/* Plans */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-faint">
          Subscription plans
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => {
            const current = user?.plan === p.id;
            return (
              <div
                key={p.id}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-5",
                  p.popular ? "border-brand/50 bg-brand/[0.07]" : "border-line bg-surface/50"
                )}
              >
                {p.popular && (
                  <span className="absolute -top-2.5 left-4 rounded-full bg-gradient-to-r from-brand-light to-indigo px-2.5 py-0.5 text-[10px] font-semibold text-white">
                    Popular
                  </span>
                )}
                <p className="font-display text-base font-semibold text-ink">{p.name}</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-2xl font-bold text-ink">{p.price}</span>
                  <span className="text-xs text-faint">/mo</span>
                </div>
                <p className="mt-1 text-xs font-medium text-brand-light">{p.credits} credits</p>
                <ul className="mt-3 flex-1 space-y-1.5">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-1.5 text-xs text-ink-soft">
                      <Check className="h-3.5 w-3.5 text-success" /> {perk}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={current ? "soft" : p.popular ? "primary" : "outline"}
                  size="sm"
                  className="mt-4 w-full"
                  disabled={current}
                >
                  {current ? "Current plan" : "Choose"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top-up packs */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-faint">
          Credit top-up packs
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {packs.map((pack) => (
            <div
              key={pack.credits}
              className="card flex items-center justify-between p-5"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-brand-light" />
                <div>
                  <p className="font-display text-lg font-bold text-ink">
                    {pack.credits} <span className="text-sm font-normal text-muted">credits</span>
                  </p>
                  <p className="text-xs text-faint">{pack.price}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Buy
              </Button>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-faint">
          Payments connect to a gateway (e.g. Razorpay) at launch. Buttons are
          placeholders in this preview build.
        </p>
      </div>
    </div>
  );
}

function cap(s?: string) {
  if (!s) return "Free";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
