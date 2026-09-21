import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blogCover from "@/assets/blog-9-cover.jpg";
import blog2 from "@/assets/blog-9-2.jpg";
import blog3 from "@/assets/blog-9-3.jpg";
import blog4 from "@/assets/blog-9-4.jpg";
import blog5 from "@/assets/blog-9-5.jpg";
import blog6 from "@/assets/blog-9-6.jpg";

const BlogPost9 = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${blog3})` }}
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
            15 ročný sen
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
            Cez víkend som absolvovala pretek Od Tatier k Dunaju. Ako už mnohí
            viete minulý rok sa mi hneď po štarte stal nepekný úraz s členkom.
          </p>
          <p>
            A tam môj 15 ročný sen skončil. Môj veľmi výkonný rok tiež. K svojmu
            telu som sa začala správať inak.
          </p>
          <p>
            Urobila som za ten rok veľa veľa práce. Zavolali ma meditácie pri
            ktorých sa mi diali brutálne veci, veľa som plakala, čistila,
            rozširovala svoje vedomie, prečítala som knihy o mimozemšťanoch,
            anjeloch lebo ma to tiež zavolalo.
          </p>
          <p>
            Chodila som síce občas ako zbitý pes lebo meditácie boli náročnejšie,
            ale malo to celé svoj význam. Sebahodnota išla hore a pretriedil sa mi
            aj môj okruh ľudí.
          </p>
          <p>
            Niekde v podvedomí som už vedela, že príde zmena, pomaličky som
            začala spomaľovať, menej pracovať a dávať seba na prvé miesto.
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
            alt="Zapisovanie úsekov na okno auta počas nočnej štafety"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p>
            A čo to má spoločné s pretekom? No asi to, že som si to celé zaslúžila.
            haha.
          </p>
          <p>
            Akurát sme boli na Slovensku a Tomáš mal istý tím z práce a ja som v
            kútiku duše cítila, že sa na to cítim. haha. Vyšlo to keď som to
            úplne pustila a už ani nedúfala.
          </p>
          <p>
            Bol utorok keď chudákom im vypadol bežec. Ináč nikoho som tam
            nepoznala. Vravím si, veď pohoda spoznám sa s novými ľuďmi.
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
            src={blogCover}
            alt="Strava selfíčko z behu na pretekoch Od Tatier k Dunaju"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p>
            Poviem Vám, že každý jeden beh som cítila takú neskutočnú vďačnosť,
            že tu môžem byť a cítila som, že som úplne iná ako pred rokom.
            Nehrotila som a konečne som si to užila.
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
            src={blog4}
            alt="Odpočinok na deke v tráve medzi úsekmi"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p className="font-display text-xl md:text-2xl italic text-foreground">
            Čarlieho anjeli, tak sme sa volali — mi splnili SEN.
          </p>
          <p className="font-display text-xl md:text-2xl italic text-foreground">
            Zamakala som a prišla ODMENA.
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
            src={blog5}
            alt="Tím Čarlieho anjeli s medailami v cieli Od Tatier k Dunaju"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="my-12"
        >
          <img
            src={blog6}
            alt="V cieli s medailou po dobehnutí štafety"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-10 pt-6 border-t border-foreground/10"
        >
          <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
            <p className="font-display text-2xl md:text-3xl italic text-foreground">
              A NAJVÄČŠIA ODMENA ZA TEN ROK BOLA ODVAHA VĎAKA KTOREJ SME NA KRÉTE.
            </p>
            <p className="font-display text-2xl md:text-3xl italic text-accent pt-2">
              Ďakujem. ❤️
            </p>
          </div>
        </motion.div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost9;
