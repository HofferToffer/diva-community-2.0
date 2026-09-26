import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blogCover from "@/assets/blog-9-cover.jpg";
import blog2 from "@/assets/blog-9-2.jpg";
import blog3 from "@/assets/blog-9-3.jpg";
import blog4 from "@/assets/blog-9-4.jpg";
import blog5 from "@/assets/blog-9-5.jpg";
import blog6 from "@/assets/blog-9-6.jpg";
import { useLang } from "@/lib/lang";

const BlogPost9 = () => {
  const { l } = useLang();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${blog3})` }}
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
            {l("15 ročný sen", "A 15-year dream")}
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
            {l("Cez víkend som absolvovala pretek Od Tatier k Dunaju. Ako už mnohí viete minulý rok sa mi hneď po štarte stal nepekný úraz s členkom.", "This weekend I ran the Tatras to the Danube relay (Od Tatier k Dunaju). As many of you know, last year I badly hurt my ankle right after the start.")}
          </p>
          <p>
            {l("A tam môj 15 ročný sen skončil. Môj veľmi výkonný rok tiež. K svojmu telu som sa začala správať inak.", "And that was the end of my 15-year dream. And of my very performance-driven year, too. I started treating my body differently.")}
          </p>
          <p>
            {l("Urobila som za ten rok veľa veľa práce. Zavolali ma meditácie pri ktorých sa mi diali brutálne veci, veľa som plakala, čistila, rozširovala svoje vedomie, prečítala som knihy o mimozemšťanoch, anjeloch lebo ma to tiež zavolalo.", "I did so, so much work that year. Meditation called me, and some wild stuff happened during it. I cried a lot, cleared a lot, expanded my consciousness, and read books about aliens and angels, because that called me too.")}
          </p>
          <p>
            {l("Chodila som síce občas ako zbitý pes lebo meditácie boli náročnejšie, ale malo to celé svoj význam. Sebahodnota išla hore a pretriedil sa mi aj môj okruh ľudí.", "Sure, some days I walked around like a kicked puppy because the meditations were intense, but it all had a purpose. My self-worth went up, and my circle of people sorted itself out too.")}
          </p>
          <p>
            {l("Niekde v podvedomí som už vedela, že príde zmena, pomaličky som začala spomaľovať, menej pracovať a dávať seba na prvé miesto.", "Somewhere deep down I already knew a change was coming. Little by little, I started slowing down, working less and putting myself first.")}
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
            alt={l("Zapisovanie úsekov na okno auta počas nočnej štafety", "Writing our relay legs on the car window during the night stage")}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p>
            {l("A čo to má spoločné s pretekom? No asi to, že som si to celé zaslúžila. haha.", "So what does any of this have to do with the race? Well, I guess I'd earned the whole thing. haha.")}
          </p>
          <p>
            {l("Akurát sme boli na Slovensku a Tomáš mal istý tím z práce a ja som v kútiku duše cítila, že sa na to cítim. haha. Vyšlo to keď som to úplne pustila a už ani nedúfala.", "We happened to be in Slovakia, Tomáš had a team from work, and deep down I had a feeling I was up for it. haha. It came together once I'd let it go completely and stopped even hoping.")}
          </p>
          <p>
            {l("Bol utorok keď chudákom im vypadol bežec. Ináč nikoho som tam nepoznala. Vravím si, veď pohoda spoznám sa s novými ľuďmi.", "It was Tuesday when the poor things lost a runner. I didn't know anyone on the team. I told myself, no stress, I'll get to meet new people.")}
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
            src={blogCover}
            alt={l("Strava selfíčko z behu na pretekoch Od Tatier k Dunaju", "A Strava selfie from my leg of the Tatras to the Danube relay")}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p>
            {l("Poviem Vám, že každý jeden beh som cítila takú neskutočnú vďačnosť, že tu môžem byť a cítila som, že som úplne iná ako pred rokom. Nehrotila som a konečne som si to užila.", "I'll tell you, on every single leg I felt such unreal gratitude just to be there, and I could feel I was a completely different person than a year ago. I didn't force it, and I finally enjoyed it.")}
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
            src={blog4}
            alt={l("Odpočinok na deke v tráve medzi úsekmi", "Resting on a blanket in the grass between legs")}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
          <p className="font-display text-xl md:text-2xl italic text-foreground">
            {l("Čarlieho anjeli, tak sme sa volali — mi splnili SEN.", "Charlie's Angels (that was our team name) made my DREAM come true.")}
          </p>
          <p className="font-display text-xl md:text-2xl italic text-foreground">
            {l("Zamakala som a prišla ODMENA.", "I put in the work, and the REWARD came.")}
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
            src={blog5}
            alt={l("Tím Čarlieho anjeli s medailami v cieli Od Tatier k Dunaju", "Team Charlie's Angels with their medals at the Tatras to the Danube finish")}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="my-12"
        >
          <img
            src={blog6}
            alt={l("V cieli s medailou po dobehnutí štafety", "At the finish line with my medal after the relay")}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.figure>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-10 pt-6 border-t border-foreground/10"
        >
          <div className="font-body text-base md:text-lg leading-loose text-foreground/85 tracking-wide space-y-5">
            <p className="font-display text-2xl md:text-3xl italic text-foreground">
              {l("A NAJVÄČŠIA ODMENA ZA TEN ROK BOLA ODVAHA VĎAKA KTOREJ SME NA KRÉTE.", "AND THE BIGGEST REWARD OF THAT YEAR WAS THE COURAGE THAT GOT US TO CRETE.")}
            </p>
            <p className="font-display text-2xl md:text-3xl italic text-accent pt-2">
              {l("Ďakujem. ❤️", "Thank you. ❤️")}
            </p>
          </div>
        </motion.div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost9;
