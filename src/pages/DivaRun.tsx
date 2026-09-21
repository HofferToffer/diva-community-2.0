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

type MediaItem = { type: "image"; src: string; alt: string; width: number; height: number };

const photos: MediaItem[] = [
  // 1. Rozcvička & príprava
  { type: "image", src: divaRun7, alt: "DIVA Run – rozcvička", width: 800, height: 1365 },
  { type: "image", src: divaRun20, alt: "DIVA Run – pred behom v parku", width: 900, height: 1600 },
  { type: "image", src: divaRun8, alt: "DIVA Run – po tréningu", width: 800, height: 1365 },

  // 2. Beh – akcia
  { type: "image", src: divaRun9, alt: "DIVA Run – beh na dráhe", width: 1024, height: 1365 },
  { type: "image", src: divaRun10, alt: "DIVA Run – tím na štadióne", width: 1024, height: 1365 },
  { type: "image", src: divaRun18, alt: "DIVA Run – beh v parku", width: 1080, height: 1565 },
  { type: "image", src: divaRun14, alt: "DIVA Run – radosť počas behu", width: 900, height: 1600 },

  // 3. Po behu – občerstvenie & spoločné momenty
  { type: "image", src: divaRun17, alt: "DIVA Run – občerstvenie po behu", width: 900, height: 1600 },
  { type: "image", src: divaRun19, alt: "DIVA Run – tím pred Mojou srdcovkou", width: 900, height: 1600 },
  { type: "image", src: divaRun15, alt: "DIVA Run – baby pred Mojou srdcovkou", width: 900, height: 1600 },

  // 4. Portréty & relax na terase
  { type: "image", src: divaRun16, alt: "DIVA Run – portrét so šiltovkou", width: 900, height: 1600 },
  { type: "image", src: divaRun11, alt: "DIVA Run – na terase", width: 900, height: 1600 },
  { type: "image", src: divaRun13, alt: "DIVA Run – úsmev na terase", width: 900, height: 1600 },
  { type: "image", src: divaRun12, alt: "DIVA Run – kávička po behu", width: 900, height: 1600 },
];

const DivaRun = () => {
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
            Bežíme spolu. Fotky z našich spoločných behov a eventov.
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
          Späť na hlavnú
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
                alt={photo.alt}
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
