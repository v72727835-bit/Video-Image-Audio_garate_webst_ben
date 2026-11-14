import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

/**
 * Audio generation placeholder.
 *
 * Leonardo.ai does not currently expose an audio-generation API. This endpoint
 * intentionally returns 501 so the UI can show an honest "coming soon" state.
 * Wire this to a dedicated audio provider (e.g. ElevenLabs) when available.
 */
export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  return NextResponse.json(
    {
      error:
        "Audio generation is coming soon. It will connect to a dedicated voice/music provider.",
    },
    { status: 501 }
  );
}
