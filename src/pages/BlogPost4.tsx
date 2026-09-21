import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blogCover from "@/assets/blog-4-cover.jpg";
import blog2 from "@/assets/blog-4-2.jpg";
import blog3 from "@/assets/blog-4-3.jpg";
import blog4 from "@/assets/blog-4-4.jpg";

const BlogPost4 = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative h-[70vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${blogCover})`, backgroundPosition: "center 25%" }}
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
            Kréta 🌊
          </motion.h1>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 md:px-12 pt-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors uppercase"
        >
          <ArrowLeft size={14} />
          Späť na blog
        </Link>
      </div>

      <article className="mx-auto max-w-3xl px-6 md:px-12 py-12">
        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p className="font-display text-2xl md:text-3xl italic text-foreground">
            Na chvíľu meníme miesto. 🌊
          </p>
          <p>
            Sťahujeme sa rodina na Krétu – na čas, ktorý ešte ani nemáme presne
            definovaný.
          </p>
          <p>Ale jednu vec viem isto: Diva Community nekončí.</p>
          <p>Toto nikdy nebolo len o spoločných behoch na jednom mieste.</p>
          <p>Je to o ženách, o energii, o návrate k sebe.</p>
        </div>

        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="my-12"
        >
          <img src={blog2} alt="Diva community" className="w-full h-auto object-cover" loading="lazy" />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p>Nebudem tu fyzicky na behoch, ale Diva ide ďalej.</p>
          <p>Možno tichšie.</p>
          <p>Možno inak.</p>
          <p>Ale o to hlbšie.</p>
        </div>

        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="my-12"
        >
          <img src={blog3} alt="Pri mori" className="w-full h-auto object-cover" loading="lazy" />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p>Idem si dať priestor.</p>
          <p>Spomaliť.</p>
          <p>A ešte viac sa napojiť sama na seba.</p>
          <p>Pretože viem, že keď rastiem ja,</p>
          <p>rastie aj všetko, čo tvorím.</p>
        </div>

        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="my-12"
        >
          <img src={blog4} alt="Diva tetovanie" className="w-full h-auto object-cover" loading="lazy" />
        </motion.figure>

        <p className="font-display text-2xl md:text-3xl italic text-foreground text-center">
          Diva nekončí. 🤍
        </p>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost4;
