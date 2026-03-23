"use client";

import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import Link from "next/link";
import Footer from "../components/MembershipsAndFooter"; 

export default function ContactPage() {
  const { t, isRTL } = useLanguage();
  const [status, setStatus] = useState<"idle" | "submitting" | "succeeded" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    formData.append("_captcha", "false"); // Disable captcha

    try {
      const response = await fetch("https://formsubmit.co/ajax/contact@drhogrghareeb.org", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatus("succeeded");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen border-t-2 border-[#C9A84C] flex flex-col bg-[#0A0E1A] text-[#F0EBD8]" style={{ direction: isRTL ? "rtl" : "ltr" }}>
      {/* ── Background Elements ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute top-0 w-[600px] h-[600px] bg-[#C9A84C] opacity-[0.03] rounded-full blur-[120px] ${isRTL ? 'left-0' : 'right-0'}`} />
        <div className={`absolute bottom-0 w-[400px] h-[400px] bg-[#1A6B5A] opacity-[0.03] rounded-full blur-[100px] ${isRTL ? 'right-0' : 'left-0'}`} />
      </div>

      {/* ── Header Simple ── */}
      <header className="relative z-10 p-6 lg:px-16 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 group text-[#F0EBD8] hover:text-[#C9A84C] transition-colors">
          <svg className={`w-5 h-5 transition-transform ${isRTL ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-mono tracking-widest uppercase">{t("contact.back_home")}</span>
        </Link>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 relative z-10 flex items-center pt-10 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-16 w-full grid lg:grid-cols-[1fr_500px] gap-16 lg:gap-24 items-start">
          
          {/* Left / Info Side */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-6" style={{ flexDirection: isRTL ? "row-reverse" : "row" }}>
                <span className="block w-8 h-px bg-[#C9A84C]" />
                <span className="text-[#C9A84C] text-xs tracking-[0.35em] uppercase font-mono">{t("contact.contact_info")}</span>
              </div>
              <h1 className="font-serif text-5xl lg:text-7xl font-bold mb-6 leading-tight">{t("contact.title")}</h1>
              <p className="text-lg text-[rgba(240,235,216,0.6)] leading-relaxed max-w-md">
                {t("contact.subtitle")}
              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-[rgba(201,168,76,0.15)]">
              <div>
                <h3 className="text-[10px] tracking-widest uppercase font-mono text-[#C9A84C] mb-2">{t("contact.direct_email")}</h3>
                <a href="mailto:contact@drhogrghareeb.org" className="text-lg hover:text-[#C9A84C] transition-colors">contact@drhogrghareeb.org</a>
              </div>
            </div>
          </div>

          {/* Right / Form Side */}
          <div className="relative">
            <div className="absolute -inset-4 bg-[rgba(240,235,216,0.02)] border border-[rgba(201,168,76,0.1)] rounded-2xl -z-10" />
            
            {status === "succeeded" ? (
              <div className="p-12 text-center space-y-4 bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.2)] rounded-xl">
                <div className="w-16 h-16 mx-auto bg-[#C9A84C]/20 text-[#C9A84C] rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="font-serif text-3xl font-bold text-[#F0EBD8]">{t("contact.success_title")}</h2>
                <p className="text-[rgba(240,235,216,0.6)]">{t("contact.success_desc")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label htmlFor="email" className="block text-[11px] font-mono tracking-widest uppercase text-[rgba(240,235,216,0.6)]">
                    {t("contact.email_label")}
                  </label>
                  <input
                    id="email"
                    type="email" 
                    name="email"
                    required
                    placeholder={t("contact.email_placeholder")}
                    className="w-full bg-[rgba(10,14,26,0.6)] border border-[rgba(201,168,76,0.2)] focus:border-[#C9A84C] rounded-none px-5 py-4 text-[#F0EBD8] placeholder-[rgba(240,235,216,0.25)] outline-none transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="message" className="block text-[11px] font-mono tracking-widest uppercase text-[rgba(240,235,216,0.6)]">
                    {t("contact.message_label")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder={t("contact.message_placeholder")}
                    className="w-full bg-[rgba(10,14,26,0.6)] border border-[rgba(201,168,76,0.2)] focus:border-[#C9A84C] rounded-none px-5 py-4 text-[#F0EBD8] placeholder-[rgba(240,235,216,0.25)] outline-none transition-colors resize-y"
                  />
                </div>

                {status === "error" && (
                  <div className="text-red-400 text-sm text-center">Something went wrong. Please try again later.</div>
                )}
                <button 
                  type="submit" 
                  disabled={status === "submitting"}
                  className="w-full group relative inline-flex items-center justify-center gap-3 px-8 py-5 text-sm font-bold text-[#0A0E1A] overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #C9A84C, #E8C96B)",
                    clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)" }} />
                  <span className="relative z-10">{status === "submitting" ? t("contact.submitting") : t("contact.submit_btn")}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
