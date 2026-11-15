import type { UserDoc } from "@/models/User";
import type { GenerationDoc } from "@/models/Generation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toUserProfile(doc: any) {
  const u = doc as UserDoc;
  return {
    id: String(u._id),
    name: u.name,
    email: u.email,
    avatar: u.avatar || "",
    plan: u.plan,
    credits: u.credits,
    planExpiry: (u as unknown as { planExpiry?: Date }).planExpiry?.toISOString() || null,
    createdAt: (u as unknown as { createdAt?: Date }).createdAt?.toISOString(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toGeneration(doc: any) {
  const g = doc as GenerationDoc & { createdAt: Date };
  return {
    _id: String(g._id),
    kind: g.kind,
    prompt: g.prompt,
    status: g.status,
    outputs: g.outputs,
    thumbnail: g.thumbnail,
    model: g.model,
    aspectRatio: g.aspectRatio,
    creditsUsed: g.creditsUsed,
    mock: g.mock,
    createdAt: g.createdAt?.toISOString?.() || new Date().toISOString(),
  };
}
