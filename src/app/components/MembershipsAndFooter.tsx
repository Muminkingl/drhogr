"use client";

import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   Intersection observer
───────────────────────────────────────────── */
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─────────────────────────────────────────────
   Hex → RGB
───────────────────────────────────────────── */
function hexToRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1], 16)}, ${parseInt(r[2], 16)}, ${parseInt(r[3], 16)}` : "201,168,76";
}

import { useLanguage } from "../i18n/LanguageContext";

/* ─────────────────────────────────────────────
   Word reveal
───────────────────────────────────────────── */
function WordReveal({ text, inView, delay = 0, color = "rgba(240,235,216,0.38)", isRTL = false }: {
  text: string; inView: boolean; delay?: number; color?: string; isRTL?: boolean;
}) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} style={{
          display: "inline-block", [isRTL ? "marginLeft" : "marginRight"]: "0.28em", color,
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.5s ease ${delay + i * 30}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay + i * 30}ms`,
        }}>{w}</span>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────
   Memberships data
───────────────────────────────────────────── */
// Data moved to component to use translation hook

/* ─────────────────────────────────────────────
   Membership card
───────────────────────────────────────────── */
function MembershipCard({ item, index, inView, isRTL, toLocalNum }: {
  item: any; index: number; inView: boolean; isRTL: boolean; toLocalNum: (n: string | number) => string;
}) {
  const [hovered, setHovered] = useState(false);
  const rgb = hexToRgb(item.accentColor);
  const delay = 300 + index * 110;

  return (
    <div
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: isRTL ? "row-reverse" : "row",
        alignItems: "center",
        gap: "20px",
        padding: "26px 28px",
        background: hovered ? `rgba(${rgb}, 0.06)` : "rgba(240,235,216,0.022)",
        border: `1px solid ${hovered ? `rgba(${rgb}, 0.32)` : "rgba(201,168,76,0.1)"}`,
        clipPath: isRTL 
          ? "polygon(16px 0, 100% 0, 100% 100%, 0 100%, 0 16px, 16px 0)"
          : "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
        transition: "background 0.4s ease, border-color 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        cursor: "default",
        textAlign: isRTL ? "right" : "left",
      }}>
        {/* Corner accents */}
        <div style={{
          position: "absolute", top: 0, [isRTL ? "left" : "right"]: 0, width: "16px", height: "16px",
          borderTop: `1px solid ${hovered ? item.accentColor : "rgba(201,168,76,0.2)"}`,
          [isRTL ? "borderLeft" : "borderRight"]: `1px solid ${hovered ? item.accentColor : "rgba(201,168,76,0.2)"}`,
          opacity: hovered ? 0.85 : 0.38, transition: "border-color 0.35s ease, opacity 0.35s ease",
        }} />
        <div style={{
          position: "absolute", bottom: 0, [isRTL ? "right" : "left"]: 0, width: "16px", height: "16px",
          borderBottom: `1px solid ${hovered ? item.accentColor : "rgba(201,168,76,0.2)"}`,
          [isRTL ? "borderRight" : "borderLeft"]: `1px solid ${hovered ? item.accentColor : "rgba(201,168,76,0.2)"}`,
          opacity: hovered ? 0.85 : 0.38, transition: "border-color 0.35s ease, opacity 0.35s ease",
        }} />

        {/* Side accent bar */}
        <div style={{
          position: "absolute", top: 0, [isRTL ? "right" : "left"]: 0, width: "2px",
          height: hovered ? "100%" : "0%",
          background: `linear-gradient(to bottom, ${item.accentColor}, transparent)`,
          transition: "height 0.5s cubic-bezier(0.16,1,0.3,1)",
          opacity: 0.5,
        }} />

        {/* Index — top corner */}
        <span style={{
          position: "absolute", top: "14px", [isRTL ? "left" : "right"]: "20px",
          fontFamily: "monospace", fontWeight: 800, fontSize: "1.6rem",
          lineHeight: 1, letterSpacing: "-0.04em",
          color: hovered ? `rgba(${rgb}, 0.22)` : "rgba(201,168,76,0.07)",
          transition: "color 0.4s ease", userSelect: "none",
        }}>0{toLocalNum(item.index)}</span>

        {/* Icon */}
        <div style={{
          flexShrink: 0, width: "46px", height: "46px",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: hovered ? `rgba(${rgb}, 0.14)` : "rgba(240,235,216,0.04)",
          border: `1px solid ${hovered ? `rgba(${rgb}, 0.4)` : "rgba(201,168,76,0.1)"}`,
          color: hovered ? item.accentColor : "rgba(201,168,76,0.55)",
          clipPath: isRTL
            ? "polygon(7px 0, 100% 0, 100% 100%, 0 100%, 0 7px, 7px 0)"
            : "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))",
          transition: "background 0.35s ease, border-color 0.35s ease, color 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
          transform: hovered ? "scale(1.08)" : "scale(1)",
        }}>
          {item.icon}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0, [isRTL ? "paddingLeft" : "paddingRight"]: "40px" }}>
          <h3 style={{
            fontFamily: "serif", fontWeight: 700,
            fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)",
            color: hovered ? "#F0EBD8" : "rgba(240,235,216,0.82)",
            lineHeight: 1.3, marginBottom: "10px",
            transition: "color 0.3s ease",
          }}>{item.name}</h3>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexDirection: isRTL ? "row-reverse" : "row" }}>
            <span style={{
              fontSize: "10px", fontFamily: "monospace", fontWeight: 700,
              letterSpacing: "0.2em", textTransform: "uppercase",
              padding: "3px 10px",
              color: hovered ? item.accentColor : "rgba(240,235,216,0.28)",
              background: hovered ? `rgba(${rgb}, 0.1)` : "rgba(240,235,216,0.03)",
              border: `1px solid ${hovered ? `rgba(${rgb}, 0.25)` : "rgba(240,235,216,0.06)"}`,
              clipPath: isRTL
                ? "polygon(4px 0, 100% 0, 100% 100%, 0 100%, 0 4px, 4px 0)"
                : "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
              transition: "color 0.35s ease, background 0.35s ease, border-color 0.35s ease",
            }}>{item.scope}</span>

            <span style={{
              display: "flex", alignItems: "center", gap: "5px", flexDirection: isRTL ? "row-reverse" : "row",
              fontSize: "10px", fontFamily: "monospace",
              color: "rgba(240,235,216,0.2)",
            }}>
              <span style={{
                width: hovered ? "16px" : "8px", height: "1px",
                background: item.accentColor, opacity: hovered ? 0.6 : 0.3,
                display: "inline-block", flexShrink: 0,
                transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)",
              }} />
              {item.region}
            </span>
          </div>
        </div>

        {/* Bottom sweep */}
        <div style={{
          position: "absolute", bottom: 0, left: "16px", right: "16px", height: "1px",
          background: isRTL
             ? `linear-gradient(270deg, transparent, ${item.accentColor}, transparent)`
             : `linear-gradient(90deg, transparent, ${item.accentColor}, transparent)`,
          opacity: hovered ? 0.5 : 0,
          transform: hovered ? "scaleX(1)" : "scaleX(0.2)",
          transformOrigin: "center",
          transition: "opacity 0.45s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
        }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MEMBERSHIPS SECTION
───────────────────────────────────────────── */
export function MembershipsSection() {
  const { ref, inView } = useInView(0.08);
  const { t, isRTL, toLocalNum } = useLanguage();

  const membershipsData = [
    {
      index: 1,
      name: t("memberships.kjs_name"),
      scope: t("memberships.scope_national"),
      region: t("memberships.region_kurdistan"),
      accentColor: "#C9A84C",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
        </svg>
      ),
    },
    {
      index: 2,
      name: t("memberships.kulu_name"),
      scope: t("memberships.scope_national"),
      region: t("memberships.region_kurdistan"),
      accentColor: "#E8C96B",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675" />
        </svg>
      ),
    },
    {
      index: 3,
      name: t("memberships.ifj_name"),
      scope: t("memberships.scope_international"),
      region: t("memberships.region_global"),
      accentColor: "#5BA89A",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      ),
    },
    {
      index: 4,
      name: t("memberships.wums_name"),
      scope: t("memberships.scope_international"),
      region: t("memberships.region_global"),
      accentColor: "#8B7FD4",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
    },
  ];

  const isArabicOrKurdish = /[\u0600-\u06FF]/.test(t("memberships.heading2"));

  return (
    <section
      id="memberships"
      ref={ref}
      className="relative py-28 lg:py-44 overflow-hidden"
      style={{ background: "#0A0E1A" }}
    >
      {/* Ambient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at bottom, rgba(201,168,76,0.04) 0%, transparent 70%)" }} />

      {/* Vertical rule */}
      <div className={`absolute ${isRTL ? "right-[4%]" : "left-[4%]"} top-0 bottom-0 w-px hidden lg:block`}
        style={{ background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.12), transparent)" }} />

      {/* Watermark - hidden for non-latin scripts */}
      {!isArabicOrKurdish && (
        <div className={`absolute top-8 ${isRTL ? "left-8" : "right-8"} font-serif font-bold select-none pointer-events-none hidden lg:block`}
          style={{ fontSize: "clamp(5rem,11vw,9rem)", color: "rgba(201,168,76,0.022)", lineHeight: 1, letterSpacing: "-0.05em" }}>
          {t("memberships.heading1").substring(0, 10)}
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16">

        {/* ── Header ── */}
        <div className="mb-16 lg:mb-24">

          {/* Overline */}
          <div className={isRTL ? "flex-row-reverse" : ""} style={{
            display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : `translateX(${isRTL ? "18px" : "-18px"})`,
            transition: "opacity 0.6s ease 0.05s, transform 0.6s ease 0.05s",
          }}>
            <span style={{ display: "block", width: "32px", height: "1px", background: "#C9A84C" }} />
            <span style={{ fontSize: "10px", letterSpacing: "0.45em", textTransform: "uppercase", fontFamily: "monospace", color: "rgba(201,168,76,0.6)" }}>
              {t("memberships.overline")}
            </span>
          </div>

          {/* Two-line headline */}
          <div style={{ overflow: "hidden", marginBottom: "2px" }}>
            <h2 style={{
              fontFamily: "serif", fontSize: "clamp(2.2rem,5vw,3.8rem)", fontWeight: 700,
              lineHeight: 0.95, color: "#F0EBD8",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(48px)",
              transition: "opacity 0.75s cubic-bezier(0.16,1,0.3,1) 0.12s, transform 0.75s cubic-bezier(0.16,1,0.3,1) 0.12s",
              textAlign: isRTL ? "right" : "left",
            }}>{t("memberships.heading1")}</h2>
          </div>
          <div style={{ overflow: "hidden", marginBottom: "24px" }}>
            <h2 style={{
              fontFamily: "serif", fontSize: "clamp(2.2rem,5vw,3.8rem)", fontWeight: 700,
              lineHeight: 0.95, WebkitTextStroke: "1px #C9A84C", color: "transparent",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(48px)",
              transition: "opacity 0.75s cubic-bezier(0.16,1,0.3,1) 0.24s, transform 0.75s cubic-bezier(0.16,1,0.3,1) 0.24s",
              textAlign: isRTL ? "right" : "left",
            }}>{t("memberships.heading2")}</h2>
          </div>

          {/* Sub-copy */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: isRTL ? "flex-end" : "flex-start", gap: "16px" }}>
            <p style={{ fontSize: "0.93rem", maxWidth: "420px", lineHeight: 1.8, textAlign: isRTL ? "right" : "left" }}>
              <WordReveal
                text={t("memberships.description")}
                inView={inView} delay={450} isRTL={isRTL}
              />
            </p>

            {/* Draw-in rule */}
            <div style={{
              marginTop: "4px", height: "1px",
              background: isRTL 
                ? "linear-gradient(270deg, #C9A84C, rgba(201,168,76,0.15), transparent)"
                : "linear-gradient(90deg, #C9A84C, rgba(201,168,76,0.15), transparent)",
              transform: inView ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: isRTL ? "right" : "left",
              transition: "transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.5s",
              maxWidth: "360px",
              width: "100%"
            }} />
          </div>
        </div>

        {/* ── Cards ── */}
        <div className="grid sm:grid-cols-2 gap-5 lg:gap-6" style={{ direction: isRTL ? "rtl" : "ltr" }}>
          {membershipsData.map((m, i) => (
            <MembershipCard key={i} item={m} index={i} inView={inView} isRTL={isRTL} toLocalNum={toLocalNum} />
          ))}
        </div>

        {/* ── Scope pills ── */}
        <div className={`mt-12 grid grid-cols-2 gap-4 max-w-sm ${isRTL ? "mr-auto ml-0" : ""}`} style={{ direction: isRTL ? "rtl" : "ltr" }}>
          {[
            { label: t("memberships.stat1_label"), value: t("memberships.stat1_value") },
            { label: t("memberships.stat2_label"), value: t("memberships.stat2_value") },
          ].map((s, i) => (
            <div key={i} style={{
              display: "flex", flexDirection: "column", alignItems: "center", padding: "18px 12px",
              background: "rgba(240,235,216,0.02)",
              border: "1px solid rgba(201,168,76,0.08)",
              clipPath: isRTL
                ? "polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px, 10px 0)"
                : "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(16px)",
              transition: `opacity 0.7s ease ${700 + i * 100}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${700 + i * 100}ms`,
            }}>
              <span style={{ fontFamily: "serif", fontWeight: 700, fontSize: "2rem", color: "#C9A84C", lineHeight: 1, marginBottom: "6px" }}>
                {toLocalNum(s.value)}
              </span>
              <span style={{ fontSize: "9px", fontFamily: "monospace", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(240,235,216,0.28)", textAlign: "center" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Social icons (SVG — pixel-perfect brands)
───────────────────────────────────────────── */
const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/hogr.gharib",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/dr.hogr.ghareeb/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@hogrghareebkhudhu0",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────
   Social icon button
───────────────────────────────────────────── */
function SocialButton({ social }: { social: (typeof socialLinks)[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: "38px", height: "38px",
        background: hovered ? "rgba(201,168,76,0.12)" : "rgba(240,235,216,0.04)",
        border: `1px solid ${hovered ? "rgba(201,168,76,0.45)" : "rgba(201,168,76,0.12)"}`,
        color: hovered ? "#C9A84C" : "rgba(240,235,216,0.4)",
        clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))",
        transition: "background 0.3s ease, border-color 0.3s ease, color 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)",
        transform: hovered ? "translateY(-3px) scale(1.05)" : "translateY(0) scale(1)",
        textDecoration: "none",
      }}
    >
      {social.icon}
    </a>
  );
}

/* ─────────────────────────────────────────────
   Footer nav link
───────────────────────────────────────────── */
function FooterLink({ label, href, isRTL }: { label: string; href: string; isRTL: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: "8px", flexDirection: isRTL ? "row-reverse" : "row",
        fontSize: "0.82rem",
        color: hovered ? "#C9A84C" : "rgba(240,235,216,0.38)",
        textDecoration: "none",
        transition: "color 0.25s ease",
      }}
    >
      <span style={{
        display: "block", height: "1px",
        width: hovered ? "14px" : "0px",
        background: "#C9A84C",
        transition: "width 0.3s cubic-bezier(0.16,1,0.3,1)",
        flexShrink: 0,
      }} />
      {label}
    </a>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */

export default function Footer() {
  const { t, isRTL, toLocalNum } = useLanguage();

  const footerLinksData = [
    { label: t("footer.nav_about"), href: "#about" },
    { label: t("footer.nav_qualifications"), href: "#qualifications" },
    { label: t("footer.nav_experience"), href: "#experience" },
    { label: t("footer.nav_leadership"), href: "#leadership" },
    { label: t("footer.nav_media"), href: "#media" },
    { label: t("footer.nav_memberships"), href: "#memberships" },
  ];

  const credentialsData = [
    { label: t("footer.cred1_label"), value: t("footer.cred1_value") },
    { label: t("footer.cred2_label"), value: t("footer.cred2_value") },
    { label: t("footer.cred3_label"), value: t("footer.cred3_value") },
  ];

  return (
    <footer className="relative overflow-hidden" style={{ background: "#070A13" }}>

      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.35), transparent)" }} />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top, rgba(201,168,76,0.05) 0%, transparent 70%)" }} />

      {/* Dashed top accent */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden opacity-20">
        <svg width="100%" height="2" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <line x1="0" y1="1" x2="100%" y2="1" stroke="#C9A84C" strokeWidth="1" strokeDasharray="4 8" />
        </svg>
      </div>

      {/* Islamic pattern strip at top */}
      <div className="absolute top-0 left-0 right-0 h-16 opacity-[0.025] pointer-events-none overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footerGeo" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <polygon points="20,2 24,14 36,10 29,20 36,30 24,26 20,38 16,26 4,30 11,20 4,10 16,14"
                fill="none" stroke="#C9A84C" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footerGeo)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16" style={{ direction: isRTL ? "rtl" : "ltr" }}>

        {/* ── Main footer body ── */}
        <div className="py-16 lg:py-20 grid lg:grid-cols-[1fr_180px_200px] gap-12 lg:gap-20 items-start">

          {/* Brand block */}
          <div className="space-y-7">

            {/* Avatar + name */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: "50px", height: "50px", flexShrink: 0,
                borderRadius: "50%", overflow: "hidden",
                border: "1px solid rgba(201,168,76,0.4)",
                boxShadow: "0 2px 12px rgba(201,168,76,0.15)"
              }}>
                <img src="/image.png" alt="Avatar logo" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                <span style={{ fontFamily: "serif", fontSize: "1.05rem", fontWeight: 700, color: "#F0EBD8" }}>
                  {t("footer.name")}
                </span>
                <span style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", fontFamily: "monospace", color: "rgba(201,168,76,0.55)", marginTop: "5px" }}>
                  {t("footer.location")}
                </span>
              </div>
            </div>

            {/* Bio */}
            <p style={{ fontSize: "0.82rem", lineHeight: 1.9, maxWidth: "280px", color: "rgba(240,235,216,0.36)" }}>
              {t("footer.bio")}
            </p>

            {/* Role tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {[t("footer.tag_journalist"), t("footer.tag_scholar"), t("footer.tag_humanitarian")].map((tag) => (
                <span key={tag} style={{
                  fontSize: "10px", fontFamily: "monospace", letterSpacing: "0.15em",
                  padding: "4px 10px",
                  color: "rgba(201,168,76,0.5)",
                  border: "1px solid rgba(201,168,76,0.12)",
                  background: "rgba(201,168,76,0.04)",
                  clipPath: isRTL 
                    ? "polygon(5px 0, 100% 0, 100% 100%, 0 100%, 0 5px, 5px 0)"
                    : "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* ── Social icons ── */}
            <div>
              <div style={{ fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", fontFamily: "monospace", color: "rgba(201,168,76,0.4)", marginBottom: "12px" }}>
                {t("footer.title_follow")}
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                {socialLinks.map((s) => (
                  <SocialButton key={s.label} social={s} />
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", fontFamily: "monospace", color: "rgba(201,168,76,0.45)", marginBottom: "20px" }}>
              {t("footer.title_navigate")}
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {footerLinksData.map((link) => (
                <FooterLink key={link.href} label={link.label} href={link.href} isRTL={isRTL} />
              ))}
            </nav>
          </div>

          {/* Credentials */}
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", fontFamily: "monospace", color: "rgba(201,168,76,0.45)", marginBottom: "20px" }}>
              {t("footer.title_credentials")}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {credentialsData.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{
                    fontSize: "9px", fontFamily: "monospace", fontWeight: 700,
                    padding: "3px 7px", flexShrink: 0,
                    color: "#C9A84C",
                    border: "1px solid rgba(201,168,76,0.2)",
                    background: "rgba(201,168,76,0.06)",
                    letterSpacing: "0.1em",
                  }}>{c.label}</span>
                  <span style={{ fontSize: "0.78rem", color: "rgba(240,235,216,0.32)", lineHeight: 1.4 }}>{toLocalNum(c.value)}</span>
                </div>
              ))}

              {/* Divider */}
              <div style={{ height: "1px", background: "rgba(201,168,76,0.08)", margin: "4px 0" }} />

              {/* Institution */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span style={{ width: "8px", height: "1px", background: "#C9A84C", marginTop: "9px", flexShrink: 0, opacity: 0.5 }} />
                <span style={{ fontSize: "0.78rem", color: "rgba(240,235,216,0.28)", lineHeight: 1.6 }}>
                  {t("footer.uni_name")}<br />
                  <span style={{ color: "rgba(240,235,216,0.18)", fontSize: "0.72rem" }}>{t("footer.uni_college")}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          padding: "20px 0",
          borderTop: "1px solid rgba(201,168,76,0.07)",
          display: "flex", flexDirection: "column", gap: "12px",
        }}
          className="sm:flex-row sm:items-center sm:justify-between"
        >
          <p style={{ fontSize: "11px", fontFamily: "monospace", color: "rgba(240,235,216,0.18)", direction: isRTL ? "rtl" : "ltr" }}>
            {t("footer.copyright").replace(
              "{year}",
              toLocalNum(new Date().getFullYear().toString())
            )}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexDirection: isRTL ? "row-reverse" : "row" }}>
            {/* Repeat social icons — small */}
            <div style={{ display: "flex", gap: "8px" }}>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    color: "rgba(240,235,216,0.2)",
                    transition: "color 0.25s ease",
                    lineHeight: 1,
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#C9A84C")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(240,235,216,0.2)")}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            <span style={{ width: "1px", height: "14px", background: "rgba(201,168,76,0.15)" }} />

            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexDirection: isRTL ? "row-reverse" : "row" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(201,168,76,0.35)" }} />
              <span style={{ fontSize: "11px", fontFamily: "monospace", color: "rgba(240,235,216,0.16)" }}>
                {t("footer.bottom_location")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}