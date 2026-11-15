import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { connectDB } from "./db";
import { Admin } from "@/models/Admin";
import { ALL_PERMISSIONS, type PermissionKey } from "./permissions";

const JWT_SECRET = process.env.JWT_SECRET || "lumina-dev-secret-change-me";
const ADMIN_COOKIE = "lumina_admin";
const MAX_AGE = 60 * 60 * 24 * 3; // 3 days

// Default super-admin, seeded on first use. Override with env on the server.
const DEFAULT_EMAIL = (process.env.ADMIN_EMAIL || "admin@aivideocreat.live").toLowerCase();
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "admin12345";

export interface AdminSession {
  id: string;
  email: string;
  name: string;
  role: "super" | "sub";
  permissions: PermissionKey[];
}

// Ensure a default super-admin exists so the panel is always reachable.
export async function ensureDefaultAdmin() {
  await connectDB();
  const supers = await Admin.countDocuments({ role: "super" });
  if (supers === 0) {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    await Admin.create({
      name: "Super Admin",
      email: DEFAULT_EMAIL,
      passwordHash,
      role: "super",
      permissions: ALL_PERMISSIONS,
      status: "active",
    });
  }
}

export async function adminLogin(email: string, password: string) {
  await ensureDefaultAdmin();
  const admin = await Admin.findOne({ email: String(email).toLowerCase() });
  if (!admin || admin.status !== "active") return null;
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return null;
  admin.lastLogin = new Date();
  await admin.save();
  return admin;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function signAdmin(admin: any) {
  return jwt.sign(
    {
      id: String(admin._id),
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
    JWT_SECRET,
    { expiresIn: MAX_AGE }
  );
}

export async function setAdminCookie(token: string) {
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

// DB-backed session: live role/permissions/status (so suspends take effect at once).
export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  let payload: { id: string };
  try {
    payload = jwt.verify(token, JWT_SECRET) as { id: string };
  } catch {
    return null;
  }
  try {
    await connectDB();
    const admin = await Admin.findById(payload.id);
    if (!admin || admin.status !== "active") return null;
    return {
      id: String(admin._id),
      email: admin.email,
      name: admin.name,
      role: admin.role,
      permissions:
        admin.role === "super" ? ALL_PERMISSIONS : (admin.permissions as PermissionKey[]),
    };
  } catch {
    return null;
  }
}

export function can(session: AdminSession | null, key: PermissionKey) {
  if (!session) return false;
  return session.role === "super" || session.permissions.includes(key);
}
