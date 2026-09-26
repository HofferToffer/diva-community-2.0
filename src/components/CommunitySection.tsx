import { motion } from "framer-motion";
import divaWomenSun from "@/assets/diva-women-sun-plum.png";
import { useLang } from "@/lib/lang";

const paragraphs: [sk: string, en: string][] = [
  ["Milé Divy.", "Dear Divas."],
  ["Tento projekt vo mne žil už dávno. Vždy som vedela, že raz chcem vytvoriť niečo pre ženy. Miesto, kde sa budeme cítiť silné, slobodné a prepojené.", "This project has been living inside me for a long time. I always knew that one day I wanted to create something for women. A place where we'd feel strong, free and connected."],
  ["Kedysi som si myslela, že najprv musím mať ten svoj príbeh za sebou. Všetko spracované, vyriešené, a až potom môžem niečo odovzdávať ďalej.", "I used to think I first had to have my own story behind me. Everything processed, figured out, and only then could I pass something on."],
  ["No haha.", "Well, haha."],
  ["Ono to tak nefunguje. Stále niečo riešim. Stále sa učím. A niekedy sa úplne stratím a potom sa zase pomaličky hľadám.", "That's not how it works. I'm still working things out. Still learning. And sometimes I get completely lost, and then slowly find my way back again."],
  ["Učím sa cez materstvo, cez vzťah, cez svoje telo. Roky som išla len VÝKON a až teraz sa učím počúvať, čo mi telo vlastne hovorí.", "I'm learning through motherhood, through my relationship, through my body. For years it was all about PERFORMANCE, and only now am I learning to listen to what my body is actually telling me."],
  ["A popri tom všetkom vzniká Diva.", "And somewhere in the middle of all that, Diva is growing."],
  ["Nie preto, že už mám všetky odpovede. Ale práve preto, že ich stále hľadám. A nechcem ich hľadať sama.", "Not because I already have all the answers. But exactly because I'm still looking for them. And I don't want to look for them alone."],
  ["Diva Community pre mňa nie je o tom byť dokonalá, silná a mať všetko pod kontrolou. Je o nás. O ženách, ktoré majú svoje obdobia, svoje pády aj svoje návraty k sebe.", "For me, Diva Community isn't about being perfect, strong and having everything under control. It's about us. About women who have their seasons, their falls and their ways back to themselves."],
  ["A toto je podľa mňa tá najväčšia sila. Že v tom nemusíme byť samé.", "And to me, that's the greatest strength of all. That we don't have to go through it alone."],
  ["Diva rastie spolu so mnou. Ako sa mením ja, mení sa aj ona. A možno práve preto to celé má zmysel.", "Diva is growing right alongside me. As I change, she changes too. And maybe that's exactly why it all means something."],
  ["Tak poďte do toho so mnou.", "So come join me."],
];

const CommunitySection = () => {
  const { l } = useLang();
  return (
    <section id="community" className="section-padding bg-background overflow-x-clip">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 xl:grid-cols-2 xl:gap-16 items-center">
          {/* On phones and tablets the illustration comes after the text, so the top of the page isn't crowded under the hero photo. */}
          <motion.div
            className="order-last xl:order-first"
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
                {l("Buď Diva.", "Be a Diva.")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
