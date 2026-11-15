const palette = [
  ["#8b5cf6", "#6366f1"],
  ["#22d3ee", "#38bdf8"],
  ["#2dd4bf", "#34d399"],
  ["#a3e635", "#fbbf24"],
  ["#fbbf24", "#fb7185"],
  ["#f472b6", "#e879f9"],
  ["#a78bfa", "#8b5cf6"],
];

export function Bars({
  data,
  height = 200,
}: {
  data: { label: string; value: number }[];
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value)) || 1;
  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((d, i) => {
        const [a, b] = palette[i % palette.length];
        const pct = (d.value / max) * 100;
        return (
          <div key={d.label} className="flex h-full flex-1 flex-col items-center gap-2">
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full origin-bottom rounded-t-lg"
                style={{
                  height: `${pct}%`,
                  background: `linear-gradient(180deg, ${a}, ${b})`,
                  boxShadow: `0 0 18px -4px ${a}99`,
                  animation: `bar-rise .7s cubic-bezier(.22,1,.36,1) ${i * 0.06}s both`,
                }}
              />
            </div>
            <span className="text-[10px] text-faint">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}
