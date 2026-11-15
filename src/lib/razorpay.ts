import crypto from "crypto";
import { connectDB } from "./db";
import { AppConfig } from "@/models/AppConfig";

export async function getRazorpayKeys() {
  let keyId = "";
  let keySecret = "";
  try {
    await connectDB();
    const docs = await AppConfig.find({ key: { $in: ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"] } });
    const map = new Map(docs.map((d) => [d.key, d.value as string]));
    keyId = map.get("RAZORPAY_KEY_ID") || "";
    keySecret = map.get("RAZORPAY_KEY_SECRET") || "";
  } catch {
    // ignore
  }
  keyId = keyId || process.env.RAZORPAY_KEY_ID || "";
  keySecret = keySecret || process.env.RAZORPAY_KEY_SECRET || "";
  return { keyId, keySecret, configured: Boolean(keyId && keySecret) };
}

export async function createRazorpayOrder(
  amount: number,
  keyId: string,
  keySecret: string,
  receipt: string
) {
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
    },
    body: JSON.stringify({ amount, currency: "INR", receipt, payment_capture: 1 }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.description || "Razorpay order creation failed");
  }
  return data as { id: string; amount: number; currency: string };
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  keySecret: string
) {
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expected === signature;
}
