import { motion } from "framer-motion";
import heroVideo from "@/assets/hero-video.mp4";
import { DivaWordmark } from "@/components/DivaWordmark";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-foreground">
      <video
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-foreground/20" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          <h1 className="sr-only">DIVA Community</h1>
          <DivaWordmark className="w-56 text-diva-kremova drop-shadow-lg sm:w-64 md:w-80 lg:w-96" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
