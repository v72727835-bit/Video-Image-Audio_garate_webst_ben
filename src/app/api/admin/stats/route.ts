import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Generation } from "@/models/Generation";
import { getAdminSession } from "@/lib/adminAuth";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  try {
    await connectDB();

    const since = new Date(Date.now() - 1000 * 60 * 60 * 24); // 24h
    const [totalUsers, totalGen, newUsers24h, creditsAgg, byKind, byPlan, byDay] =
      await Promise.all([
        User.countDocuments(),
        Generation.countDocuments(),
        User.countDocuments({ createdAt: { $gte: since } }),
        User.aggregate([{ $group: { _id: null, total: { $sum: "$credits" } } }]),
        Generation.aggregate([{ $group: { _id: "$kind", count: { $sum: 1 } } }]),
        User.aggregate([{ $group: { _id: "$plan", count: { $sum: 1 } } }]),
        User.aggregate([
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          { $limit: 14 },
        ]),
      ]);

    const kind = Object.fromEntries(byKind.map((k) => [k._id, k.count]));
    const plan = Object.fromEntries(byPlan.map((p) => [p._id, p.count]));

    // credits spent estimate = sum of creditsUsed across generations
    const spentAgg = await Generation.aggregate([
      { $group: { _id: null, total: { $sum: "$creditsUsed" } } },
    ]);

    return NextResponse.json({
      totalUsers,
      totalGen,
      newUsers24h,
      creditsInCirculation: creditsAgg[0]?.total || 0,
      creditsSpent: spentAgg[0]?.total || 0,
      kind: { image: kind.image || 0, video: kind.video || 0, audio: kind.audio || 0 },
      plan: {
        free: plan.free || 0,
        starter: plan.starter || 0,
        premium: plan.premium || 0,
        business: plan.business || 0,
      },
      signups: byDay.map((d: { _id: string; count: number }) => ({ date: d._id, count: d.count })),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load stats";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
