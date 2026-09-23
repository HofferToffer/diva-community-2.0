import type { ComponentType, SVGProps } from "react";
import {
  Apple,
  Banana,
  Bean,
  Carrot,
  Cherry,
  Citrus,
  LeafyGreen,
  Sprout,
  Wheat,
  Pill,
  Milk,
  Egg,
  Fish,
  GlassWater,
  UtensilsCrossed,
  Footprints,
  PersonStanding,
  Waves,
  HeartPulse,
  MessageCircle,
  NotebookPen,
  HeartHandshake,
  Bed,
  Home,
  Droplets,
  Hand,
  Backpack,
  Wind,
} from "lucide-react";
import { Avocado, Mango, Pineapple, Pumpkin, Strawberry, Tomato, WatermelonSlice } from "@/community/components/FruitIcons";
import type { CycleTip } from "./cycle";

export type WeekIcon = ComponentType<SVGProps<SVGSVGElement>>;

const GESTATION_DAYS = 280; // 40 weeks, counted from the last menstrual period to the due date

function daysBetween(a: Date, b: Date): number {
  const start = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const end = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export type PregnancyInfo = {
  week: number;
  trimester: 1 | 2 | 3;
  daysUntilDue: number;
  soulNote: string;
  message: string;
  symptoms: string[];
};

type WeekBand = { maxWeek: number; message: string; symptoms: string[] };

/**
 * Week-by-week pregnancy content (LMP-based dating), grounded in Mayo
 * Clinic / Cleveland Clinic / ACOG guidance on fetal development and typical
 * maternal symptoms per window — written warm, not clinical.
 */
const PREGNANCY_WEEK_BANDS: WeekBand[] = [
  {
    maxWeek: 5,
    message:
      "Bunky sa práve udomácnili v maternici a delia sa na vrstvy, z ktorých vzniknú všetky orgány. Nervová trubica — základ mozgu a miechy — sa začína uzatvárať a srdiečko, zatiaľ len ako drobná trubička, do konca tohto obdobia prvýkrát udrie.",
    symptoms: ["citlivé, napäté prsia", "únava", "mierne kŕče alebo špinenie (uhniezdenie)", "zvýšený čuch", "výkyvy nálady"],
  },
  {
    maxWeek: 7,
    message:
      "Srdiečko teraz bije pravidelne. Formujú sa základy končatín aj tváre. Toto obdobie často prináša prvú návštevu u gynekológa.",
    symptoms: ["ranné nevoľnosti (kedykoľvek počas dňa)", "silnejšia únava", "časté močenie", "averzie k jedlu"],
  },
  {
    maxWeek: 9,
    message:
      "Embryo sa okolo tohto obdobia oficiálne stáva plodom. Všetky hlavné orgány — srdce, mozog, obličky, pečeň — sa už začali formovať, rastú ruky aj nohy.",
    symptoms: ["nevoľnosť a únava zvyčajne vrcholia", "nadúvanie", "mierne kŕče, ako sa maternica zväčšuje"],
  },
  {
    maxWeek: 11,
    message:
      "Prstíky na rukách aj nohách sa oddeľujú a začínajú rásť nechtíky. Kosti sa začínajú tvrdnúť, bábätko už dokáže zovrieť pinku, hoci to ešte necítiš.",
    symptoms: ["nevoľnosť sa u mnohých začína zmierňovať", "mierne bolesti hlavy", "zvýšený výtok", "možno už badateľné bruško"],
  },
  {
    maxWeek: 13,
    message:
      "Bábätko sa učí prehĺtať a cmúľať, tvoria sa hlasivky, obličky produkujú moč. Riziko potratu po tomto období výrazne klesá, čo mnohým ženám prináša úľavu — a zvyčajne sa robí aj skríning prvého trimestra.",
    symptoms: ["nevoľnosť ustupuje u väčšiny žien", "energia sa postupne vracia"],
  },
  {
    maxWeek: 16,
    message:
      "Bábätko dokáže robiť grimasy, rastú mu vlásky a obočie, viac sa hýbe (ešte to necítiš). Mnohým ženám sa teraz vracia energia — hovorí sa tomu druhý trimester nabudenia.",
    symptoms: ["bolesti v slabinách pri prudších pohyboch", "menej nevoľnosti, viac energie", "upchatý nos, citlivé ďasná"],
  },
  {
    maxWeek: 20,
    message:
      "Okolo tohto obdobia (pri prvom bábätku často až ku koncu) prvýkrát pocítiš pohyby. Bábätko sa pokrýva ochrannou vrstvou a do 20. týždňa váži približne pol kila. Robí sa aj veľký anatomický ultrazvuk.",
    symptoms: ["prvé pohyby bábätka", "bolesti v slabinách pokračujú", "tmavšia linea nigra na brušku", "prvé Braxtonove kontrakcie (nebolestivé sťahovanie)"],
  },
  {
    maxWeek: 24,
    message:
      "Mozog rýchlo rastie, pľúca začínajú tvoriť látku potrebnú na dýchanie, hoci ešte nezrelú. Okolo tohto obdobia sa dosahuje teoretická hranica životaschopnosti mimo tela — vzdialená, ale odteraz sleduj aj pravidelnosť pohybov bábätka.",
    symptoms: ["výraznejšie Braxtonove kontrakcie", "bolesti chrbta", "nočné kŕče v lýtkach", "mierne opuchy nôh"],
  },
  {
    maxWeek: 27,
    message:
      "Očká sa po mesiacoch zatvorenia znova otvárajú a bábätko reaguje na svetlo aj zvuk. Rýchlo pribúda na váhe. Zvyčajne teraz príde na rad test na tehotenskú cukrovku.",
    symptoms: ["pálenie záhy", "bolesti chrbta", "možné hemoroidy", "únava sa môže vrátiť"],
  },
  {
    maxWeek: 31,
    message:
      "Vstupuješ do tretieho trimestra. Bábätko má teraz pravidelné cykly spánku a bdenia, mozog vytvára viditeľné záhyby, nacvičuje dýchanie. Prehliadky teraz bývajú každé dva týždne.",
    symptoms: ["dýchavičnosť (maternica tlačí na pľúca)", "opuchy členkov a nôh", "možné mravčenie v rukách", "problémy so spánkom"],
  },
  {
    maxWeek: 35,
    message:
      "Bábätko priberá tuk, kosti sú sformované, ale stále mäkké — lebka zostáva mäkká kvôli pôrodu. Väčšina bábätiek sa teraz otočí hlavičkou dole. Blíži sa test na streptokok skupiny B.",
    symptoms: ["výraznejšia bolesť chrbta a panvy (uvoľnené väzy)", "pálenie záhy môže vrcholiť", "sťažené spanie", "silnejšie Braxtonove kontrakcie"],
  },
  {
    maxWeek: 38,
    message:
      "Bábätko sa blíži k termínu, stráca ochlpenie a pripravuje si reflexy na pôrod. Hlavička sa často zasadí hlbšie do panvy, čo môže uľaviť dýchaniu, ale pridá tlak dole.",
    symptoms: ["ľahšie dýchanie, ale viac tlaku v panve", "kačacia chôdza", "zvýšený výtok", "silnejšie, častejšie Braxtonove kontrakcie", "možný pud hniezdenia"],
  },
];

const PREGNANCY_FALLBACK: WeekBand = {
  maxWeek: Infinity,
  message:
    "Bábätko je už donosené — orgány sú zrelé, telo pokračuje v drobnom priberaní a nacvičuje dýchanie aj prehĺtanie. Teraz je čas sledovať vlastné telo a signály blížiaceho sa pôrodu.",
  symptoms: ["silné Braxtonove kontrakcie", "tlak v panve", "možná strata hlienovej zátky", "vlny energie striedané únavou"],
};

/** Computes the current pregnancy week and due date from the first day of the last menstrual period. */
export function getPregnancyInfo(lastPeriodDate: string, today = new Date()): PregnancyInfo {
  const lmp = new Date(lastPeriodDate);
  const dueDate = new Date(lmp);
  dueDate.setDate(dueDate.getDate() + GESTATION_DAYS);

  const daysPregnant = Math.min(Math.max(daysBetween(lmp, today), 0), GESTATION_DAYS + 14);
  const week = Math.min(Math.max(Math.floor(daysPregnant / 7) + 1, 1), 42);
  const trimester: 1 | 2 | 3 = week <= 13 ? 1 : week <= 27 ? 2 : 3;
  const daysUntilDue = daysBetween(today, dueDate);
  const band = PREGNANCY_WEEK_BANDS.find((b) => week <= b.maxWeek) ?? PREGNANCY_FALLBACK;
  return {
    week,
    trimester,
    daysUntilDue,
    soulNote: TRIMESTER_SOUL_NOTE[trimester],
    message: band.message,
    symptoms: band.symptoms,
  };
}

export const TRIMESTER_LABEL: Record<1 | 2 | 3, string> = {
  1: "1. trimester",
  2: "2. trimester",
  3: "3. trimester",
};

const TRIMESTER_SOUL_NOTE: Record<1 | 2 | 3, string> = {
  1: "Nový život rastie potichu vo vnútri — dôveruj tomu, čo ešte nevidíš.",
  2: "Cítiš prvé pohyby a spojenie sa prehlbuje — telo aj duša sa spolu učia byť dvoma.",
  3: "Blížite sa k veľkému stretnutiu. Tvoje telo vie, čo robiť — dôveruj jeho múdrosti.",
};

/**
 * The energetic/inner layer for each trimester, in the same shape as
 * CYCLE_PHASE_ARCHETYPE — the mantra reuses TRIMESTER_SOUL_NOTE, already
 * shown elsewhere, so this just adds the archetype name and keywords beside it.
 */
export const PREGNANCY_TRIMESTER_ARCHETYPE: Record<1 | 2 | 3, { archetype: string; keywords: string }> = {
  1: { archetype: "Strážkyňa tajomstva", keywords: "tajomstvo • dôvera • krehkosť • nový začiatok" },
  2: { archetype: "Žiariaca", keywords: "spojenie • pohyb • energia • dôvera" },
  3: { archetype: "Plná mesiaca", keywords: "pripravenosť • sila • dôvera • telo" },
};

/** Soft background fill + dot color for the pregnancy tip grid. */
export const PREGNANCY_TIP_COLOR: { fill: string; dot: string } = {
  fill: "hsl(140, 18%, 42%, 0.12)",
  dot: "hsl(140, 18%, 42%)",
};

/** Food, movement and rituals for pregnancy in general — safe across all three trimesters. */
export const PREGNANCY_TIPS: CycleTip[] = [
  { label: "Kyselina listová a železo", category: "eat", icon: Pill },
  { label: "Vápnik a vitamín D", category: "eat", icon: Milk },
  { label: "Bielkoviny na rast bábätka", category: "eat", icon: Egg },
  { label: "Vláknina proti zápche", category: "eat", icon: Wheat },
  { label: "Omega-3 pre vývoj mozgu", category: "eat", icon: Fish },
  { label: "Veľa vody", category: "eat", icon: GlassWater },
  { label: "Menšie porcie častejšie", category: "eat", icon: UtensilsCrossed },
  { label: "Prechádzky na čerstvom vzduchu", category: "move", icon: Footprints },
  { label: "Tehotenská joga", category: "move", icon: PersonStanding },
  { label: "Plávanie", category: "move", icon: Waves },
  { label: "Cvičenia na panvové dno", category: "move", icon: HeartPulse },
  { label: "Rozprávaj sa s bábätkom", category: "do", icon: MessageCircle },
  { label: "Píš si tehotenský denník", category: "do", icon: NotebookPen },
  { label: "Zapoj partnera do príprav", category: "do", icon: HeartHandshake },
  { label: "Dopraj si oddych", category: "do", icon: Bed },
  { label: "Priprav detskú izbičku", category: "do", icon: Home },
];

/**
 * From roughly 34.-36. týždňa — birth-prep rituals distinct from the rest of
 * pregnancy. Raspberry leaf tea has some (modest, low-to-moderate quality)
 * evidence for shortening the second stage of labor when started gradually
 * from ~32-34 weeks; lady's mantle (alchemilka) is a traditional pairing but
 * currently lacks pregnancy safety data, so it's named only as a caution,
 * never recommended outright. Perineal massage from ~34-35 weeks has
 * Cochrane-level support for reducing perineal trauma.
 */
export const PREGNANCY_LATE_TIPS: CycleTip[] = [
  { label: "Malinové listy (čaj)", category: "eat", icon: Droplets },
  { label: "Masírovanie hrádze, ak sa cítiš pripravená", category: "do", icon: Hand },
  { label: "Príprava pôrodnej tašky", category: "do", icon: Backpack },
  { label: "Nacvič si dýchanie na pôrod", category: "move", icon: Wind },
  { label: "Spíš si pôrodný plán", category: "do", icon: NotebookPen },
  { label: "Šetri si silu, oddychuj", category: "do", icon: Bed },
];

export const PREGNANCY_LATE_NOTE =
  "Malinové listy sa v niektorých štúdiách spájajú s kratšou druhou dobou pôrodnou, ak sa pijú postupne od cca 32.-34. týždňa (začni jednou šálkou denne, postupne pridávaj) — dôkazy sú zatiaľ mierne, nie isté, tak to vždy najprv preber so svojou pôrodnou asistentkou alebo gynekologičkou. Alchemilka sa k nim v ľudovej tradícii často pridáva, no pre tehotenstvo pre ňu chýbajú bezpečnostné údaje — radšej ju vynechaj, kým ti ju vyslovene neodporučí tvoja lekárka. Masírovanie hrádze zase má za sebou solídne dôkazy, že od cca 34.-35. týždňa znižuje riziko poranenia pri pôrode — rob ho len vtedy, keď sa na to naozaj cítiš, pokojne aj s partnerom.";

/** Shown in the pregnancy section — the same teamwork framing repeats (adapted) in postpartum. */
export const PARTNER_SUPPORT_NOTE_PREGNANCY =
  "Toto obdobie nie je len tvoje — je aj partnerova cesta. Nech je pri tom s tebou: na prehliadkach, pri príprave pôrodnej tašky, pri masírovaní hrádze, v rozhovoroch o tom, čo cítiš aj čoho sa bojíš. Nie je to skúška, ktorú máš zvládnuť sama — ste nová rodina, ktorá sa to učí spolu, od prvého dňa.";

/** Playful size comparison per pregnancy week, the way most pregnancy calendar apps show it. */
const WEEK_SIZE: Record<number, string> = {
  4: "zrnko maku",
  5: "sezamové semienko",
  6: "šošovica",
  7: "čučoriedka",
  8: "malina",
  9: "čerešňa",
  10: "jahoda",
  11: "fík",
  12: "slivka",
  13: "struk hrášku",
  14: "citrón",
  15: "jablko",
  16: "avokádo",
  17: "cibuľa",
  18: "paprika",
  19: "paradajka",
  20: "banán",
  21: "mrkva",
  22: "malý kokos",
  23: "veľké mango",
  24: "klas kukurice",
  25: "cuketa",
  26: "baklažán",
  27: "karfiol",
  28: "malý ananás",
  29: "tekvica špagetová",
  30: "hlávka kapusty",
  31: "veľký kokos",
  32: "tekvica maslová",
  33: "melón cantaloupe",
  34: "melón medovka",
  35: "malá tekvica",
  36: "hlávka rímskeho šalátu",
  37: "pór",
  38: "malý vodný melón",
  39: "veľký vodný melón",
  40: "malá tekvica na jeseň",
};

export function pregnancyWeekSize(week: number): string | null {
  return WEEK_SIZE[week] ?? null;
}

/** A matching outline icon where one exists, otherwise a generic sprout — always something to show, gently. */
const WEEK_ICON: Partial<Record<number, WeekIcon>> = {
  6: Bean,
  9: Cherry,
  10: Strawberry,
  13: Bean,
  14: Citrus,
  15: Apple,
  16: Avocado,
  19: Tomato,
  20: Banana,
  21: Carrot,
  23: Mango,
  24: Wheat,
  28: Pineapple,
  30: LeafyGreen,
  36: LeafyGreen,
  38: WatermelonSlice,
  39: WatermelonSlice,
  40: Pumpkin,
};

export function pregnancyWeekIcon(week: number): WeekIcon {
  return WEEK_ICON[week] ?? Sprout;
}
