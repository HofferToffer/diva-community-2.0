import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { applySeo, type SeoOptions } from "@/lib/seo";
import { blogPosts } from "@/data/blogPosts";
import { useLang, type Lang } from "@/lib/lang";

type PageSeo = Pick<SeoOptions, "title" | "description">;

const STATIC_PAGES: Record<string, Record<Lang, PageSeo>> = {
  "/": { sk: {}, en: {} },
  "/blog": {
    sk: {
      title: "Blog",
      description: "Príbehy a myšlienky o ženskosti, cykle, materstve, odvahe a ceste k sebe. Blog DIVA Community.",
    },
    en: {
      title: "Blog",
      description: "Stories and thoughts on femininity, cycles, motherhood, courage and the way back to yourself. The DIVA Community blog.",
    },
  },
  "/diva-run": {
    sk: {
      title: "DIVA Run",
      description: "DIVA Run – beh pre ženy, pohyb v kruhu žien a radosť z vlastného tela. Pridaj sa k DIVA Community.",
    },
    en: {
      title: "DIVA Run",
      description: "DIVA Run – running for women, moving together in a circle of women and loving what your body can do. Come join the DIVA Community.",
    },
  },
  "/recrete": {
    sk: {
      title: "ReCreate – retreat pre ženy",
      description:
        "ReCreate je priestor, kde sa môžeš nadýchnuť, napojiť sa na svoje telo a v kruhu žien nájsť energiu, ktorú si možno dlho necítila.",
    },
    en: {
      title: "ReCreate – a retreat for women",
      description:
        "ReCreate is a space to breathe, reconnect with your body and, in a circle of women, find an energy you maybe haven't felt in a long time.",
    },
  },
  "/shop": {
    sk: { title: "Shop", description: "DIVA shop – šiltovky, klobúky a tašky s logom DIVA Community." },
    en: { title: "Shop", description: "The DIVA shop – caps, hats and tote bags with the DIVA Community logo." },
  },
  "/zasady-ochrany-udajov": { sk: { title: "Zásady ochrany osobných údajov" }, en: { title: "Privacy Policy" } },
  "/podmienky-pouzivania": { sk: { title: "Podmienky používania" }, en: { title: "Terms of Use" } },
  "/cookies": { sk: { title: "Zásady používania cookies" }, en: { title: "Cookie Policy" } },
};

/** Private or transactional screens that shouldn't show up in Google. */
const NOINDEX_PREFIXES = ["/community", "/checkout", "/reset-password"];

/**
 * Keeps <title>, description, canonical URL and robots tags in sync with the
 * current route and language. Product pages and database blog posts set their
 * own tags once their data loads, so they're skipped here.
 */
export default function RouteSeo() {
  const { pathname } = useLocation();
  const { lang, l } = useLang();

  useEffect(() => {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

    if (NOINDEX_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
      applySeo({ title: path.startsWith("/community") ? l("Appka", "App") : undefined, path, noindex: true });
      return;
    }

    const page = STATIC_PAGES[path];
    if (page) {
      applySeo({ ...page[lang], path });
      return;
    }

    const post = blogPosts.find((p) => p.href === path);
    if (post) {
      const text = lang === "en" && post.en ? post.en : post;
      applySeo({ title: text.title, description: text.excerpt, image: post.image, path, type: "article" });
    }
    // /shop/:slug, /blog/:slug (from the database) and 404 handle their own tags.
  }, [pathname, lang, l]);

  return null;
}
