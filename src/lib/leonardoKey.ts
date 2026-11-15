import { connectDB } from "./db";
import { AppConfig } from "@/models/AppConfig";

// Prefer a key stored by an admin in the panel; fall back to the server env.
export async function getLeonardoKey(): Promise<string> {
  try {
    await connectDB();
    const c = await AppConfig.findOne({ key: "LEONARDO_API_KEY" });
    if (c?.value) return c.value;
  } catch {
    // ignore and fall back
  }
  return process.env.LEONARDO_API_KEY || "";
}
