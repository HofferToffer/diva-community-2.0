import { motion } from "framer-motion";
import heroWater from "@/assets/hero-water.jpg";
import { DivaWordmark } from "@/components/DivaWordmark";
import { useLang } from "@/lib/lang";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const HeroSection = () => {
  const { l } = useLang();
  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-background">
      {/* Floating in clear water — the woman sits a little left of centre, so focus there. */}
      <motion.img
        src={heroWater}
        alt={l("Žena pokojne pláva na hladine priezračného mora", "A woman floating peacefully in clear sea water")}
        className="absolute inset-0 h-full w-full object-cover object-[40%_60%] md:object-[40%_55%]"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: EASE_OUT }}
      />
      {/* A soft plum veil at the top keeps the menu and logo readable. */}
      <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-diva-slivkova/45 to-transparent" aria-hidden="true" />
      {/* The photo dissolves into the page's cream at the bottom. */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-transparent via-background/60 to-background"
        aria-hidden="true"
      />

      {/* Logo above her on phones, in the open water on the right on larger screens — never over her. */}
      <div className="relative z-10 flex h-full flex-col items-center justify-start px-6 pt-28 md:items-end md:justify-center md:px-16 md:pt-0 lg:px-24">
        <motion.div
          className="md:mr-[4vw]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: EASE_OUT }}
        >
          <h1 className="sr-only">DIVA Community</h1>
          <DivaWordmark className="w-44 text-diva-kremova drop-shadow-lg sm:w-52 md:w-72 lg:w-80" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
