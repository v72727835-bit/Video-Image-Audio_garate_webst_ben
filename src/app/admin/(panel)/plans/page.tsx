"use client";

import { Check, Pencil } from "lucide-react";

const plans = [
  { id: "free", name: "Free", price: "₹0", credits: "150", features: ["Image & short video", "Standard models", "Watermarked"] },
  { id: "starter", name: "Starter", price: "₹499", credits: "1,200 / mo", features: ["Clean exports", "Basic templates", "Email support"] },
  { id: "premium", name: "Premium", price: "₹1,499", credits: "4,500 / mo", features: ["Premium video", "Priority queue", "Brand kit"], popular: true },
  { id: "business", name: "Business", price: "₹3,999", credits: "12,000 / mo", features: ["Multiple seats", "Approvals", "Higher allowance"] },
];

const packs = [
  { credits: "500", price: "₹199" },
  { credits: "1,500", price: "₹499" },
  { credits: "4,000", price: "₹1,199" },
];

export default function AdminPlans() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">Plans & credits</h1>
        <p className="mt-1.5 text-sm text-muted">Configure subscription tiers and credit top-up packs.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`relative flex flex-col rounded-2xl border p-5 ${p.popular ? "border-brand/50 bg-brand/[0.07]" : "border-line bg-surface/50"}`}
          >
            {p.popular && (
              <span className="absolute -top-2.5 left-4 rounded-full bg-gradient-to-r from-brand-light to-indigo px-2.5 py-0.5 text-[10px] font-semibold text-white">
                Popular
              </span>
            )}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-base font-semibold text-ink">{p.name}</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-display text-2xl font-bold text-ink">{p.price}</span>
                  <span className="text-xs text-faint">/mo</span>
                </div>
              </div>
              <button className="rounded-lg p-1.5 text-muted hover:bg-white/5 hover:text-ink">
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-xs font-medium text-brand-light">{p.credits} credits</p>
            <ul className="mt-3 flex-1 space-y-1.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-xs text-ink-soft">
                  <Check className="h-3.5 w-3.5 text-success" /> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-faint">Credit packs</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {packs.map((pack) => (
            <div key={pack.credits} className="card flex items-center justify-between p-5">
              <div>
                <p className="font-display text-lg font-bold text-ink">
                  {pack.credits} <span className="text-sm font-normal text-muted">credits</span>
                </p>
                <p className="text-xs text-faint">{pack.price}</p>
              </div>
              <button className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-ink">
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
