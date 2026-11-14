import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";
import { toUserProfile } from "@/lib/serialize";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: "No account found with these details." },
        { status: 401 }
      );
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    const token = signToken({ id: String(user._id), email: user.email });
    await setAuthCookie(token);

    return NextResponse.json({ user: toUserProfile(user) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Login failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
