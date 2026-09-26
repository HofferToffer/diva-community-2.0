import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blogCover from "@/assets/blog-7-cover.jpg";
import blog2 from "@/assets/blog-7-2.jpg";
import blog3 from "@/assets/blog-7-3.jpg";
import { useLang } from "@/lib/lang";

const BlogPost7 = () => {
  const { l } = useLang();
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
            {l("Dovoliť si", "Allow yourself")}
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
          {l("Späť na blog", "Back to the blog")}
        </Link>
      </div>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-6 md:px-12 py-12">
        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p>
            {l("Cítiť sa ako žena pri dvoch deťoch, povinnostiach, práci, strese, tlaku a ešte k tomu riešeniu vnútra je mega ťažké.", "Feeling like a woman with two kids, all the responsibilities, work, stress, pressure, and on top of that doing the inner work, is seriously hard.")}
          </p>

          <p>
            {l("Aj preto sme odišli na Krétu. Zminimalizovať veci, ktoré som cítila, že už ďalej nie sú funkčné.", "That's part of why we left for Crete. To cut back on the things I felt just weren't working anymore.")}
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
            alt={l("Žena v záhrade na Kréte", "A woman in a garden on Crete")}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p className="font-display text-xl md:text-2xl italic text-foreground">
            {l("Poznáte to ženy?", "Do you know that feeling, girls?")}
          </p>
          <p>{l("Aj vy máte chuť odísť?", "Do you ever feel like just leaving too?")}</p>
          <p>{l("Zmeniť svoje životy?", "Changing your life?")}</p>
          <p>{l("Dopriať si?", "Treating yourself?")}</p>
          <p className="font-display text-2xl md:text-3xl italic text-foreground pt-2">
            {l("Dovoliť si? 🌸", "Allowing yourself? 🌸")}
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
            alt={l("Žena na Kréte", "A woman on Crete")}
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
