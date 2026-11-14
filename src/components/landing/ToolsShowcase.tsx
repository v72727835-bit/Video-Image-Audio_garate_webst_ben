import { Clapperboard, ImageIcon, AudioLines, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const tools = [
  {
    icon: Clapperboard,
    name: "Text to Video",
    desc: "Describe a scene and get a cinematic clip with camera motion, lighting and mood — up to 30 seconds.",
    tag: "Motion 2.0",
    img: "https://picsum.photos/seed/lumina-video/640/420",
    live: true,
    accent: "from-brand-light/30 to-indigo/10",
  },
  {
    icon: ImageIcon,
    name: "Text to Image",
    desc: "Photoreal shots, concept art, product renders and portraits in seconds — four variations every run.",
    tag: "Lightning XL",
    img: "https://picsum.photos/seed/lumina-image/640/420",
    live: true,
    accent: "from-indigo/30 to-brand/10",
  },
  {
    icon: AudioLines,
    name: "Voice & Music",
    desc: "Narration, sound design and score to finish your story. Connecting to a dedicated audio engine.",
    tag: "Coming soon",
    img: "https://picsum.photos/seed/lumina-audio/640/420",
    live: false,
    accent: "from-accent/20 to-brand/5",
  },
];

export function ToolsShowcase() {
  return (
    <section id="tools" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="One studio, every format"
          title="Create video, images and sound in a single flow"
          subtitle="Switch between tools without switching tabs. Everything shares your prompts, references and project memory."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {tools.map((t) => (
            <div
              key={t.name}
              className="card group relative overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.img}
                  alt={t.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${t.accent} mix-blend-screen opacity-70`}
                />
                <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                  {t.tag}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand-light">
                    <t.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {t.name}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{t.desc}</p>
                <Link
                  href={t.live ? "/signup" : "#pricing"}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-light hover:text-brand"
                >
                  {t.live ? "Try it now" : "Get notified"}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">
        {eyebrow}
      </span>
      <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base text-muted">{subtitle}</p>}
    </div>
  );
}
