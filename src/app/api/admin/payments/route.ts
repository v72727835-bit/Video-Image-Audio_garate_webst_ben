import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Payment } from "@/models/Payment";
import { User } from "@/models/User";
import { getAdminSession, can } from "@/lib/adminAuth";

export async function GET() {
  const session = await getAdminSession();
  if (!can(session, "payments")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    await connectDB();
    const docs = await Payment.find().sort({ createdAt: -1 }).limit(200);
    const items = docs.map((p) => ({
      id: String(p._id),
      userName: p.userName,
      userEmail: p.userEmail,
      plan: p.plan,
      amount: p.amount,
      credits: p.credits,
      status: p.status,
      validUntil: (p as unknown as { validUntil?: Date }).validUntil?.toISOString() || null,
      createdAt: (p as unknown as { createdAt?: Date }).createdAt?.toISOString(),
    }));

    const paid = docs.filter((p) => p.status === "paid");
    const revenue = paid.reduce((s, p) => s + (p.amount || 0), 0);

    const activeSubs = await User.countDocuments({
      plan: { $ne: "free" },
      planExpiry: { $gt: new Date() },
    });

    return NextResponse.json({
      items,
      stats: {
        revenue, // paise
        paidCount: paid.length,
        activeSubs,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
