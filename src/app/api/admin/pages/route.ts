import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { getAdminSession, can } from "@/lib/adminAuth";
import { logActivity } from "@/lib/activity";
import { DEFAULT_PAGES } from "@/lib/pages";

export async function GET() {
  const session = await getAdminSession();
  if (!can(session, "pages")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    await connectDB();
    const docs = await Page.find();
    const overrides = new Map(docs.map((d) => [d.slug, d]));
    const items = DEFAULT_PAGES.map((def) => {
      const o = overrides.get(def.slug);
      return {
        slug: def.slug,
        title: o?.title ?? def.title,
        content: o?.content ?? def.content,
        published: o ? o.published : true,
        source: o ? "edited" : "default",
      };
    });
    return NextResponse.json({ items });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getAdminSession();
  if (!can(session, "pages")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { slug, title, content, published } = await req.json();
    if (!DEFAULT_PAGES.some((p) => p.slug === slug)) {
      return NextResponse.json({ error: "Unknown page." }, { status: 400 });
    }
    await connectDB();
    await Page.findOneAndUpdate(
      { slug },
      { slug, title, content, published: published !== false },
      { upsert: true, new: true }
    );
    await logActivity(session!.email, "page.update", slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
