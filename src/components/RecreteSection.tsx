import { motion } from "framer-motion";
import recreteImage from "@/assets/recrete-image.jpg";

const RecreteSection = () => {
  return (
    <section id="recrete" className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${recreteImage})` }}
      />
      <div className="absolute inset-0 bg-foreground/70" />

      <div className="relative z-10 section-padding">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="font-display text-4xl md:text-5xl font-light tracking-wide text-primary-foreground">
              ReCrete
            </h2>
            <div className="mx-auto mt-4 w-16 h-[1px] bg-accent" />
            <div className="mt-8 font-body text-sm md:text-base leading-loose text-primary-foreground/85 tracking-wide max-w-xl mx-auto space-y-3">
              <p>ReCreate je priestor, kde sa môžeš nadýchnuť.</p>
              <p>Spomalíš.</p>
              <p>Napojíš sa na svoje telo.</p>
              <p>A v kruhu žien nájdeš energiu, ktorú si možno dlho necítila.</p>
              <p className="font-display text-lg md:text-xl italic text-primary-foreground pt-2">
                Kréta nás podrží.
              </p>
              <p className="font-display text-lg md:text-xl italic text-primary-foreground">
                Ty sa vrátiš k sebe.
              </p>
            </div>

            <div className="mt-12 flex justify-center">
              <span className="font-body text-xs md:text-sm tracking-[0.4em] text-primary-foreground uppercase border border-primary-foreground/60 px-8 py-3">
                Coming Soon
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RecreteSection;

