import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blogCover from "@/assets/blog-7-cover.jpg";
import blog2 from "@/assets/blog-7-2.jpg";
import blog3 from "@/assets/blog-7-3.jpg";

const BlogPost7 = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${blogCover})` }}
        />
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-body text-xs tracking-[0.3em] text-primary-foreground/80 uppercase"
          >
            Blog
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-4 font-display text-4xl md:text-6xl font-light tracking-wide text-primary-foreground max-w-3xl"
          >
            Dovoliť si
          </motion.h1>
        </div>
      </section>

      {/* Back link */}
      <div className="mx-auto max-w-3xl px-6 md:px-12 pt-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors uppercase"
        >
          <ArrowLeft size={14} />
          Späť na blog
        </Link>
      </div>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-6 md:px-12 py-12">
        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p>
            Cítiť sa ako žena pri dvoch deťoch, povinnostiach, práci, strese,
            tlaku a ešte k tomu riešeniu vnútra je mega ťažké.
          </p>

          <p>
            Aj preto sme odišli na Krétu. Zminimalizovať veci, ktoré som cítila,
            že už ďalej nie sú funkčné.
          </p>
        </div>

        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="my-12"
        >
          <img
            src={blog2}
            alt="Žena v záhrade na Kréte"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p className="font-display text-xl md:text-2xl italic text-foreground">
            Poznáte to ženy?
          </p>
          <p>Aj vy máte chuť odísť?</p>
          <p>Zmeniť svoje životy?</p>
          <p>Dopriať si?</p>
          <p className="font-display text-2xl md:text-3xl italic text-foreground pt-2">
            Dovoliť si? 🌸
          </p>
        </div>

        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="my-12"
        >
          <img
            src={blog3}
            alt="Žena na Kréte"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost7;
