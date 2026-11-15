// Purchasable subscription plans. price is in paise (INR * 100).
export interface PlanDef {
  id: "starter" | "premium" | "business";
  name: string;
  price: number; // paise
  priceLabel: string;
  credits: number;
  days: number;
}

export const PLANS: Record<string, PlanDef> = {
  starter: { id: "starter", name: "Starter", price: 49900, priceLabel: "₹499", credits: 1200, days: 30 },
  premium: { id: "premium", name: "Premium", price: 149900, priceLabel: "₹1,499", credits: 4500, days: 30 },
  business: { id: "business", name: "Business", price: 399900, priceLabel: "₹3,999", credits: 12000, days: 30 },
};

export const PLAN_LIST = Object.values(PLANS);

export function getPlan(id: string): PlanDef | null {
  return PLANS[id] || null;
}
