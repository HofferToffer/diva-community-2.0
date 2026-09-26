import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blogCover from "@/assets/blog-5-cover.jpg";
import blog2 from "@/assets/blog-5-2.jpg";
import blog3 from "@/assets/blog-5-3.jpg";
import blog4 from "@/assets/blog-5-4.jpg";
import { useLang } from "@/lib/lang";

const BlogPost5 = () => {
  const { l } = useLang();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative h-[70vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${blogCover})`, backgroundPosition: "center 25%" }}
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
            {l("Múdrosť ženského tela 🌸", "The wisdom of a woman's body 🌸")}
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
            {l("Ženské telo je múdre.", "A woman's body is wise.")}
          </p>
          <p>
            {l("Niekedy nás zastaví práve vtedy, keď sa snažíme ísť proti svojej energii, čo som teda asi robila. Neviem.", "Sometimes it stops us right when we're trying to go against our own energy, which, well, I guess I was doing. I don't know.")}
          </p>
          <p>{l("Keď tlačím tam, kde by som mala viac plynúť.", "When I push where I should be letting things flow.")}</p>
        </div>

        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="my-12"
        >
          <img src={blog2} alt="Diva run" className="w-full h-auto object-cover" loading="lazy" />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p>{l("Môj vyvrtnutý členok bol signálom.", "My sprained ankle was a sign.")}</p>
          <p>{l("Druhý rok po sebe som vypadla z prípravy na Košický polmaratón.", "For the second year in a row, I had to drop out of training for the Košice half marathon.")}</p>
        </div>

        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="my-12"
        >
          <img src={blog3} alt={l("Vyvrtnutý členok", "A sprained ankle")} className="w-full h-auto object-cover" loading="lazy" />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p>
            {l("Keď sa tak zamyslím, tak mi to telo ukazuje „nehroť to“,", "When I really think about it, my body's telling me “don't force it”,")}
          </p>
          <p>{l("„výkon nie je pre teba“, „nedávaj beh na prvé miesto“,", "“chasing performance isn't for you”, “don't put running first”,")}</p>
          <p>{l("„si jemné žieňa“.", "“you're a gentle little woman”.")}</p>
          <p>{l("Stále sa učím a prijímam, aj keď to naše ego si ide.", "I'm still learning to accept it, even when my ego keeps doing its own thing.")}</p>
        </div>

        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="my-12"
        >
          <img src={blog4} alt={l("V cieli", "At the finish line")} className="w-full h-auto object-cover" loading="lazy" />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p>
            {l("Ale u mňa sa práve v týchto chvíľach rodí moja sila – iná než tá, ktorú poznám z výkonu.", "But for me, these are exactly the moments my strength is born. A different kind than the one I know from pushing for results.")}
          </p>
          <p className="font-display text-2xl md:text-3xl italic text-foreground">
            {l("Sila v tichu, v pokoji, v prijatí.", "Strength in silence, in stillness, in acceptance.")}
          </p>
          <p>{l("A už to presne poznám čo sa ide stať.", "And by now I know exactly what's about to happen.")}</p>
          <p className="font-display text-xl md:text-2xl italic text-foreground pt-2">
            {l("Životné skúsenosti, životné pády, životné múdra.", "Life lessons, life's falls, life's wisdom.")}
          </p>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost5;
