import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blogCover from "@/assets/blog-1-cover.jpg";
import blog2 from "@/assets/blog-1-2.jpg";

const BlogPost1 = () => {
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
            Blog · Materstvo
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-4 font-display text-4xl md:text-6xl font-light tracking-wide text-primary-foreground max-w-3xl"
          >
            V jemnosti je naša sila 🌸
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
          <p>Dlho som tomu neverila.</p>
          <p>Myslela som si, že byť silná znamená zvládať všetko.</p>
          <p>Nezlomiť sa. Nepotrebovať. Nepýtať si.</p>
          <p>Ale možno to bola len ochrana pred bolesťou.</p>
          <p>Niečo, čo mi kedysi pomohlo prežiť.</p>
        </div>

        {/* Inline image */}
        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="my-12"
        >
          <img
            src={blog2}
            alt="Mama s dcérou v tráve"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p>A potom prišla ona.</p>
          <p className="font-display text-2xl md:text-3xl italic text-foreground">
            Moja dcéra.
          </p>
          <p>A začala mi ukazovať inú cestu.</p>
          <p>Pýta si, aby som nosila šaty.</p>
          <p>Objíma ma tak, ako som to ja nikdy nevedela.</p>
          <p>Pripomína mi, že môžem byť nežná.</p>
          <p>Že nemusím stále chrániť.</p>
          <p>Že som dosť… aj keď len som.</p>
          <p>A ja sa učím.</p>
          <p>Pomaly.</p>
          <p>Byť znovu žena.</p>
          <p>Ale inak.</p>
          <p className="font-display text-2xl md:text-3xl italic text-foreground pt-4">
            Silná – ale cez jemnosť.
          </p>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost1;
