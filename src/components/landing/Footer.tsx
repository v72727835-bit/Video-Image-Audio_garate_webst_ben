import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const cols = [
  {
    title: "Product",
    links: ["Features", "Tools", "Pricing", "Changelog"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Blog", "Contact"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Community", "Tutorials", "Status"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Content policy", "Licenses"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-base">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted">
              The cinematic AI studio for video, image and sound. Built for
              creators who care about craft.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {cols.map((c) => (
              <div key={c.title}>
                <h4 className="text-sm font-semibold text-ink">{c.title}</h4>
                <ul className="mt-3 space-y-2">
                  {c.links.map((l) => (
                    <li key={l}>
                      <Link
                        href="#"
                        className="text-sm text-muted transition-colors hover:text-ink"
                      >
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
          <p className="text-xs text-faint">
            © {new Date().getFullYear()} Lumina Studio. All rights reserved.
          </p>
          <p className="text-xs text-faint">
            Crafted for creators · Video, image &amp; audio generation
          </p>
        </div>
      </div>
    </footer>
  );
}
