import { motion } from "framer-motion";
import { ArrowLeft, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blogCover from "@/assets/blog-3-cover.jpg";
import blog2 from "@/assets/blog-3-2.jpg";
import blog3 from "@/assets/blog-3-3.jpg";
import { useLang } from "@/lib/lang";

const BlogPost3 = () => {
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
          {l("Späť na blog", "Back to the blog")}
        </Link>
      </div>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-6 md:px-12 py-12">
        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p>
            {l("Stalo sa to, keď som si prechádzala starými boliestkami. Pocitmi hanby z minulosti, nie pekné skúsenosti s mužmi. Vyšlo to zo mňa pod dosť veľkým tlakom, ale muselo už. Zrútená som plakala mužovi na pleci.", "It happened while I was working through some old hurts. Feelings of shame from the past, not-so-nice experiences with men. It came out of me under a lot of pressure, but it had to, it was time. I fell apart and cried on my man's shoulder.")}
          </p>

          <p className="font-display text-xl md:text-2xl italic text-foreground pt-2">
            {l("Otázky:", "Questions:")}
          </p>

          <p className="font-display text-2xl md:text-3xl italic text-foreground">
            {l("„Nebudeš sa teraz na mňa pozerať inak?“", "“Are you going to look at me differently now?”")}
          </p>
          <p>{l("Mala som to vôbec povedať?", "Should I have even said it?")}</p>
          <p>{l("Budem bez tej masky taká silná?", "Will I still be this strong without the mask?")}</p>

          <p>
            {l("Roky som mlčala. Bola s tými pocitmi sama. Bolelo to, ale zároveň to konečne zo mňa vyšlo. Môj príbeh.", "For years I kept quiet. Alone with those feelings. It hurt, but at the same time it had finally come out of me. My story.")}
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
            alt={l("Žena pri jazere", "A woman by the lake")}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p>
            {l("A v tom ako to po pár dňoch prešlo ma napadlo, že v tom určite nie som sama. Že určite také niečo prežila aj iná žena. Že keď to budem zdieľať s druhými ženami tak je to vlastne pre mňa dosť liečivé.", "And once it eased off after a few days, it hit me that I'm definitely not the only one. That some other woman has surely lived through something like this too. And that sharing it with other women is actually really healing for me.")}
          </p>

          <p>
            {l("Ženy, ktoré sú vo videu som vyberala intuitívne, zo srdca a sú pre mňa veľkou inšpiráciou. Sú tak nádherné, čisté, autentické, že keď som to strihala tak som sa do každej jednej zaľúbila. Tak krásne poznačené tými svojimi príbehmi. Veľmi silný zážitok pre mňa.", "I chose the women in the video intuitively, straight from the heart, and they're a huge inspiration to me. They're so beautiful, so pure, so real, that while I was editing it I fell in love with every single one of them. So beautifully shaped by their own stories. Such a powerful experience for me.")}
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
            alt={l("Žena v poli", "A woman in a field")}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p>{l("Ďakujem za každú jednu.", "Thank you, every single one of you.")}</p>

          <p className="font-display text-2xl md:text-3xl italic text-foreground pt-4">
            {l("Ste najväčšie Divy. 🌸", "You're the biggest Divas. 🌸")}
          </p>
          <p className="font-display text-2xl md:text-3xl italic text-foreground">
            {l("Všetky sme. 💗", "We all are. 💗")}
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
            {l("Pozrieť video „GIRL“", "Watch the “GIRL” video")}
          </a>
        </motion.div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost3;
