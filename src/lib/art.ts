// Deterministic gradient artwork as an SVG data URI — renders anywhere,
// offline, and gives placeholder media a real "AI render" look.
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function artGradient(seed: string, w = 400, h = 400): string {
  const n = hash(seed);
  const h1 = n % 360;
  const h2 = (h1 + 45 + (n % 70)) % 360;
  const h3 = (h1 + 200) % 360;
  const cx = 15 + (n % 65);
  const cy = 10 + ((n >> 3) % 65);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>
<defs>
<linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
<stop offset='0' stop-color='hsl(${h1},68%,24%)'/>
<stop offset='.55' stop-color='hsl(${h2},62%,30%)'/>
<stop offset='1' stop-color='hsl(${h3},58%,13%)'/>
</linearGradient>
<radialGradient id='r' cx='${cx}%' cy='${cy}%' r='70%'>
<stop offset='0' stop-color='hsl(${h2},92%,66%)' stop-opacity='.5'/>
<stop offset='1' stop-color='hsl(${h2},92%,66%)' stop-opacity='0'/>
</radialGradient>
</defs>
<rect width='${w}' height='${h}' fill='url(#g)'/>
<rect width='${w}' height='${h}' fill='url(#r)'/>
<circle cx='${n % w}' cy='${(n >> 5) % h}' r='${50 + (n % 110)}' fill='hsl(${h3},80%,60%)' opacity='.16'/>
</svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
