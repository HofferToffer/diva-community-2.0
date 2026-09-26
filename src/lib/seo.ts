import { useEffect } from "react";

export const SITE_URL = "https://divacommunity.sk";
export const SITE_NAME = "DIVA Community";
export const DEFAULT_TITLE = "DIVA Community | Komunita žien";
export const DEFAULT_DESCRIPTION =
  "DIVA Community – komunita silných žien. Blog o ženskosti, cykle a materstve, DIVA Run, ReCreate retreaty, workshopy a DIVA shop.";
export const DEFAULT_IMAGE = `${SITE_URL}/icon-512.png`;

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

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

export function applySeo({ title, description, path, image, type = "website", noindex = false }: SeoOptions) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const desc = description || DEFAULT_DESCRIPTION;
  const url = `${SITE_URL}${path ?? window.location.pathname}`;
  const img = absoluteUrl(image || DEFAULT_IMAGE);

  document.title = fullTitle;
  setMeta("name", "description", desc);
  setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
  setCanonical(url);

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
  const key = options ? JSON.stringify(options) : null;
  useEffect(() => {
    if (options) applySeo(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
