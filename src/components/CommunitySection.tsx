import { motion } from "framer-motion";
import divaWomenSunLine from "@/assets/diva-women-sun-line.png.asset.json";

const CommunitySection = () => {
  return (
    <section id="community" className="section-padding bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="overflow-hidden rounded-2xl">
              <img
                src={divaWomenSunLine.url}
                alt="Ženy so slnkom - line art ilustrácia"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <h2 className="font-display text-4xl md:text-5xl font-light tracking-wide text-foreground">
              Diva Community
            </h2>
            <div className="w-16 h-[1px] bg-accent" />
            <div className="font-body text-sm leading-loose text-muted-foreground tracking-wide space-y-4">
              <p>Tento projekt žil vo mne už dávno.</p>
              <p>
                Vedela som, že raz chcem vytvoriť niečo pre ženy. Niečo, kde sa budeme cítiť silné,
                slobodné, prepojené.
              </p>
              <p>
                Lenže dnes už viem, že ten môj vlastný príbeh, o ktorom som kedysi písala, že som si
                ním musela najprv prejsť, vlastne stále prebieha.
              </p>
              <p>Stále niečo riešim.</p>
              <p>Stále sa niečo učím.</p>
              <p>Stále sa niekedy strácam a potom sa zase hľadám.</p>
              <p>A asi je to tak v poriadku.</p>
              <p>
                Nemám pocit, že som už niekde „na konci". Že už mám všetko spracované, vyriešené a
                teraz môžem niečo odovzdávať ďalej.
              </p>
              <p>Skôr mám pocit, že stále idem.</p>
              <p>Životom.</p>
              <p>Sama sebou.</p>
              <p>Materstvom.</p>
              <p>Vzťahmi.</p>
              <p>Svojím telom.</p>
              <p>Svojou ženskosťou.</p>
              <p>A popri tom všetkom vzniká aj Diva.</p>
              <p>Nie preto, že som už našla všetky odpovede.</p>
              <p>Ale možno práve preto, že ich stále hľadám.</p>
              <p>
                Diva Community pre mňa nie je o tom, že musíme byť dokonalé, silné alebo stále
                vedieť, čo robíme.
              </p>
              <p>Je o ženách.</p>
              <p>O nás.</p>
              <p>
                O tom, že každá z nás niečím prechádza. Že každá máme svoje obdobia, svoje pády,
                svoje návraty k sebe.
              </p>
              <p>A možno práve v tom je tá sila.</p>
              <p>Že v tom nemusíme byť samé.</p>
              <p>Diva Community vzniká spolu so mnou. Tak, ako sa mením ja, mení sa aj ona.</p>
              <p>A možno presne preto má zmysel.</p>
              <p className="font-display text-xl md:text-2xl italic text-foreground pt-2">
                Buď Diva 🌸
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
