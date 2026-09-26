import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blogCover from "@/assets/blog-8-cover.jpg";
import { useLang } from "@/lib/lang";

const BlogPost8 = () => {
  const { l } = useLang();
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
            {l("Cyklus", "Cycle")}
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
        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p>
            {l("Ja som tak vďačná za túto Krétu. Už teraz ma veľa učí.", "I'm so grateful for Crete. It's already teaching me so much.")}
          </p>
          <p>
            {l("Je to ženský ostrov a otvárajú sa mi veci potlačené a zvedomujem si dnes napríklad svoj cyklus.", "It's a feminine island, and things I'd pushed down are opening up. Like my cycle, which I'm only now truly becoming aware of.")}
          </p>
          <p>
            {l("Mám svoje dni a konečne si dovoľujem sa k ním správať ako sa má. Ležím pod dekou, oddychujem, preciťujem, plačem, púšťam.", "I'm on my period, and I'm finally letting myself treat those days the way they deserve. I lie under a blanket, rest, feel it all, cry, let go.")}
          </p>
        </div>

        <div className="mt-5 font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p>
            {l("Uvedomujem si, ako som sa správala k svojmu telu. Napríklad chodila som behať aj cez menzes, cvičila, nezastavila sa a išla výkon.", "I'm realising how I used to treat my body. I'd go running even on my period, work out, never stop, always chasing performance.")}
          </p>
          <p className="font-display text-xl md:text-2xl italic text-foreground">
            {l("Ach ten môj VÝKON.", "Oh, that PERFORMANCE of mine.")}
          </p>
          <p>
            {l("Toľko lekcií mi dal. A vlastne aj ďakujem, lebo vďaka nemu sa teraz učím počúvať, načúvať svojmu telu.", "It taught me so many lessons. And honestly, I'm grateful, because thanks to it I'm now learning to listen, really listen, to my body.")}
          </p>
          <p>
            {l("Učím sa cez skúsenosť. Toto som JA.", "I learn by living it. This is ME.")}
          </p>
          <p className="font-display text-2xl md:text-3xl italic text-foreground pt-2">
            {l("A prajem každej jednej žene, aby si toto mohla dovoliť. ❤️", "And I wish every single woman could allow herself this. ❤️")}
          </p>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost8;
