import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import sk from "./locales/sk/common.json";
import en from "./locales/en/common.json";

/**
 * The public website defaults to Slovak (so Google indexes the Slovak pages)
 * and only switches to English when she picks it, or via `?lang=en` links.
 * The /community app additionally follows the phone's language, as before.
 */
const isWebsite = typeof window !== "undefined" && !window.location.pathname.startsWith("/community");

/**
 * Slovak is the app's home language and the fallback for anything not yet
 * translated — this is an intentionally gradual rollout, section by
 * section, not a one-shot full translation.
 */
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      sk: { common: sk },
      en: { common: en },
    },
    fallbackLng: "sk",
    supportedLngs: ["sk", "en"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
    detection: {
      order: isWebsite ? ["querystring", "localStorage"] : ["querystring", "localStorage", "navigator"],
      lookupQuerystring: "lang",
      lookupLocalStorage: "diva-language",
      caches: ["localStorage"],
    },
  });

const syncHtmlLang = (lng: string) => {
  if (typeof document !== "undefined") document.documentElement.lang = lng.startsWith("en") ? "en" : "sk";
};
syncHtmlLang(i18n.language ?? "sk");
i18n.on("languageChanged", syncHtmlLang);

export default i18n;
