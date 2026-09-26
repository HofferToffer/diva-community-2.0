import fs from "fs";
import path from "path";
import type { Plugin } from "vite";

const SITE_URL = "https://divacommunity.sk";

/** Public pages of the website. The /community app, checkout and password reset stay out of the sitemap on purpose. */
const STATIC_PATHS = ["/", "/blog", "/diva-run", "/recrete", "/shop", "/zasady-ochrany-udajov", "/podmienky-pouzivania", "/cookies"];

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
      const blogPaths = matchAll(path.join(root, "src/data/blogPosts.ts"), /href:\s*"([^"]+)"/g);
      const productPaths = matchAll(path.join(root, "src/data/products.ts"), /slug:\s*"([^"]+)"/g).map((slug) => `/shop/${slug}`);
      const dbPosts = await fetchDatabaseBlogSlugs(env);

      const entries = new Map<string, string | null>();
      for (const p of [...STATIC_PATHS, ...blogPaths, ...productPaths]) entries.set(p, null);
      for (const post of dbPosts) entries.set(`/blog/${post.slug}`, post.updated_at?.slice(0, 10) ?? null);

      const urls = [...entries]
        .map(([p, lastmod]) => {
          const loc = `${SITE_URL}${p === "/" ? "/" : p}`;
          return `  <url>\n    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n  </url>`;
        })
        .join("\n");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml);
    },
  };
}
