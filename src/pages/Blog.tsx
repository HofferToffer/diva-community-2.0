import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAllBlogPosts } from "@/community/hooks/blogFeed";
import blogHeroBeach from "@/assets/blog-hero-beach.jpg.asset.json";

const Blog = () => {
  const allPosts = useAllBlogPosts();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-[65%_center]"
          style={{ backgroundImage: `url(${blogHeroBeach.url})` }}
        />
        <div className="absolute inset-0 bg-foreground/50" />
        <div className="relative z-10 flex h-full items-center justify-center px-6 md:px-12 lg:px-24">
          <div className="mx-auto max-w-7xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-display text-5xl md:text-7xl font-light tracking-wide text-primary-foreground"
            >
              Blog
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="mx-auto mt-4 w-16 h-[1px] bg-accent" />
              <p className="mt-6 font-body text-sm tracking-wide text-primary-foreground/70 max-w-md mx-auto">
                Príbehy, myšlienky a inšpirácie pre ženy, ktoré sa vracajú k sebe.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Back link */}
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors uppercase"
        >
          <ArrowLeft size={14} />
          Späť na hlavnú
        </Link>
      </div>

      {/* Posts */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {allPosts.map((post, index) => (
            <motion.article
              key={post.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <Link to={post.href} className="block">
                <div className="h-96 bg-muted mb-6 overflow-hidden">
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
                <h2 className="mt-2 font-display text-2xl md:text-3xl font-light text-foreground group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
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
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
