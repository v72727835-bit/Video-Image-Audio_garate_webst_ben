"use client";

import { useState } from "react";
import { Check, Zap, Sparkles, Loader2, AlertTriangle, CalendarClock, ShieldCheck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMe } from "@/store/slices/authSlice";
import { cn } from "@/lib/cn";

/* eslint-disable @typescript-eslint/no-explicit-any */

const plans = [
  { id: "free", name: "Free", price: "₹0", credits: "150", perks: ["Image & short video", "Standard models"], buyable: false },
  { id: "starter", name: "Starter", price: "₹499", credits: "1,200 / mo", perks: ["Clean exports", "Basic templates"], buyable: true },
  { id: "premium", name: "Premium", price: "₹1,499", credits: "4,500 / mo", perks: ["Premium video", "Priority queue"], popular: true, buyable: true },
  { id: "business", name: "Business", price: "₹3,999", credits: "12,000 / mo", perks: ["Multiple seats", "Approvals"], buyable: true },
];

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function BillingPage() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const expiry = user?.planExpiry ? new Date(user.planExpiry) : null;
  const expired = user && user.plan !== "free" && expiry ? expiry.getTime() < Date.now() : false;
  const daysLeft = expiry ? Math.max(0, Math.ceil((expiry.getTime() - Date.now()) / 86400000)) : null;

  async function buy(planId: string) {
    setBusy(planId);
    setMsg(null);
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: "error", text: data.error || "Could not start payment." });
        setBusy(null);
        return;
      }
      const ok = await loadRazorpay();
      if (!ok) {
        setMsg({ type: "error", text: "Could not load the payment window. Check your connection." });
        setBusy(null);
        return;
      }
      const rzp = new (window as any).Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "aivideocreat",
        description: `${data.plan.name} plan`,
        prefill: { name: data.user.name, email: data.user.email },
        theme: { color: "#8b5cf6" },
        handler: async (resp: any) => {
          const v = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: resp.razorpay_order_id,
              paymentId: resp.razorpay_payment_id,
              signature: resp.razorpay_signature,
            }),
          });
          if (v.ok) {
            await dispatch(fetchMe());
            setMsg({ type: "ok", text: `${data.plan.name} plan activated 🎉` });
          } else {
            const e = await v.json();
            setMsg({ type: "error", text: e.error || "Payment verification failed." });
          }
          setBusy(null);
        },
        modal: { ondismiss: () => setBusy(null) },
      });
      rzp.open();
    } catch {
      setMsg({ type: "error", text: "Something went wrong starting payment." });
      setBusy(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">Billing & Credits</h1>
        <p className="mt-1.5 text-sm text-muted">Manage your plan and top up credits anytime.</p>
      </div>

      {expired && (
        <div className="flex items-start gap-3 rounded-2xl border border-danger/30 bg-danger/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
          <div>
            <p className="text-sm font-semibold text-danger">Your {cap(user?.plan)} plan has expired</p>
            <p className="text-sm text-ink-soft">Renew a plan below to keep generating video and images.</p>
          </div>
        </div>
      )}

      {msg && (
        <div className={cn("rounded-xl border px-4 py-3 text-sm", msg.type === "ok" ? "border-teal/30 bg-teal/10 text-teal" : "border-danger/30 bg-danger/10 text-danger")}>
          {msg.text}
        </div>
      )}

      {/* Current balance + plan */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card flex items-center gap-4 p-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/25 to-brand/15 text-accent ring-1 ring-accent/30">
            <Zap className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs text-muted">Available balance</p>
            <p className="font-display text-3xl font-bold text-ink">
              {user ? user.credits.toLocaleString() : "—"} <span className="text-base font-normal text-muted">credits</span>
            </p>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand/20 to-indigo/10 text-brand-light ring-1 ring-brand/20">
            <CalendarClock className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs text-muted">Current plan</p>
            <p className="font-display text-2xl font-bold text-ink">{cap(user?.plan)}</p>
            {user?.plan !== "free" && expiry && (
              <p className={cn("text-xs", expired ? "text-danger" : "text-muted")}>
                {expired ? "Expired " : "Renews in "}
                {expired ? expiry.toLocaleDateString() : `${daysLeft} days (${expiry.toLocaleDateString()})`}
              </p>
            )}
            {user?.plan === "free" && <p className="text-xs text-muted">No expiry · upgrade for more</p>}
          </div>
        </div>
      </div>

      {/* Plans */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-faint">Subscription plans</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => {
            const current = user?.plan === p.id && !expired;
            return (
              <div key={p.id} className={cn("relative flex flex-col rounded-2xl border p-5", (p as any).popular ? "border-brand/50 bg-brand/[0.07]" : "border-line bg-surface/50")}>
                {(p as any).popular && (
                  <span className="absolute -top-2.5 left-4 rounded-full bg-gradient-to-r from-brand-light to-indigo px-2.5 py-0.5 text-[10px] font-semibold text-white">Popular</span>
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
                {p.buyable ? (
                  <button
                    onClick={() => buy(p.id)}
                    disabled={busy === p.id || current}
                    className={cn(
                      "mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full text-sm font-medium transition-all disabled:opacity-60",
                      (p as any).popular ? "bg-gradient-to-r from-brand-light to-indigo text-white" : "border border-line text-ink-soft hover:border-brand/40"
                    )}
                  >
                    {busy === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {current ? "Current plan" : busy === p.id ? "Opening…" : `Get ${p.name}`}
                  </button>
                ) : (
                  <div className="mt-4 rounded-full border border-line py-2.5 text-center text-sm text-muted">Default plan</div>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-4 flex items-center gap-1.5 text-xs text-faint">
          <ShieldCheck className="h-3.5 w-3.5 text-teal" /> Secure payments by Razorpay. Credits are added instantly on success.
        </p>
      </div>

      {/* Top-up packs */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-faint">Credit top-up packs</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[{ c: "500", p: "₹199" }, { c: "1,500", p: "₹499" }, { c: "4,000", p: "₹1,199" }].map((pack) => (
            <div key={pack.c} className="card flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-brand-light" />
                <div>
                  <p className="font-display text-lg font-bold text-ink">{pack.c} <span className="text-sm font-normal text-muted">credits</span></p>
                  <p className="text-xs text-faint">{pack.p}</p>
                </div>
              </div>
              <span className="rounded-full border border-line px-3 py-1.5 text-xs text-muted">Soon</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function cap(s?: string) {
  if (!s) return "Free";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
