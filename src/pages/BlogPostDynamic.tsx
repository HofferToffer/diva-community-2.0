import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogPost } from "@/community/hooks/queries";

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
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {post.gallery_image_urls.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
            {post.gallery_image_urls.map((url) => (
              <div key={url} className="aspect-square overflow-hidden bg-muted">
                <img src={url} alt={post.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        )}
      </article>

      <Footer />
    </div>
  );
};

export default BlogPostDynamic;
