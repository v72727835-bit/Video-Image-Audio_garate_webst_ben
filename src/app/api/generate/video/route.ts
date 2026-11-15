import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Generation } from "@/models/Generation";
import { getSession } from "@/lib/auth";
import { generateVideo } from "@/lib/leonardo";
import { getLeonardoKey } from "@/lib/leonardoKey";
import { toGeneration } from "@/lib/serialize";

export const maxDuration = 300;

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please sign in to generate." }, { status: 401 });
  }

  try {
    const { prompt, aspectRatio, duration } = await req.json();
    if (!prompt || String(prompt).trim().length < 3) {
      return NextResponse.json(
        { error: "Write a slightly longer prompt to generate." },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(session.id);
    if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const dur = Math.min(Math.max(Number(duration) || 5, 4), 30);
    const estimate = dur * 16;
    if (user.credits < estimate) {
      return NextResponse.json(
        { error: `This clip needs ~${estimate} credits. Top up to continue.` },
        { status: 402 }
      );
    }

    const apiKey = await getLeonardoKey();
    const result = await generateVideo({ prompt, duration: dur, aspectRatio, apiKey });

    user.credits = Math.max(0, user.credits - result.creditsUsed);
    await user.save();

    const gen = await Generation.create({
      user: user._id,
      kind: "video",
      prompt,
      model: result.mock ? "Lumina Mock Motion" : "Leonardo Motion",
      aspectRatio: aspectRatio || "16:9",
      duration: dur,
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
