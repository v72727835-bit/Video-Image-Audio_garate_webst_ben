import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Payment } from "@/models/Payment";
import { getSession } from "@/lib/auth";
import { getPlan } from "@/lib/plans";
import { getRazorpayKeys, createRazorpayOrder } from "@/lib/razorpay";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  try {
    const { planId } = await req.json();
    const plan = getPlan(planId);
    if (!plan) return NextResponse.json({ error: "Invalid plan." }, { status: 400 });

    const { keyId, keySecret, configured } = await getRazorpayKeys();
    if (!configured) {
      return NextResponse.json(
        { error: "Payments are not configured yet. Please check back soon." },
        { status: 503 }
      );
    }

    await connectDB();
    const user = await User.findById(session.id);
    if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const order = await createRazorpayOrder(plan.price, keyId, keySecret, `rcpt_${user._id}_${Date.now()}`);

    await Payment.create({
      user: user._id,
      userEmail: user.email,
      userName: user.name,
      plan: plan.id,
      amount: plan.price,
      credits: plan.credits,
      orderId: order.id,
      status: "created",
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      plan: { id: plan.id, name: plan.name, priceLabel: plan.priceLabel },
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Could not start payment";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
