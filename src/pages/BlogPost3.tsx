import { motion } from "framer-motion";
import { ArrowLeft, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blogCover from "@/assets/blog-3-cover.jpg";
import blog2 from "@/assets/blog-3-2.jpg";
import blog3 from "@/assets/blog-3-3.jpg";

const BlogPost3 = () => {
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
            GIRL 🌸
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
            Stalo sa to, keď som si prechádzala starými boliestkami. Pocitmi
            hanby z minulosti, nie pekné skúsenosti s mužmi. Vyšlo to zo mňa pod
            dosť veľkým tlakom, ale muselo už. Zrútená som plakala mužovi na
            pleci.
          </p>

          <p className="font-display text-xl md:text-2xl italic text-foreground pt-2">
            Otázky:
          </p>

          <p className="font-display text-2xl md:text-3xl italic text-foreground">
            „Nebudeš sa teraz na mňa pozerať inak?“
          </p>
          <p>Mala som to vôbec povedať?</p>
          <p>Budem bez tej masky taká silná?</p>

          <p>
            Roky som mlčala. Bola s tými pocitmi sama. Bolelo to, ale zároveň to
            konečne zo mňa vyšlo. Môj príbeh.
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
            alt="Žena pri jazere"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p>
            A v tom ako to po pár dňoch prešlo ma napadlo, že v tom určite nie
            som sama. Že určite také niečo prežila aj iná žena. Že keď to budem
            zdieľať s druhými ženami tak je to vlastne pre mňa dosť liečivé.
          </p>

          <p>
            Ženy, ktoré sú vo videu som vyberala intuitívne, zo srdca a sú pre
            mňa veľkou inšpiráciou. Sú tak nádherné, čisté, autentické, že keď
            som to strihala tak som sa do každej jednej zaľúbila. Tak krásne
            poznačené tými svojimi príbehmi. Veľmi silný zážitok pre mňa.
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
            alt="Žena v poli"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p>Ďakujem za každú jednu.</p>

          <p className="font-display text-2xl md:text-3xl italic text-foreground pt-4">
            Ste najväčšie Divy. 🌸
          </p>
          <p className="font-display text-2xl md:text-3xl italic text-foreground">
            Všetky sme. 💗
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-12 flex justify-center"
        >
          <a
            href="https://www.instagram.com/reel/DOJo-n6DMhu/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-foreground px-8 py-3 font-body text-xs tracking-[0.2em] text-foreground hover:bg-foreground hover:text-background transition-all duration-300 uppercase"
          >
            <Instagram size={16} />
            Pozrieť video „GIRL“
          </a>
        </motion.div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost3;
