import { supabase } from "@/lib/supabase";
import Navbar from "@/app/components/Navbar";
import MembershipsAndFooter from "@/app/components/MembershipsAndFooter";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft, Clock, Star } from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

// ─── Markdown parser ─────────────────────────────────────────────────────────
function parseMarkdown(md: string): string {
  if (!md) return "";
  let html = md
    .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')
    .replace(/^> (.+)$/gm, '<blockquote class="md-quote">$1</blockquote>')
    .replace(/^---$/gm, '<hr class="md-hr" />')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="md-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="md-italic">$1</em>')
    .replace(/&lt;u&gt;(.+?)&lt;\/u&gt;/g, '<u class="md-underline">$1</u>')
    .replace(/<u>(.+?)<\/u>/g, '<u class="md-underline">$1</u>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="md-link" target="_blank" rel="noopener">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="md-li-bullet">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="md-li-ordered">$1</li>')
    .replace(/(<li class="md-li-bullet">[\s\S]*?<\/li>(\n|$))+/g, m => `<ul class="md-ul">${m}</ul>`)
    .replace(/(<li class="md-li-ordered">[\s\S]*?<\/li>(\n|$))+/g, m => `<ol class="md-ol">${m}</ol>`)
    .replace(/\n\n+/g, '\n\n')
    .split('\n\n')
    .map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (/^<(h[1-6]|ul|ol|blockquote|hr|div)/i.test(trimmed)) return trimmed;
      return `<p class="md-p">${trimmed.replace(/\n/g, '<br />')}</p>`;
    })
    .join('\n');
  return html;
}

function readTime(content: string) {
  return Math.max(1, Math.ceil((content?.trim().split(/\s+/).filter(Boolean).length || 0) / 200));
}

export default async function BlogPostPageJudy({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: post, error } = await supabase
    .from("posts").select("*").eq("slug", slug).single();
  if (error || !post) notFound();

  const contentHtml = parseMarkdown(post.content || "");
  const mins = readTime(post.content);

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0E1A]">
      <Navbar />

      <main className="flex-1 pb-28">

        {/* ══════════════════════════════════════════════════════════
            HERO IMAGE — sepia with arch + ornate overlay
        ══════════════════════════════════════════════════════════ */}
        <div className="relative w-full overflow-hidden" style={{ height: "clamp(300px, 45vw, 540px)" }}>
          {post.image_url ? (
            <img src={post.image_url} alt={post.title}
              className="w-full h-full object-cover"
              style={{ filter: "sepia(30%) contrast(1.05) brightness(0.85)" }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
            style={{ background: "linear-gradient(160deg, #060D1A 0%, #0F1829 100%)" }}>
              <svg viewBox="0 0 120 120" className="w-24 h-24" fill="none">
                <polygon points="60,8 72,40 104,40 78,60 88,92 60,74 32,92 42,60 16,40 48,40"
                  fill="none" stroke="#C9A84C" strokeWidth="1" opacity="0.3" />
                <circle cx="60" cy="60" r="18" fill="rgba(201,168,76,0.1)" stroke="#C9A84C" strokeWidth="0.8" opacity="0.4" />
              </svg>
            </div>
          )}

          {/* Multi-layer overlay */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(6,13,26,0.25) 0%, rgba(6,13,26,0.2) 40%, rgba(6,13,26,0.85) 100%)" }} />
          {/* Islamic star overlay decoration */}
          <div className="absolute inset-0 flex items-end justify-end pointer-events-none opacity-10 pb-8 pr-8">
            <svg viewBox="0 0 100 100" className="w-32 h-32" fill="none">
              <polygon points="50,5 60,30 85,30 65,47 72,72 50,57 28,72 35,47 15,30 40,30"
                fill="none" stroke="#C9A84C" strokeWidth="1" />
            </svg>
          </div>

          {/* Back button */}
          <div className="absolute top-28 left-0 right-0 z-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <Link href="/news"
                className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase transition-colors px-4 py-2"
                style={{ background: "rgba(6,13,26,0.55)", color: "rgba(201,168,76,0.8)", backdropFilter: "blur(8px)", border: "1px solid rgba(201,168,76,0.25)" }}>
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to News
              </Link>
            </div>
          </div>

          {/* Title panel overlaid on image */}
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8 pt-20"
            style={{ background: "linear-gradient(to top, rgba(10,4,0,0.9) 0%, transparent 100%)" }}>
            <div className="max-w-4xl mx-auto">
              <span className="inline-block text-[9px] font-black tracking-[0.25em] uppercase px-3 py-1.5 mb-4"
                style={{ background: "#C9A84C", color: "#080E1D" }}>
                Academic Publication
              </span>
              <h1 className="font-black leading-tight tracking-tight text-white"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(1.6rem,4vw,3.2rem)", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
                {post.title}
              </h1>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            ARTICLE BODY — parchment panel on dark background
        ══════════════════════════════════════════════════════════ */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

          {/* Meta strip */}
          <div className="relative flex flex-wrap items-center gap-4 sm:gap-6 mb-8 pb-6 text-sm"
            style={{ borderBottom: "1px solid rgba(201,168,76,0.15)", color: "rgba(191,168,130,0.5)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 flex items-center justify-center font-black text-xs"
                style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", color: "#C9A84C" }}>
                GH
              </div>
              <span className="font-semibold text-sm" style={{ color: "#F5EDD0" }}>Dr. Hogr Ghareeb</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" style={{ color: "rgba(201,168,76,0.55)" }} />
              <time className="text-xs" dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" style={{ color: "rgba(201,168,76,0.55)" }} />
              <span className="text-xs">{mins} min read</span>
            </div>
          </div>

          {/* Excerpt/intro */}
          {post.excerpt && (
            <div className="relative mb-8 px-6 py-5"
              style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)" }}>
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l" style={{ borderColor: "rgba(201,168,76,0.5)" }} />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r" style={{ borderColor: "rgba(201,168,76,0.5)" }} />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l" style={{ borderColor: "rgba(201,168,76,0.5)" }} />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r" style={{ borderColor: "rgba(201,168,76,0.5)" }} />
              <p className="text-sm sm:text-base leading-[1.9] font-semibold italic"
                style={{ color: "rgba(232,201,122,0.75)", fontFamily: "Georgia, serif" }}>
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Ornate rule */}
          <div className="flex items-center gap-2 mb-8">
            <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.4))" }} />
            <Star className="w-2 h-2" fill="#C9A84C" fillOpacity={0.5} style={{ color: "#C9A84C", opacity: 0.6 }} />
            <div className="w-5 h-px" style={{ background: "rgba(201,168,76,0.2)" }} />
            <Star className="w-1.5 h-1.5" style={{ color: "#C9A84C", opacity: 0.3 }} />
            <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, rgba(201,168,76,0.4))" }} />
          </div>

          {/* Markdown content */}
          <div className="post-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />

          {/* Closing ornate seal */}
          <div className="flex justify-center mt-12 mb-4 opacity-30">
            <svg viewBox="0 0 80 80" className="w-12 h-12" fill="none">
              <circle cx="40" cy="40" r="37" stroke="#C9A84C" strokeWidth="0.7" strokeDasharray="3 2.5" />
              <polygon points="40,10 50,30 72,30 55,44 62,66 40,54 18,66 25,44 8,30 30,30"
                fill="none" stroke="#C9A84C" strokeWidth="1" />
              <circle cx="40" cy="40" r="8" fill="rgba(201,168,76,0.1)" stroke="#C9A84C" strokeWidth="0.7" />
            </svg>
          </div>
        </article>
      </main>

      {/* ── Post content styles ──────────────────────────────────── */}
      <style>{`
        .post-content { color: rgba(191,168,130,0.75); font-size: 1rem; line-height: 1.9; font-family: Georgia, serif; }
        .post-content .md-p { margin: 0 0 1.3em; }
        .post-content .md-h1 { font-size: 1.7rem; font-weight: 900; margin: 1.6em 0 0.6em; font-family: Georgia, serif; color: #F5EDD0; line-height: 1.2; }
        .post-content .md-h2 { font-size: 1.35rem; font-weight: 900; margin: 1.4em 0 0.5em; font-family: Georgia, serif; color: #F5EDD0; }
        .post-content .md-h3 { font-size: 1.1rem; font-weight: 800; margin: 1.2em 0 0.4em; font-family: Georgia, serif; color: #F5EDD0; }
        .post-content .md-bold { font-weight: 800; color: #F5EDD0; }
        .post-content .md-italic { font-style: italic; }
        .post-content .md-underline { text-decoration: underline; text-decoration-color: #C9A84C; text-underline-offset: 3px; }
        .post-content .md-quote { border-left: 2px solid #C9A84C; padding: 10px 18px; margin: 1.6em 0; background: rgba(201,168,76,0.06); font-style: italic; color: rgba(232,201,122,0.65); }
        .post-content .md-hr { border: none; border-top: 1px solid rgba(201,168,76,0.2); margin: 2em 0; }
        .post-content .md-ul { list-style: none; padding: 0; margin: 0.8em 0 1.3em; }
        .post-content .md-ol { list-style: decimal; padding-left: 1.4em; margin: 0.8em 0 1.3em; color: rgba(191,168,130,0.75); }
        .post-content .md-li-bullet { padding-left: 1.3em; position: relative; margin: 0.4em 0; }
        .post-content .md-li-bullet::before { content: ""; position: absolute; left: 0; top: 0.72em; width: 5px; height: 5px; background: #C9A84C; opacity: 0.6; transform: rotate(45deg); }
        .post-content .md-li-ordered { margin: 0.4em 0; }
        .post-content .md-link { color: #C9A84C; font-weight: 600; text-decoration: underline; text-underline-offset: 2px; text-decoration-color: rgba(201,168,76,0.4); }
        .post-content .md-link:hover { color: #E8C97A; }
      `}</style>

      <MembershipsAndFooter />
    </div>
  );
}