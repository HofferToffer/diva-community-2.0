import {
  Soup,
  Egg,
  Beef,
  Wheat,
  Fish,
  Milk,
  GlassWater,
  Footprints,
  Wind,
  HeartPulse,
  Stethoscope,
  Bath,
  Baby,
  HeartHandshake,
  Moon,
  NotebookPen,
  ShieldCheck,
} from "lucide-react";
import type { CycleTip } from "./cycle";

function daysBetween(a: Date, b: Date): number {
  const start = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const end = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export type PostpartumInfo = {
  week: number;
  message: string;
  symptoms: string[];
  archetype: string;
  keywords: string;
  mantra: string;
};

type WeekBand = {
  maxWeek: number;
  message: string;
  symptoms: string[];
  /** The energetic/inner layer alongside the physical facts above — not medical, not religious, just the deeper meaning of this week. */
  archetype: string;
  keywords: string;
  mantra: string;
};

/**
 * Week-by-week postpartum content, grounded in Cleveland Clinic / ACOG / Merck
 * Manual guidance on lochia staging, uterine involution, engorgement, baby
 * blues vs. PPD timing, and pelvic floor recovery — but written warm, not
 * clinical. Šestonedelie ("the sixth week") is the common name, but recovery
 * — and often breastfeeding — runs well past six weeks.
 */
const WEEK_BANDS: WeekBand[] = [
  {
    maxWeek: 1,
    message:
      "Prvý týždeň je o prežití a spoznávaní sa navzájom. Krvácanie je teraz najsilnejšie a tmavočervené, sťahy maternice (najviac cítiť pri dojčení) sú najintenzívnejšie — takto sa maternica vracia k svojej veľkosti. Okolo 3.–5. dňa príde mnohým ženám vlna plaču či precitlivenosti — hovorí sa tomu baby blues a do dvoch týždňov to zvyčajne samo odznie. Ty a tvoje bábätko ste teraz predovšetkým nová rodina — máš právo hneď na začiatku určiť si vlastné hranice: koho a kedy prijať na návštevu, čo práve potrebuješ, kedy chceš byť len vy dvaja. Nič iné nemá prednosť pred týmto vzťahom.",
    symptoms: [
      "silné krvácanie (tmavočervené)",
      "kŕče/sťahy maternice, najmä pri dojčení",
      "napäté, citlivé prsia okolo 3.–5. dňa",
      "extrémna únava a nočné potenie",
      "citlivosť hrádze alebo jazvy po cisárskom reze",
      "možný baby blues (plač, precitlivenosť)",
    ],
    archetype: "Novorodená matka",
    keywords: "prežitie • spoznávanie • krehkosť • nový začiatok",
    mantra: "Aj ja sa práve rodím.",
  },
  {
    maxWeek: 2,
    message:
      "Krvácanie sa mení na svetlejšie, ružovkasté až hnedasté. Kŕče aj napätie v prsiach by mali postupne slabnúť. Baby blues by mal do konca tohto týždňa doznievať — ak smútok alebo úzkosť naopak silnejú, je čas povedať si o pomoc, nie to len vydržať.",
    symptoms: ["svetlejšie, ružovkasté krvácanie", "slabnúce kŕče", "pretrvávajúca únava", "možné nočné potenie"],
    archetype: "Krehká",
    keywords: "dôvera • jemnosť • citlivosť • starostlivosť",
    mantra: "Učím sa dôverovať svojmu telu aj sebe.",
  },
  {
    maxWeek: 3,
    message:
      "Krvácanie je už len slabé, žltkasté až biele, a môže sa objavovať už len občas. Toto obdobie je aj najčastejším začiatkom popôrodnej depresie — nie preto, že by si niečo robila zle, ale preto, že telo aj hormóny prechádzajú veľkou zmenou. Ak smútok, úzkosť alebo pocit odpojenia od bábätka trvajú dlhšie než pár dní, neuzatváraj sa do seba — ozvi sa niekomu, komu dôveruješ (kamarátke, DIVA KRUHU) aj gynekológovi alebo pediatrovi. Pomoc funguje a nemusíš na ňu čakať do šestotýždňovej prehliadky, ani ju zvládať sama.",
    symptoms: ["slabé, svetlé krvácanie", "pretrvávajúca únava", "citlivejšia nálada — sleduj, ako sa cítiš"],
    archetype: "Tá vo hmle",
    keywords: "tma • podpora • pravda • nie si sama",
    mantra: "Nie som sama, aj keď sa tak cítim.",
  },
  {
    maxWeek: 4,
    message:
      "Maternica sa blíži k pôvodnej veľkosti a jazva — po pôrode aj po cisárskom reze — by mala byť citeľne pokojnejšia. Niektorým ženám okolo tohto obdobia začnú viac vypadávať vlasy. Je to normálna reakcia tela na pokles hormónov, nie niečo, čo si spravila zle.",
    symptoms: ["vypadávanie vlasov (môže začať)", "ustupujúca citlivosť jazvy", "stále prítomná únava"],
    archetype: "Hojaca sa",
    keywords: "hojenie • trpezlivosť • telo • obnova",
    mantra: "Moje telo si pamätá, ako sa uzdraviť.",
  },
  {
    maxWeek: 6,
    message:
      "Krvácanie by malo v tomto období ustať. Pomaly sa schyľuje k šestotýždňovej prehliadke u gynekologičky — dobrá príležitosť prebrať s ňou všetko, čo cítiš, aj fyzicky, aj psychicky. Svaly panvového dna sú stále citeľne slabšie než pred tehotenstvom — cvičenia na ich posilnenie majú teraz naozaj zmysel, nie je to len formalita.",
    symptoms: ["krvácanie by malo končiť", "slabšie panvové dno", "pri cisárskom reze: väčšinou povolenie na bežné aktivity"],
    archetype: "Tá, čo sa vracia k sebe",
    keywords: "návrat • sila • hranice • základ",
    mantra: "Pomaly sa vraciam domov — do seba.",
  },
  {
    maxWeek: 8,
    message:
      "Väčšina žien je už bez krvácania a kŕče sú preč. Ak nedojčíš, môže sa vrátiť menštruácia; ak dojčíš výlučne, môže vynechávať aj mesiace. Pozor — plodnosť sa vie vrátiť ešte predtým, než príde prvá menštruácia. Na šestotýždňovej prehliadke si možno dostala aj lekárske povolenie na intímny život — ale to je len povolenie, nie povinnosť. Je úplne v poriadku, ak sa naň ešte necítiš pripravená, či už teraz, o mesiac, alebo až neskôr. Ak dojčíš, nižšia chuť na sex nie je len v tvojej hlave — dojčenie zvyšuje prolaktín, ktorý libido prirodzene tlmí. Príroda to takto nastavila zámerne, aby telo teraz nerátalo s ďalším tehotenstvom. Telo aj hlava si na to berú svoj čas, nie kalendár.",
    symptoms: ["možný návrat menštruácie (ak nedojčíš)", "citeľnejší nárast energie", "únava zo spánkového deficitu pretrváva"],
    archetype: "Prebúdzajúca sa sila",
    keywords: "energia • prebúdzanie • telo • sila",
    mantra: "Cítim, ako sa mi vracia sila.",
  },
  {
    maxWeek: 12,
    message:
      "Fyzické hojenie je u väčšiny žien už hotové. Vypadávanie vlasov môže byť teraz na vrchole — vydrž, do roka sa to upraví. Sila jadra a panvového dna sa stále postupne vracia, najmä ak sa im venuješ pravidelne.",
    symptoms: ["vypadávanie vlasov môže vrcholiť", "postupne sa vracajúca sila brucha a panvového dna"],
    archetype: "Tá, čo integruje",
    keywords: "integrácia • celistvosť • rast • premena",
    mantra: "Spájam, kým som bola, s tým, kým som teraz.",
  },
];

const FALLBACK: WeekBand = {
  maxWeek: Infinity,
  message:
    "Si už niekoľko mesiacov na tejto novej ceste. Vlasy sa do roka upravia, jazva dozrieva mesiace, panvové dno aj jadro sa posilňujú ďalej pri pravidelnom cvičení. Hojenie, hormóny aj puto s dieťaťom si idú vlastným tempom — dôveruj mu, nie je to preteky.",
  symptoms: ["vlasy sa postupne upravujú", "energia a libido sa vracajú individuálnym tempom"],
  archetype: "Matka a žena zároveň",
  keywords: "rovnováha • celistvosť • matka aj žena • vlastné tempo",
  mantra: "Môžem byť matka aj sama sebou naraz.",
};

/** Soft background fill + dot color for the postpartum tip grid — warm and healing, distinct from the cycle-phase palette. */
export const POSTPARTUM_TIP_COLOR: { fill: string; dot: string } = {
  fill: "hsl(12, 38%, 48%, 0.14)",
  dot: "hsl(12, 38%, 48%)",
};

/**
 * Food, movement and rituals for šestonedelie — grounded in widely-shared
 * postpartum guidance (iron/protein/fiber for healing and the common
 * post-birth constipation, hydration for milk supply, pelvic floor
 * physiotherapy, calendula/chamomile sitz baths for perineal comfort).
 * General wellness tips, not medical prescriptions — always alongside,
 * never instead of, guidance from your own gynecologist/pediatrician.
 */
export const POSTPARTUM_TIPS: CycleTip[] = [
  { label: "Teplá, výživná polievka", category: "eat", icon: Soup },
  { label: "Bielkoviny na hojenie", category: "eat", icon: Egg },
  { label: "Železo — červené mäso, špenát", category: "eat", icon: Beef },
  { label: "Vláknina proti zápche", category: "eat", icon: Wheat },
  { label: "Mastné ryby (omega-3)", category: "eat", icon: Fish },
  { label: "Vápnik pri dojčení", category: "eat", icon: Milk },
  { label: "Veľa vody, najmä pri dojčení", category: "eat", icon: GlassWater },
  { label: "Krátke, pomalé prechádzky", category: "move", icon: Footprints },
  { label: "Dychové cvičenia s bránicou", category: "move", icon: Wind },
  { label: "Jemné cvičenia na panvové dno", category: "move", icon: HeartPulse },
  { label: "Fyzioterapeut na panvové dno", category: "move", icon: Stethoscope },
  { label: "Sedací kúpeľ s harmančekom a nechtíkom", category: "do", icon: Bath },
  { label: "Bonding s bábätkom", category: "do", icon: Baby },
  { label: "Nechaj si pomáhať", category: "do", icon: HeartHandshake },
  { label: "Spávaj, keď spí bábätko", category: "do", icon: Moon },
  { label: "Zapíš si pôrodný príbeh", category: "do", icon: NotebookPen },
  { label: "Prehliadka po šestonedelí", category: "do", icon: ShieldCheck },
];

/** Same teamwork framing as PARTNER_SUPPORT_NOTE_PREGNANCY, adapted for šestonedelie. */
export const PARTNER_SUPPORT_NOTE_POSTPARTUM =
  "Šestonedelie nie je skúška, ktorú máš vydržať sama — je to aj čas, keď sa učí byť rodičom aj partner. Nech prevezme, čo sa dá — domácnosť, nočné budenie, návštevy — aby si sa ty mohla hojiť a spoznávať bábätko. Ste nová rodina a toto je spoločná práca od prvého dňa, nie niečo, čo musí zvládnuť len jedna z vás.";

export function getPostpartumInfo(sinceDate: string, today = new Date()): PostpartumInfo {
  const since = new Date(sinceDate);
  const days = Math.max(daysBetween(since, today), 0);
  const week = Math.floor(days / 7) + 1;

  const band = WEEK_BANDS.find((b) => week <= b.maxWeek) ?? FALLBACK;
  return {
    week,
    message: band.message,
    symptoms: band.symptoms,
    archetype: band.archetype,
    keywords: band.keywords,
    mantra: band.mantra,
  };
}
