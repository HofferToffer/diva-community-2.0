import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blogCover from "@/assets/blog-2-cover.jpg";
import blog2 from "@/assets/blog-2-2.jpg";
import blog3 from "@/assets/blog-2-3.jpg";
import { useLang } from "@/lib/lang";

const lines1: [sk: string, en: string][] = [
  ["keď ideš mimo systém", "when you step outside the system"],
  ["keď sa rozhodneš mať 2 deti po sebe", "when you decide to have 2 kids back to back"],
  ["keď si rodičom, ktorý neklame deti", "when you're a parent who doesn't lie to their kids"],
  ["keď búraš generačné traumy", "when you break generational trauma"],
  ["keď ideš do hĺbky", "when you go deep"],
  ["keď dáš seba na prvé miesto", "when you put yourself first"],
  ["keď si vo vzťahu kde to nie je perfektné", "when you're in a relationship that isn't perfect"],
  ["keď si priznáš chybu", "when you admit you were wrong"],
];

const lines2: [sk: string, en: string][] = [
  ["keď začneš byť autentická", "when you start being authentic"],
  ["keď si v tichu", "when you sit in silence"],
  ["keď sa postavíš vlastným tieňom", "when you face your own shadows"],
  ["keď povieš mužovi svoje najväčšie tajomstvo", "when you tell your man your biggest secret"],
  ["keď sa spoľahneš na život", "when you trust life"],
  ["keď sa nebojíš ísť do diskomfortu", "when you're not afraid to get uncomfortable"],
  ["keď oddychuješ", "when you rest"],
];

const lines3: [sk: string, en: string][] = [
  ["keď deťom ukazuješ všetky svoje emócie", "when you show your kids all your emotions"],
  ["keď nepracuješ 8 hodín denne", "when you don't work 8 hours a day"],
  ["keď veríš že na tomto svete nie sme sami", "when you believe we're not alone in this world"],
  ["keď veríš na anjelov", "when you believe in angels"],
  ["keď sa otvoríš človeku", "when you open up to someone"],
];

const BlogPost2 = () => {
  const { l } = useLang();
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
            className="mt-4 font-display text-4xl md:text-6xl tracking-wide text-primary-foreground max-w-3xl"
          >
            {l("Odvaha 🌸", "Courage 🌸")}
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
        <p className="font-display text-2xl md:text-3xl italic text-foreground mb-10">
          {l("Čo je pre mňa ODVAHA", "What COURAGE means to me")}
        </p>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          {lines1.map(([sk, en]) => (
            <p key={sk}>{l(sk, en)}</p>
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
            alt={l("Odvaha", "Courage")}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          {lines2.map(([sk, en]) => (
            <p key={sk}>{l(sk, en)}</p>
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
            alt={l("Odvaha", "Courage")}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          {lines3.map(([sk, en]) => (
            <p key={sk}>{l(sk, en)}</p>
          ))}
          <p className="font-display text-2xl md:text-3xl italic text-foreground pt-4">
            {l("keď vieš byť slabá.", "when you let yourself be weak.")}
          </p>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost2;
