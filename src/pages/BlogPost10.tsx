import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blog1Asset from "@/assets/blog-10-1.jpeg.asset.json";
import blog2Asset from "@/assets/blog-10-2.jpeg.asset.json";
import blog3Asset from "@/assets/blog-10-3.jpeg.asset.json";
import { useLang } from "@/lib/lang";

const blog1 = blog1Asset.url;
const blog2 = blog2Asset.url;
const blog3 = blog3Asset.url;

const stanzas: string[][] = [
  [
    "Predstavte si ženu, ktorá verí, že byť ženou je požehnaním.",
    "Ženu, ktorá si váži svoje skúsenosti a odovzdáva svoje príbehy.",
    "Ženu, ktorá odmieta niesť hriechy druhých na svojich pleciach.",
  ],
  [
    "Predstavte si ženu, ktorá verí vo svoju užitočnosť,",
    "ctí a rešpektuje samu seba.",
    "Načúva svojim potrebám a túžbam a napĺňa ich s nehou a pôvabom.",
  ],
  [
    "Predstavte si ženu, ktorá si uvedomuje vplyv minulosti na svoj súčasný život.",
    "Ženu, ktorá prešla svojou minulosťou",
    "a vyliečila svoju prítomnosť.",
  ],
  [
    "Predstavte si ženu, ktorá vládne svojmu životu.",
    "Ženu, ktorá vynakladá úsilie, uvádza veci do pohybu a posúva ich vpred.",
    "Odmieta sa vzdať. Odovzdá sa iba svojmu pravému ja a hlasu múdrosti.",
  ],
  [
    "Predstavte si ženu, ktorá vo svojej tvári vidí božstvo.",
    "Predstavte si ženu, ktorá je zamilovaná do svojho tela.",
    "Verí, že jej telo je dokonalé práve také, aké je.",
    "Oslavuje svoje telo ako zdroj dokonalosti.",
  ],
  [
    "Predstavte si ženu, ktorá si váži bohyňu v sebe.",
    "Ženu, ktorá oslavuje svoje roky a svoju múdrosť.",
    "Odmieta plytvať drahocennou energiou na to, aby zakrývala zmeny prebiehajúce v jej tele a na jej tvári.",
  ],
  [
    "Predstavte si ženu, ktorá si váži ženy vo svojom živote.",
    "Ženu, ktorá sa stýka s druhými.",
    "Ktorej vždy niekto pripomenie, aká je, keď na to zabudne.",
  ],
];

const Stanzas = ({ from, to }: { from: number; to: number }) => (
  <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-6">
    {stanzas.slice(from, to).map((lines, i) => (
      <p key={i} className="italic">
        {lines.map((line, j) => (
          <span key={j}>
            {line}
            <br />
          </span>
        ))}
      </p>
    ))}
  </div>
);

const BlogPost10 = () => {
  const { lang } = useLang();
  // Slovak-only poem — not part of the English website.
  if (lang === "en") return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
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
            Múdrosť lona
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
        <Stanzas from={0} to={3} />

        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="my-12"
        >
          <img
            src={blog2}
            alt="Žena oddychuje na ležadle v tráve s knihou"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <Stanzas from={3} to={5} />

        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="my-12"
        >
          <img
            src={blog3}
            alt="Žena číta knihu na ležadle v letnom slnku"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <Stanzas from={5} to={7} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-10 pt-6 border-t border-foreground/10"
        >
          <p className="font-display text-2xl md:text-3xl italic text-foreground">
            Predstavte si, že tou ženou ste vy…
          </p>
          <p className="mt-6 font-body text-sm tracking-[0.2em] uppercase text-muted-foreground">
            Patricia Lynn Reilly
          </p>
          <p className="mt-2 font-body text-sm text-muted-foreground italic">
            z knihy Múdrosť lona
          </p>
        </motion.div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost10;
