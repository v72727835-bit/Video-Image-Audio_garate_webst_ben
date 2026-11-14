import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { getSession } from "@/lib/auth";
import { toUserProfile } from "@/lib/serialize";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  try {
    await connectDB();
    const user = await User.findById(session.id);
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    return NextResponse.json({ user: toUserProfile(user) });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  try {
    const { name } = await req.json();
    await connectDB();
    const user = await User.findById(session.id);
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    if (typeof name === "string" && name.trim().length >= 2) {
      user.name = name.trim();
    }
    await user.save();
    return NextResponse.json({ user: toUserProfile(user) });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
