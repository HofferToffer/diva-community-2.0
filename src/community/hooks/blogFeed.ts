import { useMemo } from "react";
import { blogPosts, parseSkDate, type BlogPost } from "@/data/blogPosts";
import { useBlogPosts } from "./queries";
import { useLang } from "@/lib/lang";
import blogHeroBeach from "@/assets/blog-hero-beach.jpg.asset.json";

export type FeedBlogPost = BlogPost & { sortTs: number };

/**
 * Single source of truth for "all blog posts, newest first" — merges DB posts
 * with the static ones. Title, teaser and date come back in the current language;
 * in English, posts that only exist in Slovak (admin posts, the poem) are left out.
 */
export function useAllBlogPosts(): FeedBlogPost[] {
  const { data: dbPosts } = useBlogPosts(false);
  const { lang, dateLocale } = useLang();

  return useMemo(() => {
    const formatDate = (ts: number) =>
      new Intl.DateTimeFormat(dateLocale, { day: "numeric", month: "long", year: "numeric" }).format(ts);

    const fromDb: FeedBlogPost[] = (lang === "en" ? [] : dbPosts ?? []).map((post) => {
      const ts = new Date(post.published_at ?? post.created_at).getTime();
      return {
        title: post.title,
        excerpt: post.excerpt ?? "",
        date: formatDate(ts),
        category: "",
        image: post.cover_image_url ?? blogHeroBeach.url,
        imagePosition: "top",
        href: `/blog/${post.slug}`,
        sortTs: ts,
      };
    });
    const fromStatic: FeedBlogPost[] = blogPosts
      .filter((post) => lang === "sk" || post.en)
      .map((post) => {
        const ts = parseSkDate(post.date);
        const translated = lang === "en" ? post.en : undefined;
        return {
          ...post,
          title: translated?.title ?? post.title,
          excerpt: translated?.excerpt ?? post.excerpt,
          date: lang === "en" ? formatDate(ts) : post.date,
          sortTs: ts,
        };
      });
    return [...fromDb, ...fromStatic].sort((a, b) => b.sortTs - a.sortTs);
  }, [dbPosts, lang, dateLocale]);
}
