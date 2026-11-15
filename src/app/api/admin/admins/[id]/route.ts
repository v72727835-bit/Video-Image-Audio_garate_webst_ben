import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { Admin } from "@/models/Admin";
import { getAdminSession, can } from "@/lib/adminAuth";
import { logActivity } from "@/lib/activity";
import { ALL_PERMISSIONS } from "@/lib/permissions";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!can(session, "admins")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    await connectDB();
    const admin = await Admin.findById(id);
    if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

    // only a super can modify another super
    if (admin.role === "super" && session!.role !== "super") {
      return NextResponse.json({ error: "Only a super admin can modify a super admin." }, { status: 403 });
    }

    if (typeof body.name === "string" && body.name.trim()) admin.name = body.name.trim();
    if (typeof body.password === "string" && body.password.length >= 6) {
      admin.passwordHash = await bcrypt.hash(body.password, 10);
    }
    if (Array.isArray(body.permissions)) {
      const allowed = session!.role === "super" ? ALL_PERMISSIONS : session!.permissions;
      admin.permissions = body.permissions.filter((p: string) =>
        allowed.includes(p as (typeof allowed)[number])
      );
    }
    if (["active", "suspended"].includes(body.status)) {
      // don't let an admin suspend themselves
      if (String(admin._id) === session!.id && body.status === "suspended") {
        return NextResponse.json({ error: "You cannot suspend yourself." }, { status: 400 });
      }
      admin.status = body.status;
    }
    await admin.save();
    await logActivity(session!.email, "admin.update", admin.email);
    return NextResponse.json({
      admin: {
        id: String(admin._id),
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        status: admin.status,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!can(session, "admins")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { id } = await ctx.params;
    if (id === session!.id) {
      return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
    }
    await connectDB();
    const admin = await Admin.findById(id);
    if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    if (admin.role === "super" && session!.role !== "super") {
      return NextResponse.json({ error: "Only a super admin can delete a super admin." }, { status: 403 });
    }
    // never delete the last super admin
    if (admin.role === "super") {
      const supers = await Admin.countDocuments({ role: "super" });
      if (supers <= 1) {
        return NextResponse.json({ error: "Cannot delete the last super admin." }, { status: 400 });
      }
    }
    await Admin.findByIdAndDelete(id);
    await logActivity(session!.email, "admin.delete", admin.email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
