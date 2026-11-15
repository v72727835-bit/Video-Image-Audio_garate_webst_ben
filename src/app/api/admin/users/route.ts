import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { getAdminSession } from "@/lib/adminAuth";

export async function GET(req: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const plan = searchParams.get("plan");

    const query: Record<string, unknown> = {};
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }
    if (plan && plan !== "all") query.plan = plan;

    const docs = await User.find(query).sort({ createdAt: -1 }).limit(200);
    const items = docs.map((u) => ({
      id: String(u._id),
      name: u.name,
      email: u.email,
      plan: u.plan,
      role: u.role || "user",
      status: u.status || "active",
      credits: u.credits,
      createdAt: (u as unknown as { createdAt?: Date }).createdAt?.toISOString(),
    }));
    return NextResponse.json({ items, total: items.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load users";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
