import { useMemo } from "react";
import { blogPosts, parseSkDate, type BlogPost } from "@/data/blogPosts";
import { useBlogPosts } from "./queries";
import blogHeroBeach from "@/assets/blog-hero-beach.jpg.asset.json";

export type FeedBlogPost = BlogPost & { sortTs: number };

/** Single source of truth for "all blog posts, newest first" — merges DB posts with the static ones. */
export function useAllBlogPosts(): FeedBlogPost[] {
  const { data: dbPosts } = useBlogPosts(false);

  return useMemo(() => {
    const fromDb: FeedBlogPost[] = (dbPosts ?? []).map((post) => {
      const ts = new Date(post.published_at ?? post.created_at).getTime();
      return {
        title: post.title,
        excerpt: post.excerpt ?? "",
        date: new Intl.DateTimeFormat("sk-SK", { day: "numeric", month: "long", year: "numeric" }).format(ts),
        category: "",
        image: post.cover_image_url ?? blogHeroBeach.url,
        imagePosition: "top",
        href: `/blog/${post.slug}`,
        sortTs: ts,
      };
    });
    const fromStatic: FeedBlogPost[] = blogPosts.map((post) => ({ ...post, sortTs: parseSkDate(post.date) }));
    return [...fromDb, ...fromStatic].sort((a, b) => b.sortTs - a.sortTs);
  }, [dbPosts]);
}
