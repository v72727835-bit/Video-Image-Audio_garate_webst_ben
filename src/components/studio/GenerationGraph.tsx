"use client";

import { useEffect, useRef, useState } from "react";
import {
  Wand2,
  BrainCircuit,
  User,
  Mountain,
  Palette,
  Camera,
  Cpu,
  Film,
  ImageIcon,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import type { Generation } from "@/store/slices/studioSlice";

const CW = 1180;
const CH = 560;

type NodeDef = {
  id: string;
  title: string;
  sub?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  stage: number;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  kind?: "output" | "style" | "normal";
};

const baseNodes: NodeDef[] = [
  { id: "prompt", title: "Prompt", sub: "Brief parsed", x: 30, y: 232, w: 185, h: 96, stage: 0, icon: Wand2, accent: "#8b5cf6" },
  { id: "director", title: "Director AI", sub: "Scene planning", x: 275, y: 222, w: 180, h: 116, stage: 1, icon: BrainCircuit, accent: "#a78bfa" },
  { id: "subject", title: "Subject", sub: "Identity lock", x: 515, y: 36, w: 190, h: 90, stage: 2, icon: User, accent: "#22d3ee" },
  { id: "scene", title: "Scene", sub: "Environment", x: 515, y: 158, w: 190, h: 90, stage: 2, icon: Mountain, accent: "#2dd4bf" },
  { id: "style", title: "Style", sub: "Noir / cinematic", x: 515, y: 300, w: 190, h: 90, stage: 2, icon: Palette, accent: "#f472b6", kind: "style" },
  { id: "camera", title: "Camera", sub: "35mm anamorphic", x: 515, y: 430, w: 190, h: 90, stage: 2, icon: Camera, accent: "#fbbf24" },
  { id: "model", title: "Model routing", sub: "Leonardo engine", x: 765, y: 215, w: 180, h: 118, stage: 3, icon: Cpu, accent: "#6366f1" },
];

const connectors: { from: [number, number]; to: [number, number]; stage: number; color: string }[] = [
  { from: [215, 280], to: [275, 280], stage: 1, color: "#8b5cf6" },
  { from: [455, 280], to: [515, 81], stage: 2, color: "#a78bfa" },
  { from: [455, 280], to: [515, 203], stage: 2, color: "#a78bfa" },
  { from: [455, 280], to: [515, 345], stage: 2, color: "#a78bfa" },
  { from: [455, 280], to: [515, 475], stage: 2, color: "#a78bfa" },
  { from: [705, 81], to: [765, 274], stage: 3, color: "#22d3ee" },
  { from: [705, 203], to: [765, 274], stage: 3, color: "#2dd4bf" },
  { from: [705, 345], to: [765, 274], stage: 3, color: "#f472b6" },
  { from: [705, 475], to: [765, 274], stage: 3, color: "#fbbf24" },
  { from: [945, 274], to: [1000, 274], stage: 5, color: "#6366f1" },
];

const stageLabels = [
  "Analyzing prompt",
  "Planning the scene",
  "Configuring subject, style & camera",
  "Routing to the best model",
  "Rendering frames",
  "Complete",
];

function path(from: [number, number], to: [number, number]) {
  const mx = (from[0] + to[0]) / 2;
  return `M${from[0]} ${from[1]} C ${mx} ${from[1]}, ${mx} ${to[1]}, ${to[0]} ${to[1]}`;
}

export function GenerationGraph({
  active,
  kind,
  prompt,
  result,
}: {
  active: boolean;
  kind: "image" | "video";
  prompt: string;
  result?: Generation | null;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [stage, setStage] = useState(result ? 5 : 0);

  // fit the fixed canvas to container width
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / CW));
    ro.observe(el);
    setScale(el.clientWidth / CW);
    return () => ro.disconnect();
  }, []);

  // staged animation while generating
  useEffect(() => {
    if (active) {
      setStage(0);
      let s = 0;
      const t = setInterval(() => {
        s = s >= 4 ? 4 : s + 1;
        setStage(s);
      }, 650);
      return () => clearInterval(t);
    }
    setStage(result ? 5 : 0);
  }, [active, result]);

  const outputNode: NodeDef = {
    id: "output",
    title: kind === "video" ? "Video output" : "Image output",
    x: 1000,
    y: 205,
    w: 150,
    h: 140,
    stage: 5,
    icon: kind === "video" ? Film : ImageIcon,
    accent: "#2dd4bf",
    kind: "output",
  };
  const nodes = [...baseNodes, outputNode];

  return (
    <div className="overflow-hidden rounded-2xl border border-brand/25">
      {/* chrome bar */}
      <div className="flex items-center justify-between border-b border-line bg-base/80 px-4 py-2.5 text-xs">
        <div className="flex items-center gap-2 text-ink-soft">
          <span className="font-display font-semibold tracking-wide text-ink">LUMINA ENGINE</span>
          <span className="text-faint">/ pipeline</span>
        </div>
        <div className="flex items-center gap-2">
          {stage < 5 ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-light" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5 text-teal" />
          )}
          <span className={stage < 5 ? "text-brand-light" : "text-teal"}>
            {stageLabels[stage]}
          </span>
        </div>
      </div>

      {/* canvas */}
      <div ref={wrapRef} className="canvas-grid relative w-full" style={{ height: CH * scale }}>
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: CW, height: CH, transform: `scale(${scale})` }}
        >
          {/* connectors */}
          <svg viewBox={`0 0 ${CW} ${CH}`} width={CW} height={CH} className="absolute inset-0">
            <defs>
              {connectors.map((c, i) => (
                <linearGradient key={i} id={`conn-${i}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor={c.color} stopOpacity="0.2" />
                  <stop offset="1" stopColor={c.color} />
                </linearGradient>
              ))}
            </defs>
            {connectors.map((c, i) => {
              const on = stage >= c.stage;
              const flowing = stage === c.stage || (c.stage === 5 && stage === 5);
              return (
                <path
                  key={i}
                  d={path(c.from, c.to)}
                  fill="none"
                  stroke={on ? `url(#conn-${i})` : "#241f33"}
                  strokeWidth={on ? 3 : 2}
                  strokeLinecap="round"
                  strokeDasharray={flowing ? "9 9" : undefined}
                  style={{
                    animation: flowing ? "dashflow .7s linear infinite" : undefined,
                    filter: on ? `drop-shadow(0 0 6px ${c.color}88)` : undefined,
                    transition: "stroke .4s",
                  }}
                />
              );
            })}
          </svg>

          {/* nodes */}
          {nodes.map((n) => {
            const isActive = stage === n.stage || (n.stage === 2 && stage === 2);
            const isDone = stage > n.stage || (n.id === "output" && stage === 5);
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className={`node-card absolute p-3 ${isActive ? "node-active" : ""} ${
                  isDone && n.id === "output" ? "node-done" : ""
                }`}
                style={{ left: n.x, top: n.y, width: n.w, height: n.h }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ background: `${n.accent}22`, color: n.accent }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-ink">{n.title}</p>
                    {n.sub && <p className="truncate text-[11px] text-faint">{n.sub}</p>}
                  </div>
                  {isActive && n.id !== "output" && (
                    <span
                      className="animate-pulse-dot ml-auto h-2 w-2 shrink-0 rounded-full"
                      style={{ background: n.accent }}
                    />
                  )}
                </div>

                {n.id === "prompt" && (
                  <p className="mt-2 line-clamp-2 text-[11px] leading-snug text-muted">
                    {prompt || "Describe your shot…"}
                  </p>
                )}

                {n.kind === "style" && (
                  <div className="mt-2.5 flex gap-1.5">
                    {["#0b0b12", "#f472b6", "#22d3ee", "#a78bfa", "#fbbf24"].map((c) => (
                      <span key={c} className="h-4 w-4 rounded" style={{ background: c }} />
                    ))}
                  </div>
                )}

                {n.id === "output" && (
                  <div className="mt-2 h-[70px] w-full overflow-hidden rounded-lg border border-line bg-black/40">
                    {result && stage === 5 ? (
                      kind === "video" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={result.thumbnail || result.outputs[0]}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={result.outputs[0]} alt="" className="h-full w-full object-cover" />
                      )
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        {stage >= 4 ? (
                          <Loader2 className="h-5 w-5 animate-spin text-teal" />
                        ) : (
                          <span className="text-[10px] text-faint">awaiting render</span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* faux minimap */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg border border-line bg-base/70 px-2.5 py-1.5 text-[10px] text-faint backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-light" /> live pipeline · 100%
          </div>
        </div>
      </div>
    </div>
  );
}
