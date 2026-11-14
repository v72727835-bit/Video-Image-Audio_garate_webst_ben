/**
 * Leonardo.ai API client.
 *
 * Supports real image + video (Motion) generation when LEONARDO_API_KEY is set,
 * and falls back to a clearly-labelled MOCK mode when it is not — so the panel
 * is fully demo-able before credentials are wired in.
 *
 * NOTE: Leonardo's video/motion params evolve (Motion 2.0 / Seedance). The
 * request bodies below follow the v1 REST shape; confirm against the current
 * docs at https://docs.leonardo.ai before going to production.
 */

const API_BASE = "https://cloud.leonardo.ai/api/rest/v1";
const API_KEY = process.env.LEONARDO_API_KEY || "";

export const leonardoEnabled = Boolean(API_KEY);

const headers = {
  accept: "application/json",
  "content-type": "application/json",
  authorization: `Bearer ${API_KEY}`,
};

export interface GenImageOptions {
  prompt: string;
  width?: number;
  height?: number;
  numImages?: number;
  modelId?: string;
}

export interface GenResult {
  outputs: string[];
  thumbnail: string;
  providerJobId: string;
  creditsUsed: number;
  mock: boolean;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ---------------- MOCK helpers (no API key) ----------------
   Generates self-contained gradient artwork as SVG data URIs so the panel
   renders real tiles even offline / before a Leonardo key is added. */

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function gradientDataUri(seed: string, w = 768, h = 768): string {
  const n = hashSeed(seed);
  const hue1 = n % 360;
  const hue2 = (hue1 + 40 + (n % 60)) % 360;
  const hue3 = (hue1 + 200) % 360;
  const cx = 20 + (n % 60);
  const cy = 15 + ((n >> 3) % 60);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>
<defs>
<linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
<stop offset='0' stop-color='hsl(${hue1},70%,22%)'/>
<stop offset='0.55' stop-color='hsl(${hue2},65%,30%)'/>
<stop offset='1' stop-color='hsl(${hue3},60%,14%)'/>
</linearGradient>
<radialGradient id='r' cx='${cx}%' cy='${cy}%' r='70%'>
<stop offset='0' stop-color='hsl(${hue2},90%,65%)' stop-opacity='0.55'/>
<stop offset='1' stop-color='hsl(${hue2},90%,65%)' stop-opacity='0'/>
</radialGradient>
</defs>
<rect width='${w}' height='${h}' fill='url(#g)'/>
<rect width='${w}' height='${h}' fill='url(#r)'/>
<circle cx='${(n % w)}' cy='${(n >> 5) % h}' r='${60 + (n % 120)}' fill='hsl(${hue3},80%,60%)' opacity='0.18'/>
<circle cx='${(n >> 7) % w}' cy='${(n >> 2) % h}' r='${40 + (n % 90)}' fill='hsl(${hue1},80%,70%)' opacity='0.14'/>
</svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function mockImages(seed: string, n: number, w = 768, h = 768): string[] {
  return Array.from({ length: n }).map((_, i) => gradientDataUri(seed + i, w, h));
}

// A tiny, self-contained sample clip (data URI) used only in demo mode.
const SAMPLE_VIDEO =
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

/* ---------------- Image generation ---------------- */

export async function generateImage(opts: GenImageOptions): Promise<GenResult> {
  const { prompt, width = 768, height = 768, numImages = 4 } = opts;

  if (!leonardoEnabled) {
    await sleep(1400);
    const outputs = mockImages(prompt + Date.now(), numImages);
    return {
      outputs,
      thumbnail: outputs[0],
      providerJobId: "mock-" + Date.now(),
      creditsUsed: numImages * 6,
      mock: true,
    };
  }

  const createRes = await fetch(`${API_BASE}/generations`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      prompt,
      width,
      height,
      num_images: numImages,
      modelId: opts.modelId || "b24e16ff-06e3-43eb-8d33-4416c2d75876", // Leonardo Lightning XL
    }),
  });
  const created = await createRes.json();
  if (!createRes.ok) {
    throw new Error(created?.error || "Leonardo image request failed");
  }
  const jobId: string = created?.sdGenerationJob?.generationId;
  const cost: number = created?.sdGenerationJob?.apiCreditCost ?? numImages * 6;

  const outputs = await pollImages(jobId);
  return {
    outputs,
    thumbnail: outputs[0] || "",
    providerJobId: jobId,
    creditsUsed: cost,
    mock: false,
  };
}

async function pollImages(jobId: string, tries = 20): Promise<string[]> {
  for (let i = 0; i < tries; i++) {
    await sleep(3000);
    const res = await fetch(`${API_BASE}/generations/${jobId}`, { headers });
    const data = await res.json();
    const gen = data?.generations_by_pk;
    if (gen?.status === "COMPLETE") {
      return (gen.generated_images || []).map(
        (img: { url: string }) => img.url
      );
    }
    if (gen?.status === "FAILED") throw new Error("Generation failed on Leonardo");
  }
  throw new Error("Generation timed out");
}

/* ---------------- Video generation (Motion / text-to-video) ---------------- */

export interface GenVideoOptions {
  prompt: string;
  duration?: number; // seconds
  aspectRatio?: string;
}

export async function generateVideo(opts: GenVideoOptions): Promise<GenResult> {
  const { prompt, duration = 5 } = opts;

  if (!leonardoEnabled) {
    await sleep(2200);
    return {
      outputs: [SAMPLE_VIDEO],
      thumbnail: gradientDataUri(prompt + "vid", 1280, 720),
      providerJobId: "mock-vid-" + Date.now(),
      creditsUsed: Math.max(1, Math.round(duration)) * 16,
      mock: true,
    };
  }

  // Real text-to-video (Motion). Endpoint/params should be confirmed against
  // current Leonardo docs for Motion 2.0 / Seedance before production use.
  const createRes = await fetch(`${API_BASE}/generations-text-to-video`, {
    method: "POST",
    headers,
    body: JSON.stringify({ prompt, duration }),
  });
  const created = await createRes.json();
  if (!createRes.ok) {
    throw new Error(created?.error || "Leonardo video request failed");
  }
  const jobId: string =
    created?.motionVideoGenerationJob?.generationId ||
    created?.sdGenerationJob?.generationId;
  const cost: number =
    created?.motionVideoGenerationJob?.apiCreditCost ?? duration * 40;

  const outputs = await pollVideo(jobId);
  return {
    outputs,
    thumbnail: "",
    providerJobId: jobId,
    creditsUsed: cost,
    mock: false,
  };
}

async function pollVideo(jobId: string, tries = 40): Promise<string[]> {
  for (let i = 0; i < tries; i++) {
    await sleep(4000);
    const res = await fetch(`${API_BASE}/generations/${jobId}`, { headers });
    const data = await res.json();
    const gen = data?.generations_by_pk;
    if (gen?.status === "COMPLETE") {
      const vids = (gen.generated_images || [])
        .map((img: { motionMP4URL?: string; url?: string }) => img.motionMP4URL || img.url)
        .filter(Boolean);
      return vids;
    }
    if (gen?.status === "FAILED") throw new Error("Video generation failed");
  }
  throw new Error("Video generation timed out");
}
