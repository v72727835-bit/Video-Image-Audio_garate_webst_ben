export function Gauge({
  value,
  from = "#8b5cf6",
  to = "#22d3ee",
  size = 150,
  label,
}: {
  value: number; // 0..100
  from?: string;
  to?: string;
  size?: number;
  label?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  const r = 80;
  const len = Math.PI * r; // semicircle length
  const offset = len * (1 - v / 100);
  const id = `g-${from.replace("#", "")}-${to.replace("#", "")}`;

  return (
    <div className="relative inline-flex flex-col items-center" style={{ width: size }}>
      <svg viewBox="0 0 200 118" width={size} className="overflow-visible">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
        </defs>
        <path
          d="M12 104 A88 88 0 0 1 188 104"
          fill="none"
          stroke="#1c1830"
          strokeWidth="13"
          strokeLinecap="round"
        />
        <path
          d="M12 104 A88 88 0 0 1 188 104"
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth="13"
          strokeLinecap="round"
          strokeDasharray={len * 1.4}
          strokeDashoffset={offset * 1.4}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="-mt-9 text-center">
        <div className="font-display text-2xl font-bold text-ink">{v}%</div>
        {label && <div className="text-[11px] text-muted">{label}</div>}
      </div>
    </div>
  );
}
