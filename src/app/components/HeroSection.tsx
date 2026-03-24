"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

/* ─────────────────────────────────────────────
   Social icons
───────────────────────────────────────────── */
const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/hogr.gharib",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px]">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/dr.hogr.ghareeb/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px]">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@hogrghareebkhudhu0",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px]">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@dr-hogrghareeb3887",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px]">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "Telegram",
    href: "https://t.me/Drhogrghareb",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px]">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.062-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.042-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/Drhogrghareeb",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px]">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.493h2.039L6.486 3.24H4.298l13.311 17.406z" />
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────── */
export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const { t, isRTL, locale } = useLanguage();

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(timer);
  }, [locale]);

  const getBannerImage = () => {
    switch (locale) {
      case "ar": return "/herooA.png";
      case "ku": return "/herooK.png";
      case "en": default: return "/herooE.png";
    }
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      {/* ── Full-screen background image ── */}
      {/* Desktop: center-top, Mobile: show the person on the right (70% top) */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-[70%_top] md:bg-[center_top]"
        style={{ backgroundImage: `url('${getBannerImage()}')` }}
      />

      {/* ── Dark gradient overlays ── */}
      {/* Bottom-to-top — heavier on mobile so text is readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,14,26,0.6) 0%, rgba(10,14,26,0.45) 30%, rgba(10,14,26,0.8) 65%, rgba(10,14,26,0.98) 100%)",
        }}
      />
      {/* Left overlay — desktop only (on mobile the full overlay is enough) */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(to right, rgba(10,14,26,0.9) 0%, rgba(10,14,26,0.65) 40%, rgba(10,14,26,0.2) 65%, transparent 85%)",
        }}
      />

      {/* ── Subtle scan line ── */}
      <div
        className="absolute left-0 right-0 h-px pointer-events-none z-20"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)",
          top: "50%",
          animation: "scanLine 2.5s cubic-bezier(0.4,0,0.2,1) forwards",
          opacity: 0,
        }}
      />

      {/* ── MAIN CONTENT ── */}
      <div
        className={`relative z-10 max-w-7xl mx-auto px-6 lg:px-16 w-full min-h-screen flex flex-col justify-end pb-16 lg:pb-24 pt-32 ${
          isRTL ? "items-end" : "items-start"
        }`}
      >
        {/* ── Role / credential tags ── */}
        <div
          className={`flex flex-wrap gap-2 mb-7 ${isRTL ? "flex-row-reverse" : ""}`}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
          }}
        >
          {[t("hero.tag_phd") || "Ph.D", t("hero.tag_journalist") || "Journalist", t("hero.tag_founder") || "Founder"].map(
            (tag, i) => (
              <span
                key={tag}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 14px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: i === 0 ? "#C9A84C" : "rgba(240,235,216,0.85)",
                  border: `1px solid ${i === 0 ? "rgba(201,168,76,0.55)" : "rgba(240,235,216,0.25)"}`,
                  background:
                    i === 0
                      ? "rgba(201,168,76,0.12)"
                      : "rgba(240,235,216,0.06)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {i === 0 && (
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#C9A84C",
                      display: "inline-block",
                    }}
                  />
                )}
                {tag}
              </span>
            )
          )}
        </div>

        {/* ── Name block ── */}
        <div
          className={isRTL ? "text-right" : "text-left"}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
            transition:
              "opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s",
          }}
        >
          {/* Overline label */}
          <p
            style={{
              fontSize: "clamp(0.85rem, 1.6vw, 1rem)",
              color: "rgba(240,235,216,0.7)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily: "monospace",
              fontWeight: 700,
              marginBottom: "14px",
              textShadow: "0 1px 8px rgba(0,0,0,0.5)",
            }}
          >
            {t("hero.overline")}
          </p>

          {/* Main name — large editorial type */}
          <h1
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: locale === "en" ? "clamp(1.8rem, 4vw, 4.2rem)" : "clamp(2.5rem, 6vw, 6rem)",
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: "rgba(240,235,216,0.96)",
              margin: 0,
              textShadow: "0 2px 40px rgba(10,14,26,0.6)",
              whiteSpace: "nowrap", // ensures it stays on one line
            }}
          >
            {[t("hero.name_line1"), t("hero.name_line2"), t("hero.name_line3")]
              .filter(Boolean)
              .join(" ")}
          </h1>
        </div>

        {/* ── Thin gold accent rule ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "28px 0",
            flexDirection: isRTL ? "row-reverse" : "row",
          }}
        >
          <div
            style={{
              height: "1px",
              width: "clamp(80px, 15vw, 200px)",
              background: isRTL
                ? "linear-gradient(to left, #C9A84C, rgba(201,168,76,0.08))"
                : "linear-gradient(to right, #C9A84C, rgba(201,168,76,0.08))",
              transform: visible ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: isRTL ? "right" : "left",
              transition: "transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.85s",
            }}
          />
          <div
            style={{
              width: 4,
              height: 4,
              background: "#C9A84C",
              transform: `rotate(45deg) ${visible ? "scale(1)" : "scale(0)"}`,
              transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1) 1.3s",
              flexShrink: 0,
            }}
          />
          <div
            style={{
              height: "1px",
              width: "40px",
              background: "rgba(201,168,76,0.2)",
              transform: visible ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: isRTL ? "right" : "left",
              transition: "transform 1.1s cubic-bezier(0.16,1,0.3,1) 1.1s",
            }}
          />
        </div>

        {/* ── Bottom row: CTA + Socials ── */}
        <div
          className={`flex flex-col sm:flex-row items-start sm:items-center gap-5 ${
            isRTL ? "sm:flex-row-reverse" : ""
          }`}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.8s ease 1s, transform 0.8s ease 1s",
          }}
        >
          {/* CTA Button */}
          <a
            href="#about"
            className="group relative inline-flex items-center gap-3 overflow-hidden"
            style={{
              padding: "13px 28px",
              background: "linear-gradient(135deg, #C9A84C, #E8C96B)",
              color: "#0A0E1A",
              clipPath:
                "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontSize: "10px",
              fontWeight: 800,
              fontFamily: "monospace",
              textDecoration: "none",
            }}
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
                transition: "opacity 0.3s",
                animation: "shimmer 1.4s ease infinite",
              }}
            />
            <span className="relative z-10">{t("hero.cta_primary") || "Explore Profile"}</span>
            <svg
              className={`w-3.5 h-3.5 relative z-10 transition-transform duration-200 ${
                isRTL
                  ? "group-hover:-translate-x-1.5 rotate-180"
                  : "group-hover:translate-x-1.5"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>

          {/* Divider pip */}
          <div
            style={{
              width: 1,
              height: 32,
              background: "rgba(201,168,76,0.2)",
              display: "none",
            }}
            className="sm:block"
          />

          {/* Social icons — vertical stack label + icons */}
          <div
            className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span
              style={{
                fontSize: "9px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(240,235,216,0.2)",
                fontFamily: "monospace",
                writingMode: "horizontal-tb",
              }}
            >
              {t("hero.follow") || "Follow"}
            </span>
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group/icon flex items-center justify-center transition-all duration-300"
                  style={{
                    width: 36,
                    height: 36,
                    background: "rgba(10,14,26,0.55)",
                    border: "1px solid rgba(201,168,76,0.18)",
                    color: "rgba(240,235,216,0.4)",
                    backdropFilter: "blur(8px)",
                    clipPath:
                      "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "rgba(201,168,76,0.14)";
                    el.style.borderColor = "rgba(201,168,76,0.55)";
                    el.style.color = "#C9A84C";
                    el.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "rgba(10,14,26,0.55)";
                    el.style.borderColor = "rgba(201,168,76,0.18)";
                    el.style.color = "rgba(240,235,216,0.4)";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll cue ── */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 1s ease 1.4s",
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: "9px",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(240,235,216,0.2)",
          }}
        >
          {t("hero.scroll") || "Scroll"}
        </span>
        <div
          style={{
            width: 1,
            height: 32,
            background:
              "linear-gradient(to bottom, rgba(201,168,76,0.5), transparent)",
            animation: "scrollLine 2s ease-in-out infinite",
          }}
        />
      </div>

      {/* ════ KEYFRAMES ════ */}
      <style jsx>{`
        @keyframes scrollLine {
          0%   { transform: scaleY(0); transform-origin: top; opacity: 1; }
          50%  { transform: scaleY(1); transform-origin: top; opacity: 1; }
          100% { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
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
      `}</style>
    </section>
  );
}