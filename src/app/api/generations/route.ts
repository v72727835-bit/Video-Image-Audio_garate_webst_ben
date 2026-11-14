import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Generation } from "@/models/Generation";
import { getSession } from "@/lib/auth";
import { toGeneration } from "@/lib/serialize";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const kind = searchParams.get("kind");
    const query: Record<string, unknown> = { user: session.id };
    if (kind && kind !== "all") query.kind = kind;

    const docs = await Generation.find(query).sort({ createdAt: -1 }).limit(60);
    return NextResponse.json({ items: docs.map(toGeneration) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
