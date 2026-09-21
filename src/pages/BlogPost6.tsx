import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blogCover from "@/assets/blog-6-cover.jpg";

const BlogPost6 = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

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
            Prijatie 🌸
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
            Možno to poznáte – keď sa chránite tak silno, až prestanete cítiť.
          </p>
          <p>Ja som si tým prešla a cítim, že sa konečne vraciam k sebe.</p>
          <p>
            Že to všetko, čo sa stalo, ma posunulo a vďaka tomu som teraz tá
            silnejšia žena. Pomaličky sa otváram, dovoľujem si povedať NIE, že
            aj ja si zaslúžim byť šťastná a prijatá. Že moje potreby sú
            dôležité. Cítim moju jemnosť a viem, že sa môžem „zrútiť" a
            nebudem tým nejaká „slaboška".
          </p>
          <p>
            Už viem, prečo ten vyvrtnutý členok. Potrebovala som spomaliť,
            precítiť, na chvíľku stíchnuť a byť s tým. Nájsť rovnováhu medzi
            kontrolou a dôverou. Posilniť dôveru v samú seba a v kroky, ktoré
            robím. Veriť ženskej intuícii. Vlastne 2 sekundy predtým som mala
            „tušáka", že sa niečo ide stať.
          </p>
          <p className="font-display text-2xl md:text-3xl italic text-foreground pt-4">
            Pochopila som.
          </p>
          <p className="font-display text-2xl md:text-3xl italic text-foreground">
            Spomaľujem.
          </p>
          <p className="font-display text-2xl md:text-3xl italic text-foreground">
            Cítim.
          </p>
          <p className="font-display text-2xl md:text-3xl italic text-foreground pt-2">
            Ďakujem. ❤️
          </p>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost6;
