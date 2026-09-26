import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blogCover from "@/assets/blog-1-cover.jpg";
import blog2 from "@/assets/blog-1-2.jpg";
import { useLang } from "@/lib/lang";

const BlogPost1 = () => {
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
            {l("Blog · Materstvo", "Blog · Motherhood")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-4 font-display text-4xl md:text-6xl font-light tracking-wide text-primary-foreground max-w-3xl"
          >
            {l("V jemnosti je naša sila 🌸", "Our strength is in our softness 🌸")}
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
          <p>{l("Dlho som tomu neverila.", "For a long time, I didn't believe it.")}</p>
          <p>{l("Myslela som si, že byť silná znamená zvládať všetko.", "I thought being strong meant handling everything.")}</p>
          <p>{l("Nezlomiť sa. Nepotrebovať. Nepýtať si.", "Not breaking. Not needing. Not asking.")}</p>
          <p>{l("Ale možno to bola len ochrana pred bolesťou.", "But maybe it was just a way to protect myself from pain.")}</p>
          <p>{l("Niečo, čo mi kedysi pomohlo prežiť.", "Something that once helped me survive.")}</p>
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
            alt={l("Mama s dcérou v tráve", "A mum and her daughter in the grass")}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p>{l("A potom prišla ona.", "And then she came along.")}</p>
          <p className="font-display text-2xl md:text-3xl italic text-foreground">
            {l("Moja dcéra.", "My daughter.")}
          </p>
          <p>{l("A začala mi ukazovať inú cestu.", "And she started showing me another way.")}</p>
          <p>{l("Pýta si, aby som nosila šaty.", "She asks me to wear dresses.")}</p>
          <p>{l("Objíma ma tak, ako som to ja nikdy nevedela.", "She hugs me in a way I never knew how to.")}</p>
          <p>{l("Pripomína mi, že môžem byť nežná.", "She reminds me that I'm allowed to be gentle.")}</p>
          <p>{l("Že nemusím stále chrániť.", "That I don't always have to be the one protecting.")}</p>
          <p>{l("Že som dosť… aj keď len som.", "That I'm enough… even when I simply am.")}</p>
          <p>{l("A ja sa učím.", "And I'm learning.")}</p>
          <p>{l("Pomaly.", "Slowly.")}</p>
          <p>{l("Byť znovu žena.", "To be a woman again.")}</p>
          <p>{l("Ale inak.", "But differently.")}</p>
          <p className="font-display text-2xl md:text-3xl italic text-foreground pt-4">
            {l("Silná – ale cez jemnosť.", "Strong, but through softness.")}
          </p>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost1;
