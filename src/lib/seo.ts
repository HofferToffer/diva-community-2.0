import { useEffect } from "react";
import i18n from "@/i18n/config";
import { toLang } from "@/lib/lang";

export const SITE_URL = "https://divacommunity.sk";
export const SITE_NAME = "DIVA Community";
export const DEFAULT_TITLE = { sk: "DIVA Community | Komunita žien", en: "DIVA Community | A community for women" };
export const DEFAULT_DESCRIPTION = {
  sk: "DIVA Community – komunita silných žien. Blog o ženskosti, cykle a materstve, DIVA Run, ReCreate retreaty, workshopy a DIVA shop.",
  en: "DIVA Community – a community of strong women. A blog about femininity, cycles and motherhood, DIVA Run, ReCreate retreats, workshops and the DIVA shop.",
};
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

export type SeoOptions = {
  /** Page title without the site name — " | DIVA Community" is appended. */
  title?: string;
  description?: string;
  /** Path of the canonical URL, e.g. "/blog/odvaha". */
  path?: string;
  /** Absolute or site-relative image URL for link previews. */
  image?: string;
  type?: "website" | "article" | "product";
  /** Keep the page out of Google (private app screens, checkout, 404). */
  noindex?: boolean;
  /** Content exists only in Slovak (posts from the admin) — no English alternate. */
  slovakOnly?: boolean;
};

function absoluteUrl(url: string) {
  try {
    return new URL(url, SITE_URL).toString();
  } catch {
    return url;
  }
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string | null, hreflang?: string) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    if (hreflang) el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * Slovak lives at the plain URL, English at `?lang=en` — each is its own
 * canonical page, linked to the other with hreflang so Google shows the
 * right one to the right reader.
 */
export function applySeo({ title, description, path, image, type = "website", noindex = false, slovakOnly = false }: SeoOptions) {
  const lang = toLang(i18n.resolvedLanguage ?? i18n.language);
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE[lang];
  const desc = description || DEFAULT_DESCRIPTION[lang];
  const skUrl = `${SITE_URL}${path ?? window.location.pathname}`;
  const enUrl = `${skUrl}?lang=en`;
  const url = lang === "en" && !slovakOnly ? enUrl : skUrl;
  const img = absoluteUrl(image || DEFAULT_IMAGE);

  document.title = fullTitle;
  setMeta("name", "description", desc);
  setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
  setLink("canonical", url);
  const alternates = !noindex && !slovakOnly;
  setLink("alternate", alternates ? skUrl : null, "sk");
  setLink("alternate", alternates ? enUrl : null, "en");
  setLink("alternate", alternates ? skUrl : null, "x-default");
  setMeta("property", "og:locale", lang === "en" ? "en_GB" : "sk_SK");

  setMeta("property", "og:title", fullTitle);
  setMeta("property", "og:description", desc);
  setMeta("property", "og:url", url);
  setMeta("property", "og:type", type);
  setMeta("property", "og:image", img);
  setMeta("name", "twitter:title", fullTitle);
  setMeta("name", "twitter:description", desc);
  setMeta("name", "twitter:image", img);
}

/** Sets the page's title, description, canonical URL and link-preview tags for Google and social sharing. */
export function useSeo(options: SeoOptions | null) {
  const key = options ? JSON.stringify([options, i18n.language]) : null;
  useEffect(() => {
    if (options) applySeo(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
