import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { applySeo, type SeoOptions } from "@/lib/seo";
import { blogPosts } from "@/data/blogPosts";

const STATIC_PAGES: Record<string, SeoOptions> = {
  "/": {},
  "/blog": {
    title: "Blog",
    description: "Príbehy a myšlienky o ženskosti, cykle, materstve, odvahe a ceste k sebe. Blog DIVA Community.",
  },
  "/diva-run": {
    title: "DIVA Run",
    description: "DIVA Run – beh pre ženy, pohyb v kruhu žien a radosť z vlastného tela. Pridaj sa k DIVA Community.",
  },
  "/recrete": {
    title: "ReCreate – retreat pre ženy",
    description:
      "ReCreate je priestor, kde sa môžeš nadýchnuť, napojiť sa na svoje telo a v kruhu žien nájsť energiu, ktorú si možno dlho necítila.",
  },
  "/shop": {
    title: "Shop",
    description: "DIVA shop – šiltovky, klobúky a tašky s logom DIVA Community.",
  },
  "/zasady-ochrany-udajov": { title: "Zásady ochrany osobných údajov" },
  "/podmienky-pouzivania": { title: "Podmienky používania" },
  "/cookies": { title: "Zásady používania cookies" },
};

/** Private or transactional screens that shouldn't show up in Google. */
const NOINDEX_PREFIXES = ["/community", "/checkout", "/reset-password"];

/**
 * Keeps <title>, description, canonical URL and robots tags in sync with the
 * current route. Product pages and database blog posts set their own tags
 * once their data loads, so they're skipped here.
 */
export default function RouteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

    if (NOINDEX_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
      applySeo({ title: path.startsWith("/community") ? "Appka" : undefined, path, noindex: true });
      return;
    }

    const page = STATIC_PAGES[path];
    if (page) {
      applySeo({ ...page, path });
      return;
    }

    const post = blogPosts.find((p) => p.href === path);
    if (post) {
      applySeo({ title: post.title, description: post.excerpt, image: post.image, path, type: "article" });
    }
    // /shop/:slug, /blog/:slug (from the database) and 404 handle their own tags.
  }, [pathname]);

  return null;
}
