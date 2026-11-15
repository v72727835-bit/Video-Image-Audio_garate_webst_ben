export function LineArea({
  series,
  height = 240,
  labels,
}: {
  series: { name: string; color: string; data: number[] }[];
  height?: number;
  labels?: string[];
}) {
  const w = 720;
  const h = height;
  const padX = 16;
  const padY = 16;
  const all = series.flatMap((s) => s.data);
  const max = Math.max(...all) * 1.1;
  const min = 0;
  const span = max - min || 1;
  const n = series[0]?.data.length || 1;

  const xy = (i: number, v: number) => {
    const x = padX + (i / (n - 1)) * (w - padX * 2);
    const y = padY + (1 - (v - min) / span) * (h - padY * 2 - 20);
    return [x, y] as const;
  };

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
      <defs>
        {series.map((s) => (
          <linearGradient key={s.name} id={`la-${s.name}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={s.color} stopOpacity="0.3" />
            <stop offset="1" stopColor={s.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>

      {/* gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((g) => {
        const y = padY + g * (h - padY * 2 - 20);
        return <line key={g} x1={padX} y1={y} x2={w - padX} y2={y} stroke="#1c1830" strokeWidth="1" />;
      })}

      {series.map((s) => {
        const pts = s.data.map((v, i) => xy(i, v));
        const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
        const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${h - 20} L${pts[0][0].toFixed(1)} ${h - 20} Z`;
        return (
          <g key={s.name}>
            <path d={area} fill={`url(#la-${s.name})`} />
            <path d={line} fill="none" stroke={s.color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}

      {labels &&
        labels.map((l, i) => {
          const x = padX + (i / (labels.length - 1)) * (w - padX * 2);
          return (
            <text key={l} x={x} y={h - 4} fontSize="11" fill="#605b73" textAnchor="middle">
              {l}
            </text>
          );
        })}
    </svg>
  );
}
