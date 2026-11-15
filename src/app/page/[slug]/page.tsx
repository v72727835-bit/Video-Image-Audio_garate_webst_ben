import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Page as PageModel } from "@/models/Page";
import { defaultPage, type PageContent } from "@/lib/pages";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Markdown } from "@/components/ui/Markdown";

export const dynamic = "force-dynamic";

async function getPage(slug: string): Promise<PageContent | null> {
  try {
    await connectDB();
    const doc = await PageModel.findOne({ slug, published: true });
    if (doc) return { slug: doc.slug, title: doc.title, content: doc.content };
  } catch {
    // fall back to default
  }
  return defaultPage(slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  return { title: page ? `${page.title} — aivideocreat` : "Page not found" };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <main className="relative">
      <Navbar />
      <section className="relative pt-32 pb-20 sm:pt-40">
        <div className="absolute inset-0 -z-10 aurora opacity-50" />
        <div className="absolute inset-0 -z-10 grid-noise opacity-40" />
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <article className="card p-7 sm:p-10">
            <Markdown content={page.content} />
          </article>
        </div>
      </section>
      <Footer />
    </main>
  );
}
