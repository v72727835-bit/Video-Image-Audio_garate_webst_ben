import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Generation } from "@/models/Generation";
import { getSession } from "@/lib/auth";
import { generateImage } from "@/lib/leonardo";
import { getLeonardoKey } from "@/lib/leonardoKey";
import { isPlanActive } from "@/lib/subscription";
import { toGeneration } from "@/lib/serialize";

export const maxDuration = 120;

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please sign in to generate." }, { status: 401 });
  }

  try {
    const { prompt, aspectRatio } = await req.json();
    if (!prompt || String(prompt).trim().length < 3) {
      return NextResponse.json(
        { error: "Write a slightly longer prompt to generate." },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(session.id);
    if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    if (!isPlanActive(user)) {
      return NextResponse.json(
        { error: "Your plan has expired. Please renew a plan to keep generating.", code: "plan_expired" },
        { status: 402 }
      );
    }
    if (user.credits < 20) {
      return NextResponse.json(
        { error: "Not enough credits. Top up to continue creating." },
        { status: 402 }
      );
    }

    const [w, h] = dimsFor(aspectRatio);
    const apiKey = await getLeonardoKey();
    const result = await generateImage({ prompt, width: w, height: h, numImages: 4, apiKey });

    user.credits = Math.max(0, user.credits - result.creditsUsed);
    await user.save();

    const gen = await Generation.create({
      user: user._id,
      kind: "image",
      prompt,
      model: result.mock ? "Lumina Mock Engine" : "Leonardo Lightning XL",
      aspectRatio: aspectRatio || "1:1",
      status: "completed",
      outputs: result.outputs,
      thumbnail: result.thumbnail,
      creditsUsed: result.creditsUsed,
      providerJobId: result.providerJobId,
      mock: result.mock,
    });

    return NextResponse.json({
      generation: toGeneration(gen),
      credits: user.credits,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function dimsFor(ar?: string): [number, number] {
  switch (ar) {
    case "16:9":
      return [1024, 576];
    case "9:16":
      return [576, 1024];
    case "4:3":
      return [1024, 768];
    default:
      return [768, 768];
  }
}
