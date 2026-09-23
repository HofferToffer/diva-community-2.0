import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import sk from "./locales/sk/common.json";
import en from "./locales/en/common.json";

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
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "diva-language",
      caches: ["localStorage"],
    },
  });

export default i18n;
