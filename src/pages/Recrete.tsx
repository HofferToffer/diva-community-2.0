import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import recreteImage from "@/assets/recrete-image.jpg";
import { useLang } from "@/lib/lang";

const Recrete = () => {
  const { l } = useLang();
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
              className="font-display text-5xl md:text-7xl tracking-wide text-primary-foreground"
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
                {l("Priestor, kde sa môžeš nadýchnuť, spomaliť a vrátiť k sebe.", "A space to breathe, slow down and come back to yourself.")}
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
          {l("Späť na hlavnú", "Back to home")}
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
          <p>{l("ReCreate je priestor, kde sa môžeš nadýchnuť.", "ReCreate is a space where you can finally breathe.")}</p>
          <p>{l("Spomalíš.", "Slow down.")}</p>
          <p>{l("Napojíš sa na svoje telo.", "Reconnect with your body.")}</p>
          <p>{l("A v kruhu žien nájdeš energiu, ktorú si možno dlho necítila.", "And in a circle of women, find an energy you maybe haven't felt in a long time.")}</p>
          <p className="font-display text-2xl md:text-3xl italic text-foreground pt-6">
            {l("Kréta nás podrží.", "Crete will hold us.")}
          </p>
          <p className="font-display text-2xl md:text-3xl italic text-foreground">
            {l("Ty sa vrátiš k sebe.", "You'll come back to yourself.")}
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
