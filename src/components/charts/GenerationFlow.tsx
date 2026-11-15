type Node = { id: string; label: string; y: number; color: string };

const colA: Node[] = [
  { id: "txt", label: "Text prompts", y: 40, color: "#8b5cf6" },
  { id: "img", label: "Image refs", y: 120, color: "#22d3ee" },
  { id: "sty", label: "Style kits", y: 200, color: "#f472b6" },
];
const colB: Node[] = [
  { id: "plan", label: "Director AI", y: 70, color: "#a78bfa" },
  { id: "render", label: "Render farm", y: 170, color: "#2dd4bf" },
];
const colC: Node[] = [
  { id: "video", label: "Video", y: 40, color: "#6366f1" },
  { id: "image", label: "Image", y: 120, color: "#38bdf8" },
  { id: "audio", label: "Audio", y: 200, color: "#fb7185" },
];

const links: { from: Node; to: Node; w: number; c: string }[] = [
  { from: colA[0], to: colB[0], w: 14, c: "#8b5cf6" },
  { from: colA[1], to: colB[0], w: 8, c: "#22d3ee" },
  { from: colA[1], to: colB[1], w: 7, c: "#22d3ee" },
  { from: colA[2], to: colB[1], w: 10, c: "#f472b6" },
  { from: colB[0], to: colC[0], w: 12, c: "#a78bfa" },
  { from: colB[0], to: colC[1], w: 7, c: "#a78bfa" },
  { from: colB[1], to: colC[1], w: 9, c: "#2dd4bf" },
  { from: colB[1], to: colC[2], w: 6, c: "#2dd4bf" },
];

const X = { a: 60, b: 300, c: 540 };
const NODE_W = 92;

export function GenerationFlow() {
  return (
    <svg viewBox="0 0 640 260" width="100%" className="overflow-visible">
      <defs>
        {links.map((l, i) => (
          <linearGradient key={i} id={`fl-${i}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={l.from.color} />
            <stop offset="1" stopColor={l.to.color} />
          </linearGradient>
        ))}
      </defs>

      {links.map((l, i) => {
        const x1 = X[colA.includes(l.from) ? "a" : "b"] + NODE_W;
        const x2 = X[colC.includes(l.to) ? "c" : "b"];
        const y1 = l.from.y + 14;
        const y2 = l.to.y + 14;
        const mx = (x1 + x2) / 2;
        return (
          <path
            key={i}
            d={`M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
            fill="none"
            stroke={`url(#fl-${i})`}
            strokeWidth={l.w}
            strokeLinecap="round"
            opacity="0.55"
          />
        );
      })}

      {[...colA.map((n) => ["a", n] as const), ...colB.map((n) => ["b", n] as const), ...colC.map((n) => ["c", n] as const)].map(
        ([col, n]) => (
          <g key={n.id}>
            <rect
              x={X[col]}
              y={n.y}
              width={NODE_W}
              height={28}
              rx={8}
              fill="#14121f"
              stroke={n.color}
              strokeOpacity="0.6"
            />
            <rect x={X[col]} y={n.y} width={4} height={28} rx={2} fill={n.color} />
            <text x={X[col] + 14} y={n.y + 18} fontSize="11" fill="#c6c2d6">
              {n.label}
            </text>
          </g>
        )
      )}
    </svg>
  );
}
