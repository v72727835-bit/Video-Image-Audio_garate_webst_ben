import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ActivityLog } from "@/models/ActivityLog";
import { getAdminSession, can } from "@/lib/adminAuth";

export async function GET() {
  const session = await getAdminSession();
  if (!can(session, "activity")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    await connectDB();
    const docs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100);
    const items = docs.map((a) => ({
      id: String(a._id),
      actor: a.actor,
      action: a.action,
      target: a.target,
      meta: a.meta,
      createdAt: (a as unknown as { createdAt?: Date }).createdAt?.toISOString(),
    }));
    return NextResponse.json({ items });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
