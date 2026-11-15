const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// deterministic pseudo-random intensity
function intensity(d: number, h: number): number {
  const n = (d * 7 + h * 13 + 3) % 11;
  const peak = h >= 9 && h <= 20 ? 1 : 0.35;
  return Math.min(1, (n / 10) * peak + 0.05);
}

export function Heatmap({ hours = 24 }: { hours?: number }) {
  return (
    <div>
      <div className="flex gap-1.5">
        <div className="flex flex-col justify-between py-0.5 pr-1 text-[9px] text-faint">
          {days.map((d) => (
            <span key={d} className="h-3.5 leading-3.5">
              {d}
            </span>
          ))}
        </div>
        <div className="flex-1 space-y-1">
          {days.map((_, di) => (
            <div key={di} className="flex gap-1">
              {Array.from({ length: hours }).map((__, hi) => {
                const v = intensity(di, hi);
                return (
                  <div
                    key={hi}
                    className="h-3.5 flex-1 rounded-[3px]"
                    style={{
                      background: `rgba(139,92,246,${v})`,
                      boxShadow: v > 0.75 ? "0 0 6px -1px rgba(139,92,246,0.8)" : undefined,
                    }}
                    title={`${v > 0.7 ? "High" : v > 0.4 ? "Medium" : "Low"} activity`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] text-faint">
        <span>Less</span>
        {[0.15, 0.4, 0.65, 0.9].map((v) => (
          <span key={v} className="h-3 w-3 rounded-[3px]" style={{ background: `rgba(139,92,246,${v})` }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
