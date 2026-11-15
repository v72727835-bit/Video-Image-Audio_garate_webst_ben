export interface PageContent {
  slug: string;
  title: string;
  content: string; // markdown
}

const brand = "aivideocreat";

// Default content for every footer page. Admins can override any of these from
// the panel; the public page shows the DB version when present, else these.
export const DEFAULT_PAGES: PageContent[] = [
  {
    slug: "features",
    title: "Features",
    content: `# Everything you need to create\n\n${brand} turns a single line of text into cinematic video and images.\n\n## Highlights\n\n- **Text to Video** — cinematic clips with motion, lighting and mood\n- **Text to Image** — four photoreal variations every run\n- **Storyboard** — plan a whole sequence shot by shot\n- **Characters** — reusable identities that stay consistent\n- **Brand kits** — lock your palette, logos and style\n- **Transparent credits** — see the cost before you generate`,
  },
  {
    slug: "tools",
    title: "Tools",
    content: `# The studio toolkit\n\n- **Video generator** — Leonardo Motion powered\n- **Image generator** — Lightning XL and more\n- **Voice & music** — coming soon\n- **Gallery** — every creation in one place\n- **Analytics** — understand your output`,
  },
  {
    slug: "pricing",
    title: "Pricing",
    content: `# Simple, predictable pricing\n\nSubscribe monthly and get a generous credit allowance. Top up anytime.\n\n- **Free** — ₹0 · 150 credits to try\n- **Starter** — ₹499 / mo · 1,200 credits\n- **Premium** — ₹1,499 / mo · 4,500 credits\n- **Business** — ₹3,999 / mo · 12,000 credits\n\nSign in to choose a plan.`,
  },
  {
    slug: "changelog",
    title: "Changelog",
    content: `# Changelog\n\n## Latest\n\n- Super admin panel with roles, API keys and activity log\n- Node-graph generation pipeline\n- Storyboard, Characters, Assets, Brand Kit and Analytics`,
  },
  {
    slug: "about",
    title: "About us",
    content: `# About ${brand}\n\nWe build the cinematic AI studio for creators who care about craft.\n\nOur mission is to make studio-grade video and images reachable for every filmmaker, marketer and storyteller.`,
  },
  {
    slug: "careers",
    title: "Careers",
    content: `# Careers\n\nWe're a small team building big things. If you love AI, design and film, we'd love to hear from you.\n\nEmail your portfolio to **careers@aivideocreat.live**.`,
  },
  {
    slug: "blog",
    title: "Blog",
    content: `# Blog\n\nStories, tips and behind-the-scenes from the ${brand} team.\n\n_New posts coming soon._`,
  },
  {
    slug: "contact",
    title: "Contact",
    content: `# Contact us\n\nWe'd love to help.\n\n- **Support** — support@aivideocreat.live\n- **Sales** — sales@aivideocreat.live\n\nWe usually reply within one business day.`,
  },
  {
    slug: "documentation",
    title: "Documentation",
    content: `# Documentation\n\nLearn how to get the most out of ${brand}.\n\n## Getting started\n\n1. Create a free account\n2. Write a prompt in Text to Video or Text to Image\n3. Pick an aspect ratio and generate\n4. Download your result`,
  },
  {
    slug: "community",
    title: "Community",
    content: `# Community\n\nJoin thousands of creators sharing prompts, styles and finished work.\n\n_Community links coming soon._`,
  },
  {
    slug: "tutorials",
    title: "Tutorials",
    content: `# Tutorials\n\nStep-by-step guides to help you master the studio.\n\n- Writing prompts that work\n- Building a consistent character\n- Planning a sequence in the storyboard`,
  },
  {
    slug: "status",
    title: "System status",
    content: `# System status\n\nAll systems operational.\n\n- Image generation — **Operational**\n- Video generation — **Operational**\n- Website — **Operational**`,
  },
  {
    slug: "privacy",
    title: "Privacy policy",
    content: `# Privacy policy\n\nWe respect your privacy. We collect only what we need to run the service and never sell your data.\n\n## What we store\n\n- Your account details\n- Your creations and prompts\n- Usage needed for billing\n\nContact **privacy@aivideocreat.live** for any request.`,
  },
  {
    slug: "terms",
    title: "Terms of service",
    content: `# Terms of service\n\nBy using ${brand} you agree to these terms.\n\n- Use the service lawfully\n- You own your creations\n- Don't abuse the platform or infringe others' rights\n\nThese terms may update over time.`,
  },
  {
    slug: "content-policy",
    title: "Content policy",
    content: `# Content policy\n\nTo keep ${brand} safe we don't allow:\n\n- Illegal content\n- Non-consensual or harmful imagery\n- Impersonation or deception\n\nViolations may lead to suspension.`,
  },
  {
    slug: "licenses",
    title: "Licenses",
    content: `# Licenses\n\nContent you generate on a paid plan is yours to use commercially, subject to our terms and the underlying model providers' policies.`,
  },
];

export const PAGE_SLUGS = DEFAULT_PAGES.map((p) => p.slug);

export function defaultPage(slug: string): PageContent | null {
  return DEFAULT_PAGES.find((p) => p.slug === slug) || null;
}
