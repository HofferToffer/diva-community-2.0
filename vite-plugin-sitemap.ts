import fs from "fs";
import path from "path";
import type { Plugin } from "vite";

const SITE_URL = "https://divacommunity.sk";

/** Public pages of the website. The /community app, checkout and password reset stay out of the sitemap on purpose. */
const STATIC_PATHS = ["/", "/blog", "/diva-run", "/recrete", "/shop", "/zasady-ochrany-udajov", "/podmienky-pouzivania", "/cookies"];

/** Static blog posts, and whether each has an English version (`en: {` in its entry). */
function readBlogPosts(file: string) {
  const source = fs.readFileSync(file, "utf8");
  const hrefs = [...source.matchAll(/href:\s*"([^"]+)"/g)];
  return hrefs.map((m, i) => {
    const entry = source.slice(m.index, hrefs[i + 1]?.index ?? source.length);
    return { path: m[1], bilingual: /\ben:\s*\{/.test(entry.split(/\n {2}\},?\n/)[0]) };
  });
}

function matchAll(file: string, pattern: RegExp) {
  const source = fs.readFileSync(file, "utf8");
  return [...source.matchAll(pattern)].map((m) => m[1]);
}

/** Published blog posts written in the app's admin, read with the public (anon) key. Missing network just means they're left out. */
async function fetchDatabaseBlogSlugs(env: Record<string, string>) {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(`${url}/rest/v1/blog_posts?select=slug,updated_at&published=eq.true`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    return (await res.json()) as { slug: string; updated_at: string | null }[];
  } catch {
    return [];
  }
}

/** Writes sitemap.xml into the build output so Google can find every public page. */
export function sitemapPlugin(env: Record<string, string>): Plugin {
  let outDir = "dist";
  let root = process.cwd();
  return {
    name: "diva-sitemap",
    apply: "build",
    configResolved(config) {
      root = config.root;
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const blogPosts = readBlogPosts(path.join(root, "src/data/blogPosts.ts"));
      const productPaths = matchAll(path.join(root, "src/data/products.ts"), /slug:\s*"([^"]+)"/g).map((slug) => `/shop/${slug}`);
      const dbPosts = await fetchDatabaseBlogSlugs(env);

      // Pages translated into English also live at `?lang=en`; Slovak-only posts (the poem, admin posts) don't.
      const entries = new Map<string, { lastmod: string | null; bilingual: boolean }>();
      for (const p of [...STATIC_PATHS, ...productPaths]) entries.set(p, { lastmod: null, bilingual: true });
      for (const post of blogPosts) entries.set(post.path, { lastmod: null, bilingual: post.bilingual });
      for (const post of dbPosts) {
        const p = `/blog/${post.slug}`;
        if (!entries.has(p)) entries.set(p, { lastmod: post.updated_at?.slice(0, 10) ?? null, bilingual: false });
      }

      const urlEntry = (loc: string, lastmod: string | null, alternates: string) =>
        `  <url>\n    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}${alternates}\n  </url>`;

      const urls = [...entries]
        .flatMap(([p, { lastmod, bilingual }]) => {
          const skLoc = `${SITE_URL}${p}`;
          if (!bilingual) return [urlEntry(skLoc, lastmod, "")];
          const enLoc = `${skLoc}?lang=en`;
          const alternates = [
            `\n    <xhtml:link rel="alternate" hreflang="sk" href="${skLoc}" />`,
            `\n    <xhtml:link rel="alternate" hreflang="en" href="${enLoc}" />`,
            `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${skLoc}" />`,
          ].join("");
          return [urlEntry(skLoc, lastmod, alternates), urlEntry(enLoc, lastmod, alternates)];
        })
        .join("\n");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml);
    },
  };
}
