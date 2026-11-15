import Link from "next/link";
import type { ReactNode } from "react";

// Minimal, safe markdown renderer (no dangerouslySetInnerHTML).
// Supports: # / ## / ### headings, - lists, paragraphs, **bold**, _italic_, [text](url).

function inline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*|_([^_]+)_|\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[2]) nodes.push(<strong key={`${keyBase}-b${i}`} className="font-semibold text-ink">{m[2]}</strong>);
    else if (m[3]) nodes.push(<em key={`${keyBase}-i${i}`}>{m[3]}</em>);
    else if (m[4] && m[5]) {
      const href = m[5];
      const external = /^https?:\/\//.test(href);
      nodes.push(
        external ? (
          <a key={`${keyBase}-l${i}`} href={href} target="_blank" rel="noreferrer" className="text-brand-light hover:text-brand">
            {m[4]}
          </a>
        ) : (
          <Link key={`${keyBase}-l${i}`} href={href} className="text-brand-light hover:text-brand">
            {m[4]}
          </Link>
        )
      );
    }
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ content }: { content: string }) {
  const lines = content.replace(/\r/g, "").split("\n");
  const blocks: ReactNode[] = [];
  let para: string[] = [];
  let list: string[] = [];
  let key = 0;

  const flushPara = () => {
    if (para.length) {
      const text = para.join(" ");
      blocks.push(
        <p key={`p${key++}`} className="mb-4 leading-relaxed text-ink-soft">
          {inline(text, `p${key}`)}
        </p>
      );
      para = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      blocks.push(
        <ul key={`u${key++}`} className="mb-4 space-y-1.5">
          {list.map((item, idx) => (
            <li key={idx} className="flex gap-2 text-ink-soft">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-light" />
              <span>{inline(item, `u${key}-${idx}`)}</span>
            </li>
          ))}
        </ul>
      );
      list = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^###\s+/.test(line)) {
      flushPara(); flushList();
      blocks.push(<h3 key={`h${key++}`} className="font-display mb-2 mt-6 text-lg font-semibold text-ink">{inline(line.replace(/^###\s+/, ""), `h${key}`)}</h3>);
    } else if (/^##\s+/.test(line)) {
      flushPara(); flushList();
      blocks.push(<h2 key={`h${key++}`} className="font-display mb-3 mt-8 text-xl font-bold text-ink">{inline(line.replace(/^##\s+/, ""), `h${key}`)}</h2>);
    } else if (/^#\s+/.test(line)) {
      flushPara(); flushList();
      blocks.push(<h1 key={`h${key++}`} className="font-display mb-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{inline(line.replace(/^#\s+/, ""), `h${key}`)}</h1>);
    } else if (/^[-*]\s+/.test(line)) {
      flushPara();
      list.push(line.replace(/^[-*]\s+/, ""));
    } else if (line.trim() === "") {
      flushPara(); flushList();
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara(); flushList();

  return <div className="max-w-none">{blocks}</div>;
}
