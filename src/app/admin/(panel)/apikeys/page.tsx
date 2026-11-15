"use client";

import { useEffect, useState } from "react";
import { KeyRound, Loader2, Check, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";

interface KeyRow {
  key: string;
  label: string;
  hint: string;
  set: boolean;
  source: "panel" | "env" | "none";
  masked: string;
}

export default function ApiKeysPage() {
  const [items, setItems] = useState<KeyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState<Record<string, string>>({});
  const [show, setShow] = useState<Record<string, boolean>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/apikeys");
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function save(k: string) {
    setSavingKey(k);
    const res = await fetch("/api/admin/apikeys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: k, value: values[k] ?? "" }),
    });
    setSavingKey(null);
    if (res.ok) {
      setSavedKey(k);
      setValues((v) => ({ ...v, [k]: "" }));
      setTimeout(() => setSavedKey(null), 2500);
      load();
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">API keys</h1>
        <p className="mt-1.5 text-sm text-muted">Add provider keys to switch the studio from mock mode to real generation.</p>
      </div>

      <div className="card flex items-center gap-2 p-4 text-sm text-ink-soft">
        <ShieldCheck className="h-4 w-4 shrink-0 text-teal" />
        Keys are stored server-side and never shown in full again. A key set here overrides the server environment.
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-brand-light" /></div>
      ) : (
        <div className="space-y-4">
          {items.map((k) => (
            <div key={k.key} className="card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand-light">
                    <KeyRound className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-medium text-ink">{k.label}</p>
                    <p className="text-xs text-muted">{k.hint}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs",
                    k.set ? "bg-teal/15 text-teal" : "bg-amber/15 text-amber"
                  )}
                >
                  {k.set ? `Active · ${k.source}` : "Not set · mock mode"}
                </span>
              </div>

              {k.set && (
                <p className="mt-3 font-mono text-sm text-faint">Current: {k.masked}</p>
              )}

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <input
                    type={show[k.key] ? "text" : "password"}
                    value={values[k.key] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [k.key]: e.target.value }))}
                    placeholder="Paste new key (leave empty to clear)"
                    className="h-11 w-full rounded-xl border border-line bg-base/60 px-3 pr-10 text-sm text-ink placeholder:text-faint outline-none focus:border-brand/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => ({ ...s, [k.key]: !s[k.key] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-ink-soft"
                  >
                    {show[k.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <button
                  onClick={() => save(k.key)}
                  disabled={savingKey === k.key}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-light to-indigo px-5 text-sm font-medium text-white disabled:opacity-60"
                >
                  {savingKey === k.key ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : savedKey === k.key ? (
                    <Check className="h-4 w-4" />
                  ) : null}
                  {savedKey === k.key ? "Saved" : "Save key"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
