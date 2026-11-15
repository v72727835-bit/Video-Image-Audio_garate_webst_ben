import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Generation } from "@/models/Generation";
import { getAdminSession, can } from "@/lib/adminAuth";

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!can(session, "users")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    // per-user usage
    const usageAgg = await Generation.aggregate([
      { $group: { _id: "$user", renders: { $sum: 1 }, creditsUsed: { $sum: "$creditsUsed" } } },
    ]);
    const usage = new Map(
      usageAgg.map((u: { _id: unknown; renders: number; creditsUsed: number }) => [
        String(u._id),
        { renders: u.renders, creditsUsed: u.creditsUsed },
      ])
    );

    const items = docs.map((u) => {
      const id = String(u._id);
      const use = usage.get(id) || { renders: 0, creditsUsed: 0 };
      return {
        id,
        name: u.name,
        email: u.email,
        plan: u.plan,
        role: u.role || "user",
        status: u.status || "active",
        credits: u.credits,
        renders: use.renders,
        usedCredits: use.creditsUsed,
        createdAt: (u as unknown as { createdAt?: Date }).createdAt?.toISOString(),
      };
    });
    return NextResponse.json({ items, total: items.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load users";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
