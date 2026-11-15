import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Generation } from "@/models/Generation";
import { getAdminSession, can } from "@/lib/adminAuth";
import { logActivity } from "@/lib/activity";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!can(session, "users")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    await connectDB();
    const user = await User.findById(id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const changes: string[] = [];
    if (typeof body.credits === "number") {
      user.credits = Math.max(0, Math.round(body.credits));
      changes.push(`credits=${user.credits}`);
    }
    if (["free", "starter", "premium", "business"].includes(body.plan)) {
      user.plan = body.plan;
      changes.push(`plan=${body.plan}`);
    }
    if (["user", "admin"].includes(body.role)) {
      user.role = body.role;
      changes.push(`role=${body.role}`);
    }
    if (["active", "suspended"].includes(body.status)) {
      user.status = body.status;
      changes.push(`status=${body.status}`);
    }
    await user.save();
    await logActivity(session!.email, "user.update", user.email, { changes });

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
  const session = await getAdminSession();
  if (!can(session, "users")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { id } = await ctx.params;
    await connectDB();
    const user = await User.findById(id);
    await Generation.deleteMany({ user: id });
    await User.findByIdAndDelete(id);
    await logActivity(session!.email, "user.delete", user?.email || id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
