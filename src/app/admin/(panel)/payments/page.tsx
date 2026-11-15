"use client";

import { useEffect, useState } from "react";
import { Loader2, IndianRupee, Users, Repeat, CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/cn";

interface Txn {
  id: string;
  userName: string;
  userEmail: string;
  plan: string;
  amount: number;
  credits: number;
  status: string;
  validUntil: string | null;
  createdAt?: string;
}
interface Stats {
  revenue: number;
  paidCount: number;
  activeSubs: number;
}

const planTone: Record<string, string> = {
  starter: "bg-cyan/15 text-cyan",
  premium: "bg-brand/15 text-brand-light",
  business: "bg-amber/15 text-amber",
};

export default function AdminPayments() {
  const [items, setItems] = useState<Txn[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/payments")
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setStats(d.stats || null);
      })
      .finally(() => setLoading(false));
  }, []);

  const inr = (paise: number) => "₹" + (paise / 100).toLocaleString("en-IN");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">Payments & subscriptions</h1>
        <p className="mt-1.5 text-sm text-muted">Who bought which plan, and until when it&apos;s valid.</p>
      </div>

      {/* stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi icon={<IndianRupee className="h-5 w-5" />} label="Revenue" value={stats ? inr(stats.revenue) : "—"} tone="#2dd4bf" />
        <Kpi icon={<Repeat className="h-5 w-5" />} label="Active subscriptions" value={stats ? String(stats.activeSubs) : "—"} tone="#8b5cf6" />
        <Kpi icon={<Users className="h-5 w-5" />} label="Successful payments" value={stats ? String(stats.paidCount) : "—"} tone="#22d3ee" />
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-brand-light" /></div>
      ) : items.length === 0 ? (
        <div className="card px-6 py-14 text-center text-sm text-muted">No transactions yet.</div>
      ) : (
        <>
          {/* desktop table */}
          <div className="card hidden overflow-hidden p-0 md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-faint">
                  <th className="px-5 py-3.5 font-medium">User</th>
                  <th className="px-5 py-3.5 font-medium">Plan</th>
                  <th className="px-5 py-3.5 font-medium">Amount</th>
                  <th className="px-5 py-3.5 font-medium">Valid until</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {items.map((t) => (
                  <tr key={t.id} className="border-b border-line-soft last:border-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-ink">{t.userName || "—"}</p>
                      <p className="text-xs text-faint">{t.userEmail}</p>
                    </td>
                    <td className="px-5 py-3.5"><span className={cn("rounded-md px-2 py-0.5 text-xs capitalize", planTone[t.plan])}>{t.plan}</span></td>
                    <td className="px-5 py-3.5 text-ink-soft">₹{(t.amount / 100).toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3.5 text-ink-soft">{t.validUntil ? new Date(t.validUntil).toLocaleDateString() : "—"}</td>
                    <td className="px-5 py-3.5"><StatusChip status={t.status} /></td>
                    <td className="px-5 py-3.5 text-faint">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* mobile cards */}
          <div className="space-y-3 md:hidden">
            {items.map((t) => (
              <div key={t.id} className="card p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{t.userName || t.userEmail}</p>
                    <p className="truncate text-xs text-faint">{t.userEmail}</p>
                  </div>
                  <StatusChip status={t.status} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className={cn("rounded-md px-2 py-0.5 capitalize", planTone[t.plan])}>{t.plan}</span>
                  <span className="rounded-md bg-teal/15 px-2 py-0.5 text-teal">₹{(t.amount / 100).toLocaleString("en-IN")}</span>
                  {t.validUntil && <span className="text-faint">till {new Date(t.validUntil).toLocaleDateString()}</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Kpi({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${tone}22`, color: tone }}>{icon}</span>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="font-display text-2xl font-bold text-ink">{value}</p>
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  if (status === "paid") return <span className="inline-flex items-center gap-1 rounded-md bg-teal/15 px-2 py-0.5 text-xs text-teal"><CheckCircle2 className="h-3 w-3" /> paid</span>;
  if (status === "failed") return <span className="inline-flex items-center gap-1 rounded-md bg-danger/15 px-2 py-0.5 text-xs text-danger"><XCircle className="h-3 w-3" /> failed</span>;
  return <span className="inline-flex items-center gap-1 rounded-md bg-amber/15 px-2 py-0.5 text-xs text-amber"><Clock className="h-3 w-3" /> pending</span>;
}
