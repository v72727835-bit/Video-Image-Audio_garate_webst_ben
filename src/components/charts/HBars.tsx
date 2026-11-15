export function HBars({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) {
  const max = Math.max(...data.map((d) => d.value)) || 1;
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-ink-soft">{d.label}</span>
            <span className="text-faint">{d.value.toLocaleString()}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: `linear-gradient(90deg, ${d.color}, ${d.color}aa)`,
                boxShadow: `0 0 12px -2px ${d.color}aa`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
