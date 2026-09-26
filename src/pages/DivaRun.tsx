import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import divaRunHero from "@/assets/diva-run-hero.jpg";
import divaRunLogo from "@/assets/diva-run-logo.png";
import divaRun7 from "@/assets/diva-run-7.jpg";
import divaRun8 from "@/assets/diva-run-8.jpg";
import divaRun9 from "@/assets/diva-run-9.jpg";
import divaRun10 from "@/assets/diva-run-10.jpg";
import divaRun11 from "@/assets/diva-run-11.jpg";
import divaRun12 from "@/assets/diva-run-12.jpg";
import divaRun13 from "@/assets/diva-run-13.jpg";
import divaRun14 from "@/assets/diva-run-14.jpg";
import divaRun15 from "@/assets/diva-run-15.jpg";
import divaRun16 from "@/assets/diva-run-16.jpg";
import divaRun17 from "@/assets/diva-run-17.jpg";
import divaRun18 from "@/assets/diva-run-18.jpg";
import divaRun19 from "@/assets/diva-run-19.jpg";
import divaRun20 from "@/assets/diva-run-20.jpg";
import { useLang, type Bilingual } from "@/lib/lang";

type MediaItem = { type: "image"; src: string; alt: Bilingual; width: number; height: number };

const photos: MediaItem[] = [
  // 1. Rozcvička & príprava
  { type: "image", src: divaRun7, alt: { sk: "DIVA Run – rozcvička", en: "DIVA Run – warm-up" }, width: 800, height: 1365 },
  { type: "image", src: divaRun20, alt: { sk: "DIVA Run – pred behom v parku", en: "DIVA Run – before the run in the park" }, width: 900, height: 1600 },
  { type: "image", src: divaRun8, alt: { sk: "DIVA Run – po tréningu", en: "DIVA Run – after training" }, width: 800, height: 1365 },

  // 2. Beh – akcia
  { type: "image", src: divaRun9, alt: { sk: "DIVA Run – beh na dráhe", en: "DIVA Run – running on the track" }, width: 1024, height: 1365 },
  { type: "image", src: divaRun10, alt: { sk: "DIVA Run – tím na štadióne", en: "DIVA Run – the team at the stadium" }, width: 1024, height: 1365 },
  { type: "image", src: divaRun18, alt: { sk: "DIVA Run – beh v parku", en: "DIVA Run – running in the park" }, width: 1080, height: 1565 },
  { type: "image", src: divaRun14, alt: { sk: "DIVA Run – radosť počas behu", en: "DIVA Run – pure joy mid-run" }, width: 900, height: 1600 },

  // 3. Po behu – občerstvenie & spoločné momenty
  { type: "image", src: divaRun17, alt: { sk: "DIVA Run – občerstvenie po behu", en: "DIVA Run – snacks after the run" }, width: 900, height: 1600 },
  { type: "image", src: divaRun19, alt: { sk: "DIVA Run – tím pred Mojou srdcovkou", en: "DIVA Run – the team outside Moja srdcovka" }, width: 900, height: 1600 },
  { type: "image", src: divaRun15, alt: { sk: "DIVA Run – baby pred Mojou srdcovkou", en: "DIVA Run – the girls outside Moja srdcovka" }, width: 900, height: 1600 },

  // 4. Portréty & relax na terase
  { type: "image", src: divaRun16, alt: { sk: "DIVA Run – portrét so šiltovkou", en: "DIVA Run – portrait in a DIVA cap" }, width: 900, height: 1600 },
  { type: "image", src: divaRun11, alt: { sk: "DIVA Run – na terase", en: "DIVA Run – on the terrace" }, width: 900, height: 1600 },
  { type: "image", src: divaRun13, alt: { sk: "DIVA Run – úsmev na terase", en: "DIVA Run – smiles on the terrace" }, width: 900, height: 1600 },
  { type: "image", src: divaRun12, alt: { sk: "DIVA Run – kávička po behu", en: "DIVA Run – coffee after the run" }, width: 900, height: 1600 },
];

const DivaRun = () => {
  const { l, pick } = useLang();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${divaRunHero})` }}
        />
        <div className="absolute inset-0 bg-foreground/70" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
          <motion.img
            src={divaRunLogo}
            alt="DIVA Run"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="h-48 md:h-72 lg:h-96 w-auto drop-shadow-2xl"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-4 font-body text-sm md:text-base tracking-wide text-primary-foreground/80 max-w-lg"
          >
            {l("Bežíme spolu. Fotky z našich spoločných behov a eventov.", "We run together. Photos from our group runs and events.")}
          </motion.p>
        </div>
      </section>

      {/* Back link */}
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors uppercase"
        >
          <ArrowLeft size={14} />
          {l("Späť na hlavnú", "Back to home")}
        </Link>
      </div>

      {/* Photo Gallery */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 py-12">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="break-inside-avoid overflow-hidden"
            >
              <img
                src={photo.src}
                alt={pick(photo.alt)}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                className="w-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DivaRun;
