"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Check, FileText, ExternalLink, Eye } from "lucide-react";
import { Markdown } from "@/components/ui/Markdown";
import { cn } from "@/lib/cn";

interface CmsPage {
  slug: string;
  title: string;
  content: string;
  source: "edited" | "default";
}

export default function AdminPages() {
  const [items, setItems] = useState<CmsPage[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/pages");
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
    if (!active && data.items?.length) select(data.items[0]);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function select(p: CmsPage) {
    setActive(p.slug);
    setTitle(p.title);
    setContent(p.content);
    setPreview(false);
  }

  async function save() {
    if (!active) return;
    setSaving(true);
    const res = await fetch("/api/admin/pages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: active, title, content }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      setItems((prev) => prev.map((x) => (x.slug === active ? { ...x, title, content, source: "edited" } : x)));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">Pages (CMS)</h1>
        <p className="mt-1.5 text-sm text-muted">Edit the content of every public website page.</p>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-brand-light" /></div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
          {/* page list */}
          <div className="card h-fit p-2">
            {items.map((p) => (
              <button
                key={p.slug}
                onClick={() => select(p)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                  active === p.slug ? "bg-brand/15 text-ink" : "text-muted hover:bg-white/[0.04] hover:text-ink"
                )}
              >
                <FileText className="h-4 w-4 shrink-0 text-faint" />
                <span className="flex-1 truncate">{p.title}</span>
                {p.source === "edited" && <span className="h-1.5 w-1.5 rounded-full bg-teal" />}
              </button>
            ))}
          </div>

          {/* editor */}
          {active && (
            <div className="card p-5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-faint">
                  <span className="rounded-md bg-base px-2 py-1 font-mono">/page/{active}</span>
                  <Link href={`/page/${active}`} target="_blank" className="inline-flex items-center gap-1 text-brand-light hover:text-brand">
                    <ExternalLink className="h-3.5 w-3.5" /> View
                  </Link>
                </div>
                <button
                  onClick={() => setPreview((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs text-ink-soft hover:border-brand/40"
                >
                  <Eye className="h-3.5 w-3.5" /> {preview ? "Edit" : "Preview"}
                </button>
              </div>

              {preview ? (
                <div className="rounded-xl border border-line bg-base/40 p-5">
                  <Markdown content={content} />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-soft">Page title</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-xl border border-line bg-base/60 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand/50"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-soft">Content (Markdown)</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={16}
                      className="w-full resize-y rounded-xl border border-line bg-base/60 p-4 font-mono text-sm text-ink outline-none focus:border-brand/50"
                    />
                    <p className="mt-1.5 text-xs text-faint">Supports # headings, - lists, **bold**, _italic_ and [links](url).</p>
                  </div>
                </div>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  onClick={save}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-light to-indigo px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
                  {saved ? "Saved" : "Save page"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
