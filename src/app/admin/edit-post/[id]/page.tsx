"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import slugify from "slugify";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/ui/admin-sidebar";
import {
  Save, AlertCircle, CheckCircle, Eye, Edit3, Image,
  Bold, Italic, Underline, List, ListOrdered, Quote,
  Heading2, Minus, Link as LinkIcon, Type, FileText, Layers,
} from "lucide-react";

// ─── Tiny rich-text toolbar ──────────────────────────────────────────────────
type ToolbarAction = {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  divider?: boolean;
};

function RichToolbar({ textareaRef }: { textareaRef: React.RefObject<HTMLTextAreaElement | null> }) {
  const wrap = useCallback((before: string, after: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.substring(start, end) || "text";
    const newVal = el.value.substring(0, start) + before + selected + after + el.value.substring(end);
    const nativeInputSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
    nativeInputSetter?.call(el, newVal);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.focus();
    el.setSelectionRange(start + before.length, start + before.length + selected.length);
  }, [textareaRef]);

  const insertLine = useCallback((prefix: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const lineStart = el.value.lastIndexOf("\n", start - 1) + 1;
    const newVal = el.value.substring(0, lineStart) + prefix + el.value.substring(lineStart);
    const nativeInputSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
    nativeInputSetter?.call(el, newVal);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.focus();
  }, [textareaRef]);

  const tools: ToolbarAction[] = [
    { icon: <Bold className="w-3.5 h-3.5" />, label: "Bold", action: () => wrap("**", "**") },
    { icon: <Italic className="w-3.5 h-3.5" />, label: "Italic", action: () => wrap("*", "*") },
    { icon: <Underline className="w-3.5 h-3.5" />, label: "Underline", action: () => wrap("<u>", "</u>") },
    { icon: <Heading2 className="w-3.5 h-3.5" />, label: "Heading", action: () => insertLine("## "), divider: true },
    { icon: <Quote className="w-3.5 h-3.5" />, label: "Blockquote", action: () => insertLine("> ") },
    { icon: <List className="w-3.5 h-3.5" />, label: "Bullet List", action: () => insertLine("- ") },
    { icon: <ListOrdered className="w-3.5 h-3.5" />, label: "Numbered List", action: () => insertLine("1. ") },
    { icon: <Minus className="w-3.5 h-3.5" />, label: "Divider", action: () => wrap("\n\n---\n\n", ""), divider: true },
    { icon: <LinkIcon className="w-3.5 h-3.5" />, label: "Link", action: () => wrap("[", "](url)") },
  ];

  return (
    <div
      className="flex flex-wrap items-center gap-0.5 px-3 py-2 rounded-t-xl border-b border-border"
      style={{ background: "rgba(45,106,79,0.05)" }}
    >
      {tools.map((tool, i) => (
        <span key={i} className="flex items-center gap-0.5">
          {tool.divider && i > 0 && <span className="w-px h-4 mx-1 bg-border" />}
          <motion.button
            type="button"
            title={tool.label}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={tool.action}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            {tool.icon}
          </motion.button>
        </span>
      ))}
    </div>
  );
}

// ─── Markdown renderer (simple) ──────────────────────────────────────────────
function renderMarkdown(md: string): string {
  if (!md) return "";
  return md
    .replace(/^## (.+)$/gm, '<h2 style="font-size:1.35rem;font-weight:900;margin:1.4em 0 0.5em;font-family:Georgia,serif;color:#1a2b20">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-size:1.7rem;font-weight:900;margin:1.2em 0 0.6em;font-family:Georgia,serif;color:#1a2b20">$1</h1>')
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #c8992a;padding:8px 16px;margin:1em 0;background:rgba(200,153,42,0.07);border-radius:0 8px 8px 0;color:#1a2b20;font-style:italic">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li style="margin:4px 0;padding-left:4px;color:#1a2b20">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li style="margin:4px 0;padding-left:4px;list-style-type:decimal;color:#1a2b20">$2</li>')
    .replace(/---/g, '<hr style="border:none;border-top:1px solid rgba(26,43,32,0.15);margin:1.5em 0"/>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:800;color:#1a2b20">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em style="font-style:italic">$1</em>')
    .replace(/<u>(.+?)<\/u>/g, '<u>$1</u>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#1a6b3c;text-decoration:underline;font-weight:600">$1</a>')
    .replace(/\n\n/g, '</p><p style="margin:0 0 0.85em;line-height:1.75;color:#1a2b20aa">')
    .replace(/\n/g, "<br/>");
}

// ─── Field wrapper ───────────────────────────────────────────────────────────
function FieldLabel({ icon: Icon, label, required }: { icon: React.ElementType; label: string; required?: boolean }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-primary/10">
        <Icon className="w-3.5 h-3.5 text-primary" />
      </div>
      <label className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all duration-300 placeholder:text-muted-foreground";

function StyledInput({ value, onChange, placeholder, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${inputClass} bg-background border ${focused ? "border-primary ring-2 ring-primary/20" : "border-border"} text-foreground`}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function StyledTextarea({ value, onChange, placeholder, rows = 4, textareaRef, mono }: {
  value: string; onChange: (v: string) => void; placeholder: string; rows?: number;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>; mono?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      ref={textareaRef}
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${inputClass} resize-none ${mono ? "font-mono text-xs leading-relaxed" : ""} bg-background border ${focused ? "border-primary ring-2 ring-primary/20" : "border-border"} text-foreground`}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function EditPost() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [description, setDescription] = useState("");
  const [bgImage, setBgImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const descRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;
  const charCount = description.length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
      if (data && !error) {
        setTitle(data.title || "");
        setIntro(data.excerpt || "");
        setDescription(data.content || "");
        setBgImage(data.image_url || "");
      } else {
        setStatus({ type: "error", message: "Failed to load post data." });
      }
      setIsLoading(false);
    };
    fetchPost();
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setStatus(null);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("https://api.imgbb.com/1/upload?key=7a8c1ee0c8e66e024751c1b99f8d5874", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setBgImage(data.data.display_url);
        setStatus({ type: "success", message: "Image uploaded to ImgBB! Remember to update your post to save it." });
        setTimeout(() => setStatus(null), 4000);
      } else {
        throw new Error(data.error?.message || "ImgBB upload failed.");
      }
    } catch (err: any) {
      console.error(err);
      setStatus({ type: "error", message: "Failed to upload image." });
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("You must be logged in to edit a post");

      const { error } = await supabase.from("posts").update({
        title,
        excerpt: intro,
        content: description,
        image_url: bgImage,
      }).eq("id", id);
      
      if (error) throw error;
      setStatus({ type: "success", message: "Post updated successfully!" });
      setTimeout(() => {
        router.push("/admin/manage-posts");
      }, 1500);
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Something went wrong" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <div className="flex min-h-screen items-center justify-center bg-background">
             <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-background">
          <div className="relative z-10 p-5 sm:p-7 lg:p-8">

            {/* ── Page header ─────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
                    <Edit3 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-primary">Judy Admin</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  Edit Post
                </h1>
                <p className="text-xs mt-1 text-muted-foreground">
                  Update existing news and events
                </p>
              </div>

              {/* Edit / Preview toggle */}
              <div className="flex items-center rounded-xl p-1 shrink-0 bg-muted border border-border">
                {(["edit", "preview"] as const).map((tab) => (
                  <motion.button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wide capitalize transition-colors"
                    style={{ color: activeTab === tab ? "#ffffff" : undefined }}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="tab-bg"
                        className="absolute inset-0 rounded-lg bg-primary"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    <span className={`relative z-10 flex items-center gap-1.5 ${activeTab !== tab ? "text-muted-foreground" : ""}`}>
                      {tab === "edit" ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {tab}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* ── Status banner ───────────────────────────────────── */}
            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.35 }}
                  className={`mb-6 flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold border ${
                    status.type === "success"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  {status.type === "success"
                    ? <CheckCircle className="w-5 h-5 shrink-0" />
                    : <AlertCircle className="w-5 h-5 shrink-0" />}
                  {status.message}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Split pane ──────────────────────────────────────── */}
            <div className="flex flex-col xl:flex-row gap-6">

              {/* ═══════════════════ EDITOR PANE ═══════════════════ */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 min-w-0"
              >
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Card: Post Info */}
                  <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
                    <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border bg-muted/50">
                      <Layers className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground">Post Details</span>
                    </div>
                    <div className="p-5 space-y-5">
                      {/* Title */}
                      <div>
                        <FieldLabel icon={Type} label="Post Title" required />
                        <StyledInput value={title} onChange={setTitle} placeholder="e.g., New Water Well Project in Erbil" />
                      </div>
                      {/* Intro */}
                      <div>
                        <FieldLabel icon={FileText} label="Intro / Excerpt" required />
                        <p className="text-[10px] mb-2 text-muted-foreground">
                          Short summary shown on blog cards. Keep it under 160 characters.
                        </p>
                        <StyledTextarea value={intro} onChange={setIntro} placeholder="A brief, compelling summary of the post…" rows={2} />
                      </div>
                    </div>
                  </div>

                  {/* Card: Background Image */}
                  <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
                    <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border bg-muted/50">
                      <Image className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground">Background Image</span>
                    </div>
                    <div className="p-5 space-y-4">
                      <div>
                        <FieldLabel icon={Image} label="Image URL" />
                        <div className="flex items-center gap-3">
                          <StyledInput value={bgImage} onChange={setBgImage} placeholder="https://example.com/hero-image.jpg" type="url" />
                          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingImage}
                            className="shrink-0 rounded-xl px-4 py-3 text-sm font-bold tracking-wide transition-colors disabled:opacity-50 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                          >
                            {isUploadingImage ? "Uploading..." : "Upload Image"}
                          </button>
                        </div>
                      </div>
                      {/* Preview thumbnail */}
                      <AnimatePresence>
                        {bgImage && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4 }}
                            className="overflow-hidden rounded-xl"
                          >
                            <div className="relative h-48 overflow-hidden rounded-xl border border-border">
                              <img src={bgImage} alt="Preview" key={bgImage} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <span className="absolute bottom-2.5 left-3 text-[10px] font-bold text-white/80 tracking-widest uppercase">Preview</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Card: Description / Content */}
                  <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
                    <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border bg-muted/50">
                      <Edit3 className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground">Post Content</span>
                      <span className="ml-auto text-[10px] font-bold text-muted-foreground/50">
                        Markdown supported
                      </span>
                    </div>
                    {/* Toolbar */}
                    <RichToolbar textareaRef={descRef} />
                    <div className="p-5 pt-0">
                      <div>
                        <StyledTextarea
                          value={description}
                          onChange={setDescription}
                          placeholder="Write your full post content here… Use the toolbar above for formatting."
                          rows={16}
                          textareaRef={descRef}
                          mono
                        />
                      </div>
                      {/* Word / char count */}
                      <div className="flex items-center gap-4 mt-3">
                        {[
                          { label: "words", value: wordCount },
                          { label: "chars", value: charCount },
                          { label: `min read`, value: readTime },
                        ].map(({ label, value }) => (
                          <span key={label} className="text-[10px] font-bold text-muted-foreground/60">
                            <span className="text-primary">{value}</span> {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end pt-1">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="relative inline-flex items-center gap-2.5 font-black text-sm tracking-widest px-8 py-3.5 rounded-full overflow-hidden disabled:opacity-50 bg-primary text-primary-foreground"
                    >
                      <Save className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">{isSubmitting ? "Updating…" : "Update Post"}</span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2 }}
                      />
                    </motion.button>
                  </div>
                </form>
              </motion.div>

              {/* ═══════════════════ PREVIEW PANE ══════════════════ */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`xl:w-[460px] shrink-0 ${activeTab === "preview" ? "block" : "hidden xl:block"}`}
              >
                <div className="sticky top-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground/60">Live Preview</span>
                    <span className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>

                  {/* Phone/article preview card */}
                  <div
                    className="rounded-3xl overflow-hidden border border-border"
                    style={{ background: "#fff", boxShadow: "0 20px 60px -16px rgba(0,0,0,0.12)", maxHeight: "85vh", overflowY: "auto" }}
                  >
                    {/* Hero image */}
                    <div className="relative h-52 overflow-hidden" style={{ background: "#e8e0cc" }}>
                      {bgImage ? (
                        <img src={bgImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ background: "linear-gradient(145deg, #ede4c8, #d9cfb8)" }}>
                          <Image className="w-8 h-8" style={{ color: "rgba(26,43,32,0.2)" }} />
                          <span className="text-xs font-bold" style={{ color: "rgba(26,43,32,0.25)" }}>No image added</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      {/* Category pill */}
                      <div className="absolute top-4 left-4">
                        <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-primary text-primary-foreground">
                          Foundation News
                        </span>
                      </div>
                    </div>

                    {/* Content area */}
                    <div className="px-6 py-6">
                      {/* Title */}
                      <h1
                        className="font-black leading-snug mb-3"
                        style={{ fontSize: "1.3rem", color: title ? "#1a2b20" : "rgba(26,43,32,0.2)", fontFamily: "'Georgia', serif" }}
                      >
                        {title || "Your post title will appear here…"}
                      </h1>

                      {/* Meta row */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-primary">
                          <span className="text-[10px] font-black text-white">J</span>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold" style={{ color: "#1a2b20" }}>Judy Academy</div>
                          <div className="text-[10px]" style={{ color: "rgba(26,43,32,0.4)" }}>
                            {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                            {readTime > 0 && ` · ${readTime} min read`}
                          </div>
                        </div>
                      </div>

                      {/* Gold divider */}
                      <div className="h-px w-full mb-5" style={{ background: "linear-gradient(90deg, #c8992a, transparent)" }} />

                      {/* Intro */}
                      {intro && (
                        <p className="text-sm font-semibold mb-4 leading-relaxed italic" style={{ color: "rgba(26,43,32,0.65)", borderLeft: "3px solid #c8992a", paddingLeft: "12px" }}>
                          {intro}
                        </p>
                      )}

                      {/* Full description rendered */}
                      {description ? (
                        <div
                          className="text-sm leading-relaxed"
                          style={{ color: "rgba(26,43,32,0.7)" }}
                          dangerouslySetInnerHTML={{
                            __html: `<p style="margin:0 0 0.85em;line-height:1.75;color:rgba(26,43,32,0.65)">${renderMarkdown(description)}</p>`,
                          }}
                        />
                      ) : (
                        <p className="text-sm" style={{ color: "rgba(26,43,32,0.2)" }}>Your formatted content will appear here…</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
