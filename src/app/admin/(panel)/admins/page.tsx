"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2, ShieldCheck, Pencil, Trash2, X, Check, Crown } from "lucide-react";
import { PERMISSIONS, type PermissionKey } from "@/lib/permissions";
import { cn } from "@/lib/cn";

interface AdminRow {
  id: string;
  name: string;
  email: string;
  role: "super" | "sub";
  permissions: string[];
  status: string;
  lastLogin: string | null;
}

export default function AdminsPage() {
  const [items, setItems] = useState<AdminRow[]>([]);
  const [self, setSelf] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<AdminRow | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/admins");
    const data = await res.json();
    setItems(data.items || []);
    setSelf(data.self || "");
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function del(a: AdminRow) {
    if (!confirm(`Delete admin ${a.email}?`)) return;
    const res = await fetch(`/api/admin/admins/${a.id}`, { method: "DELETE" });
    if (res.ok) setItems((p) => p.filter((x) => x.id !== a.id));
    else alert((await res.json()).error);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">Admins</h1>
          <p className="mt-1.5 text-sm text-muted">Create sub-admins and control exactly what each can access.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="btn-sheen inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-brand-light via-brand to-indigo px-5 text-sm font-medium text-white"
        >
          <Plus className="h-4 w-4" /> New admin
        </button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-brand-light" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-light to-indigo text-sm font-bold text-white">
                    {a.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate font-semibold text-ink">
                      {a.name}
                      {a.role === "super" && <Crown className="h-3.5 w-3.5 text-amber" />}
                    </p>
                    <p className="truncate text-xs text-faint">{a.email}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(a)} className="rounded-lg p-1.5 text-muted hover:bg-white/5 hover:text-ink"><Pencil className="h-4 w-4" /></button>
                  {a.id !== self && (
                    <button onClick={() => del(a)} className="rounded-lg p-1.5 text-muted hover:bg-danger/10 hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className={cn("rounded-md px-2 py-0.5 text-[11px] capitalize", a.status === "suspended" ? "bg-danger/15 text-danger" : "bg-teal/15 text-teal")}>{a.status}</span>
                <span className="text-[11px] text-faint">{a.lastLogin ? "Last in " + new Date(a.lastLogin).toLocaleDateString() : "Never signed in"}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {a.role === "super" ? (
                  <span className="rounded-md bg-amber/15 px-2 py-0.5 text-[11px] text-amber">Full access</span>
                ) : a.permissions.length ? (
                  a.permissions.map((p) => (
                    <span key={p} className="rounded-md bg-brand/10 px-2 py-0.5 text-[11px] capitalize text-brand-light">{p}</span>
                  ))
                ) : (
                  <span className="text-[11px] text-faint">No access granted</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {creating && (
        <AdminForm
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            load();
          }}
        />
      )}
      {editing && (
        <AdminForm
          existing={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function AdminForm({
  existing,
  onClose,
  onSaved,
}: {
  existing?: AdminRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = Boolean(existing);
  const [name, setName] = useState(existing?.name || "");
  const [email, setEmail] = useState(existing?.email || "");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(existing?.status || "active");
  const [perms, setPerms] = useState<string[]>(existing?.permissions || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(k: PermissionKey) {
    setPerms((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));
  }

  async function save() {
    setSaving(true);
    setError(null);
    let res: Response;
    if (isEdit) {
      res = await fetch(`/api/admin/admins/${existing!.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, permissions: perms, status, password: password || undefined }),
      });
    } else {
      res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, permissions: perms }),
      });
    }
    setSaving(false);
    if (res.ok) onSaved();
    else setError((await res.json()).error || "Failed");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-elevated p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-faint hover:text-ink"><X className="h-4 w-4" /></button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-brand-light" />
          <h3 className="font-display text-lg font-semibold text-ink">{isEdit ? "Edit admin" : "New admin"}</h3>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-line bg-base/60 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand/50" />
          </div>
          {!isEdit && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-soft">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-line bg-base/60 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand/50" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-soft">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="w-full rounded-xl border border-line bg-base/60 px-3 py-2.5 text-sm text-ink placeholder:text-faint outline-none focus:border-brand/50" />
              </div>
            </>
          )}
          {isEdit && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-soft">New password (optional)</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep current" className="w-full rounded-xl border border-line bg-base/60 px-3 py-2.5 text-sm text-ink placeholder:text-faint outline-none focus:border-brand/50" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-soft">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-xl border border-line bg-base/60 px-3 py-2.5 text-sm capitalize text-ink outline-none focus:border-brand/50">
                  <option value="active">active</option>
                  <option value="suspended">suspended</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-ink-soft">Access permissions</label>
            <div className="space-y-2">
              {PERMISSIONS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => toggle(p.key)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                    perms.includes(p.key) ? "border-brand/50 bg-brand/10" : "border-line bg-base/40 hover:border-brand/30"
                  )}
                >
                  <span className={cn("flex h-5 w-5 items-center justify-center rounded-md border", perms.includes(p.key) ? "border-brand bg-brand text-white" : "border-line")}>
                    {perms.includes(p.key) && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-ink">{p.label}</span>
                    <span className="block text-xs text-muted">{p.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:bg-white/5">Cancel</button>
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-light to-indigo px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} {isEdit ? "Save" : "Create admin"}
          </button>
        </div>
      </div>
    </div>
  );
}
