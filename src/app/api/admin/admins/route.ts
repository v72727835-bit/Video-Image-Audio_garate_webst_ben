import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { Admin } from "@/models/Admin";
import { getAdminSession, can } from "@/lib/adminAuth";
import { logActivity } from "@/lib/activity";
import { ALL_PERMISSIONS } from "@/lib/permissions";

export async function GET() {
  const session = await getAdminSession();
  if (!can(session, "admins")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    await connectDB();
    const docs = await Admin.find().sort({ createdAt: -1 }).limit(100);
    const items = docs.map((a) => ({
      id: String(a._id),
      name: a.name,
      email: a.email,
      role: a.role,
      permissions: a.permissions || [],
      status: a.status,
      lastLogin: (a as unknown as { lastLogin?: Date }).lastLogin?.toISOString() || null,
      createdAt: (a as unknown as { createdAt?: Date }).createdAt?.toISOString(),
    }));
    return NextResponse.json({ items, self: session!.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load admins";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!can(session, "admins")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { name, email, password, permissions } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
    }
    if (String(password).length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }
    await connectDB();
    const exists = await Admin.findOne({ email: String(email).toLowerCase() });
    if (exists) {
      return NextResponse.json({ error: "An admin with this email already exists." }, { status: 409 });
    }
    // can only grant permissions the creator holds
    const allowed = session!.role === "super" ? ALL_PERMISSIONS : session!.permissions;
    const perms = (Array.isArray(permissions) ? permissions : []).filter((p: string) =>
      allowed.includes(p as (typeof allowed)[number])
    );

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      name,
      email: String(email).toLowerCase(),
      passwordHash,
      role: "sub",
      permissions: perms,
      status: "active",
    });
    await logActivity(session!.email, "admin.create", admin.email, { permissions: perms });
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
    const msg = err instanceof Error ? err.message : "Create failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
