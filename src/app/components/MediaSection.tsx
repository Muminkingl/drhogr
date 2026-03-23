"use client";

import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   Intersection observer
───────────────────────────────────────────── */
function useInView(threshold = 0.08) {
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

/* ─────────────────────────────────────────────
   Word reveal
───────────────────────────────────────────── */
function WordReveal({ text, inView, delay = 0, color = "rgba(240,235,216,0.38)" }: {
  text: string; inView: boolean; delay?: number; color?: string;
}) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            marginRight: "0.28em",
            color,
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(12px)",
            transition: `opacity 0.5s ease ${delay + i * 30}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay + i * 30}ms`,
          }}
        >
          {w}
        </span>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const mediaVentures = [
  {
    index: "01",
    title: "Judi TV",
    subtitle: "Founder & General Director",
    description: "The first television channel dedicated to the Holy Qur'an in Kurdistan and Iraq. A pioneering media initiative bringing Qur'anic content to millions.",
    highlight: "First of its kind in Kurdistan & Iraq",
    type: "TV Channel",
    year: "Est. Kurdistan",
    accentColor: "#C9A84C",
    size: "large",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    index: "02",
    title: "U2 Channel",
    subtitle: "Founder",
    description: "A dedicated channel for Islamic advocacy and education, providing valuable religious programming to audiences across the region.",
    highlight: "Advocacy & Education",
    type: "TV Channel",
    year: "Kurdistan",
    accentColor: "#8B7FD4",
    size: "small",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    index: "03",
    title: "Speda Drama",
    subtitle: "Founder",
    description: "A drama-focused channel delivering engaging storytelling and cultural content to Kurdish-speaking audiences.",
    highlight: "Drama & Culture",
    type: "TV Channel",
    year: "Kurdistan",
    accentColor: "#E8927C",
    size: "small",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3-1.125V4.875c0-.621.504-1.125 1.125-1.125h15.75c.621 0 1.125.504 1.125 1.125v14.25m-20.25-.75h20.25" />
      </svg>
    ),
  },
  {
    index: "04",
    title: "Dialogue — Diālog",
    subtitle: "Program Host",
    description: "An Islamic intellectual and jurisprudential program exploring critical topics in Islamic thought, comparative jurisprudence, and contemporary issues facing Muslim communities.",
    highlight: "Islamic Thought & Jurisprudence",
    type: "TV Program",
    year: "Ongoing",
    accentColor: "#5BA89A",
    size: "large",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
  },
];

import { useLanguage } from "../i18n/LanguageContext";

/* ─────────────────────────────────────────────
   Media card
───────────────────────────────────────────── */
function MediaCard({
  venture,
  inView,
  entryDelay,
  isRTL,
  toLocalNum,
}: {
  venture: any;
  inView: boolean;
  entryDelay: number;
  isRTL: boolean;
  toLocalNum: (n: number | string) => string;
}) {
  const [hovered, setHovered] = useState(false);
  const rgb = hexToRgb(venture.accentColor);
  const isLarge = venture.size === "large";

  return (
    <div
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${entryDelay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${entryDelay}ms`,
        height: "100%",
        width: "100%",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: isLarge ? undefined : "column",
          height: "100%",
          background: hovered ? `rgba(${rgb}, 0.06)` : "rgba(240,235,216,0.022)",
          border: `1px solid ${hovered ? `rgba(${rgb}, 0.32)` : "rgba(201,168,76,0.1)"}`,
          clipPath: isRTL 
            ? "polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px, 20px 0)"
            : "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
          transition: "background 0.4s ease, border-color 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          textAlign: isRTL ? "right" : "left",
        }}
      >
        {/* Corner accents */}
        <div style={{
          position: "absolute", top: 0, [isRTL ? "left" : "right"]: 0, width: "20px", height: "20px",
          borderTop: `1px solid ${hovered ? venture.accentColor : "rgba(201,168,76,0.22)"}`,
          [isRTL ? "borderLeft" : "borderRight"]: `1px solid ${hovered ? venture.accentColor : "rgba(201,168,76,0.22)"}`,
          opacity: hovered ? 0.85 : 0.38,
          transition: "border-color 0.35s ease, opacity 0.35s ease",
        }} />
        <div style={{
          position: "absolute", bottom: 0, [isRTL ? "right" : "left"]: 0, width: "20px", height: "20px",
          borderBottom: `1px solid ${hovered ? venture.accentColor : "rgba(201,168,76,0.22)"}`,
          [isRTL ? "borderRight" : "borderLeft"]: `1px solid ${hovered ? venture.accentColor : "rgba(201,168,76,0.22)"}`,
          opacity: hovered ? 0.85 : 0.38,
          transition: "border-color 0.35s ease, opacity 0.35s ease",
        }} />

        {/* Side accent bar — large cards only — grows down on hover */}
        {isLarge && (
          <div style={{
            position: "absolute",
            top: 0,
            [isRTL ? "right" : "left"]: 0,
            width: "2px",
            height: hovered ? "100%" : "30%",
            background: `linear-gradient(to bottom, ${venture.accentColor}, transparent)`,
            transition: "height 0.55s cubic-bezier(0.16,1,0.3,1)",
            opacity: hovered ? 0.6 : 0.25,
          }} />
        )}

        {/* Card body */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: isLarge ? "32px 36px" : "28px",
        }}>

          {/* Top row: big index + type badge */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexDirection: isRTL ? "row-reverse" : "row" }}>
            <span style={{
              fontFamily: "monospace",
              fontWeight: 800,
              fontSize: isLarge ? "3.5rem" : "2.8rem",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: hovered ? `rgba(${rgb}, 0.28)` : "rgba(201,168,76,0.07)",
              transition: "color 0.4s ease",
              userSelect: "none",
            }}>
              0{toLocalNum(venture.index)}
            </span>

            <span style={{
              fontSize: "10px",
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "4px 12px",
              color: hovered ? venture.accentColor : "rgba(240,235,216,0.28)",
              background: hovered ? `rgba(${rgb}, 0.1)` : "rgba(240,235,216,0.03)",
              border: `1px solid ${hovered ? `rgba(${rgb}, 0.25)` : "rgba(240,235,216,0.07)"}`,
              clipPath: isRTL
                ? "polygon(5px 0, 100% 0, 100% 100%, 0 100%, 0 5px, 5px 0)"
                : "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
              transition: "color 0.35s ease, background 0.35s ease, border-color 0.35s ease",
            }}>
              {venture.type}
            </span>
          </div>

          {/* Icon + title block */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "16px", flexDirection: isRTL ? "row-reverse" : "row" }}>
            <div style={{
              flexShrink: 0,
              width: "42px",
              height: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: hovered ? `rgba(${rgb}, 0.14)` : "rgba(240,235,216,0.04)",
              border: `1px solid ${hovered ? `rgba(${rgb}, 0.4)` : "rgba(201,168,76,0.1)"}`,
              color: hovered ? venture.accentColor : "rgba(201,168,76,0.55)",
              clipPath: isRTL 
                ? "polygon(6px 0, 100% 0, 100% 100%, 0 100%, 0 6px, 6px 0)"
                : "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              transition: "background 0.35s ease, border-color 0.35s ease, color 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
              transform: hovered ? "scale(1.08)" : "scale(1)",
            }}>
              {venture.icon}
            </div>

            <div>
              <h3 style={{
                fontFamily: "serif",
                fontWeight: 700,
                fontSize: isLarge ? "1.45rem" : "1.15rem",
                color: hovered ? "#F0EBD8" : "rgba(240,235,216,0.85)",
                lineHeight: 1.25,
                transition: "color 0.3s ease",
                marginBottom: "4px",
              }}>
                {venture.title}
              </h3>
              <p style={{
                fontSize: "11px",
                fontFamily: "monospace",
                letterSpacing: "0.12em",
                color: hovered ? venture.accentColor : "rgba(201,168,76,0.5)",
                transition: "color 0.3s ease",
              }}>
                {venture.subtitle}
              </p>
            </div>
          </div>

          {/* Description */}
          <p style={{
            fontSize: "0.83rem",
            lineHeight: 1.85,
            color: "rgba(240,235,216,0.42)",
            flex: 1,
            marginBottom: "22px",
            maxWidth: isLarge ? "540px" : undefined,
          }}>
            {venture.description}
          </p>

          {/* Footer row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "16px",
            borderTop: `1px solid ${hovered ? `rgba(${rgb}, 0.18)` : "rgba(201,168,76,0.07)"}`,
            transition: "border-color 0.35s ease",
            flexDirection: isRTL ? "row-reverse" : "row",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexDirection: isRTL ? "row-reverse" : "row" }}>
              {/* Animated dot */}
              <span style={{
                display: "block",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: hovered ? venture.accentColor : "rgba(201,168,76,0.35)",
                transition: "background 0.3s ease, transform 0.3s ease",
                transform: hovered ? "scale(1.4)" : "scale(1)",
                flexShrink: 0,
              }} />
              <span style={{
                fontSize: "11px",
                fontWeight: 500,
                color: hovered ? venture.accentColor : "rgba(240,235,216,0.32)",
                transition: "color 0.3s ease",
              }}>
                {venture.highlight}
              </span>
            </div>
            <span style={{
              fontSize: "10px",
              fontFamily: "monospace",
              letterSpacing: "0.2em",
              color: "rgba(240,235,216,0.18)",
            }}>
              {venture.year}
            </span>
          </div>
        </div>

        {/* Bottom sweep line */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: "20px",
          right: "20px",
          height: "1px",
          background: isRTL 
             ? `linear-gradient(270deg, transparent, ${venture.accentColor}, transparent)`
             : `linear-gradient(90deg, transparent, ${venture.accentColor}, transparent)`,
          opacity: hovered ? 0.55 : 0,
          transform: hovered ? "scaleX(1)" : "scaleX(0.15)",
          transformOrigin: "center",
          transition: "opacity 0.45s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
        }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Stat pill
───────────────────────────────────────────── */
function StatPill({ value, label, inView, delay, isRTL, toLocalNum }: {
  value: string; label: string; inView: boolean; delay: number; isRTL: boolean; toLocalNum: (n: string) => string;
}) {
  const [hovered, setHovered] = useState(false);
  
  // Custom parsing for numbers that might have a '+' suffix
  const formattedValue = value.replace(/\d+/g, match => toLocalNum(match));

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px 12px",
        background: hovered ? "rgba(201,168,76,0.06)" : "rgba(240,235,216,0.02)",
        border: `1px solid ${hovered ? "rgba(201,168,76,0.28)" : "rgba(201,168,76,0.08)"}`,
        clipPath: isRTL 
          ? "polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px, 10px 0)"
          : "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
        transition: "background 0.35s ease, border-color 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
        transform: inView ? hovered ? "translateY(-3px)" : "translateY(0)" : "translateY(20px)",
        opacity: inView ? 1 : 0,
        transitionDelay: `${delay}ms`,
        cursor: "default",
      }}
    >
      <span style={{
        fontFamily: "serif",
        fontWeight: 700,
        fontSize: "2rem",
        color: hovered ? "#E8C96B" : "#C9A84C",
        transition: "color 0.3s ease",
        lineHeight: 1,
        marginBottom: "6px",
      }}>
        {formattedValue}
      </span>
      <span style={{
        fontSize: "9px",
        fontFamily: "monospace",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: hovered ? "rgba(240,235,216,0.55)" : "rgba(240,235,216,0.28)",
        transition: "color 0.3s ease",
        textAlign: "center",
      }}>
        {label}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main section
───────────────────────────────────────────── */
export default function MediaSection() {
  const { ref, inView } = useInView(0.06);
  const { t, isRTL, toLocalNum } = useLanguage();

  const mediaVenturesData = [
    {
      index: 1,
      title: t("media.judi_title"),
      subtitle: t("media.judi_role"),
      description: t("media.judi_desc"),
      highlight: t("media.judi_highlight"),
      type: t("media.tv_channel"),
      year: t("media.judi_year"),
      accentColor: "#C9A84C",
      size: "large",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
    },
    {
      index: 2,
      title: t("media.u2_title"),
      subtitle: t("media.u2_role"),
      description: t("media.u2_desc"),
      highlight: t("media.u2_highlight"),
      type: t("media.tv_channel"),
      year: t("media.u2_year"),
      accentColor: "#8B7FD4",
      size: "small",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      ),
    },
    {
      index: 3,
      title: t("media.speda_title"),
      subtitle: t("media.speda_role"),
      description: t("media.speda_desc"),
      highlight: t("media.speda_highlight"),
      type: t("media.tv_channel"),
      year: t("media.speda_year"),
      accentColor: "#E8927C",
      size: "small",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3-1.125V4.875c0-.621.504-1.125 1.125-1.125h15.75c.621 0 1.125.504 1.125 1.125v14.25m-20.25-.75h20.25" />
        </svg>
      ),
    },
    {
      index: 4,
      title: t("media.dialogue_title"),
      subtitle: t("media.dialogue_role"),
      description: t("media.dialogue_desc"),
      highlight: t("media.dialogue_highlight"),
      type: t("media.tv_program"),
      year: t("media.dialogue_year"),
      accentColor: "#5BA89A",
      size: "large",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      ),
    },
  ];

  // Logic to prevent big English letters displaying weirdly in RTL or hiding in AR/KU
  const isArabicOrKurdish = /[\u0600-\u06FF]/.test(t("media.heading2"));

  return (
    <section
      id="media"
      ref={ref}
      className="relative py-28 lg:py-44 overflow-hidden"
      style={{ background: "#0A0E1A" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/3 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at right, rgba(201,168,76,0.04) 0%, transparent 65%)" }}
      />

      {/* Vertical rule */}
      <div
        className={`absolute ${isRTL ? "right-[4%]" : "left-[4%]"} top-0 bottom-0 w-px hidden lg:block`}
        style={{ background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.12), transparent)" }}
      />

      {/* Watermark - hidden for non-latin scripts */}
      {!isArabicOrKurdish && (
        <div
          className={`absolute bottom-6 ${isRTL ? "right-8" : "left-8"} font-serif font-bold select-none pointer-events-none hidden lg:block`}
          style={{ fontSize: "clamp(5rem,12vw,10rem)", color: "rgba(201,168,76,0.022)", lineHeight: 1, letterSpacing: "-0.05em" }}
        >
          {t("media.heading1").replace("&", "")}
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16">

        {/* ════ HEADER ════ */}
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
              {t("media.overline")}
            </span>
          </div>

          {/* Two-line headline — overflow clip reveal */}
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
              textAlign: isRTL ? "right" : "left"
            }}>
              {t("media.heading1")}
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
              textAlign: isRTL ? "right" : "left"
            }}>
              {t("media.heading2")}
            </h2>
          </div>

          {/* Sub-copy + diamond divider */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: isRTL ? "flex-end" : "flex-start", gap: "16px" }}>
            <p style={{ fontSize: "0.93rem", maxWidth: "420px", lineHeight: 1.8, textAlign: isRTL ? "right" : "left" }}>
              {t("media.description")}
            </p>

            {/* Draw-in rule */}
            <div style={{
              height: "1px",
              background: isRTL 
                ? "linear-gradient(270deg, #C9A84C, rgba(201,168,76,0.15), transparent)"
                : "linear-gradient(90deg, #C9A84C, rgba(201,168,76,0.15), transparent)",
              transform: inView ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: isRTL ? "right" : "left",
              transition: "transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.5s",
              maxWidth: "360px",
              width: "100%",
            }} />
          </div>
        </div>

        {/* ════ BENTO GRID ════ */}
        <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6`} style={{ direction: isRTL ? "rtl" : "ltr" }}>

          {/* Row 1: Judi TV (2 cols) + U2 (1 col) */}
          <div className="lg:col-span-2" style={{ display: "flex" }}>
            <MediaCard venture={mediaVenturesData[0]} inView={inView} entryDelay={200} isRTL={isRTL} toLocalNum={toLocalNum} />
          </div>
          <div style={{ display: "flex" }}>
            <MediaCard venture={mediaVenturesData[1]} inView={inView} entryDelay={320} isRTL={isRTL} toLocalNum={toLocalNum} />
          </div>

          {/* Row 2: Speda (1 col) + Dialogue (2 cols) */}
          <div style={{ display: "flex" }}>
            <MediaCard venture={mediaVenturesData[2]} inView={inView} entryDelay={400} isRTL={isRTL} toLocalNum={toLocalNum} />
          </div>
          <div className="lg:col-span-2" style={{ display: "flex" }}>
            <MediaCard venture={mediaVenturesData[3]} inView={inView} entryDelay={500} isRTL={isRTL} toLocalNum={toLocalNum} />
          </div>
        </div>

        {/* ════ STAT BAR ════ */}
        <div
          className="mt-12 grid grid-cols-3 gap-4"
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          {[
            { value: t("media.stat1_value"), label: t("media.stat1_label") },
            { value: t("media.stat2_value"), label: t("media.stat2_label") },
            { value: t("media.stat3_value"), label: t("media.stat3_label") },
          ].map((s, i) => (
            <StatPill key={i} value={s.value} label={s.label} inView={inView} delay={650 + i * 100} isRTL={isRTL} toLocalNum={toLocalNum} />
          ))}
        </div>
      </div>
    </section>
  );
}