"use client";

import { useState } from "react";
import { Cpu, Power, UserPlus, Wand2, ShieldCheck, KeyRound } from "lucide-react";
import { cn } from "@/lib/cn";

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors",
        on ? "bg-gradient-to-r from-brand-light to-indigo" : "bg-line"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
          on ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export default function AdminSettings() {
  const [maintenance, setMaintenance] = useState(false);
  const [signups, setSignups] = useState(true);
  const [generation, setGeneration] = useState(true);

  const rows = [
    { icon: Power, title: "Maintenance mode", desc: "Temporarily take the studio offline for visitors.", on: maintenance, set: setMaintenance, danger: true },
    { icon: UserPlus, title: "Allow new sign-ups", desc: "Let new users create accounts.", on: signups, set: setSignups },
    { icon: Wand2, title: "Enable generation", desc: "Allow users to run video / image generations.", on: generation, set: setGeneration },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">Platform settings</h1>
        <p className="mt-1.5 text-sm text-muted">Global switches and integration status.</p>
      </div>

      <div className="card divide-y divide-line p-0">
        {rows.map((r) => (
          <div key={r.title} className="flex items-center gap-4 p-5">
            <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", r.danger ? "bg-danger/15 text-danger" : "bg-brand/15 text-brand-light")}>
              <r.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{r.title}</p>
              <p className="text-xs text-muted">{r.desc}</p>
            </div>
            <Toggle on={r.on} onClick={() => r.set(!r.on)} />
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-brand-light" />
            <h2 className="font-display text-base font-semibold text-ink">Generation engine</h2>
          </div>
          <div className="mt-4 space-y-3">
            <Status label="Leonardo image (Lightning XL)" value="Operational" ok />
            <Status label="Leonardo video (Motion 2.0)" value="Operational" ok />
            <Status label="Voice engine" value="Connecting" />
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-brand-light" />
            <h2 className="font-display text-base font-semibold text-ink">API keys</h2>
          </div>
          <p className="mt-4 text-sm text-muted">
            The Leonardo API key is read from the server environment
            (<code className="rounded bg-base px-1 text-ink-soft">LEONARDO_API_KEY</code>).
            When empty, the studio runs in <span className="text-accent">mock mode</span>.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-line bg-base/40 px-4 py-3 text-sm">
            <ShieldCheck className="h-4 w-4 text-teal" />
            <span className="text-ink-soft">Keys are stored server-side, never exposed to the browser.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Status({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-line bg-base/40 px-4 py-3">
      <span className="text-sm text-ink-soft">{label}</span>
      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs", ok ? "bg-teal/15 text-teal" : "bg-amber/15 text-amber")}>
        <span className={cn("h-1.5 w-1.5 rounded-full", ok ? "bg-teal" : "bg-amber")} />
        {value}
      </span>
    </div>
  );
}
