import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export type Lang = "sk" | "en";

/** Bilingual text for data files, e.g. `{ sk: "Taška", en: "Tote bag" }`. */
export type Bilingual = { sk: string; en: string };

export function toLang(language: string | undefined): Lang {
  return language?.startsWith("en") ? "en" : "sk";
}

/**
 * The website keeps its Slovak and English copy side by side in the JSX:
 * `l("Späť na blog", "Back to the blog")`. Re-renders on language switch.
 */
export function useLang() {
  const { i18n } = useTranslation();
  const lang = toLang(i18n.resolvedLanguage ?? i18n.language);
  const l = useCallback((sk: string, en: string) => (lang === "en" ? en : sk), [lang]);
  const pick = useCallback((text: Bilingual) => text[lang], [lang]);
  const dateLocale = lang === "en" ? "en-GB" : "sk-SK";
  return { lang, l, pick, dateLocale, setLang: (next: Lang) => i18n.changeLanguage(next) };
}
