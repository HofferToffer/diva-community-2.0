import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blogCover from "@/assets/blog-2-cover.jpg";
import blog2 from "@/assets/blog-2-2.jpg";
import blog3 from "@/assets/blog-2-3.jpg";

const lines1 = [
  "keď ideš mimo systém",
  "keď sa rozhodneš mať 2 deti po sebe",
  "keď si rodičom, ktorý neklame deti",
  "keď búraš generačné traumy",
  "keď ideš do hĺbky",
  "keď dáš seba na prvé miesto",
  "keď si vo vzťahu kde to nie je perfektné",
  "keď si priznáš chybu",
];

const lines2 = [
  "keď začneš byť autentická",
  "keď si v tichu",
  "keď sa postavíš vlastným tieňom",
  "keď povieš mužovi svoje najväčšie tajomstvo",
  "keď sa spoľahneš na život",
  "keď sa nebojíš ísť do diskomfortu",
  "keď oddychuješ",
];

const lines3 = [
  "keď deťom ukazuješ všetky svoje emócie",
  "keď nepracuješ 8 hodín denne",
  "keď veríš že na tomto svete nie sme sami",
  "keď veríš na anjelov",
  "keď sa otvoríš človeku",
];

const BlogPost2 = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${blogCover})`, backgroundPosition: "center 20%" }}
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
            Odvaha 🌸
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
        <p className="font-display text-2xl md:text-3xl italic text-foreground mb-10">
          Čo je pre mňa ODVAHA
        </p>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          {lines1.map((line) => (
            <p key={line}>{line}</p>
          ))}
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
            alt="Odvaha"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          {lines2.map((line) => (
            <p key={line}>{line}</p>
          ))}
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
            alt="Odvaha"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          {lines3.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className="font-display text-2xl md:text-3xl italic text-foreground pt-4">
            keď vieš byť slabá.
          </p>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost2;
