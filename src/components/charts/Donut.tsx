export function Donut({
  data,
  size = 180,
  thickness = 26,
}: {
  data: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1c1830" strokeWidth={thickness} />
        {data.map((d, i) => {
          const frac = d.value / total;
          const dash = frac * c;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-acc * c}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 6px ${d.color}66)` }}
            />
          );
          acc += frac;
          return el;
        })}
      </svg>
      <ul className="space-y-2">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            <span className="text-ink-soft">{d.label}</span>
            <span className="ml-auto font-medium text-muted">
              {Math.round((d.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
