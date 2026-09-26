import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blogCover from "@/assets/blog-6-cover.jpg";
import { useLang } from "@/lib/lang";

const BlogPost6 = () => {
  const { l } = useLang();
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
            {l("Prijatie 🌸", "Acceptance 🌸")}
          </motion.h1>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 md:px-12 pt-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors uppercase"
        >
          <ArrowLeft size={14} />
          {l("Späť na blog", "Back to the blog")}
        </Link>
      </div>

      <article className="mx-auto max-w-3xl px-6 md:px-12 py-12">
        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p className="font-display text-2xl md:text-3xl italic text-foreground">
            {l("Možno to poznáte – keď sa chránite tak silno, až prestanete cítiť.", "Maybe you know the feeling: you protect yourself so hard that you stop feeling anything at all.")}
          </p>
          <p>{l("Ja som si tým prešla a cítim, že sa konečne vraciam k sebe.", "I've been through that, and I can feel I'm finally finding my way back to myself.")}</p>
          <p>
            {l("Že to všetko, čo sa stalo, ma posunulo a vďaka tomu som teraz tá silnejšia žena. Pomaličky sa otváram, dovoľujem si povedať NIE, že aj ja si zaslúžim byť šťastná a prijatá. Že moje potreby sú dôležité. Cítim moju jemnosť a viem, že sa môžem „zrútiť\" a nebudem tým nejaká „slaboška\".", "That everything that happened moved me forward, and because of it, I'm now the stronger woman. I'm slowly opening up, letting myself say NO, letting myself believe that I deserve to be happy and accepted too. That my needs matter. I can feel my softness, and I know I'm allowed to “fall apart” without being some kind of “weakling”.")}
          </p>
          <p>
            {l("Už viem, prečo ten vyvrtnutý členok. Potrebovala som spomaliť, precítiť, na chvíľku stíchnuť a byť s tým. Nájsť rovnováhu medzi kontrolou a dôverou. Posilniť dôveru v samú seba a v kroky, ktoré robím. Veriť ženskej intuícii. Vlastne 2 sekundy predtým som mala „tušáka\", že sa niečo ide stať.", "Now I know why the sprained ankle happened. I needed to slow down, to really feel it, to go quiet for a moment and just be with it. To find the balance between control and trust. To trust myself more, and the steps I'm taking. To trust my feminine intuition. Funny thing is, two seconds before, I had a “hunch” that something was about to happen.")}
          </p>
          <p className="font-display text-2xl md:text-3xl italic text-foreground pt-4">
            {l("Pochopila som.", "I get it now.")}
          </p>
          <p className="font-display text-2xl md:text-3xl italic text-foreground">
            {l("Spomaľujem.", "I'm slowing down.")}
          </p>
          <p className="font-display text-2xl md:text-3xl italic text-foreground">
            {l("Cítim.", "I'm feeling.")}
          </p>
          <p className="font-display text-2xl md:text-3xl italic text-foreground pt-2">
            {l("Ďakujem. ❤️", "Thank you. ❤️")}
          </p>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost6;
