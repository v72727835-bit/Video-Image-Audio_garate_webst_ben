import { connectDB } from "./db";
import { ActivityLog } from "@/models/ActivityLog";

export async function logActivity(
  actor: string,
  action: string,
  target = "",
  meta?: Record<string, unknown>
) {
  try {
    await connectDB();
    await ActivityLog.create({ actor, action, target, meta });
  } catch {
    // never let logging break the main action
  }
}
