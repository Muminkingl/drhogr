"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

/* ─────────────────────────────────────────────
   Animated counter
───────────────────────────────────────────── */
function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ─────────────────────────────────────────────
   Split-char span helper
───────────────────────────────────────────── */
function SplitText({
  text,
  className,
  delay = 0,
  visible,
  stagger = 40,
  isRTL = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  visible: boolean;
  stagger?: number;
  isRTL?: boolean;
}) {
  return (
    <span className={className} aria-label={text} style={{ display: "block" }}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) rotateX(0deg)" : "translateY(60px) rotateX(-40deg)",
            transition: `opacity 0.6s ease ${delay + i * stagger}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay + i * stagger}ms, color 0.5s ease-out, -webkit-text-stroke 0.5s ease-out, text-shadow 0.5s ease-out`,
            whiteSpace: ch === " " ? "pre" : "normal",
            direction: isRTL ? "rtl" : "ltr",
            unicodeBidi: isRTL ? "bidi-override" : "normal",
          }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Typewriter line
───────────────────────────────────────────── */
function TypewriterLine({ text, delay = 0, visible }: { text: string; delay?: number; visible: boolean }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!visible) return;
    setDisplayed("");
    let i = 0;
    const timer = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(id);
      }, 30);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(timer);
  }, [visible, text, delay]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && visible && (
        <span className="inline-block w-0.5 h-4 bg-[#C9A84C] ml-0.5 align-middle" style={{ animation: "blink 0.8s step-end infinite" }} />
      )}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Stats
───────────────────────────────────────────── */
const statValues = [
  { value: 25, suffix: "+" },
  { value: 3,  suffix: ""  },
  { value: 4,  suffix: ""  },
];

const statLabelKeys = ["hero.stat1_label", "hero.stat2_label", "hero.stat3_label"];

/* ─────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────── */
export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t, isRTL, locale, toLocalNum } = useLanguage();

  // Reset animation on language change
  useEffect(() => {
    setVisible(false);
    const t2 = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t2);
  }, [locale]);

  const c0 = useCounter(statValues[0].value, 2400, visible);
  const c1 = useCounter(statValues[1].value, 1800, visible);
  const c2 = useCounter(statValues[2].value, 2000, visible);
  const counters = [c0, c1, c2];

  const descriptorLines = [t("hero.desc1"), t("hero.desc2"), t("hero.desc3")];

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0A0E1A]"
    >
      {/* ── Islamic geometric pattern ── */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ animation: "slowRotate 120s linear infinite" }}>
          <defs>
            <pattern id="geo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <polygon points="40,4 47,27 70,20 57,40 70,60 47,53 40,76 33,53 10,60 23,40 10,20 33,27" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
              <rect x="20" y="20" width="40" height="40" fill="none" stroke="#C9A84C" strokeWidth="0.4" transform="rotate(45,40,40)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geo)" />
        </svg>
      </div>

      {/* ── Ambient glows ── */}
      <div className={`absolute top-0 w-[600px] h-[600px] bg-[#C9A84C] opacity-[0.04] rounded-full blur-[120px] pointer-events-none ${isRTL ? 'left-0' : 'right-0'}`} />
      <div className={`absolute bottom-0 w-[400px] h-[400px] bg-[#1A6B5A] opacity-[0.05] rounded-full blur-[100px] pointer-events-none ${isRTL ? 'right-0' : 'left-0'}`} />

      {/* ── Horizontal scan line that sweeps once on load ── */}
      <div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/60 to-transparent pointer-events-none z-30"
        style={{ top: "50%", animation: "scanLine 1.8s cubic-bezier(0.4,0,0.2,1) forwards", opacity: 0 }}
      />

      {/* ── Vertical rule ── */}
      <div
        className={`absolute top-0 w-px bg-gradient-to-b from-transparent via-[#C9A84C]/30 to-transparent hidden lg:block ${isRTL ? 'right-[4%]' : 'left-[4%]'}`}
        style={{ height: "100%" }}
      />

      {/* ── MAIN LAYOUT ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 w-full py-24 lg:py-12 mt-16 lg:mt-24">
        <div className={`grid lg:grid-cols-[1fr_420px] gap-16 lg:gap-24 items-center ${isRTL ? 'lg:grid-cols-[420px_1fr]' : ''}`}>

          {/* ═══════════════ TEXT COLUMN ═══════════════ */}
          <div className={`space-y-10 ${isRTL ? 'lg:order-2 text-right' : ''}`} style={{ perspective: "800px" }}>

            {/* ── Overline with typewriter ── */}
            <div
              className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : `translateX(${isRTL ? '24px' : '-24px'})`,
                transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
              }}
            >
              <span className="block w-8 h-px bg-[#C9A84C]" />
              <span className="text-[#C9A84C] text-xs tracking-[0.35em] uppercase font-medium font-mono">
                <TypewriterLine text={t("hero.overline")} delay={300} visible={visible} />
              </span>
            </div>

            {/* ── EDITORIAL NAME — split-char 3D reveal ── */}
            <div className="space-y-0 overflow-hidden hover-glow-root" style={{ perspective: "600px" }}>
              {/* Line 1 — solid */}
              <h1
                className="font-serif leading-[0.88] tracking-tight select-none"
                style={{ fontSize: "clamp(3rem,8vw,7rem)", color: "#F0EBD8" }}
              >
                {isRTL ? (
                  <span style={{ display: "block" }}>{t("hero.name_line1")}</span>
                ) : (
                  <SplitText text={t("hero.name_line1")} visible={visible} delay={200} stagger={45} />
                )}
              </h1>

              {/* Line 2 — outlined with elegant glow on hover */}
              <h1
                className="font-serif leading-[0.88] tracking-tight select-none"
                style={{ fontSize: "clamp(3rem,8vw,7rem)", cursor: "default" }}
              >
                {isRTL ? (
                  <span className="outlined-name" style={{ display: "block", opacity: visible ? 1 : 0, transition: "opacity 0.6s ease 450ms" }}>
                    <span style={{ transition: "color 0.5s ease-out, -webkit-text-stroke 0.5s ease-out, text-shadow 0.5s ease-out" }}>{t("hero.name_line2")}</span>
                  </span>
                ) : (
                  <SplitText
                    text={t("hero.name_line2")}
                    visible={visible}
                    delay={450}
                    stagger={38}
                    className="outlined-name"
                  />
                )}
              </h1>

              {/* Line 3 — outlined with elegant glow on hover */}
              <h1
                className="font-serif leading-[0.88] tracking-tight select-none"
                style={{ fontSize: "clamp(3rem,8vw,7rem)", cursor: "default" }}
              >
                {isRTL ? (
                  <span className="outlined-name" style={{ display: "block", opacity: visible ? 1 : 0, transition: "opacity 0.6s ease 700ms" }}>
                    <span style={{ transition: "color 0.5s ease-out, -webkit-text-stroke 0.5s ease-out, text-shadow 0.5s ease-out" }}>{t("hero.name_line3")}</span>
                  </span>
                ) : (
                  <SplitText
                    text={t("hero.name_line3")}
                    visible={visible}
                    delay={700}
                    stagger={38}
                    className="outlined-name"
                  />
                )}
              </h1>
            </div>

            {/* ── Thin divider that slides in ── */}
            <div
              style={{
                height: "1px",
                background: isRTL
                  ? "linear-gradient(90deg, transparent, #C9A84C80, #C9A84C33)"
                  : "linear-gradient(90deg, #C9A84C33, #C9A84C80, transparent)",
                transform: visible ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: isRTL ? "right" : "left",
                transition: "transform 1s cubic-bezier(0.16,1,0.3,1) 900ms",
              }}
            />

            {/* ── Descriptor — word-by-word fade+slide ── */}
            <DescriptorBlock visible={visible} lines={descriptorLines} isRTL={isRTL} />

            {/* ── Stats counters ── */}
            <div
              className={`flex flex-wrap gap-10 pt-2 ${isRTL ? 'justify-end' : ''}`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.8s ease 1.1s, transform 0.8s ease 1.1s",
              }}
            >
              {statValues.map((stat, i) => (
                <div key={i} className="space-y-1 group">
                  <div
                    className="font-mono text-3xl font-bold tabular-nums relative overflow-hidden"
                    style={{ color: "#C9A84C" }}
                  >
                    <span className="relative z-10">{toLocalNum(counters[i])}{stat.suffix}</span>
                    <span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C9A84C]/30"
                      style={{ transform: "scaleX(0)", transformOrigin: isRTL ? "right" : "left", transition: "transform 0.4s ease" }}
                    />
                  </div>
                  <div className="text-[#F0EBD8]/40 text-xs tracking-widest uppercase group-hover:text-[#C9A84C]/60 transition-colors duration-300">
                    {t(statLabelKeys[i])}
                  </div>
                </div>
              ))}
            </div>

            {/* ── CTAs ── */}
            <div
              className={`flex flex-wrap gap-4 ${isRTL ? 'justify-end' : ''}`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.8s ease 1.3s, transform 0.8s ease 1.3s",
              }}
            >
              {/* Primary */}
              <a
                href="#about"
                className="group relative inline-flex items-center gap-3 px-8 py-4 text-sm font-bold text-[#0A0E1A] overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #E8C96B)",
                  clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontSize: "11px",
                }}
              >
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)", animation: "shimmer 1.4s ease infinite" }}
                />
                <span className="relative z-10">{t("hero.cta_primary")}</span>
                <svg className={`w-4 h-4 relative z-10 transition-transform ${isRTL ? 'group-hover:-translate-x-1.5 rotate-180' : 'group-hover:translate-x-1.5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>

              {/* Secondary */}
              <a
                href="#media"
                className="group relative inline-flex items-center gap-2 px-8 py-4 overflow-hidden"
                style={{
                  border: "1px solid rgba(201,168,76,0.25)",
                  clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#C9A84C",
                }}
              >
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "rgba(201,168,76,0.06)" }}
                />
                <span className="relative z-10">{t("hero.cta_secondary")}</span>
                <svg className="w-3.5 h-3.5 relative z-10 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ═══════════════ PHOTO COLUMN ═══════════════ */}
          <div
            className={`relative flex justify-center lg:justify-end ${isRTL ? 'lg:order-1 lg:justify-start' : ''}`}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : `translateX(${isRTL ? '-40px' : '40px'})`,
              transition: "opacity 1s ease 0.4s, transform 1s ease 0.4s",
            }}
          >
            {/* Corner decorations */}
            <div className="absolute -top-4 -left-4 w-10 h-10 border-t-2 border-l-2 border-[#C9A84C]/60 z-20" />
            <div className="absolute -bottom-4 -right-4 w-10 h-10 border-b-2 border-r-2 border-[#C9A84C]/60 z-20" />

            {/* Photo */}
            <div
              className="relative w-72 h-[420px] sm:w-80 sm:h-[460px] overflow-hidden"
              style={{ clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))" }}
            >
              <Image
                src="/image.png"
                alt={`${t("hero.name_line1")} ${t("hero.name_line2")} ${t("hero.name_line3")}`}
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 640px) 288px, 320px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A]/70 via-transparent to-transparent" />

              {/* Credential badge */}
              <div
                className="absolute bottom-6 left-6 right-6 p-4 backdrop-blur-md"
                style={{
                  background: "rgba(10,14,26,0.78)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                }}
              >
                <div className="text-[#C9A84C] text-[9px] font-mono tracking-[0.3em] uppercase mb-1">{t("hero.badge_label")}</div>
                <div className="text-[#F0EBD8]/75 text-xs leading-snug">
                  {t("hero.badge_text")}
                </div>
              </div>
            </div>

            {/* Floating university tag */}
            <div
              className={`absolute -top-3 flex items-center gap-2 px-4 py-2 ${isRTL ? 'left-0 lg:-left-6' : 'right-0 lg:-right-6'}`}
              style={{
                background: "rgba(10,14,26,0.9)",
                border: "1px solid rgba(201,168,76,0.25)",
                animation: "floatY 4s ease-in-out infinite",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
              <span className="text-[#F0EBD8]/60 text-[10px] tracking-[0.25em] uppercase font-mono whitespace-nowrap">
                {t("hero.university_tag")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll cue ── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 1s ease 1.6s" }}
      >
        <span className="text-[9px] tracking-[0.4em] uppercase text-[#F0EBD8]/25 font-mono">{t("hero.scroll")}</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#C9A84C]/40 to-transparent" style={{ animation: "scrollLine 2s ease-in-out infinite" }} />
      </div>

      {/* ════════════ KEYFRAMES & CUSTOM CSS ════════════ */}
      <style jsx>{`
        @keyframes slowRotate {
          from { transform: rotate(0deg) scale(1.5); }
          to   { transform: rotate(360deg) scale(1.5); }
        }
        @keyframes floatY {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-8px); }
        }
        @keyframes scrollLine {
          0%   { transform: scaleY(0); transform-origin: top; opacity: 1; }
          50%  { transform: scaleY(1); transform-origin: top; opacity: 1; }
          100% { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50%     { opacity: 0; }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes scanLine {
          0%   { top: -2px; opacity: 1; }
          60%  { top: 100%; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        /* Outlined second name line */
        :global(.outlined-name span) {
          -webkit-text-stroke: 1.2px rgba(201, 168, 76, 0.65);
          color: transparent;
        }

        /* Elegant cinematic glow effect on second h1 hover */
        :global(.hover-glow-root:hover .outlined-name span) {
          color: #C9A84C;
          -webkit-text-stroke: 0px transparent;
          text-shadow: 0 0 30px rgba(201, 168, 76, 0.6), 0 0 10px rgba(201, 168, 76, 0.3);
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Word-by-word descriptor block
───────────────────────────────────────────── */
function DescriptorBlock({ visible, lines, isRTL }: { visible: boolean; lines: string[]; isRTL: boolean }) {
  return (
    <div className="max-w-lg space-y-2">
      {lines.map((line, li) =>
        <WordRevealLine key={li} text={line} visible={visible} delay={750 + li * 180} isRTL={isRTL} />
      )}
    </div>
  );
}

function WordRevealLine({ text, visible, delay, isRTL }: { text: string; visible: boolean; delay: number; isRTL: boolean }) {
  const words = text.split(" ");
  return (
    <p className="text-base leading-relaxed" style={{ color: "rgba(240,235,216,0.55)", textAlign: isRTL ? "right" : "left" }}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            marginRight: isRTL ? "0" : "0.3em",
            marginLeft: isRTL ? "0.3em" : "0",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: `opacity 0.5s ease ${delay + i * 35}ms, transform 0.5s ease ${delay + i * 35}ms`,
          }}
        >
          {word}
        </span>
      ))}
    </p>
  );
}