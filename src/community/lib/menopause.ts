import {
  Bed,
  Dumbbell,
  Egg,
  Footprints,
  GlassWater,
  Leaf,
  MessageCircle,
  Milk,
  PersonStanding,
  Snowflake,
  Sprout,
  Waves,
} from "lucide-react";
import type { CycleTip } from "@/community/lib/cycle";

/**
 * Tips for menopause, in the same do/eat/move shape as the cycle-phase tips.
 * Sourced from Cleveland Clinic, Mayo Clinic and Healthline guidance on
 * menopause nutrition and exercise (protein + resistance training for muscle
 * and bone loss, iron and hydration against fatigue/brain fog, phytoestrogens
 * and calcium/vitamin D for symptom and bone support).
 */
export type MenopauseStage = {
  key: string;
  name: string;
  ageRange: string;
  message: string;
  symptoms: string[];
  /** The energetic/inner layer alongside the physical facts above — not medical, not religious, just the deeper meaning of the stage. */
  archetype: string;
  keywords: string;
  mantra: string;
};

/**
 * The menopause transition isn't one state — it has real, distinct stages.
 * Sourced from Mayo Clinic, Cleveland Clinic, NAMS/The Menopause Society
 * (STRAW+10 staging), and ACOG. There's no clean "day 1" the way pregnancy
 * or postpartum has, so this is shown as a guide to read through rather than
 * an auto-detected "you are here" — a woman can recognize her own stage.
 */
export const MENOPAUSE_STAGES: MenopauseStage[] = [
  {
    key: "perimenopauza_skora",
    name: "Skorá perimenopauza",
    ageRange: "zvyčajne polovica 40-tky (priemer okolo 47 rokov)",
    message:
      "Prvý signál je väčšinou zmena dĺžky cyklu — o týždeň a viac, niekedy cyklus aj vynechá. Návaly, zmeny nálady či spánku sa môžu objaviť už teraz, hoci ešte nie naplno.",
    symptoms: [
      "nepravidelnejší cyklus (zmena o 7 a viac dní)",
      "prvé návaly horúčosti",
      "zmeny nálady alebo spánku",
      "„hmla v hlave“ — problémy so sústredením (často prehliadaný signál)",
    ],
    archetype: "Prebúdzajúca sa",
    keywords: "prvé signály • všímavosť • citlivosť • nový začiatok",
    mantra: "Začínam si všímať zmenu.",
  },
  {
    key: "perimenopauza_neskora",
    name: "Neskorá perimenopauza",
    ageRange: "zvyčajne pár rokov pred poslednou menštruáciou",
    message:
      "Cykly sú už zjavne nepravidelné, s medzerami 60 a viac dní. Návaly, nočné potenie, poruchy spánku aj výkyvy nálady bývajú práve teraz najintenzívnejšie — hormóny teraz kolíšu najviac, tesne pred tým, než menštruácia úplne ustane.",
    symptoms: [
      "výrazne nepravidelný cyklus",
      "intenzívnejšie návaly a nočné potenie",
      "poruchy spánku",
      "podráždenosť, plačlivosť alebo úzkosť",
    ],
    archetype: "Tá, čo sa premieňa",
    keywords: "pustenie • intenzita • hĺbka • očista",
    mantra: "Nechávam odísť, čo už neslúži.",
  },
  {
    key: "menopauza",
    name: "Menopauza",
    ageRange: "v priemere okolo 52 rokov",
    message:
      "Menopauza nie je obdobie, ale jeden bod v čase — deň, ktorý sa spätne potvrdí, keď máš za sebou 12 mesiacov bez menštruácie. Vaječníky už prestali uvoľňovať vajíčka aj tvoriť estrogén v predošlom množstve. To, čo teraz cítiš, je zvyčajne pokračovanie toho, čo začalo v neskorej perimenopauze, nie niečo úplne nové.",
    symptoms: ["návaly a nočné potenie môžu ešte pretrvávať", "poruchy spánku a nálady doznievajú pomaly"],
    archetype: "Žena na prahu",
    keywords: "prah • iniciácia • ticho • nový začiatok",
    mantra: "Prekračujem.",
  },
  {
    key: "postmenopauza",
    name: "Postmenopauza",
    ageRange: "od potvrdenia menopauzy po zvyšok života",
    message:
      "Návaly a nočné potenie sa časom väčšinou zmierňujú — v priemere asi 4,5 roka po poslednej menštruácii, hoci asi tretina žien ich cíti ešte aj 10 rokov neskôr. Iné zmeny si zaslúžia pozornosť, nie čakanie: úbytok kostnej hmoty sa práve teraz najviac zrýchľuje a kardiovaskulárne riziko sa v priebehu pár rokov vyrovná mužom v rovnakom veku. Suchosť, nepohodlie pri sexe alebo časté nutkanie na močenie tiež samy neodznejú — ale dajú sa dobre liečiť, stačí sa o tom porozprávať s lekárom.",
    symptoms: [
      "návaly postupne slabnú (priemerne 4–5 rokov, u niektorých dlhšie)",
      "zrýchlený úbytok kostnej hmoty — pozor na pohyb a vápnik",
      "zvýšené kardiovaskulárne riziko",
      "suchosť či nepohodlie, ktoré samo neustúpi — dá sa liečiť",
    ],
    archetype: "Slobodná kráľovná",
    keywords: "sloboda • múdrosť • suverenita • celistvosť",
    mantra: "Som slobodná byť sama sebou.",
  },
];

export const MENOPAUSE_TIPS: CycleTip[] = [
  { label: "Bielkoviny pri každom jedle", category: "eat", icon: Egg },
  { label: "Vápnik a vitamín D", category: "eat", icon: Milk },
  { label: "Potraviny bohaté na železo", category: "eat", icon: Leaf },
  { label: "Sójové a strukovinové jedlá", category: "eat", icon: Sprout },
  { label: "Dostatok vody", category: "eat", icon: GlassWater },
  { label: "Silový tréning", category: "move", icon: Dumbbell },
  { label: "Rezká chôdza", category: "move", icon: Footprints },
  { label: "Joga a strečing", category: "move", icon: PersonStanding },
  { label: "Cvičenia na panvové dno", category: "move", icon: Waves },
  { label: "Chladenie pri návaloch", category: "do", icon: Snowflake },
  { label: "Pravidelný spánkový režim", category: "do", icon: Bed },
  { label: "Hovor o tom nahlas", category: "do", icon: MessageCircle },
];
