import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Payment } from "@/models/Payment";
import { getSession } from "@/lib/auth";
import { getPlan } from "@/lib/plans";
import { getRazorpayKeys, verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  try {
    const { orderId, paymentId, signature } = await req.json();
    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
    }

    const { keySecret } = await getRazorpayKeys();
    if (!verifyRazorpaySignature(orderId, paymentId, signature, keySecret)) {
      return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
    }

    await connectDB();
    const payment = await Payment.findOne({ orderId, user: session.id });
    if (!payment) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    if (payment.status === "paid") {
      return NextResponse.json({ ok: true, already: true });
    }

    const plan = getPlan(payment.plan);
    if (!plan) return NextResponse.json({ error: "Invalid plan." }, { status: 400 });

    const validUntil = new Date(Date.now() + plan.days * 24 * 60 * 60 * 1000);

    const user = await User.findById(session.id);
    if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    user.plan = plan.id;
    user.credits = (user.credits || 0) + plan.credits;
    user.planExpiry = validUntil;
    await user.save();

    payment.status = "paid";
    payment.paymentId = paymentId;
    payment.validUntil = validUntil;
    await payment.save();

    return NextResponse.json({
      ok: true,
      plan: user.plan,
      credits: user.credits,
      planExpiry: validUntil.toISOString(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Verification failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
