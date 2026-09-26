import { motion } from "framer-motion";
import recreteImage from "@/assets/recrete-image.jpg";
import { useLang } from "@/lib/lang";

const RecreteSection = () => {
  const { l } = useLang();
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
            <h2 className="font-display text-4xl md:text-5xl tracking-wide text-primary-foreground">
              ReCrete
            </h2>
            <div className="mx-auto mt-4 w-16 h-[1px] bg-accent" />
            <div className="mt-8 font-body text-sm md:text-base leading-loose text-primary-foreground/85 tracking-wide max-w-xl mx-auto space-y-3">
              <p>{l("ReCreate je priestor, kde sa môžeš nadýchnuť.", "ReCreate is a space where you can finally breathe.")}</p>
              <p>{l("Spomalíš.", "Slow down.")}</p>
              <p>{l("Napojíš sa na svoje telo.", "Reconnect with your body.")}</p>
              <p>{l("A v kruhu žien nájdeš energiu, ktorú si možno dlho necítila.", "And in a circle of women, find an energy you maybe haven't felt in a long time.")}</p>
              <p className="font-display text-lg md:text-xl italic text-primary-foreground pt-2">
                {l("Kréta nás podrží.", "Crete will hold us.")}
              </p>
              <p className="font-display text-lg md:text-xl italic text-primary-foreground">
                {l("Ty sa vrátiš k sebe.", "You'll come back to yourself.")}
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

