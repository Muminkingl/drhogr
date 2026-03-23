"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

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
   Types
───────────────────────────────────────────── */
interface TimelineItem {
  year: string;
  title: string;
  institution: string;
  description?: string;
  type: "academic" | "work";
}

/* ─────────────────────────────────────────────
   Icons
───────────────────────────────────────────── */
const AcademicIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
  </svg>
);

const WorkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
  </svg>
);


/* ─────────────────────────────────────────────
   Timeline card
───────────────────────────────────────────── */
function TimelineCard({
  item,
  index,
  inView,
  side,
  isLast,
  isRTL,
  toLocalNum,
}: {
  item: TimelineItem;
  index: number;
  inView: boolean;
  side: "left" | "right";
  isLast: boolean;
  isRTL: boolean;
  toLocalNum: (n: number | string) => string;
}) {
  const [hovered, setHovered] = useState(false);
  const entryDelay = 200 + index * 160;
  
  // RTL logic adjustment: When RTL is true, standard 'left/right' positions flip visually relative to flex row.
  // Standard fromLeft implies it is on the left side of the vertical center line.
  const fromLeft = side === "right"; 

  // Format the year text to local numerals if needed
  const formatYear = (yearStr: string) => {
    return yearStr.split("").map(char => /\d/.test(char) ? toLocalNum(char) : char).join("");
  };

  return (
    <div
      className={`relative flex items-start gap-0 ${fromLeft ? (isRTL ? "lg:flex-row-reverse" : "lg:flex-row") : (isRTL ? "lg:flex-row" : "lg:flex-row-reverse")}`}
    >
      {/* Desktop half-width spacer */}
      <div className="hidden lg:block lg:w-[calc(50%-20px)]" />

      {/* ── Center node (desktop) ── */}
      <div
        className="hidden lg:flex absolute left-1/2 -translate-x-1/2 flex-col items-center z-20"
        style={{ top: "32px" }}
      >
        {/* Outer ring */}
        <div
          style={{
            position: "absolute",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: `1px solid ${hovered ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.18)"}`,
            transform: `scale(${hovered ? 1.35 : 1})`,
            transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease",
            opacity: inView ? 1 : 0,
            transitionDelay: `${entryDelay}ms, ${entryDelay}ms`,
          }}
        />
        {/* Inner filled dot */}
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: hovered ? "#C9A84C" : "rgba(201,168,76,0.12)",
            border: `1px solid ${hovered ? "#C9A84C" : "rgba(201,168,76,0.45)"}`,
            color: hovered ? "#0A0E1A" : "#C9A84C",
            transition: "background 0.35s ease, border-color 0.35s ease, color 0.35s ease",
            opacity: inView ? 1 : 0,
            transform: inView ? "scale(1)" : "scale(0.4)",
          }}
        >
          {item.type === "academic" ? <AcademicIcon /> : <WorkIcon />}
        </div>
      </div>

      {/* ── Mobile dot ── */}
      <div className={`lg:hidden flex-shrink-0 flex flex-col items-center mt-8 z-20 ${isRTL ? 'ml-4' : 'mr-4'}`}>
        <div
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(201,168,76,0.12)",
            border: "1px solid rgba(201,168,76,0.4)",
            color: "#C9A84C",
            flexShrink: 0,
          }}
        >
          {item.type === "academic" ? <AcademicIcon /> : <WorkIcon />}
        </div>
        {!isLast && (
          <div style={{ width: "1px", flex: 1, marginTop: "8px", minHeight: "40px", background: "rgba(201,168,76,0.18)" }} />
        )}
      </div>

      {/* ── Card ── */}
      <div
        className={`flex-1 lg:w-[calc(50%-28px)] mb-10 ${fromLeft ? (isRTL ? "lg:pr-10" : "lg:pl-10") : (isRTL ? "lg:pl-10" : "lg:pr-10")}`}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView
            ? "translateX(0) translateY(0)"
            : `translateX(${fromLeft ? (isRTL ? "28px" : "-28px") : (isRTL ? "-28px" : "28px")}) translateY(10px)`,
          transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${entryDelay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${entryDelay}ms`,
        }}
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: "relative",
            padding: "28px",
            background: hovered ? "rgba(201,168,76,0.05)" : "rgba(240,235,216,0.022)",
            border: `1px solid ${hovered ? "rgba(201,168,76,0.28)" : "rgba(201,168,76,0.1)"}`,
            clipPath: isRTL 
              ? "polygon(16px 0, 100% 0, 100% 100%, 0 100%, 0 16px, 16px 0)" 
              : "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
            transition: "background 0.35s ease, border-color 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
            transform: hovered ? "translateY(-3px)" : "translateY(0)",
            cursor: "default",
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {/* Corner accents */}
          <div style={{
            position: "absolute", top: 0, [isRTL ? 'left' : 'right']: 0, width: "16px", height: "16px",
            borderTop: `1px solid ${hovered ? "rgba(201,168,76,0.55)" : "rgba(201,168,76,0.22)"}`,
            [isRTL ? 'borderLeft' : 'borderRight']: `1px solid ${hovered ? "rgba(201,168,76,0.55)" : "rgba(201,168,76,0.22)"}`,
            transition: "border-color 0.35s ease",
          }} />
          <div style={{
            position: "absolute", bottom: 0, [isRTL ? 'right' : 'left']: 0, width: "16px", height: "16px",
            borderBottom: `1px solid ${hovered ? "rgba(201,168,76,0.55)" : "rgba(201,168,76,0.22)"}`,
            [isRTL ? 'borderRight' : 'borderLeft']: `1px solid ${hovered ? "rgba(201,168,76,0.55)" : "rgba(201,168,76,0.22)"}`,
            transition: "border-color 0.35s ease",
          }} />

          {/* Year badge */}
          <div style={{ marginBottom: "18px" }}>
            <span
              style={{
                display: "inline-block",
                padding: "4px 12px",
                fontSize: "10px",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#C9A84C",
                background: hovered ? "rgba(201,168,76,0.14)" : "rgba(201,168,76,0.07)",
                border: "1px solid rgba(201,168,76,0.2)",
                clipPath: isRTL
                  ? "polygon(5px 0, 100% 0, 100% 100%, 0 100%, 0 5px, 5px 0)"
                  : "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
                transition: "background 0.35s ease",
              }}
            >
              {formatYear(item.year)}
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: "serif",
              fontSize: "clamp(1.05rem, 1.4vw, 1.22rem)",
              fontWeight: 700,
              color: hovered ? "#F0EBD8" : "rgba(240,235,216,0.88)",
              marginBottom: "10px",
              lineHeight: 1.3,
              transition: "color 0.3s ease",
            }}
          >
            {item.title}
          </h3>

          {/* Institution */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "14px", flexDirection: isRTL ? "row-reverse" : "row" }}>
            <span style={{
              display: "block", width: "14px", height: "1px", marginTop: "10px",
              background: "#C9A84C", flexShrink: 0,
            }} />
            <p style={{
              fontSize: "0.82rem",
              fontWeight: 600,
              color: hovered ? "rgba(201,168,76,0.9)" : "rgba(201,168,76,0.65)",
              lineHeight: 1.5,
              transition: "color 0.3s ease",
            }}>
              {item.institution}
            </p>
          </div>

          {/* Description */}
          {item.description && (
            <p style={{
              fontSize: "0.82rem",
              lineHeight: 1.85,
              color: "rgba(240,235,216,0.42)",
            }}>
              {item.description}
            </p>
          )}

          {/* Bottom sweep line */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: "16px",
            right: "16px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
            opacity: hovered ? 0.5 : 0,
            transform: hovered ? "scaleX(1)" : "scaleX(0.3)",
            transition: "opacity 0.45s ease, transform 0.45s cubic-bezier(0.16,1,0.3,1)",
          }} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Section header with staggered line reveals
───────────────────────────────────────────── */
function SectionHeader({
  label,
  line1,
  line2Outlined,
  inView,
  isRTL,
}: {
  label: string;
  line1: string;
  line2Outlined: string;
  inView: boolean;
  isRTL: boolean;
}) {
  return (
    <div className="mb-20 lg:mb-28">
      {/* Overline */}
      <div
        className={isRTL ? "flex-row-reverse" : ""}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateX(0)" : `translateX(${isRTL ? "18px" : "-18px"})`,
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <span style={{ display: "block", width: "32px", height: "1px", background: "#C9A84C" }} />
        <span style={{ fontSize: "10px", letterSpacing: "0.45em", textTransform: "uppercase", fontFamily: "monospace", color: "rgba(201,168,76,0.6)" }}>
          {label}
        </span>
      </div>

      {/* Line 1 — slides up from clip */}
      <div style={{ overflow: "hidden", marginBottom: "2px" }}>
        <h2
          style={{
            fontFamily: "serif",
            fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
            fontWeight: 700,
            lineHeight: 0.95,
            color: "#F0EBD8",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(50px)",
            transition: "opacity 0.75s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.75s cubic-bezier(0.16,1,0.3,1) 0.1s",
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {line1}
        </h2>
      </div>

      {/* Line 2 — outlined, slightly delayed */}
      <div style={{ overflow: "hidden", marginBottom: "20px" }}>
        <h2
          style={{
            fontFamily: "serif",
            fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
            fontWeight: 700,
            lineHeight: 0.95,
            WebkitTextStroke: "1px #C9A84C",
            color: "transparent",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(50px)",
            transition: "opacity 0.75s cubic-bezier(0.16,1,0.3,1) 0.22s, transform 0.75s cubic-bezier(0.16,1,0.3,1) 0.22s",
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {line2Outlined}
        </h2>
      </div>

      {/* Draw-in rule */}
      <div style={{
        height: "1px",
        background: isRTL ? "linear-gradient(270deg, #C9A84C, rgba(201,168,76,0.15), transparent)" : "linear-gradient(90deg, #C9A84C, rgba(201,168,76,0.15), transparent)",
        transform: inView ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: isRTL ? "right" : "left",
        transition: "transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.5s",
        maxWidth: "320px",
        marginLeft: isRTL ? "auto" : "0",
        marginRight: isRTL ? "0" : "auto",
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Timeline block
───────────────────────────────────────────── */
function TimelineBlock({
  id,
  label,
  line1,
  line2Outlined,
  items,
}: {
  id: string;
  label: string;
  line1: string;
  line2Outlined: string;
  items: TimelineItem[];
}) {
  const { ref, inView } = useInView(0.08);
  const { isRTL, toLocalNum } = useLanguage();

  return (
    <section
      id={id}
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{ background: "#0A0E1A" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.03) 0%, transparent 70%)" }}
      />

      {/* Vertical rule */}
      <div
        className={`absolute top-0 bottom-0 w-px hidden lg:block ${isRTL ? "right-[4%]" : "left-[4%]"}`}
        style={{ background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.12), transparent)" }}
      />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6 lg:px-16">

        <SectionHeader label={label} line1={line1} line2Outlined={line2Outlined} inView={inView} isRTL={isRTL} />

        {/* Timeline */}
        <div className="relative">

          {/* Base vertical line */}
          <div
            className="absolute left-1/2 -translate-x-px top-8 hidden lg:block"
            style={{
              bottom: 0,
              width: "1px",
              background: "linear-gradient(to bottom, rgba(201,168,76,0.2), rgba(201,168,76,0.06), transparent)",
            }}
          />

          {/* Animated grow-in overlay line */}
          <div
            className="absolute left-1/2 -translate-x-px top-8 hidden lg:block"
            style={{
              bottom: 0,
              width: "1px",
              background: "linear-gradient(to bottom, #C9A84C, rgba(201,168,76,0.25), transparent)",
              transform: inView ? "scaleY(1)" : "scaleY(0)",
              transformOrigin: "top",
              transition: "transform 1.8s cubic-bezier(0.16,1,0.3,1) 0.3s",
            }}
          />

          {items.map((item, i) => (
            <TimelineCard
              key={i}
              item={item}
              index={i}
              inView={inView}
              side={i % 2 === 0 ? "right" : "left"}
              isLast={i === items.length - 1}
              isRTL={isRTL}
              toLocalNum={toLocalNum}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Export
───────────────────────────────────────────── */
export default function QualificationsAndExperience() {
  const { t } = useLanguage();

  const academicQualifications: TimelineItem[] = [
    {
      year: t("timeline.qual_1_year"),
      title: t("timeline.qual_1_title"),
      institution: t("timeline.qual_1_inst"),
      description: t("timeline.qual_1_desc"),
      type: "academic",
    },
    {
      year: t("timeline.qual_2_year"),
      title: t("timeline.qual_2_title"),
      institution: t("timeline.qual_2_inst"),
      description: t("timeline.qual_2_desc"),
      type: "academic",
    },
    {
      year: t("timeline.qual_3_year"),
      title: t("timeline.qual_3_title"),
      institution: t("timeline.qual_3_inst"),
      description: t("timeline.qual_3_desc"),
      type: "academic",
    },
  ];

  const professionalExperience: TimelineItem[] = [
    {
      year: t("timeline.exp_1_year"),
      title: t("timeline.exp_1_title"),
      institution: t("timeline.exp_1_inst"),
      description: t("timeline.exp_1_desc"),
      type: "work",
    },
    {
      year: t("timeline.exp_2_year"),
      title: t("timeline.exp_2_title"),
      institution: t("timeline.exp_2_inst"),
      description: t("timeline.exp_2_desc"),
      type: "work",
    },
    {
      year: t("timeline.exp_3_year"),
      title: t("timeline.exp_3_title"),
      institution: t("timeline.exp_3_inst"),
      description: t("timeline.exp_3_desc"),
      type: "work",
    },
  ];

  return (
    <>
      <TimelineBlock
        id="qualifications"
        label={t("timeline.academic_label")}
        line1={t("timeline.academic_line1")}
        line2Outlined={t("timeline.academic_line2")}
        items={academicQualifications}
      />
      <TimelineBlock
        id="experience"
        label={t("timeline.work_label")}
        line1={t("timeline.work_line1")}
        line2Outlined={t("timeline.work_line2")}
        items={professionalExperience}
      />
    </>
  );
}