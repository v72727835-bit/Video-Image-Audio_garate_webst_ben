"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Trash2, Clapperboard, ImageIcon, Clock, User } from "lucide-react";
import { cn } from "@/lib/cn";

interface Gen {
  _id: string;
  kind: string;
  prompt: string;
  outputs: string[];
  thumbnail?: string;
  creditsUsed?: number;
  mock?: boolean;
  createdAt?: string;
  user?: { name?: string; email?: string } | null;
}

const tabs = ["all", "video", "image"];

export default function AdminContent() {
  const [items, setItems] = useState<Gen[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/generations?kind=${tab}`);
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    load();
  }, [load]);

  async function del(id: string) {
    await fetch(`/api/admin/generations?id=${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((x) => x._id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">Content</h1>
          <p className="mt-1.5 text-sm text-muted">Every creation across the platform. Moderate as needed.</p>
        </div>
        <div className="flex gap-1 rounded-full border border-line bg-surface p-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all",
                tab === t ? "bg-gradient-to-r from-brand-light to-indigo text-white" : "text-muted hover:text-ink"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-brand-light" />
        </div>
      ) : items.length === 0 ? (
        <div className="card px-6 py-14 text-center text-sm text-muted">No content yet.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g) => (
            <div key={g._id} className="card group overflow-hidden">
              <div className="relative aspect-video overflow-hidden bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.thumbnail || g.outputs[0]}
                  alt={g.prompt}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
                  {g.kind === "video" ? <Clapperboard className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                  {g.kind}
                </span>
                <button
                  onClick={() => del(g._id)}
                  className="absolute right-3 top-3 rounded-lg bg-black/50 p-1.5 text-white/80 backdrop-blur transition-colors hover:bg-danger hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4">
                <p className="line-clamp-2 text-sm text-ink-soft">{g.prompt}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-faint">
                  <span className="inline-flex items-center gap-1 truncate">
                    <User className="h-3 w-3 shrink-0" /> {g.user?.name || "Unknown"}
                  </span>
                  <span className="inline-flex items-center gap-1 shrink-0">
                    <Clock className="h-3 w-3" />
                    {g.createdAt ? new Date(g.createdAt).toLocaleDateString() : "—"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
