const stats = [
  { value: "2M+", label: "Renders delivered", color: "from-brand-light to-indigo" },
  { value: "12K+", label: "Active creators", color: "from-cyan to-sky" },
  { value: "40+", label: "Styles & models", color: "from-pink to-fuchsia" },
  { value: "4.9/5", label: "Average rating", color: "from-amber to-rose" },
];

export function StatsBand() {
  return (
    <section className="relative border-y border-line py-14">
      <div className="absolute inset-0 -z-10 grid-noise opacity-40" />
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div
              className={`font-display bg-gradient-to-r ${s.color} bg-clip-text text-4xl font-bold text-transparent sm:text-5xl`}
            >
              {s.value}
            </div>
            <p className="mt-2 text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
