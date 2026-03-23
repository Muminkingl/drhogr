"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage, type Locale } from "../i18n/LanguageContext";

const navKeys = [
  { key: "nav.home", href: "#home" },
  { key: "nav.about", href: "#about" },
  { key: "nav.qualifications", href: "#qualifications" },
  { key: "nav.experience", href: "#experience" },
  { key: "nav.leadership", href: "#leadership" },
  { key: "nav.media", href: "#media" },
  { key: "nav.memberships", href: "#memberships" },
];

const languages: { code: Locale; label: string; icon: string }[] = [
  { code: "en", label: "English", icon: "/flag/english.svg" },
  { code: "ar", label: "العربية", icon: "/flag/arabic.svg" },
  { code: "ku", label: "کوردی", icon: "/flag/kurdish.svg" },
];

function LanguageToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-sm transition-colors duration-200 group"
        style={{
          background: isOpen ? "rgba(201,168,76,0.08)" : "transparent",
          border: "1px solid",
          borderColor: isOpen ? "rgba(201,168,76,0.3)" : "transparent",
        }}
      >
        <img src={currentLang.icon} alt={currentLang.label} className="w-4 h-4 rounded-[2px] object-cover" />
        <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#F0EBD8] group-hover:text-[#C9A84C] transition-colors">{currentLang.code}</span>
        <svg className={`w-3 h-3 text-[rgba(201,168,76,0.7)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      <div 
        className={`absolute top-[calc(100%+8px)] right-0 w-36 py-2 flex flex-col transition-all duration-300 origin-top-right ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
        style={{
          background: "rgba(10,14,26,0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(201,168,76,0.15)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          borderRadius: "4px"
        }}
      >
        {languages.map((lang) => {
          const isActive = lang.code === locale;
          return (
            <button
              key={lang.code}
              onClick={() => { setLocale(lang.code); setIsOpen(false); }}
              className="group flex items-center gap-3 px-4 py-2.5 w-full text-left transition-colors duration-200"
              style={{ background: isActive ? "rgba(201,168,76,0.08)" : "transparent" }}
            >
              <img src={lang.icon} alt={lang.label} className="w-4 h-4 rounded-[2px] opacity-90 group-hover:opacity-100 transition-opacity" />
              <span 
                className="text-xs font-medium tracking-wide group-hover:text-[#C9A84C] transition-colors" 
                style={{ color: isActive ? "#C9A84C" : "#F0EBD8" }}
              >
                {lang.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("#home");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveLink(`#${e.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    navKeys.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Hover pill position
  const handleMouseEnter = (i: number) => {
    setHoverIndex(i);
    const el = linkRefs.current[i];
    const nav = navRef.current;
    if (el && nav) {
      const navRect = nav.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setPillStyle({
        left: elRect.left - navRect.left,
        width: elRect.width,
        opacity: 1,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setPillStyle((p) => ({ ...p, opacity: 0 }));
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "py-0" : "py-2"
        }`}
      >
        {/* Background panel */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: scrolled
              ? "rgba(10,14,26,0.88)"
              : "transparent",
            backdropFilter: scrolled ? "blur(20px)" : "none",
            borderBottom: scrolled ? "1px solid rgba(201,168,76,0.12)" : "none",
            boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.3)" : "none",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-16">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">

            {/* Logo mark */}
            <a href="#home" className="flex items-center gap-3 group">
              {/* Avatar Logo */}
              <div
                className="relative w-12 h-12 flex-shrink-0 transition-transform duration-300 group-hover:scale-105 rounded-full overflow-hidden border border-[#C9A84C]/40 shadow-[0_2px_12px_rgba(201,168,76,0.15)]"
              >
                <img src="/image.png" alt="Avatar logo" className="w-full h-full object-cover object-top" />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="font-serif text-base font-bold tracking-wide"
                  style={{ color: "#F0EBD8" }}
                >
                  {t("logo.name")}
                </span>
                <span
                  className="text-[9px] tracking-[0.3em] uppercase font-mono"
                  style={{ color: "rgba(201,168,76,0.7)" }}
                >
                  {t("logo.subtitle")}
                </span>
              </div>
            </a>

            {/* Desktop nav */}
            <div
              ref={navRef}
              className="hidden lg:flex items-center gap-0.5 relative"
              onMouseLeave={handleMouseLeave}
            >
              {/* Hover pill */}
              <div
                className="absolute top-1/2 -translate-y-1/2 h-8 rounded-sm pointer-events-none transition-all duration-200"
                style={{
                  left: pillStyle.left,
                  width: pillStyle.width,
                  opacity: pillStyle.opacity,
                  background: "rgba(201,168,76,0.08)",
                  border: "1px solid rgba(201,168,76,0.15)",
                  transitionProperty: "left, width, opacity",
                }}
              />

              {navKeys.map((link, i) => {
                const isActive = activeLink === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    ref={(el) => { linkRefs.current[i] = el; }}
                    onMouseEnter={() => handleMouseEnter(i)}
                    className="relative px-4 py-2 text-[13px] font-medium tracking-wide transition-colors duration-200 whitespace-nowrap"
                    style={{
                      color: isActive
                        ? "#C9A84C"
                        : hoverIndex === i
                        ? "#F0EBD8"
                        : "rgba(240,235,216,0.5)",
                      fontFamily: "var(--font-mono, monospace)",
                    }}
                  >
                    {t(link.key)}
                    {/* Active underline */}
                    {isActive && (
                      <span
                        className="absolute bottom-0.5 left-4 right-4 h-px"
                        style={{
                          background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
                        }}
                      />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3 lg:gap-5">
              <LanguageToggle />

              {/* Contact CTA (desktop) */}
              <a
                href="/contact"
                className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold font-mono tracking-widest uppercase transition-all duration-300 hover:opacity-90"
                style={{
                  color: "#0A0E1A",
                  background: "linear-gradient(135deg, #C9A84C, #E8C96B)",
                  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                }}
              >
                {t("nav.contact")}
              </a>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden relative w-10 h-10 flex items-center justify-center"
                aria-label="Toggle navigation"
                style={{ color: "#F0EBD8" }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                >
                  {mobileOpen ? (
                    <>
                      <line x1="5" y1="5" x2="19" y2="19" />
                      <line x1="19" y1="5" x2="5" y2="19" />
                    </>
                  ) : (
                    <>
                      <line x1="4" y1="8" x2="20" y2="8" />
                      <line x1="4" y1="12" x2="16" y2="12" />
                      <line x1="4" y1="16" x2="12" y2="16" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className="fixed inset-0 z-40 lg:hidden transition-all duration-500 pointer-events-none"
        style={{
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: "rgba(10,14,26,0.7)",
            backdropFilter: "blur(8px)",
            opacity: mobileOpen ? 1 : 0,
          }}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer — slides from right in LTR, from left in RTL */}
        <div
          className={`absolute top-0 h-full w-72 flex flex-col transition-transform duration-500 ${isRTL ? 'left-0' : 'right-0'}`}
          style={{
            background: "#0A0E1A",
            borderLeft: isRTL ? "none" : "1px solid rgba(201,168,76,0.15)",
            borderRight: isRTL ? "1px solid rgba(201,168,76,0.15)" : "none",
            transform: mobileOpen
              ? "translateX(0)"
              : isRTL
              ? "translateX(-100%)"
              : "translateX(100%)",
          }}
        >
          {/* Drawer header */}
          <div
            className="flex items-center justify-between px-6 h-16"
            style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}
          >
            <span
              className="text-xs tracking-[0.3em] uppercase font-mono"
              style={{ color: "rgba(201,168,76,0.6)" }}
            >
              {t("nav.navigation")}
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 flex items-center justify-center"
              style={{ color: "rgba(240,235,216,0.5)" }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col py-6 px-4 gap-1 flex-1">
            {navKeys.map((link, i) => {
              const isActive = activeLink === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-4 px-4 py-3.5 transition-all duration-200 rounded-sm"
                  style={{
                    background: isActive ? "rgba(201,168,76,0.07)" : "transparent",
                    borderLeft: !isRTL ? (isActive ? "2px solid #C9A84C" : "2px solid transparent") : "none",
                    borderRight: isRTL ? (isActive ? "2px solid #C9A84C" : "2px solid transparent") : "none",
                    color: isActive ? "#C9A84C" : "rgba(240,235,216,0.55)",
                    animationDelay: `${i * 40}ms`,
                  }}
                >
                  <span className="text-[10px] font-mono" style={{ color: "rgba(201,168,76,0.3)" }}>
                    0{i + 1}
                  </span>
                  <span className="text-sm font-medium tracking-wide">{t(link.key)}</span>
                </a>
              );
            })}
          </div>

          {/* Drawer footer */}
          <div className="px-6 py-6" style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}>
            <a
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 text-[11px] font-mono font-bold tracking-widest uppercase"
              style={{
                color: "#0A0E1A",
                background: "linear-gradient(135deg, #C9A84C, #E8C96B)",
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
              }}
            >
              {t("nav.get_in_touch")}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}