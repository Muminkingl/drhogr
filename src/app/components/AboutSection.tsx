"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

/* ─────────────────────────────────────────────
   Intersection observer hook
───────────────────────────────────────────── */
function useInView(threshold = 0.15) {
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
   Counter hook
───────────────────────────────────────────── */
function useCounter(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let t: number | null = null;
    const step = (ts: number) => {
      if (!t) t = ts;
      const p = Math.min((ts - t) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 4)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ─────────────────────────────────────────────
   Word-by-word reveal paragraph
───────────────────────────────────────────── */
function WordReveal({
  text,
  inView,
  delay = 0,
  className = "",
  isRTL = false,
}: {
  text: string;
  inView: boolean;
  delay?: number;
  className?: string;
  isRTL?: boolean;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            marginRight: isRTL ? "0" : "0.28em",
            marginLeft: isRTL ? "0.28em" : "0",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(14px)",
            transition: `opacity 0.55s ease ${delay + i * 28}ms, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${delay + i * 28}ms`,
          }}
        >
          {w}
        </span>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Animated draw-in underline
───────────────────────────────────────────── */
function DrawLine({ inView, delay = 0, isRTL = false }: { inView: boolean; delay?: number; isRTL?: boolean }) {
  return (
    <span
      style={{
        display: "block",
        height: "1px",
        background: isRTL
          ? "linear-gradient(90deg, rgba(201,168,76,0.2), #C9A84C)"
          : "linear-gradient(90deg, #C9A84C, rgba(201,168,76,0.2))",
        transform: inView ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: isRTL ? "right" : "left",
        transition: `transform 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   Pillar icons
───────────────────────────────────────────── */
const pillarIcons = [
  (
    <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  (
    <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5l16.5-4.125M12 6.75c-2.708 0-5.363.224-7.948.655C2.566 7.176 2.25 8.527 2.25 9.75v9a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25v-9c0-1.223-.316-2.574-1.802-2.845A48.14 48.14 0 0012 6.75z" />
    </svg>
  ),
  (
    <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
  (
    <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
];

const pillarLabelKeys = [
  "about.pillar1_label", "about.pillar2_label", "about.pillar3_label", "about.pillar4_label",
];
const pillarDescKeys = [
  "about.pillar1_desc", "about.pillar2_desc", "about.pillar3_desc", "about.pillar4_desc",
];
const pillarNumbers = ["01", "02", "03", "04"];

const statValues = [
  { value: 25, suffix: "+" },
  { value: 3, suffix: "" },
  { value: 3, suffix: "" },
  { value: 4, suffix: "" },
];
const statLabelKeys = ["about.stat1_label", "about.stat2_label", "about.stat3_label", "about.stat4_label"];

/* ─────────────────────────────────────────────
   ABOUT SECTION
───────────────────────────────────────────── */
export default function AboutSection() {
  const { ref, inView } = useInView(0.1);
  const { t, isRTL } = useLanguage();

  const c0 = useCounter(statValues[0].value, 2200, inView);
  const c1 = useCounter(statValues[1].value, 1500, inView);
  const c2 = useCounter(statValues[2].value, 1700, inView);
  const c3 = useCounter(statValues[3].value, 1900, inView);
  const counters = [c0, c1, c2, c3];

  return (
    <section
      id="about"
      className="relative py-28 lg:py-44 overflow-hidden"
      style={{ background: "#0A0E1A" }}
    >
      {/* ── Soft radial glow ── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 68%)" }}
      />

      {/* ── Vertical rule ── */}
      <div
        className={`absolute top-0 bottom-0 w-px hidden lg:block ${isRTL ? 'right-[4%]' : 'left-[4%]'}`}
        style={{ background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.15), transparent)" }}
      />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16">

        {/* ════════════════════════════════
            SECTION HEADER
        ════════════════════════════════ */}
        <div className="mb-24">

          {/* Overline */}
          <div
            className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateX(0)" : `translateX(${isRTL ? '20px' : '-20px'})`,
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <span className="block w-8 h-px" style={{ background: "#C9A84C" }} />
            <span
              className="text-[10px] tracking-[0.45em] uppercase font-mono"
              style={{ color: "rgba(201,168,76,0.65)" }}
            >
              {t("about.overline")}
            </span>
          </div>

          {/* Headline — two-line staggered slide-up */}
          <div className="overflow-hidden mb-3">
            <h2
              className="font-serif font-bold leading-[0.92]"
              style={{
                fontSize: "clamp(2.4rem,5.5vw,4.2rem)",
                color: "#F0EBD8",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(40px)",
                transition: "opacity 0.75s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.75s cubic-bezier(0.16,1,0.3,1) 0.1s",
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("about.heading1")}
            </h2>
          </div>
          <div className="overflow-hidden mb-6">
            <h2
              className="font-serif font-bold leading-[0.92]"
              style={{
                fontSize: "clamp(2.4rem,5.5vw,4.2rem)",
                WebkitTextStroke: "1px #C9A84C",
                color: "transparent",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(40px)",
                transition: "opacity 0.75s cubic-bezier(0.16,1,0.3,1) 0.22s, transform 0.75s cubic-bezier(0.16,1,0.3,1) 0.22s",
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("about.heading2")}
            </h2>
          </div>

          {/* Draw-in underline */}
          <DrawLine inView={inView} delay={500} isRTL={isRTL} />
        </div>

        {/* ════════════════════════════════
            MAIN GRID
        ════════════════════════════════ */}
        <div className={`grid lg:grid-cols-[1fr_360px] gap-16 lg:gap-28 items-start ${isRTL ? 'lg:grid-cols-[360px_1fr]' : ''}`}>

          {/* ═══ LEFT (or RIGHT in RTL) ═══ */}
          <div className={`space-y-14 ${isRTL ? 'lg:order-2' : ''}`}>

            {/* Bio paragraphs with word-by-word reveal */}
            <div className="space-y-7">
              <p
                className="font-serif leading-relaxed"
                style={{
                  fontSize: "clamp(1.05rem,1.3vw,1.2rem)",
                  color: "rgba(240,235,216,0.82)",
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                <span
                  className="font-bold"
                  style={{
                    color: "#C9A84C",
                    opacity: inView ? 1 : 0,
                    transition: "opacity 0.6s ease 0.35s",
                  }}
                >
                  {t("about.bio_name")}
                </span>{" "}
                <WordReveal
                  text={t("about.bio1")}
                  inView={inView}
                  delay={450}
                  isRTL={isRTL}
                />
              </p>

              <p style={{
                fontSize: "clamp(0.95rem,1.1vw,1.05rem)",
                color: "rgba(240,235,216,0.45)",
                lineHeight: 1.85,
                textAlign: isRTL ? "right" : "left",
              }}>
                <WordReveal
                  text={t("about.bio2")}
                  inView={inView}
                  delay={700}
                  isRTL={isRTL}
                />
              </p>
            </div>

            {/* ── Pillar cards ── */}
            <div className="grid sm:grid-cols-2 gap-3">
              {pillarNumbers.map((num, i) => (
                <PillarCard
                  key={i}
                  number={num}
                  label={t(pillarLabelKeys[i])}
                  desc={t(pillarDescKeys[i])}
                  icon={pillarIcons[i]}
                  inView={inView}
                  delay={500 + i * 100}
                  isRTL={isRTL}
                />
              ))}
            </div>

            {/* ── Quote ── */}
            <QuoteBlock inView={inView} delay={900} quote={t("about.quote")} isRTL={isRTL} />
          </div>

          {/* ═══ RIGHT: Stats panel (or LEFT in RTL) ═══ */}
          <div
            className={isRTL ? 'lg:order-1' : ''}
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.9s ease 0.4s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s",
            }}
          >
            <StatsPanel
              statLabelKeys={statLabelKeys}
              statValues={statValues}
              counters={counters}
              inView={inView}
              isRTL={isRTL}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulseGold {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Pillar card
───────────────────────────────────────────── */
function PillarCard({
  number,
  label,
  desc,
  icon,
  inView,
  delay,
  isRTL,
}: {
  number: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  inView: boolean;
  delay: number;
  isRTL: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "20px",
        background: hovered ? "rgba(201,168,76,0.05)" : "rgba(240,235,216,0.02)",
        border: `1px solid ${hovered ? "rgba(201,168,76,0.3)" : "rgba(201,168,76,0.1)"}`,
        clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
        transition: "background 0.35s ease, border-color 0.35s ease, transform 0.35s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        opacity: inView ? 1 : 0,
        willChange: "opacity, transform",
        transitionDelay: `${delay}ms, ${delay}ms, 0ms, 0ms`,
        textAlign: isRTL ? "right" : "left",
      }}
    >
      {/* Number + icon row */}
      <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <span
          className="font-mono text-[10px] tracking-[0.3em]"
          style={{ color: "rgba(201,168,76,0.35)" }}
        >
          {number}
        </span>
        <span
          style={{
            color: hovered ? "#C9A84C" : "rgba(201,168,76,0.5)",
            transition: "color 0.35s ease",
          }}
        >
          {icon}
        </span>
      </div>

      {/* Label */}
      <div
        className="text-xs tracking-[0.3em] uppercase font-mono mb-2"
        style={{ color: "#C9A84C" }}
      >
        {label}
      </div>

      {/* Desc */}
      <div
        className="text-xs leading-relaxed"
        style={{ color: "rgba(240,235,216,0.45)", lineHeight: 1.75 }}
      >
        {desc}
      </div>

      {/* Bottom slide-in line on hover */}
      <div
        style={{
          marginTop: "14px",
          height: "1px",
          background: "#C9A84C",
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: isRTL ? "right" : "left",
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Quote block
───────────────────────────────────────────── */
function QuoteBlock({ inView, delay, quote, isRTL }: { inView: boolean; delay: number; quote: string; isRTL: boolean }) {
  return (
    <div
      className={`relative ${isRTL ? 'pr-6' : 'pl-6'}`}
      style={{
        borderLeft: isRTL ? "none" : "2px solid rgba(201,168,76,0.25)",
        borderRight: isRTL ? "2px solid rgba(201,168,76,0.25)" : "none",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : `translateX(${isRTL ? '16px' : '-16px'})`,
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {/* Gold accent dot on border */}
      <div
        className={`absolute top-0 w-2 h-2 rounded-full ${isRTL ? '-right-[5px]' : '-left-[5px]'}`}
        style={{ background: "#C9A84C", animation: "pulseGold 3s ease-in-out infinite" }}
      />
      <p
        className="font-serif italic leading-loose"
        style={{
          fontSize: "clamp(0.95rem,1.1vw,1.05rem)",
          color: "rgba(240,235,216,0.35)",
          textAlign: isRTL ? "right" : "left",
        }}
      >
        &ldquo;{quote}&rdquo;
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Stats panel
───────────────────────────────────────────── */
function StatsPanel({
  statLabelKeys,
  statValues,
  counters,
  inView,
  isRTL,
}: {
  statLabelKeys: string[];
  statValues: { value: number; suffix: string }[];
  counters: number[];
  inView: boolean;
  isRTL: boolean;
}) {
  const { t, toLocalNum } = useLanguage();

  return (
    <div className="space-y-3">
      {/* Main panel */}
      <div
        className="relative p-8"
        style={{
          background: "rgba(240,235,216,0.02)",
          border: "1px solid rgba(201,168,76,0.15)",
          clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
        }}
      >
        {/* Corner accents */}
        <div className="absolute top-0 right-0 w-5 h-5 border-t border-r" style={{ borderColor: "rgba(201,168,76,0.45)" }} />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l" style={{ borderColor: "rgba(201,168,76,0.45)" }} />

        {/* Panel label */}
        <div
          className="text-[10px] tracking-[0.45em] uppercase font-mono mb-8"
          style={{ color: "rgba(201,168,76,0.45)", textAlign: isRTL ? "right" : "left" }}
        >
          {t("about.stats_label")}
        </div>

        {/* Stat rows — each slides in with stagger */}
        <div className="space-y-0">
          {statValues.map((s, i) => {
            const value = counters[i] ?? 0;
            return (
              <StatRow
                key={i}
                label={t(statLabelKeys[i])}
                value={value}
                suffix={s.suffix}
                inView={inView}
                delay={500 + i * 120}
                isLast={i === statValues.length - 1}
                isRTL={isRTL}
                toLocalNum={toLocalNum}
              />
            );
          })}
        </div>

        {/* Divider + quote footer */}
        <div
          style={{
            marginTop: "28px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(201,168,76,0.08)",
            opacity: inView ? 1 : 0,
            transition: "opacity 0.8s ease 1.1s",
          }}
        >
          <p
            className="font-serif italic text-sm leading-relaxed"
            style={{ color: "rgba(240,235,216,0.28)", textAlign: isRTL ? "right" : "left" }}
          >
            &ldquo;{t("about.stats_footer")}&rdquo;
          </p>
        </div>
      </div>

      {/* Location tag */}
      <div
        className={`flex items-center gap-3 px-5 py-3 ${isRTL ? 'flex-row-reverse' : ''}`}
        style={{
          background: "rgba(10,14,26,0.85)",
          border: "1px solid rgba(201,168,76,0.12)",
          clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
          opacity: inView ? 1 : 0,
          transition: "opacity 0.7s ease 1.2s",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: "#C9A84C", animation: "pulseGold 3s ease-in-out infinite" }}
        />
        <span
          className="text-[11px] font-mono tracking-widest uppercase"
          style={{ color: "rgba(240,235,216,0.38)" }}
        >
          {t("about.location")}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Stat row
───────────────────────────────────────────── */
function StatRow({
  label,
  value,
  suffix,
  inView,
  delay,
  isLast,
  isRTL,
  toLocalNum,
}: {
  label: string;
  value: number;
  suffix: string;
  inView: boolean;
  delay: number;
  isLast: boolean;
  isRTL: boolean;
  toLocalNum: (n: number | string) => string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: isRTL ? "row-reverse" : "row",
        padding: "18px 0",
        borderBottom: isLast ? "none" : "1px solid rgba(201,168,76,0.07)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : `translateX(${isRTL ? '-20px' : '20px'})`,
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        cursor: "default",
      }}
    >
      {/* Label with sliding gold underline */}
      <div className="relative">
        <span
          className="text-xs font-mono tracking-[0.2em] uppercase"
          style={{ color: hovered ? "rgba(240,235,216,0.7)" : "rgba(240,235,216,0.4)", transition: "color 0.3s ease" }}
        >
          {label}
        </span>
        <span
          style={{
            display: "block",
            height: "1px",
            background: "#C9A84C",
            transform: hovered ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: isRTL ? "right" : "left",
            transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
            marginTop: "3px",
          }}
        />
      </div>

      {/* Counter */}
      <span
        className="font-serif font-bold tabular-nums"
        style={{
          fontSize: "clamp(2rem,3vw,2.6rem)",
          color: hovered ? "#E8C96B" : "#C9A84C",
          transition: "color 0.3s ease",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {toLocalNum(value)}{suffix}
      </span>
    </div>
  );
}