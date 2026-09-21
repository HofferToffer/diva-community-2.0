import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAllBlogPosts } from "@/community/hooks/blogFeed";

const BlogSection = () => {
  const allPosts = useAllBlogPosts();
  const previewPosts = allPosts.slice(0, 2);

  return (
    <section id="blog" className="section-padding bg-card">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-light tracking-wide text-foreground">
            Blog
          </h2>
          <div className="mx-auto mt-4 w-16 h-[1px] bg-accent" />
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {previewPosts.map((post, index) => (
            <motion.article
              key={post.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <Link to={post.href} className="block">
                <div className="h-80 bg-muted mb-6 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{ objectPosition: post.imagePosition ?? "center" }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <span className="font-body text-xs tracking-[0.2em] text-accent uppercase">
                  {post.category}
                </span>
                <h3 className="mt-2 font-display text-2xl font-light text-foreground group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <span className="mt-4 inline-block font-body text-xs text-muted-foreground tracking-wide">
                  {post.date}
                </span>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            to="/blog"
            className="inline-block border border-foreground px-8 py-3 font-body text-xs tracking-[0.2em] text-foreground hover:bg-foreground hover:text-background transition-all duration-300 uppercase"
          >
            Všetky články
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
