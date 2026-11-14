# Lumina Studio — AI Video, Image & Audio Generation (User Panel)

A cinematic, production-grade **user panel** for a text-to-media SaaS, powered by
the [Leonardo.ai](https://leonardo.ai) API. Built as the first slice of the
AI Video Engine business plan: a professional landing page, authentication, and
a full creator dashboard where users turn text into video and images.

> **Scope of this build:** User-facing panel only (no admin). Landing → login →
> dashboard with Text-to-Video, Text-to-Image, gallery, credits/billing and
> settings.

## Tech stack

| Layer      | Choice                                   |
| ---------- | ---------------------------------------- |
| Framework  | Next.js 16 (App Router) + TypeScript     |
| Styling    | Tailwind CSS v4                          |
| State      | Redux Toolkit + react-redux              |
| Backend    | Next.js Route Handlers (Node runtime)    |
| Database   | MongoDB + Mongoose                       |
| Auth       | JWT (httpOnly cookie) + bcrypt           |
| AI engine  | Leonardo.ai (image + Motion video)       |
| Icons/anim | lucide-react + framer-motion             |

## Features

- **Professional landing page** — hero, tool showcase, features, pricing, CTA.
- **Auth** — register / login / logout with hashed passwords and JWT sessions;
  protected `/dashboard` routes via middleware.
- **Creator dashboard** — overview with stats, Text-to-Video, Text-to-Image,
  a unified gallery, billing/credits and profile settings.
- **Credit system** — each generation estimates and deducts credits; balance is
  reflected live in the UI.
- **Mock mode** — with no `LEONARDO_API_KEY`, generations return clearly-labelled
  demo media so the whole panel works out of the box.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in MONGODB_URI (and optionally LEONARDO_API_KEY)
pnpm dev
```

Open http://localhost:3000.

- Sign up to get **150 free credits**.
- Generate from **Text to Video** / **Text to Image**.
- Without a Leonardo key the app runs in **Demo mode** (placeholder media).

## Notes & next steps

- **Audio** generation is a "coming soon" placeholder — Leonardo does not expose
  an audio API. Wire it to a dedicated provider (e.g. ElevenLabs) later.
- **Video endpoint** params follow Leonardo's v1 REST shape; confirm against the
  current docs (Motion 2.0 / Seedance) before production.
- **Payments** (Razorpay) and the **admin panel** are intentionally out of scope
  for this slice.
