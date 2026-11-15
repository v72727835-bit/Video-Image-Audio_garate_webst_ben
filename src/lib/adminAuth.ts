import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "lumina-dev-secret-change-me";
const ADMIN_COOKIE = "lumina_admin";
const MAX_AGE = 60 * 60 * 24 * 3; // 3 days

// Super-admin identity comes from env. Set strong values on the server:
//   ADMIN_EMAIL=you@domain.com   ADMIN_PASSWORD=a-strong-password
// The defaults below only exist so the panel is usable before env is set.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@aivideocreat.live";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin12345";

export interface AdminSession {
  admin: true;
  email: string;
}

export function checkAdminCreds(email: string, password: string) {
  return (
    String(email).toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    String(password) === ADMIN_PASSWORD
  );
}

export function signAdmin() {
  return jwt.sign({ admin: true, email: ADMIN_EMAIL }, JWT_SECRET, {
    expiresIn: MAX_AGE,
  });
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

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AdminSession;
    return payload?.admin === true ? payload : null;
  } catch {
    return null;
  }
}

export function adminEmail() {
  return ADMIN_EMAIL;
}
