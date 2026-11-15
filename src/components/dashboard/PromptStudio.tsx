"use client";

import { useEffect, useMemo, useState } from "react";
import { Wand2, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createGeneration,
  fetchGenerations,
  clearStudioError,
  type GenKind,
} from "@/store/slices/studioSlice";
import { setCredits } from "@/store/slices/authSlice";
import { GenerationCard } from "./GenerationCard";
import { GenerationGraph } from "@/components/studio/GenerationGraph";
import { cn } from "@/lib/cn";

const ratios = ["16:9", "1:1", "9:16", "4:3"];
const durations = [4, 6, 10, 15];

const suggestions: Record<string, string[]> = {
  image: [
    "A lone astronaut on a violet alien beach, golden hour, 35mm film",
    "Minimalist product shot of a glass perfume bottle on marble",
    "Cyberpunk street food stall, neon rain, cinematic",
  ],
  video: [
    "Slow dolly through a misty pine forest at dawn, volumetric light",
    "A paper boat sailing down a rain-soaked city gutter, macro",
    "Aerial shot flying over neon Tokyo at night, cinematic",
  ],
};

export function PromptStudio({
  kind,
  title,
  description,
}: {
  kind: Extract<GenKind, "image" | "video">;
  title: string;
  description: string;
}) {
  const dispatch = useAppDispatch();
  const { generating, error, items } = useAppSelector((s) => s.studio);
  const user = useAppSelector((s) => s.auth.user);

  const [prompt, setPrompt] = useState("");
  const [ratio, setRatio] = useState(kind === "video" ? "16:9" : "1:1");
  const [duration, setDuration] = useState(6);

  useEffect(() => {
    dispatch(fetchGenerations(kind));
    return () => {
      dispatch(clearStudioError());
    };
  }, [dispatch, kind]);

  const results = useMemo(
    () => items.filter((i) => i.kind === kind),
    [items, kind]
  );
  const latest = results[0] || null;

  const estimate =
    kind === "video" ? duration * 16 : 24;

  async function onGenerate() {
    if (prompt.trim().length < 3 || generating) return;
    const res = await dispatch(
      createGeneration({ kind, prompt, aspectRatio: ratio, duration })
    );
    if (createGeneration.fulfilled.match(res)) {
      dispatch(setCredits(res.payload.credits));
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-muted">{description}</p>
      </div>

      {/* Composer */}
      <div className="card p-5 sm:p-6">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder={`Describe the ${kind} you want to create…`}
            className="w-full resize-none rounded-xl border border-line bg-base/60 p-4 pr-4 text-sm text-ink placeholder:text-faint outline-none transition-colors focus:border-brand/50 focus:ring-2 focus:ring-brand/15"
          />
        </div>

        {/* suggestion chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions[kind].map((s) => (
            <button
              key={s}
              onClick={() => setPrompt(s)}
              className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-muted transition-colors hover:border-brand/40 hover:text-ink-soft"
            >
              <Sparkles className="mr-1 inline h-3 w-3 text-brand-light" />
              {s.length > 42 ? s.slice(0, 42) + "…" : s}
            </button>
          ))}
        </div>

        {/* controls */}
        <div className="mt-5 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap gap-5">
            <Control label="Aspect ratio">
              <div className="flex gap-1.5">
                {ratios.map((r) => (
                  <Chip key={r} active={ratio === r} onClick={() => setRatio(r)}>
                    {r}
                  </Chip>
                ))}
              </div>
            </Control>

            {kind === "video" && (
              <Control label="Duration">
                <div className="flex gap-1.5">
                  {durations.map((d) => (
                    <Chip
                      key={d}
                      active={duration === d}
                      onClick={() => setDuration(d)}
                    >
                      {d}s
                    </Chip>
                  ))}
                </div>
              </Control>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted">
              Est.{" "}
              <span className="font-semibold text-ink-soft">{estimate} cr</span>
            </span>
            <button
              onClick={onGenerate}
              disabled={generating || prompt.trim().length < 3}
              className="btn-sheen inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-light via-brand to-indigo px-6 text-sm font-medium text-white shadow-[0_10px_30px_-10px_rgba(139,92,246,0.9)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" /> Generate
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-4 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            <AlertCircle className="h-4 w-4" /> {error}
          </p>
        )}
        {user && (
          <p className="mt-3 text-xs text-faint">
            Balance: {user.credits.toLocaleString()} credits
          </p>
        )}
      </div>

      {/* Live generation pipeline */}
      {(generating || latest) && (
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-faint">
            Generation pipeline
          </h2>
          <GenerationGraph
            active={generating}
            kind={kind}
            prompt={prompt || latest?.prompt || ""}
            result={generating ? null : latest}
          />
        </div>
      )}

      {/* Results */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-faint">
          Recent {kind === "video" ? "videos" : "images"}
        </h2>

        {results.length === 0 && !generating ? (
          <EmptyState kind={kind} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {results.map((g) => (
              <GenerationCard key={g._id} gen={g} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-faint">
        {label}
      </p>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all",
        active
          ? "bg-brand/20 text-ink ring-1 ring-brand/40"
          : "border border-line bg-surface text-muted hover:text-ink-soft"
      )}
    >
      {children}
    </button>
  );
}

function EmptyState({ kind }: { kind: string }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/15 text-brand-light">
        <Sparkles className="h-6 w-6" />
      </span>
      <p className="mt-4 font-display text-lg font-semibold text-ink">
        Your canvas is empty
      </p>
      <p className="mt-1 max-w-sm text-sm text-muted">
        Write a prompt above and hit generate to create your first {kind}. It
        appears here instantly.
      </p>
    </div>
  );
}
