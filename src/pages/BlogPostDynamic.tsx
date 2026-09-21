import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogPost } from "@/community/hooks/queries";

type ContentBlock = { type: "p"; text: string; key: string } | { type: "img"; url: string; key: string };

/** Spreads gallery photos evenly through the paragraphs instead of dumping them all at the end. */
function interleaveImages(paragraphs: string[], images: string[]): ContentBlock[] {
  const blocks: ContentBlock[] = paragraphs.map((text, i) => ({ type: "p", text, key: `p-${i}` }));
  if (images.length === 0) return blocks;

  const slot = paragraphs.length / (images.length + 1);
  let inserted = 0;
  images.forEach((url, i) => {
    const afterParagraph = Math.min(paragraphs.length, Math.round(slot * (i + 1)));
    const insertAt = afterParagraph + inserted;
    blocks.splice(insertAt, 0, { type: "img", url, key: `img-${i}` });
    inserted += 1;
  });
  return blocks;
}

const BlogPostDynamic = () => {
  const { slug } = useParams();
  const { data: post, isLoading } = useBlogPost(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl px-6 py-24 md:px-12">
          <Skeleton className="h-96 w-full" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post || !post.published) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl space-y-4 px-6 py-24 text-center md:px-12">
          <h1 className="font-display text-3xl">Článok sa nenašiel</h1>
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] underline">
            <ArrowLeft size={14} />
            Späť na blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const paragraphs = post.content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const contentBlocks = interleaveImages(paragraphs, post.gallery_image_urls);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative h-[70vh] w-full overflow-hidden">
        {post.cover_image_url ? (
          <div
            className="absolute inset-0 bg-cover bg-top bg-no-repeat"
            style={{ backgroundImage: `url(${post.cover_image_url})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-secondary" />
        )}
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-body text-xs uppercase tracking-[0.3em] text-primary-foreground/80"
          >
            Blog
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-4 max-w-3xl font-display text-4xl font-light tracking-wide text-primary-foreground md:text-6xl"
          >
            {post.title}
          </motion.h1>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 pt-8 md:px-12">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Späť na blog
        </Link>
      </div>

      <article className="mx-auto max-w-3xl px-6 py-12 md:px-12">
        <div className="space-y-5 font-body text-base leading-loose tracking-wide text-foreground/85 md:text-lg">
          {contentBlocks.map((block) =>
            block.type === "p" ? (
              <p key={block.key}>{block.text}</p>
            ) : (
              <div key={block.key} className="!my-8 -mx-6 overflow-hidden md:-mx-12">
                <img src={block.url} alt={post.title} className="max-h-[32rem] w-full object-cover" loading="lazy" />
              </div>
            ),
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPostDynamic;
