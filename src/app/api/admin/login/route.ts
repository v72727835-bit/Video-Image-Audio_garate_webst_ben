import { NextResponse } from "next/server";
import { checkAdminCreds, signAdmin, setAdminCookie, adminEmail } from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    if (!checkAdminCreds(email, password)) {
      return NextResponse.json({ error: "Invalid super-admin credentials." }, { status: 401 });
    }
    await setAdminCookie(signAdmin());
    return NextResponse.json({ ok: true, email: adminEmail() });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
