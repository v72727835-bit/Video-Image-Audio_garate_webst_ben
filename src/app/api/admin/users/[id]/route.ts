import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Generation } from "@/models/Generation";
import { getAdminSession } from "@/lib/adminAuth";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    await connectDB();
    const user = await User.findById(id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (typeof body.credits === "number") user.credits = Math.max(0, Math.round(body.credits));
    if (["free", "starter", "premium", "business"].includes(body.plan)) user.plan = body.plan;
    if (["user", "admin"].includes(body.role)) user.role = body.role;
    if (["active", "suspended"].includes(body.status)) user.status = body.status;
    await user.save();

    return NextResponse.json({
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        plan: user.plan,
        role: user.role,
        status: user.status,
        credits: user.credits,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  try {
    const { id } = await ctx.params;
    await connectDB();
    await Generation.deleteMany({ user: id });
    await User.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
