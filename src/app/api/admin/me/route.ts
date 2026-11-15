import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/adminAuth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  return NextResponse.json({
    admin: {
      id: session.id,
      email: session.email,
      name: session.name,
      role: session.role,
      permissions: session.permissions,
    },
  });
}
