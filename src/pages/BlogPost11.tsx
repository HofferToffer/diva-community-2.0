import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blog1Asset from "@/assets/blog-11-1.jpeg.asset.json";
import blog2Asset from "@/assets/blog-11-2.jpeg.asset.json";
import { useLang } from "@/lib/lang";

const blog1 = blog1Asset.url;
const blog2 = blog2Asset.url;

const paragraphs1: [sk: string, en: string][] = [
  ["Milé Divy. ❤️", "Dear Divas. ❤️"],
  ["Idem sa s Vami podeliť, ako budem na sebe ďalší polrok pracovať. Bola som pozvaná ako pilotná klientka do programu pre ženy, kde sa bude riešiť cyklus, nutrícia, Human Design, jednoducho sa tam ide do poriadnej hĺbky. Je to online kurz, kde sme 1:1, individuálny prístup, veľmi intuitívny. Robí to Lucka Loderer, o ktorej ste u mňa už počuli.", "I want to share with you how I'll be working on myself for the next six months. I was invited to be a pilot client in a program for women that covers the cycle, nutrition, Human Design… basically, it goes really deep. It's an online course, 1:1, fully individual and very intuitive. It's run by Lucka Loderer, who you've already heard about from me."],
];

const paragraphs2: [sk: string, en: string][] = [
  ["Keď ma s tým oslovila, bola som veľmi nadšená, pretože roky som sa starala o všetkých okolo a teraz prišiel čas postarať sa aj o seba. Mám veľký problém prijímať či dary alebo pomoc, takže si viete predstaviť, čo to robilo s mojím programom, ale po chvíli som začala cítiť veľkú vďačnosť a prijala som to so zodpovednosťou, že dám do toho všetko.", "When she reached out, I was so excited, because for years I've taken care of everyone around me, and now it's time to take care of myself too. I find it really hard to receive, whether it's gifts or help, so you can imagine what that did to my inner programming. But after a while I started to feel huge gratitude, and I said yes, with the commitment to give it everything I've got."],
  ["Teším sa na túto cestu a na ten výsledok, lebo už viem, akou verziou SEBA chcem byť a vlastne UŽ SOM. Budem Vám to celé zaznamenávať, niečo ako taký môj denník.", "I'm looking forward to this journey and to where it leads, because I already know which version of MYSELF I want to be, and actually, I ALREADY AM. I'll be sharing the whole thing with you, kind of like my own little diary."],
  ["A pracujem na ďalších krásnych veciach, o ktorých sa dozviete čoskoro.", "And I'm working on some other beautiful things you'll hear about soon."],
  ["ĎAKUJEM.", "THANK YOU."],
];

const Text = ({ items }: { items: [sk: string, en: string][] }) => {
  const { l } = useLang();
  return (
    <div className="font-body text-base md:text-lg leading-loose text-foreground/85 space-y-6">
      {items.map(([sk, en], i) => (
        <p key={i}>{l(sk, en)}</p>
      ))}
    </div>
  );
};

const BlogPost11 = () => {
  const { l } = useLang();
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
            className="mt-4 font-display text-4xl md:text-6xl tracking-wide text-primary-foreground max-w-3xl"
          >
            {l("Moja cesta hlbšie k sebe", "My journey deeper into myself")}
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
            alt={l("Žena na kamennej pláži pri mori s vlajúcou šatkou", "A woman on a pebble beach by the sea, her scarf blowing in the wind")}
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
