"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Loader2,
  Pencil,
  Trash2,
  X,
  ShieldCheck,
  Check,
  AlertTriangle,
  Film,
  ImageIcon,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  plan: string;
  role: string;
  status: string;
  credits: number;
  renders: number;
  usedCredits: number;
  planExpiry?: string | null;
  createdAt?: string;
}

const plans = ["free", "starter", "premium", "business"];
const planTone: Record<string, string> = {
  free: "bg-faint/15 text-muted",
  starter: "bg-cyan/15 text-cyan",
  premium: "bg-brand/15 text-brand-light",
  business: "bg-amber/15 text-amber",
};

export default function AdminUsers() {
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [plan, setPlan] = useState("all");
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [confirmDel, setConfirmDel] = useState<AdminUser | null>(null);
  const [usageUser, setUsageUser] = useState<AdminUser | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (plan !== "all") params.set("plan", plan);
    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }, [q, plan]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  async function del(u: AdminUser) {
    await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
    setConfirmDel(null);
    setItems((prev) => prev.filter((x) => x.id !== u.id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">Users</h1>
        <p className="mt-1.5 text-sm text-muted">Manage every account, plan and credit balance.</p>
      </div>

      {/* controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or email…"
            className="h-11 w-full rounded-xl border border-line bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-faint outline-none focus:border-brand/50"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1">
          {["all", ...plans].map((p) => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium capitalize transition-all",
                plan === p ? "bg-gradient-to-r from-brand-light to-indigo text-white" : "text-muted hover:text-ink"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-brand-light" />
        </div>
      ) : items.length === 0 ? (
        <div className="card px-6 py-14 text-center text-sm text-muted">No users found.</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="card hidden overflow-hidden p-0 md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-faint">
                  <th className="px-5 py-3.5 font-medium">User</th>
                  <th className="px-5 py-3.5 font-medium">Plan</th>
                  <th className="px-5 py-3.5 font-medium">Credits</th>
                  <th className="px-5 py-3.5 font-medium">Usage</th>
                  <th className="px-5 py-3.5 font-medium">Role</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((u) => (
                  <tr key={u.id} className="border-b border-line-soft last:border-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-light to-indigo text-xs font-bold text-white">
                          {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink">{u.name}</p>
                          <p className="truncate text-xs text-faint">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn("rounded-md px-2 py-0.5 text-xs capitalize", planTone[u.plan])}>{u.plan}</span>
                      {u.plan !== "free" && u.planExpiry && (
                        <div className={cn("mt-1 text-[11px]", new Date(u.planExpiry) < new Date() ? "text-danger" : "text-faint")}>
                          {new Date(u.planExpiry) < new Date() ? "expired " : "till "}
                          {new Date(u.planExpiry).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-ink-soft">{u.credits.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setUsageUser(u)} className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.03] px-2 py-1 text-xs text-ink-soft hover:text-brand-light">
                        <Film className="h-3 w-3" /> {u.renders}
                        <span className="text-faint">·</span>
                        <Zap className="h-3 w-3 text-accent" /> {u.usedCredits.toLocaleString()}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      {u.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-brand/15 px-2 py-0.5 text-xs text-brand-light">
                          <ShieldCheck className="h-3 w-3" /> admin
                        </span>
                      ) : (
                        <span className="text-xs text-muted">user</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn("rounded-md px-2 py-0.5 text-xs", u.status === "suspended" ? "bg-danger/15 text-danger" : "bg-teal/15 text-teal")}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setEditing(u)} className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-ink">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setConfirmDel(u)} className="rounded-lg p-2 text-muted hover:bg-danger/10 hover:text-danger">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {items.map((u) => (
              <div key={u.id} className="card p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-light to-indigo text-xs font-bold text-white">
                    {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{u.name}</p>
                    <p className="truncate text-xs text-faint">{u.email}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditing(u)} className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-ink">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setConfirmDel(u)} className="rounded-lg p-2 text-muted hover:bg-danger/10 hover:text-danger">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className={cn("rounded-md px-2 py-0.5 capitalize", planTone[u.plan])}>{u.plan}</span>
                  <span className="rounded-md bg-amber/15 px-2 py-0.5 text-amber">{u.credits.toLocaleString()} cr</span>
                  {u.role === "admin" && <span className="rounded-md bg-brand/15 px-2 py-0.5 text-brand-light">admin</span>}
                  <span className={cn("rounded-md px-2 py-0.5", u.status === "suspended" ? "bg-danger/15 text-danger" : "bg-teal/15 text-teal")}>{u.status}</span>
                  {u.plan !== "free" && u.planExpiry && (
                    <span className={cn("rounded-md px-2 py-0.5", new Date(u.planExpiry) < new Date() ? "bg-danger/15 text-danger" : "bg-white/[0.03] text-faint")}>
                      {new Date(u.planExpiry) < new Date() ? "expired" : "till " + new Date(u.planExpiry).toLocaleDateString()}
                    </span>
                  )}
                  <button onClick={() => setUsageUser(u)} className="rounded-md bg-white/[0.03] px-2 py-0.5 text-ink-soft">{u.renders} renders</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {editing && (
        <EditModal
          user={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            setItems((prev) => prev.map((x) => (x.id === updated.id ? { ...x, ...updated } : x)));
            setEditing(null);
          }}
        />
      )}

      {confirmDel && (
        <Modal onClose={() => setConfirmDel(null)}>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-danger/15 text-danger">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">Delete user?</h3>
              <p className="text-sm text-muted">This also removes all their creations. This cannot be undone.</p>
            </div>
          </div>
          <p className="mt-4 rounded-lg border border-line bg-base/40 px-3 py-2 text-sm text-ink-soft">
            {confirmDel.name} · {confirmDel.email}
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button onClick={() => setConfirmDel(null)} className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:bg-white/5">Cancel</button>
            <button onClick={() => del(confirmDel)} className="rounded-full bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-danger/90">Delete</button>
          </div>
        </Modal>
      )}

      {usageUser && <UsageModal user={usageUser} onClose={() => setUsageUser(null)} />}
    </div>
  );
}

interface UGen {
  _id: string;
  kind: string;
  prompt: string;
  thumbnail?: string;
  outputs: string[];
  creditsUsed?: number;
  createdAt?: string;
}

function UsageModal({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const [gens, setGens] = useState<UGen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/generations?user=${user.id}`)
      .then((r) => r.json())
      .then((d) => setGens(d.items || []))
      .finally(() => setLoading(false));
  }, [user.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-line bg-elevated p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-faint hover:text-ink"><X className="h-4 w-4" /></button>
        <h3 className="font-display text-lg font-semibold text-ink">{user.name}&apos;s usage</h3>
        <p className="text-xs text-muted">{user.email}</p>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat icon={<Film className="h-4 w-4" />} label="Renders" value={user.renders} />
          <Stat icon={<Zap className="h-4 w-4 text-accent" />} label="Credits used" value={user.usedCredits} />
          <Stat icon={<ImageIcon className="h-4 w-4" />} label="Credits left" value={user.credits} />
        </div>

        <h4 className="mt-5 mb-3 text-sm font-semibold uppercase tracking-wider text-faint">Recent creations</h4>
        {loading ? (
          <div className="flex h-24 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-brand-light" /></div>
        ) : gens.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">No creations yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {gens.map((g) => (
              <div key={g._id} className="overflow-hidden rounded-lg border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.thumbnail || g.outputs[0]} alt={g.prompt} className="aspect-square w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-line bg-base/40 p-3 text-center">
      <div className="mb-1 flex justify-center text-brand-light">{icon}</div>
      <p className="font-display text-lg font-bold text-ink">{value.toLocaleString()}</p>
      <p className="text-[11px] text-faint">{label}</p>
    </div>
  );
}

function EditModal({
  user,
  onClose,
  onSaved,
}: {
  user: AdminUser;
  onClose: () => void;
  onSaved: (u: AdminUser) => void;
}) {
  const [credits, setCredits] = useState(user.credits);
  const [plan, setPlan] = useState(user.plan);
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credits, plan, role, status }),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      onSaved(data.user);
    }
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="font-display text-lg font-semibold text-ink">Edit {user.name}</h3>
      <p className="text-xs text-muted">{user.email}</p>
      <div className="mt-5 space-y-4">
        <Field label="Credits">
          <input
            type="number"
            value={credits}
            onChange={(e) => setCredits(Number(e.target.value))}
            className="w-full rounded-xl border border-line bg-base/60 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand/50"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Plan">
            <Select value={plan} onChange={setPlan} options={plans} />
          </Field>
          <Field label="Role">
            <Select value={role} onChange={setRole} options={["user", "admin"]} />
          </Field>
        </div>
        <Field label="Status">
          <Select value={status} onChange={setStatus} options={["active", "suspended"]} />
        </Field>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:bg-white/5">Cancel</button>
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-light to-indigo px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save
        </button>
      </div>
    </Modal>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-line bg-elevated p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-faint hover:text-ink">
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</label>
      {children}
    </div>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-line bg-base/60 px-3 py-2.5 text-sm capitalize text-ink outline-none focus:border-brand/50"
    >
      {options.map((o) => (
        <option key={o} value={o} className="capitalize">
          {o}
        </option>
      ))}
    </select>
  );
}
