import { motion } from "framer-motion";
import divaWomenSun from "@/assets/diva-women-sun-plum.png";
import { useLang } from "@/lib/lang";

const paragraphs: [sk: string, en: string][] = [
  ["Tento projekt žil vo mne už dávno.", "This project has been living inside me for a long time."],
  ["Vedela som, že raz chcem vytvoriť niečo pre ženy. Niečo, kde sa budeme cítiť silné, slobodné, prepojené.", "I always knew that one day I wanted to create something for women. A place where we'd feel strong, free and connected."],
  ["Lenže dnes už viem, že ten môj vlastný príbeh, o ktorom som kedysi písala, že som si ním musela najprv prejsť, vlastne stále prebieha.", "But now I know that my own story, the one I used to write about as something I had to get through first, is actually still happening."],
  ["Stále niečo riešim.", "I'm still working things out."],
  ["Stále sa niečo učím.", "Still learning."],
  ["Stále sa niekedy strácam a potom sa zase hľadám.", "Still losing myself sometimes, and then finding my way back again."],
  ["A asi je to tak v poriadku.", "And I think that's okay."],
  ["Nemám pocit, že som už niekde „na konci\". Že už mám všetko spracované, vyriešené a teraz môžem niečo odovzdávať ďalej.", "I don't feel like I've reached some kind of \"finish line\". Like I've got it all processed and figured out, and now I get to pass it on."],
  ["Skôr mám pocit, že stále idem.", "It feels more like I'm still on my way."],
  ["Životom.", "Through life."],
  ["Sama sebou.", "Through myself."],
  ["Materstvom.", "Through motherhood."],
  ["Vzťahmi.", "Through relationships."],
  ["Svojím telom.", "Through my body."],
  ["Svojou ženskosťou.", "Through my femininity."],
  ["A popri tom všetkom vzniká aj Diva.", "And somewhere along the way, Diva is growing too."],
  ["Nie preto, že som už našla všetky odpovede.", "Not because I've found all the answers."],
  ["Ale možno práve preto, že ich stále hľadám.", "But maybe exactly because I'm still looking for them."],
  ["Diva Community pre mňa nie je o tom, že musíme byť dokonalé, silné alebo stále vedieť, čo robíme.", "For me, Diva Community isn't about being perfect, or strong, or always knowing what we're doing."],
  ["Je o ženách.", "It's about women."],
  ["O nás.", "About us."],
  ["O tom, že každá z nás niečím prechádza. Že každá máme svoje obdobia, svoje pády, svoje návraty k sebe.", "About the fact that every one of us is going through something. That we all have our seasons, our falls, our ways back to ourselves."],
  ["A možno práve v tom je tá sila.", "And maybe that's exactly where the strength is."],
  ["Že v tom nemusíme byť samé.", "In knowing we don't have to go through it alone."],
  ["Diva Community vzniká spolu so mnou. Tak, ako sa mením ja, mení sa aj ona.", "Diva Community is growing right alongside me. As I change, it changes too."],
  ["A možno presne preto má zmysel.", "And maybe that's exactly why it means something."],
];

const CommunitySection = () => {
  const { l } = useLang();
  return (
    <section id="community" className="section-padding bg-background overflow-x-clip">
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
                src={divaWomenSun}
                alt={l("Ženy so slnkom - line art ilustrácia", "Women with the sun, line art illustration")}
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
            <h2 className="font-display text-4xl md:text-5xl tracking-wide text-foreground">
              Diva Community
            </h2>
            <div className="w-16 h-[1px] bg-accent" />
            <div className="font-body text-sm leading-loose text-muted-foreground tracking-wide space-y-4">
              {paragraphs.map(([sk, en]) => (
                <p key={sk}>{l(sk, en)}</p>
              ))}
              <p className="font-display text-xl md:text-2xl italic text-foreground pt-2">
                {l("Buď Diva", "Be a Diva")} 🌸
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
