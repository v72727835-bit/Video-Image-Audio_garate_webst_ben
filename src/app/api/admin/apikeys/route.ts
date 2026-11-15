import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { AppConfig } from "@/models/AppConfig";
import { getAdminSession, can } from "@/lib/adminAuth";
import { logActivity } from "@/lib/activity";

// Keys the panel can manage.
const KEYS = [
  { key: "LEONARDO_API_KEY", label: "Leonardo.ai", hint: "Enables real image & video generation" },
];

function mask(v: string) {
  if (!v) return "";
  if (v.length <= 6) return "••••";
  return "••••••" + v.slice(-4);
}

export async function GET() {
  const session = await getAdminSession();
  if (!can(session, "apikeys")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    await connectDB();
    const docs = await AppConfig.find({ key: { $in: KEYS.map((k) => k.key) } });
    const map = new Map(docs.map((d) => [d.key, d.value as string]));
    const items = KEYS.map((k) => {
      const dbVal = map.get(k.key) || "";
      const envVal = process.env[k.key] || "";
      const effective = dbVal || envVal;
      return {
        key: k.key,
        label: k.label,
        hint: k.hint,
        set: Boolean(effective),
        source: dbVal ? "panel" : envVal ? "env" : "none",
        masked: mask(effective),
      };
    });
    return NextResponse.json({ items });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!can(session, "apikeys")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { key, value } = await req.json();
    if (!KEYS.some((k) => k.key === key)) {
      return NextResponse.json({ error: "Unknown key." }, { status: 400 });
    }
    await connectDB();
    await AppConfig.findOneAndUpdate(
      { key },
      { key, value: String(value || ""), label: KEYS.find((k) => k.key === key)?.label },
      { upsert: true, new: true }
    );
    await logActivity(session!.email, "apikey.update", key, { set: Boolean(value) });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
