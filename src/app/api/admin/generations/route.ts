import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Generation } from "@/models/Generation";
import { User } from "@/models/User";
import { getAdminSession, can } from "@/lib/adminAuth";
import { logActivity } from "@/lib/activity";

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!can(session, "content")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    await connectDB();
    void User; // register model for populate
    const { searchParams } = new URL(req.url);
    const kind = searchParams.get("kind");
    const user = searchParams.get("user");
    const query: Record<string, unknown> = {};
    if (kind && kind !== "all") query.kind = kind;
    if (user) query.user = user;

    const docs = await Generation.find(query)
      .sort({ createdAt: -1 })
      .limit(user ? 24 : 60)
      .populate("user", "name email");

    const items = docs.map((g) => {
      const u = g.user as unknown as { name?: string; email?: string } | null;
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
  const session = await getAdminSession();
  if (!can(session, "content")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await connectDB();
    await Generation.findByIdAndDelete(id);
    await logActivity(session!.email, "content.delete", id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
