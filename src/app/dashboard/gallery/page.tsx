"use client";

import { useEffect, useMemo, useState } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGenerations, type GenKind } from "@/store/slices/studioSlice";
import { GenerationCard } from "@/components/dashboard/GenerationCard";
import { cn } from "@/lib/cn";

const tabs: { key: GenKind | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "video", label: "Videos" },
  { key: "image", label: "Images" },
];

export default function GalleryPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.studio);
  const [tab, setTab] = useState<GenKind | "all">("all");

  useEffect(() => {
    dispatch(fetchGenerations("all"));
  }, [dispatch]);

  const filtered = useMemo(
    () => (tab === "all" ? items : items.filter((i) => i.kind === tab)),
    [items, tab]
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            My Creations
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Everything you&apos;ve generated, in one gallery.
          </p>
        </div>

        <div className="flex gap-1 rounded-full border border-line bg-surface p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                tab === t.key
                  ? "bg-gradient-to-r from-brand-light to-indigo text-white"
                  : "text-muted hover:text-ink"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton aspect-[4/3] rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/15 text-brand-light">
            <GalleryVerticalEnd className="h-6 w-6" />
          </span>
          <p className="mt-4 font-display text-lg font-semibold text-ink">
            No creations yet
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted">
            Head to Text to Video or Text to Image to make your first one.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g) => (
            <GenerationCard key={g._id} gen={g} />
          ))}
        </div>
      )}
    </div>
  );
}
