"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  LogIn,
  UserCog,
  UserX,
  Trash2,
  KeyRound,
  ShieldPlus,
  Activity as ActivityIcon,
} from "lucide-react";

interface Log {
  id: string;
  actor: string;
  action: string;
  target: string;
  meta?: Record<string, unknown>;
  createdAt?: string;
}

function iconFor(action: string) {
  if (action.includes("login")) return { Icon: LogIn, tone: "#2dd4bf" };
  if (action.startsWith("user.delete") || action.startsWith("admin.delete")) return { Icon: UserX, tone: "#fb7185" };
  if (action.startsWith("content.delete")) return { Icon: Trash2, tone: "#fb7185" };
  if (action.startsWith("apikey")) return { Icon: KeyRound, tone: "#fbbf24" };
  if (action.startsWith("admin.create")) return { Icon: ShieldPlus, tone: "#8b5cf6" };
  if (action.startsWith("user.") || action.startsWith("admin.")) return { Icon: UserCog, tone: "#22d3ee" };
  return { Icon: ActivityIcon, tone: "#a78bfa" };
}

function label(action: string) {
  const map: Record<string, string> = {
    "admin.login": "signed in",
    "user.update": "updated user",
    "user.delete": "deleted user",
    "content.delete": "removed content",
    "apikey.update": "updated API key",
    "admin.create": "created admin",
    "admin.update": "updated admin",
    "admin.delete": "deleted admin",
  };
  return map[action] || action;
}

export default function ActivityPage() {
  const [items, setItems] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/activity")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">Activity log</h1>
        <p className="mt-1.5 text-sm text-muted">A running audit trail of every admin action.</p>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-brand-light" /></div>
      ) : items.length === 0 ? (
        <div className="card px-6 py-14 text-center text-sm text-muted">No activity recorded yet.</div>
      ) : (
        <div className="card p-0">
          <ul className="divide-y divide-line-soft">
            {items.map((log) => {
              const { Icon, tone } = iconFor(log.action);
              const changes = (log.meta?.changes as string[] | undefined)?.join(", ");
              return (
                <li key={log.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: `${tone}22`, color: tone }}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink-soft">
                      <span className="font-medium text-ink">{log.actor}</span> {label(log.action)}{" "}
                      {log.target && <span className="text-muted">· {log.target}</span>}
                      {changes && <span className="text-faint"> ({changes})</span>}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-faint">
                    {log.createdAt ? new Date(log.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
