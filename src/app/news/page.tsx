"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/app/components/Navbar";
import MembershipsAndFooter from "@/app/components/MembershipsAndFooter";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Star, BookOpen, ScrollText, Feather } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

function readTime(content: string) {
  const words = content?.trim().split(/\s+/).filter(Boolean).length || 0;
  return Math.max(1, Math.ceil(words / 200));
}

type Post = {
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  created_at: string;
  content: string;
};

// ── Shared ornamental elements ───────────────────────────────────────────────
const OrnateRule = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.45))" }} />
    <Star className="w-2 h-2 shrink-0" fill="#C9A84C" fillOpacity={0.5} style={{ color: "#C9A84C", opacity: 0.7 }} />
    <div className="w-4 h-px" style={{ background: "rgba(201,168,76,0.25)" }} />
    <Star className="w-1.5 h-1.5 shrink-0" style={{ color: "#C9A84C", opacity: 0.3 }} />
    <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, rgba(201,168,76,0.45))" }} />
  </div>
);

const Brackets = ({ size = 14 }: { size?: number }) => (
  <>
    <div className="absolute top-0 left-0" style={{ width: size, height: size, borderTop: "1px solid rgba(201,168,76,0.4)", borderLeft: "1px solid rgba(201,168,76,0.4)" }} />
    <div className="absolute top-0 right-0" style={{ width: size, height: size, borderTop: "1px solid rgba(201,168,76,0.4)", borderRight: "1px solid rgba(201,168,76,0.4)" }} />
    <div className="absolute bottom-0 left-0" style={{ width: size, height: size, borderBottom: "1px solid rgba(201,168,76,0.4)", borderLeft: "1px solid rgba(201,168,76,0.4)" }} />
    <div className="absolute bottom-0 right-0" style={{ width: size, height: size, borderBottom: "1px solid rgba(201,168,76,0.4)", borderRight: "1px solid rgba(201,168,76,0.4)" }} />
  </>
);

// ── Skeleton loader ──────────────────────────────────────────────────────────
const Skeleton = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <div className={`animate-pulse rounded-sm ${className}`} style={{ background: "rgba(201,168,76,0.08)", ...style }} />
);

export default function NewsPageJudy() {
  const { t, locale, toLocalNum } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("posts")
        .select("title, slug, excerpt, image_url, created_at, content")
        .order("created_at", { ascending: false });
      setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const dateLocale = locale === "ku" ? "ckb" : locale === "ar" ? "ar" : "en-US";
  const [featured, ...rest] = posts;

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0E1A]">
      <Navbar />

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section
        className="relative pt-40 pb-24 overflow-hidden"
        style={{ background: "#0A0E1A" }}
      >
        {/* Islamic tile */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.045]" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="news-tile" x="0" y="0" width="72" height="72" patternUnits="userSpaceOnUse">
              <polygon points="36,4 44,24 64,24 48,38 54,58 36,46 18,58 24,38 8,24 28,24"
                fill="none" stroke="#C9A84C" strokeWidth="0.6" />
              <circle cx="36" cy="36" r="7" fill="none" stroke="#C9A84C" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#news-tile)" />
        </svg>
        {/* Grain */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "160px" }}
        />
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(201,168,76,0.1) 0%, transparent 60%)" }} />
        {/* Gold rules */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,#C9A84C,transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(201,168,76,0.3),transparent)" }} />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Arch ornament */}
          <div className="flex justify-center mb-6">
            <svg viewBox="0 0 240 42" className="w-52" fill="none">
              <path d="M8 40 Q8 8 120 8 Q232 8 232 40" stroke="#C9A84C" strokeWidth="0.7" fill="none" strokeDasharray="4 3.5" opacity="0.4" />
              <polygon points="120,3 124,12 120,15 116,12" stroke="#C9A84C" strokeWidth="0.7" fill="rgba(201,168,76,0.15)" />
              <polygon points="120,0 122,4 126,4 123,7 124,11 120,9 116,11 117,7 114,4 118,4"
                stroke="#C9A84C" strokeWidth="0.5" fill="rgba(201,168,76,0.2)" />
              <circle cx="8" cy="40" r="2.5" fill="#C9A84C" opacity="0.3" />
              <circle cx="232" cy="40" r="2.5" fill="#C9A84C" opacity="0.3" />
            </svg>
          </div>

          <p className="text-[10px] font-black tracking-[0.32em] uppercase italic mb-4" style={{ color: "rgba(201,168,76,0.5)" }}>
            {t("news.badge") || "Academic Publications"}
          </p>

          <h1 className="font-black leading-tight tracking-tight mb-3"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#F5EDD0", fontSize: "clamp(2.5rem,6vw,5rem)" }}>
            {t("news.title") || "News &"}{" "}
            <span style={{ color: "#C9A84C" }}>{t("news.titleAccent") || "Insights"}</span>
          </h1>

          <OrnateRule className="max-w-xs mx-auto my-5" />

          <p className="text-sm sm:text-base max-w-xl mx-auto leading-[1.9] italic"
            style={{ color: "rgba(191,168,130,0.55)", fontFamily: "Georgia, serif" }}>
            {t("news.subtitle")}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════════ */}
      <main className="flex-1 pb-28 pt-14 relative z-10" style={{ background: "#0A0E1A" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Loading skeletons ──────────────────────────────────── */}
          {loading && (
            <div className="space-y-10">
              {/* Featured skeleton */}
              <div className="relative" style={{ border: "1px solid rgba(201,168,76,0.12)" }}>
                <Brackets size={14} />
                <div className="grid lg:grid-cols-2">
                  <Skeleton className="h-72 lg:h-auto" style={{ minHeight: "320px" }} />
                  <div className="p-8 lg:p-12 space-y-4">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                    <Skeleton className="h-3 w-4/6" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1,2,3].map(i => (
                  <div key={i} className="relative overflow-hidden" style={{ border: "1px solid rgba(201,168,76,0.1)" }}>
                    <Brackets size={10} />
                    <Skeleton className="h-44" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Empty state ────────────────────────────────────────── */}
          {!loading && posts.length === 0 && (
            <div className="flex min-h-[50vh] items-center justify-center">
              <div className="relative text-center py-16 px-10">
                <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-full"
                  style={{ background: "rgba(201,168,76,0.08)" }}>
                  <BookOpen className="w-8 h-8" style={{ color: "rgba(201,168,76,0.6)" }} />
                </div>
                <OrnateRule className="mb-5 max-w-xs mx-auto" />
                <p className="text-base font-black mb-1" style={{ color: "#F5EDD0", fontFamily: "Georgia, serif" }}>
                  {t("news.noPostsTitle") || "No Publications Yet"}
                </p>
                <p className="text-sm italic" style={{ color: "rgba(191,168,130,0.4)", fontFamily: "Georgia, serif" }}>
                  {t("news.noPostsSubtitle") || "Check back soon for academic updates."}
                </p>
                <OrnateRule className="mt-5 max-w-xs mx-auto" />
              </div>
            </div>
          )}

          {/* ── Posts ──────────────────────────────────────────────── */}
          {!loading && posts.length > 0 && (
            <AnimatePresence>
              <div className="space-y-10">

                {/* ── Featured post ─────────────────────────────────── */}
                {featured && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden group"
                    style={{ border: "1px solid rgba(201,168,76,0.2)", background: "#0D1526", boxShadow: "0 16px 60px -16px rgba(0,0,0,0.6)" }}
                  >
                    <Brackets size={18} />
                    {/* Top gold rule */}
                    <div className="h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />

                    <Link href={`/news/${featured.slug}`} className="grid lg:grid-cols-2">
                      {/* Image */}
                      <div className="relative overflow-hidden" style={{ minHeight: "320px", background: "#080E1D" }}>
                        {featured.image_url ? (
                          <img src={featured.image_url} alt={featured.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            style={{ filter: "sepia(15%) contrast(1.05)" }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(145deg,#0F1829,#080E1D)" }}>
                            <BookOpen className="w-16 h-16" style={{ color: "rgba(201,168,76,0.2)" }} />
                          </div>
                        )}
                        {/* Overlay */}
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(13,21,38,0.1), rgba(13,21,38,0.5))" }} />
                        {/* "Latest" tag */}
                        <div className="absolute top-5 left-5">
                          <span className="text-[9px] font-black tracking-[0.22em] uppercase px-3 py-1.5"
                            style={{ background: "#C9A84C", color: "#120700" }}>
                            {t("news.latest") || "Latest"}
                          </span>
                        </div>
                        {/* Arch decoration on image */}
                        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20 pointer-events-none">
                          <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
                            <polygon points="40,5 48,25 68,25 52,39 58,59 40,47 22,59 28,39 12,25 32,25"
                              fill="none" stroke="#C9A84C" strokeWidth="0.8" />
                          </svg>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-8 lg:p-12 flex flex-col justify-center">
                        {/* Meta */}
                        <div className="flex items-center gap-3 mb-5 text-[11px] font-medium"
                          style={{ color: "rgba(191,168,130,0.45)" }}>
                          <Calendar className="w-3.5 h-3.5" style={{ color: "rgba(201,168,76,0.55)" }} />
                          <time>{toLocalNum(new Date(featured.created_at).toLocaleDateString(dateLocale, { month: "long", day: "numeric", year: "numeric" }))}</time>
                          <span className="w-1 h-1 rounded-full" style={{ background: "rgba(201,168,76,0.25)" }} />
                          <Clock className="w-3.5 h-3.5" />
                          <span>{toLocalNum(readTime(featured.content))} {t("news.minRead") || "min read"}</span>
                        </div>

                        <OrnateRule className="mb-5" />

                        <h2 className="font-black leading-snug mb-4 transition-colors group-hover:text-[#E8C97A]"
                          style={{ color: "#F5EDD0", fontFamily: "Georgia, serif", fontSize: "clamp(1.4rem,2.5vw,2rem)" }}>
                          {featured.title}
                        </h2>

                        {featured.excerpt && (
                          <p className="text-sm leading-[1.85] mb-7 italic line-clamp-3"
                            style={{ color: "rgba(191,168,130,0.55)", fontFamily: "Georgia, serif" }}>
                            {featured.excerpt}
                          </p>
                        )}

                        <div className="mt-auto inline-flex items-center gap-2.5 font-black text-xs tracking-[0.15em] uppercase transition-all group-hover:gap-4"
                          style={{ color: "#C9A84C" }}>
                          {t("news.readFullStory") || "Read Full Article"}
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}

                {/* ── Section divider ───────────────────────────────── */}
                {rest.length > 0 && (
                  <div className="flex items-center gap-4">
                    <OrnateRule className="flex-1" />
                    <span className="text-[9px] font-black tracking-[0.25em] uppercase italic shrink-0"
                      style={{ color: "rgba(201,168,76,0.4)" }}>
                      {t("news.moreArticles") || "More Publications"}
                    </span>
                    <OrnateRule className="flex-1" />
                  </div>
                )}

                {/* ── Rest of posts grid ────────────────────────────── */}
                {rest.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {rest.map((post, i) => (
                      <motion.article
                        key={post.slug}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
                        style={{ background: "#0D1526", border: "1px solid rgba(201,168,76,0.15)", boxShadow: "0 4px 20px -6px rgba(0,0,0,0.4)" }}
                      >
                        <Brackets size={10} />

                        {/* Image */}
                        <Link href={`/news/${post.slug}`}
                          className="block relative overflow-hidden" style={{ aspectRatio: "16/10", background: "#080E1D" }}>
                          {post.image_url ? (
                            <img src={post.image_url} alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
                              style={{ filter: "sepia(15%) contrast(1.05)" }} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"
                              style={{ background: "linear-gradient(145deg,#0F1829,#080E1D)" }}>
                              <Feather className="w-8 h-8" style={{ color: "rgba(201,168,76,0.2)" }} />
                            </div>
                          )}
                          {/* Hover vignette */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{ background: "linear-gradient(to top, rgba(13,21,38,0.7) 0%, transparent 60%)" }} />
                          {/* Corner brackets on hover */}
                          <div className="absolute inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none">
                            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l" style={{ borderColor: "rgba(201,168,76,0.6)" }} />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r" style={{ borderColor: "rgba(201,168,76,0.6)" }} />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l" style={{ borderColor: "rgba(201,168,76,0.6)" }} />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r" style={{ borderColor: "rgba(201,168,76,0.6)" }} />
                          </div>
                          {/* Gold bottom sweep */}
                          <div className="absolute bottom-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400"
                            style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />
                        </Link>

                        {/* Content */}
                        <div className="flex flex-1 flex-col p-5">
                          {/* Meta */}
                          <div className="flex items-center gap-2 mb-3 text-[10px] font-medium"
                            style={{ color: "rgba(191,168,130,0.4)" }}>
                            <Calendar className="w-3 h-3" style={{ color: "rgba(201,168,76,0.5)" }} />
                            <time>{toLocalNum(new Date(post.created_at).toLocaleDateString(dateLocale, { month: "short", day: "numeric", year: "numeric" }))}</time>
                            <span className="w-1 h-1 rounded-full" style={{ background: "rgba(201,168,76,0.2)" }} />
                            <Clock className="w-3 h-3" />
                            <span>{toLocalNum(readTime(post.content))} {t("news.min") || "min"}</span>
                          </div>

                          {/* Title */}
                          <h2 className="text-sm font-black leading-snug mb-2 line-clamp-2 transition-colors group-hover:text-[#E8C97A]"
                            style={{ color: "#F5EDD0", fontFamily: "Georgia, serif" }}>
                            <Link href={`/news/${post.slug}`}>{post.title}</Link>
                          </h2>

                          {post.excerpt && (
                            <p className="text-xs leading-relaxed mb-4 line-clamp-2 italic"
                              style={{ color: "rgba(191,168,130,0.4)", fontFamily: "Georgia, serif" }}>
                              {post.excerpt}
                            </p>
                          )}

                          {/* CTA */}
                          <div className="mt-auto pt-3" style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}>
                            <Link href={`/news/${post.slug}`}
                              className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.15em] uppercase transition-all group-hover:gap-2.5"
                              style={{ color: "rgba(201,168,76,0.65)" }}>
                              {t("news.readPost") || "Read Article"}
                              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                )}

                {/* ── Bottom ornate close ───────────────────────────── */}
                <OrnateRule className="max-w-md mx-auto" />
                <div className="text-center">
                  <p className="text-[10px] italic" style={{ color: "rgba(201,168,76,0.25)", fontFamily: "Georgia, serif" }}>
                    "And say: My Lord, increase me in knowledge." — Qur'an 20:114
                  </p>
                </div>
              </div>
            </AnimatePresence>
          )}
        </div>
      </main>

      <MembershipsAndFooter />
    </div>
  );
}