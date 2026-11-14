"use client";

import { Download, Clapperboard, ImageIcon, Clock } from "lucide-react";
import type { Generation } from "@/store/slices/studioSlice";

export function GenerationCard({ gen }: { gen: Generation }) {
  const isVideo = gen.kind === "video";
  const time = new Date(gen.createdAt).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="card overflow-hidden">
      <div className="relative">
        {isVideo ? (
          <video
            src={gen.outputs[0]}
            poster={gen.thumbnail || undefined}
            controls
            playsInline
            className="aspect-video w-full bg-black object-cover"
          />
        ) : (
          <div
            className={
              gen.outputs.length > 1
                ? "grid grid-cols-2 gap-0.5 bg-line"
                : "block"
            }
          >
            {gen.outputs.slice(0, 4).map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={url}
                alt={gen.prompt}
                className="aspect-square w-full object-cover"
              />
            ))}
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
          {isVideo ? <Clapperboard className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
          {isVideo ? "Video" : "Image"}
        </span>
        {gen.mock && (
          <span className="absolute right-3 top-3 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold text-accent ring-1 ring-accent/30">
            Demo
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="line-clamp-2 text-sm text-ink-soft">{gen.prompt}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-faint">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {time}
          </span>
          <div className="flex items-center gap-3">
            <span>{gen.creditsUsed ?? 0} cr</span>
            <a
              href={gen.outputs[0]}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-brand-light hover:text-brand"
            >
              <Download className="h-3.5 w-3.5" /> Save
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
