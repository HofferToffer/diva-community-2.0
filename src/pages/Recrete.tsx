import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import recreteImage from "@/assets/recrete-image.jpg";

const Recrete = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${recreteImage})` }}
        />
        <div className="absolute inset-0 bg-foreground/70" />
        <div className="relative z-10 flex h-full items-center justify-center px-6 md:px-12 lg:px-24">
          <div className="mx-auto max-w-7xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-display text-5xl md:text-7xl font-light tracking-wide text-primary-foreground"
            >
              ReCrete
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="mx-auto mt-4 w-16 h-[1px] bg-accent" />
              <p className="mt-6 font-body text-sm tracking-wide text-primary-foreground/80 max-w-md mx-auto">
                Priestor, kde sa môžeš nadýchnuť, spomaliť a vrátiť k sebe.
              </p>
            </motion.div>
          </div>
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

      {/* Content */}
      <section className="mx-auto max-w-3xl px-6 md:px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center font-body text-base md:text-lg leading-loose text-foreground/80 tracking-wide space-y-5"
        >
          <p>ReCreate je priestor, kde sa môžeš nadýchnuť.</p>
          <p>Spomalíš.</p>
          <p>Napojíš sa na svoje telo.</p>
          <p>A v kruhu žien nájdeš energiu, ktorú si možno dlho necítila.</p>
          <p className="font-display text-2xl md:text-3xl italic text-foreground pt-6">
            Kréta nás podrží.
          </p>
          <p className="font-display text-2xl md:text-3xl italic text-foreground">
            Ty sa vrátiš k sebe.
          </p>
        </motion.div>

        <div className="mt-16 flex justify-center">
          <span className="font-body text-xs md:text-sm tracking-[0.4em] text-foreground uppercase border border-foreground/60 px-8 py-3">
            Coming Soon
          </span>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Recrete;
