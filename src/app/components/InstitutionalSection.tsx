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
   Hex → RGB helper
───────────────────────────────────────────── */
function hexToRgb(hex: string): string {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r
    ? `${parseInt(r[1], 16)}, ${parseInt(r[2], 16)}, ${parseInt(r[3], 16)}`
    : "201,168,76";
}

/* ─────────────────────────────────────────────
   Word reveal
───────────────────────────────────────────── */
function WordReveal({ text, inView, delay = 0, style = {} }: {
  text: string; inView: boolean; delay?: number; style?: React.CSSProperties;
}) {
  return (
    <span style={style}>
      {text.split(" ").map((w, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            marginRight: "0.28em",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(12px)",
            transition: `opacity 0.5s ease ${delay + i * 30}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay + i * 30}ms`,
          }}
        >
          {w}
        </span>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
import { useLanguage } from "../i18n/LanguageContext";

/* ─────────────────────────────────────────────
   Institution card
───────────────────────────────────────────── */
function InstitutionCard({
  inst,
  index,
  inView,
  isRTL,
  toLocalNum,
}: {
  inst: any;
  index: number;
  inView: boolean;
  isRTL: boolean;
  toLocalNum: (n: number | string) => string;
}) {
  const [hovered, setHovered] = useState(false);
  const rgb = hexToRgb(inst.accentColor);
  const entryDelay = 300 + index * 140;

  return (
    <a
      href={inst.href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", display: "flex", flexDirection: "column" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "32px",
          background: hovered ? `rgba(${rgb}, 0.06)` : "rgba(240,235,216,0.022)",
          border: `1px solid ${hovered ? `rgba(${rgb}, 0.32)` : "rgba(201,168,76,0.1)"}`,
          clipPath: isRTL
            ? "polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px, 20px 0)"
            : "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
          transition: "background 0.4s ease, border-color 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)",
          transform: inView
            ? hovered ? "translateY(-5px)" : "translateY(0)"
            : "translateY(36px)",
          opacity: inView ? 1 : 0,
          cursor: "pointer",
          textAlign: isRTL ? "right" : "left",
        }}
      >
        {/* ── Corner accents ── */}
        <div style={{
          position: "absolute", top: 0, [isRTL ? "left" : "right"]: 0, width: "20px", height: "20px",
          borderTop: `1px solid ${hovered ? inst.accentColor : "rgba(201,168,76,0.22)"}`,
          [isRTL ? "borderLeft" : "borderRight"]: `1px solid ${hovered ? inst.accentColor : "rgba(201,168,76,0.22)"}`,
          opacity: hovered ? 0.85 : 0.4,
          transition: "border-color 0.35s ease, opacity 0.35s ease",
        }} />
        <div style={{
          position: "absolute", bottom: 0, [isRTL ? "right" : "left"]: 0, width: "20px", height: "20px",
          borderBottom: `1px solid ${hovered ? inst.accentColor : "rgba(201,168,76,0.22)"}`,
          [isRTL ? "borderRight" : "borderLeft"]: `1px solid ${hovered ? inst.accentColor : "rgba(201,168,76,0.22)"}`,
          opacity: hovered ? 0.85 : 0.4,
          transition: "border-color 0.35s ease, opacity 0.35s ease",
        }} />

        {/* ── Side accent bar that grows down on hover ── */}
        <div style={{
          position: "absolute",
          top: 0,
          [isRTL ? "right" : "left"]: 0,
          width: "2px",
          height: hovered ? "100%" : "0%",
          background: `linear-gradient(to bottom, ${inst.accentColor}, transparent)`,
          transition: "height 0.5s cubic-bezier(0.16,1,0.3,1)",
          opacity: 0.5,
        }} />

        {/* ── Index + icon row ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexDirection: isRTL ? "row-reverse" : "row" }}>
          {/* Big index number */}
          <span
            style={{
              fontFamily: "monospace",
              fontWeight: 800,
              fontSize: "3rem",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: hovered ? `rgba(${rgb}, 0.3)` : "rgba(201,168,76,0.08)",
              transition: "color 0.4s ease",
              userSelect: "none",
            }}
          >
            0{toLocalNum(inst.index)}
          </span>

          {/* Icon box */}
          <div style={{
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: hovered ? `rgba(${rgb}, 0.14)` : "rgba(240,235,216,0.04)",
            border: `1px solid ${hovered ? `rgba(${rgb}, 0.4)` : "rgba(201,168,76,0.12)"}`,
            color: hovered ? inst.accentColor : "rgba(201,168,76,0.55)",
            clipPath: isRTL
               ? "polygon(7px 0, 100% 0, 100% 100%, 0 100%, 0 7px, 7px 0)"
               : "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))",
            transition: "background 0.35s ease, border-color 0.35s ease, color 0.35s ease",
            transform: hovered ? "rotate(5deg) scale(1.08)" : "rotate(0deg) scale(1)",
            transitionProperty: "background, border-color, color, transform",
          }}>
            {inst.icon}
          </div>
        </div>

        {/* ── Role badge ── */}
        <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px", flexDirection: isRTL ? "row-reverse" : "row" }}>
          <span style={{
            display: "block",
            width: hovered ? "20px" : "12px",
            height: "1px",
            background: inst.accentColor,
            transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)",
            opacity: hovered ? 1 : 0.5,
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: "10px",
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: inst.accentColor,
            opacity: hovered ? 1 : 0.7,
            transition: "opacity 0.3s ease",
          }}>
            {inst.role}
          </span>
        </div>

        {/* ── Title ── */}
        <h3 style={{
          fontFamily: "serif",
          fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)",
          fontWeight: 700,
          color: hovered ? "#F0EBD8" : "rgba(240,235,216,0.85)",
          marginBottom: "12px",
          lineHeight: 1.3,
          transition: "color 0.3s ease",
        }}>
          {inst.title}
        </h3>

        {/* ── Description ── */}
        <p style={{
          fontSize: "0.82rem",
          lineHeight: 1.85,
          color: "rgba(240,235,216,0.42)",
          flex: 1,
          marginBottom: "24px",
        }}>
          {inst.description}
        </p>

        {/* ── Detail tags ── */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: isRTL ? "row-reverse" : "row",
          gap: "6px",
          paddingTop: "18px",
          borderTop: `1px solid ${hovered ? `rgba(${rgb}, 0.18)` : "rgba(201,168,76,0.07)"}`,
          transition: "border-color 0.35s ease",
        }}>
          {inst.detail.split(" · ").map((tag: string, t: number) => (
            <span key={t} style={{
              fontSize: "10px",
              fontFamily: "monospace",
              letterSpacing: "0.12em",
              padding: "3px 9px",
              color: hovered ? inst.accentColor : "rgba(240,235,216,0.28)",
              background: hovered ? `rgba(${rgb}, 0.09)` : "rgba(240,235,216,0.03)",
              border: `1px solid ${hovered ? `rgba(${rgb}, 0.22)` : "rgba(240,235,216,0.06)"}`,
              transition: "color 0.35s ease, background 0.35s ease, border-color 0.35s ease",
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* ── Bottom sweep line ── */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: "20px",
          right: "20px",
          height: "1px",
          background: isRTL 
            ? `linear-gradient(270deg, transparent, ${inst.accentColor}, transparent)`
            : `linear-gradient(90deg, transparent, ${inst.accentColor}, transparent)`,
          opacity: hovered ? 0.55 : 0,
          transform: hovered ? "scaleX(1)" : "scaleX(0.2)",
          transformOrigin: "center",
          transition: "opacity 0.45s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
        }} />
      </div>
    </a>
  );
}

/* ─────────────────────────────────────────────
   Entry wrapper (separates scroll entry from hover)
───────────────────────────────────────────── */
function CardEntry({ children, inView, delay }: {
  children: React.ReactNode; inView: boolean; delay: number;
}) {
  return (
    <div style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(36px)",
      transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      display: "flex",
      flexDirection: "column",
    }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main section
───────────────────────────────────────────── */
export default function InstitutionalSection() {
  const { ref, inView } = useInView(0.08);
  const { t, isRTL, toLocalNum } = useLanguage();

  const institutionsData = [
    {
      title: t("institutional.org1_title"),
      role: t("institutional.org1_role"),
      index: 1,
      description: t("institutional.org1_desc"),
      accentColor: "#E8927C",
      href: "https://elia-foundation.org/",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
      detail: t("institutional.org1_tag"),
    },
    {
      title: t("institutional.org2_title"),
      role: t("institutional.org2_role"),
      index: 2,
      description: t("institutional.org2_desc"),
      accentColor: "#C9A84C",
      href: "https://judyacademy.org/",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
      detail: t("institutional.org2_tag"),
    },
    {
      title: t("institutional.org3_title"),
      role: t("institutional.org3_role"),
      index: 3,
      description: t("institutional.org3_desc"),
      accentColor: "#5BA89A",
      href: "https://sahabakurdish.org/",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      detail: t("institutional.org3_tag"),
    },
  ];

  // Regex utility to detect Arabic text so we don't display big ghost letters incorrectly.
  const hasArabic = /[\u0600-\u06FF]/.test(t("institutional.heading2"));

  return (
    <section
      id="leadership"
      ref={ref}
      className="relative py-28 lg:py-44 overflow-hidden"
      style={{ background: "#0A0E1A" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.035) 0%, transparent 65%)" }}
      />

      {/* Vertical rule */}
      <div
        className={`absolute top-0 bottom-0 w-px hidden lg:block ${isRTL ? "right-[4%]" : "left-[4%]"}`}
        style={{ background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.12), transparent)" }}
      />

      {/* Watermark - Hide for non-English to prevent ugly formatting */}
      {!hasArabic && (
        <div
          className="absolute bottom-8 right-8 font-serif font-bold select-none pointer-events-none hidden lg:block"
          style={{
            fontSize: "clamp(6rem,14vw,12rem)",
            color: "rgba(201,168,76,0.022)",
            lineHeight: 1,
            letterSpacing: "-0.05em",
          }}
        >
          {t("institutional.heading2")}
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16">

        {/* ════ HEADER ════ */}
        <div className="mb-20 lg:mb-28">

          {/* Overline */}
          <div className={isRTL ? "flex-row-reverse" : ""} style={{
            display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : `translateX(${isRTL ? "18px" : "-18px"})`,
            transition: "opacity 0.6s ease 0.05s, transform 0.6s ease 0.05s",
          }}>
            <span style={{ display: "block", width: "32px", height: "1px", background: "#C9A84C" }} />
            <span style={{ fontSize: "10px", letterSpacing: "0.45em", textTransform: "uppercase", fontFamily: "monospace", color: "rgba(201,168,76,0.6)" }}>
              {t("institutional.overline")}
            </span>
          </div>

          {/* Two-line headline */}
          <div style={{ overflow: "hidden", marginBottom: "2px" }}>
            <h2 style={{
              fontFamily: "serif",
              fontSize: "clamp(2.2rem,5vw,3.8rem)",
              fontWeight: 700,
              lineHeight: 0.95,
              color: "#F0EBD8",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(48px)",
              transition: "opacity 0.75s cubic-bezier(0.16,1,0.3,1) 0.12s, transform 0.75s cubic-bezier(0.16,1,0.3,1) 0.12s",
              textAlign: isRTL ? "right" : "left",
            }}>
              {t("institutional.heading1")}
            </h2>
          </div>
          <div style={{ overflow: "hidden", marginBottom: "24px" }}>
            <h2 style={{
              fontFamily: "serif",
              fontSize: "clamp(2.2rem,5vw,3.8rem)",
              fontWeight: 700,
              lineHeight: 0.95,
              WebkitTextStroke: "1px #C9A84C",
              color: "transparent",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(48px)",
              transition: "opacity 0.75s cubic-bezier(0.16,1,0.3,1) 0.24s, transform 0.75s cubic-bezier(0.16,1,0.3,1) 0.24s",
              textAlign: isRTL ? "right" : "left",
            }}>
              {t("institutional.heading2")}
            </h2>
          </div>

          {/* Sub-copy + divider row */}
          <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
            <p style={{
              fontSize: "0.95rem",
              maxWidth: "400px",
              lineHeight: 1.8,
              color: "rgba(240,235,216,0.38)",
              opacity: inView ? 1 : 0,
              transition: "opacity 0.7s ease 0.45s",
              textAlign: isRTL ? "right" : "left",
            }}>
              {t("institutional.description")}
            </p>

            {/* Decorative divider */}
            <div style={{
              display: "flex", alignItems: "center", gap: "12px",
              opacity: inView ? 1 : 0,
              transition: "opacity 0.7s ease 0.55s",
            }}>
              <div style={{ height: "1px", width: "60px", background: "linear-gradient(to right, rgba(201,168,76,0.3), transparent)" }} />
              <div style={{ width: "5px", height: "5px", transform: "rotate(45deg)", background: "#C9A84C", opacity: 0.4 }} />
              <div style={{ height: "1px", width: "60px", background: "linear-gradient(to left, rgba(201,168,76,0.3), transparent)" }} />
            </div>
          </div>

          {/* Draw-in rule */}
          <div style={{
            marginTop: "28px",
            height: "1px",
            background: isRTL 
               ? "linear-gradient(270deg, #C9A84C, rgba(201,168,76,0.15), transparent)" 
               : "linear-gradient(90deg, #C9A84C, rgba(201,168,76,0.15), transparent)",
            transform: inView ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: isRTL ? "right" : "left",
            transition: "transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.5s",
            maxWidth: "360px",
            marginLeft: isRTL ? "auto" : "0",
            marginRight: isRTL ? "0" : "auto",
          }} />
        </div>

        {/* ════ CARDS ════ */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {institutionsData.map((inst, i) => (
            <CardEntry key={i} inView={inView} delay={300 + i * 140}>
              <InstitutionCard inst={inst} index={i} inView={inView} isRTL={isRTL} toLocalNum={toLocalNum} />
            </CardEntry>
          ))}
        </div>

        {/* ════ BOTTOM TAG ════ */}
        <div className={isRTL ? "flex-row-reverse" : "flex-row"} style={{
          marginTop: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px",
          opacity: inView ? 1 : 0,
          transition: "opacity 0.8s ease 0.9s",
        }}>
          <div style={{ height: "1px", width: "60px", background: isRTL ? "linear-gradient(to left, transparent, rgba(201,168,76,0.25))" : "linear-gradient(to right, transparent, rgba(201,168,76,0.25))" }} />
          <span style={{ fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", fontFamily: "monospace", color: "rgba(240,235,216,0.18)" }}>
            {toLocalNum(3)} {t("institutional.footer_tag").replace("3 Organizations · Active Leadership", "").replace("٣ مؤسسات · قيادة نشطة", "").replace("٣ رێکخراو · سەرکردایەتی چالاک", "")} {t("institutional.footer_tag")}
          </span>
          <div style={{ height: "1px", width: "60px", background: isRTL ? "linear-gradient(to right, transparent, rgba(201,168,76,0.25))" : "linear-gradient(to left, transparent, rgba(201,168,76,0.25))" }} />
        </div>
      </div>
    </section>
  );
} 