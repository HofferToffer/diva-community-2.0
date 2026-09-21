import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blog1Asset from "@/assets/blog-11-1.jpeg.asset.json";
import blog2Asset from "@/assets/blog-11-2.jpeg.asset.json";

const blog1 = blog1Asset.url;
const blog2 = blog2Asset.url;

const paragraphs1 = [
  "Milé Divy. ❤️",
  "Idem sa s Vami podeliť, ako budem na sebe ďalší polrok pracovať. Bola som pozvaná ako pilotná klientka do programu pre ženy, kde sa bude riešiť cyklus, nutrícia, Human Design, jednoducho sa tam ide do poriadnej hĺbky. Je to online kurz, kde sme 1:1, individuálny prístup, veľmi intuitívny. Robí to Lucka Loderer, o ktorej ste u mňa už počuli.",
];

const paragraphs2 = [
  "Keď ma s tým oslovila, bola som veľmi nadšená, pretože roky som sa starala o všetkých okolo a teraz prišiel čas postarať sa aj o seba. Mám veľký problém prijímať či dary alebo pomoc, takže si viete predstaviť, čo to robilo s mojím programom, ale po chvíli som začala cítiť veľkú vďačnosť a prijala som to so zodpovednosťou, že dám do toho všetko.",
  "Teším sa na túto cestu a na ten výsledok, lebo už viem, akou verziou SEBA chcem byť a vlastne UŽ SOM. Budem Vám to celé zaznamenávať, niečo ako taký môj denník.",
  "A pracujem na ďalších krásnych veciach, o ktorých sa dozviete čoskoro.",
  "ĎAKUJEM.",
];

const Text = ({ items }: { items: string[] }) => (
  <div className="font-body text-base md:text-lg leading-loose text-foreground/85 space-y-6">
    {items.map((p, i) => (
      <p key={i}>{p}</p>
    ))}
  </div>
);

const BlogPost11 = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative h-[70vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${blog1})` }}
        />
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
          <span className="font-body text-xs tracking-[0.3em] text-primary-foreground/80 uppercase">
            Blog
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-4 font-display text-4xl md:text-6xl font-light tracking-wide text-primary-foreground max-w-3xl"
          >
            Moja cesta hlbšie k sebe
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
        <Text items={paragraphs1} />

        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="my-12"
        >
          <img
            src={blog2}
            alt="Žena na kamennej pláži pri mori s vlajúcou šatkou"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <Text items={paragraphs2} />
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost11;
