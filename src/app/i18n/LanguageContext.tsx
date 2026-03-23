"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

import en from "./translations/en.json";
import ar from "./translations/ar.json";
import ku from "./translations/ku.json";

export type Locale = "en" | "ar" | "ku";

const translations: Record<Locale, Record<string, unknown>> = { en, ar, ku };

export const rtlLocales: Locale[] = ["ar", "ku"];

/* ── deep-get helper: t("hero.name_line1") ── */
function deepGet(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // fallback: return the key itself
    }
  }
  return typeof current === "string" ? current : path;
}

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
  isRTL: boolean;
  toLocalNum: (n: number | string) => string;
}

const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function toArabicNumerals(input: number | string): string {
  return String(input).replace(/\d/g, (d) => arabicDigits[parseInt(d)]);
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  setLocale: () => {},
  t: (k) => k,
  dir: "ltr",
  isRTL: false,
  toLocalNum: (n) => String(n),
});

const STORAGE_KEY = "portfolio-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  /* hydrate from localStorage */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && translations[saved]) {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback(
    (key: string) => deepGet(translations[locale] as Record<string, unknown>, key),
    [locale]
  );

  const isRTL = rtlLocales.includes(locale);
  const dir = isRTL ? "rtl" : "ltr";

  const toLocalNum = useCallback(
    (n: number | string) => isRTL ? toArabicNumerals(n) : String(n),
    [isRTL]
  );

  /* Update <html> attributes whenever locale changes */
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir, mounted]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir, isRTL, toLocalNum }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
