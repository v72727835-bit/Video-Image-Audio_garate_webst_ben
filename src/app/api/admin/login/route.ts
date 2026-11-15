import { NextResponse } from "next/server";
import { adminLogin, signAdmin, setAdminCookie } from "@/lib/adminAuth";
import { logActivity } from "@/lib/activity";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    const admin = await adminLogin(email, password);
    if (!admin) {
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
    }
    await setAdminCookie(signAdmin(admin));
    await logActivity(admin.email, "admin.login", admin.email);
    return NextResponse.json({
      ok: true,
      admin: { email: admin.email, name: admin.name, role: admin.role },
    });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
