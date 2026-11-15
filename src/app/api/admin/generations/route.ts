import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Generation } from "@/models/Generation";
import { User } from "@/models/User";
import { getAdminSession } from "@/lib/adminAuth";

export async function GET(req: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  try {
    await connectDB();
    void User; // ensure User model is registered for populate
    const { searchParams } = new URL(req.url);
    const kind = searchParams.get("kind");
    const query: Record<string, unknown> = {};
    if (kind && kind !== "all") query.kind = kind;

    const docs = await Generation.find(query)
      .sort({ createdAt: -1 })
      .limit(60)
      .populate("user", "name email");

    const items = docs.map((g) => {
      const u = g.user as unknown as { _id?: unknown; name?: string; email?: string } | null;
      return {
        _id: String(g._id),
        kind: g.kind,
        prompt: g.prompt,
        outputs: g.outputs,
        thumbnail: g.thumbnail,
        creditsUsed: g.creditsUsed,
        mock: g.mock,
        createdAt: (g as unknown as { createdAt?: Date }).createdAt?.toISOString(),
        user: u ? { name: u.name, email: u.email } : null,
      };
    });
    return NextResponse.json({ items });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await connectDB();
    await Generation.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
