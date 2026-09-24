import type { LucideIcon } from "lucide-react";
import {
  PersonStanding,
  Footprints,
  Feather,
  Bath,
  Bed,
  BookOpen,
  Egg,
  Nut,
  Dumbbell,
  Zap,
  Bike,
  Sparkles,
  Music,
  Users,
  Salad,
  GlassWater,
  Fish,
  HeartHandshake,
  MessageCircle,
  Wheat,
  Moon,
  Waves,
  Milk,
  Timer,
  Sparkle,
  Ear,
  NotebookPen,
  Flower,
  Beef,
  Drumstick,
  Banana,
  Cookie,
  Shell,
  Wine,
  HandHeart,
  Citrus,
} from "lucide-react";

export type CycleInfo = {
  dayOfCycle: number;
  phaseKey: CyclePhaseKey;
  phase: { name: string; description: string };
  subPhase: { key: string; name: string; description: string };
  nextPeriodDate: Date;
  nextOvulationDate: Date;
  daysUntilNextPeriod: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function toDateOnly(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

/**
 * Finer breakdown within each of the 4 broad phases — e.g. early vs. late luteal feel very
 * different (PMS is concentrated at the end), so the summary card shouldn't lump them together.
 * The luteal range is split proportionally to the person's actual cycle length.
 */
function getDetailedSubPhase(dayOfCycle: number, cycleLengthDays: number): { key: string; name: string; description: string } {
  if (dayOfCycle <= 2) {
    return {
      key: "menstruacna_tazke_dni",
      name: "Zima — najhlbšia tma",
      description:
        "Prvé dni bývajú najťažšie, presne ako najkratšie dni roka. Energia je na dne, tak si dovoľ zastaviť sa — teplo, pokoj a nič si nemusíš dokazovať.",
    };
  }
  if (dayOfCycle <= 5) {
    return {
      key: "menstruacna_doznievanie",
      name: "Zima — svetlo sa vracia",
      description:
        "Krvácanie slabne, sila sa pomaly vracia, akoby dni boli zas o čosi dlhšie. Ak máš chuť na pohyb, vyber si krátku prechádzku, no netlač na seba.",
    };
  }
  if (dayOfCycle <= 9) {
    return {
      key: "folikularna_rozbeh",
      name: "Jar — prvé puky",
      description:
        "Hormóny idú hore a hlava sa čistí, akoby zo zeme vyklíčili prvé puky. Skvelý čas naštartovať nové nápady a plány.",
    };
  }
  if (dayOfCycle <= 12) {
    return {
      key: "folikularna_vrchol",
      name: "Jar — plný rozkvet",
      description:
        "Si vo forme — energia, sebadôvera aj výkon rastú tak rýchlo ako jarná zeleň. Telo teraz unesie aj náročnejší tréning.",
    };
  }
  if (dayOfCycle <= 16) {
    return {
      key: "ovulacia",
      name: "Leto — plné slnko",
      description:
        "Si na vrchole cyklu, presne ako slnko v najdlhší deň roka. Energia, sebavedomie aj chuť byť medzi ľuďmi sú najvyššie — čas na osobné rekordy.",
    };
  }

  const length = Math.min(Math.max(Math.round(cycleLengthDays), 21), 40);
  const lutealStart = 17;
  const lutealLength = Math.max(length - lutealStart + 1, 3);
  const third = Math.ceil(lutealLength / 3);

  if (dayOfCycle <= lutealStart + third - 1) {
    return {
      key: "lutealna_stabilna",
      name: "Jeseň — zber úrody",
      description:
        "Progesterón po ovulácii stúpa a telo sa pripravuje na možné tehotenstvo. Energia môže byť ešte celkom dobrá, no postupne sa môže spomaľovať — toto obdobie môže byť vhodné na dokončenie rozbehnutých vecí, kým na to máš silu.",
    };
  }
  if (dayOfCycle <= lutealStart + 2 * third - 1) {
    return {
      key: "lutealna_premenliva",
      name: "Jeseň — vietor sa mení",
      description:
        "Hladiny hormónov sa začínajú meniť, čo môže priniesť výkyvy nálad aj väčšiu citlivosť. Môžeš sa cítiť inak zo dňa na deň — to je bežné. Buď k sebe trpezlivá a na tieto dni si možno neplánuj nič príliš náročné.",
    };
  }
  return {
    key: "lutealna_neskora",
    name: "Jeseň — posledné lístie padá",
    description:
      "Progesterón aj estrogén tesne pred menštruáciou prudko klesajú, čo môže priniesť najnižšiu energiu a najvýraznejšie PMS príznaky tohto cyklu. Môže pomôcť dopriať si pokoj, jemnosť a čo najmenej povinností.",
  };
}

export function getCycleInfo(lastPeriodDate: string, cycleLengthDays: number): CycleInfo | null {
  const last = toDateOnly(new Date(`${lastPeriodDate}T12:00:00`));
  if (Number.isNaN(last.getTime())) return null;
  const length = Math.min(Math.max(Math.round(cycleLengthDays), 21), 40);
  const today = toDateOnly(new Date());

  const daysSince = Math.floor((today.getTime() - last.getTime()) / DAY_MS);
  const dayOfCycle = ((daysSince % length) + length) % length + 1;

  const cyclesAhead = Math.max(1, Math.ceil((daysSince + 1) / length));
  const nextPeriodDate = new Date(last.getTime() + cyclesAhead * length * DAY_MS);
  const nextOvulationDate = new Date(nextPeriodDate.getTime() - 14 * DAY_MS);
  const daysUntilNextPeriod = Math.round((nextPeriodDate.getTime() - today.getTime()) / DAY_MS);

  const phase =
    dayOfCycle <= 5
      ? {
          name: "Menštruačná fáza",
          description:
            "Si vo svojej vnútornej zime. Telo stíchne a pýta si pokoj — ako príroda v januári. Nie je to slabosť, je to múdrosť tela: choď do toho len toľko, koľko cítiš.",
        }
      : dayOfCycle <= 12
        ? {
            name: "Folikulárna fáza",
            description:
              "Vchádzaš do svojej jari. Hormóny sa prebúdzajú, hlava sa čistí a chuť tvoriť rastie s každým dňom — skvelý čas na nové výzvy, silové tréningy a dlhšie behy.",
          }
        : dayOfCycle <= 16
          ? {
              name: "Ovulácia",
              description:
                "Si vo svojom lete. Slnko je najvyššie, energia, sebavedomie aj chuť byť medzi ľuďmi sú na vrchole — čas na osobné rekordy aj aktivity v komunite.",
            }
          : {
              name: "Luteálna fáza",
              description:
                "Vchádzaš do svojej jesene. Energia sa pomaly stišuje a telo ťa pozýva k zberu úrody — dokonči, čo si začala, a zvoľ jemnejší pohyb: jogu, prechádzky, regeneráciu.",
            };

  const phaseKey: CyclePhaseKey =
    dayOfCycle <= 5 ? "menstruacna" : dayOfCycle <= 12 ? "folikularna" : dayOfCycle <= 16 ? "ovulacia" : "lutealna";

  const subPhase = getDetailedSubPhase(dayOfCycle, length);

  return { dayOfCycle, phaseKey, phase, subPhase, nextPeriodDate, nextOvulationDate, daysUntilNextPeriod };
}

export type CyclePhaseKey = "menstruacna" | "folikularna" | "ovulacia" | "lutealna";

export const CYCLE_PHASES: Record<CyclePhaseKey, { name: string }> = {
  menstruacna: { name: "Menštruačná fáza" },
  folikularna: { name: "Folikulárna fáza" },
  ovulacia: { name: "Ovulácia" },
  lutealna: { name: "Luteálna fáza" },
};

/** Soft background fill + a stronger dot/marker color per phase, shared by the chart and calendar — same hues as the app-wide phase theme in index.css. */
export const CYCLE_PHASE_COLORS: Record<CyclePhaseKey, { fill: string; dot: string }> = {
  menstruacna: { fill: "hsl(335, 35%, 40%, 0.14)", dot: "hsl(335, 35%, 40%)" },
  folikularna: { fill: "hsl(140, 18%, 42%, 0.12)", dot: "hsl(140, 18%, 42%)" },
  ovulacia: { fill: "hsl(32, 45%, 46%, 0.18)", dot: "hsl(32, 45%, 46%)" },
  lutealna: { fill: "hsl(20, 25%, 30%, 0.12)", dot: "hsl(20, 25%, 30%)" },
};

/** A near-invisible wash over the whole "Prehľad cyklu" card — the card itself stays the same, this just very gently hints which phase you're in. */
export const CYCLE_PHASE_CARD_TINT: Record<CyclePhaseKey, string> = {
  menstruacna: "hsl(335, 35%, 40%, 0.06)",
  folikularna: "hsl(140, 18%, 42%, 0.06)",
  ovulacia: "hsl(32, 45%, 46%, 0.07)",
  lutealna: "hsl(20, 25%, 30%, 0.05)",
};

/**
 * The four archetypal energies of the cycle (Panna/Milenka/Kráľovná/Starena
 * framework) — a distinct set from the life-stage archetypes (Dievča/Žena/
 * Matka/Múdra žena) so the two never get confused with each other.
 */
export const CYCLE_PHASE_ARCHETYPE: Record<CyclePhaseKey, { archetype: string; keywords: string; mantra: string }> = {
  menstruacna: { archetype: "Starena", keywords: "vnútro • odpočinok • intuícia • pustenie", mantra: "Som vo vnútri." },
  folikularna: { archetype: "Dievča", keywords: "novosť • zvedavosť • tvorivosť • hravosť", mantra: "Som na začiatku." },
  ovulacia: { archetype: "Milenka", keywords: "žiarenie • spojenie • príťažlivosť • energia", mantra: "Som vonku." },
  lutealna: { archetype: "Kráľovná", keywords: "hranice • sila • pravda • dokončenie", mantra: "Vraciam sa k sebe." },
};

/**
 * The same 4 phases, framed as the seasons of the year — a second, natural-world
 * lens on the same energy as the archetype above (Zima↔Starena, Jar↔Dievča,
 * Leto↔Milenka, Jeseň↔Kráľovná), for the short "season tag" shown beside it.
 */
export const CYCLE_PHASE_SEASON: Record<CyclePhaseKey, { season: string; tagline: string }> = {
  menstruacna: { season: "Zima", tagline: "Vnútorná zima cyklu — čas pustiť a stíchnuť." },
  folikularna: { season: "Jar", tagline: "Vnútorná jar cyklu — čas klíčiť a začínať." },
  ovulacia: { season: "Leto", tagline: "Vnútorné leto cyklu — čas žiariť a spájať sa." },
  lutealna: { season: "Jeseň", tagline: "Vnútorná jeseň cyklu — čas zberu a spomaľovania." },
};

export type CycleTipCategory = "do" | "eat" | "move";

export type CycleTip = { label: string; category: CycleTipCategory; icon: LucideIcon; detail?: string };

export const CYCLE_TIP_CATEGORIES: Record<CycleTipCategory, string> = {
  do: "Rituály",
  eat: "Jedlo",
  move: "Pohyb",
};

/** Detailed, icon-tagged tips per phase — food, movement and rituals to browse like a tip grid. */
export const CYCLE_PHASE_TIPS: Record<CyclePhaseKey, CycleTip[]> = {
  menstruacna: [
    { label: "Železo", category: "eat", icon: Beef, detail: "Môže podporiť doplnenie železa — tmavá listová zelenina, sušené marhule a figy, chudé červené mäso, šošovica, tofu, tekvicové semienka." },
    { label: "Vitamín C", category: "eat", icon: Citrus, detail: "Môže podporiť vstrebávanie železa z rastlinných zdrojov — citrusy, paprika, paradajky, listová zelenina." },
    { label: "Vitamín D", category: "eat", icon: Sun, detail: "Mastné ryby, vaječné žĺtky, obohatené rastlinné mlieka a cereálie, prípadne 10 mcg denne ako doplnok — môže podporiť zdravie kostí a celkovú pohodu." },
    { label: "Horčík", category: "eat", icon: Cookie, detail: "Môže zmierniť PMS a dopriať pokoj — horká čokoláda, tmavá listová zelenina, mandle, avokádo." },
    { label: "Protizápalové potraviny", category: "eat", icon: Salad, detail: "Môžu podporiť telo počas tejto fázy — bobuľové ovocie, listová zelenina, mastné ryby, avokádo, olivový olej, orechy a semienka." },
    { label: "Mastné ryby", category: "eat", icon: Fish, detail: "Losos, makrela — asi 2 porcie týždenne. Zdroj omega-3, ktorý môže podporiť celkovú pohodu." },
    { label: "Kofeín, alkohol a ťažké jedlá", category: "eat", icon: Wine, detail: "Niektorým ženám pomáha obmedziť aj mastné, korenené či sladké jedlá — môže to podporiť tráviaci komfort počas menštruácie." },
    { label: "Jemná joga", category: "move", icon: PersonStanding },
    { label: "Choď sa prejsť", category: "move", icon: Footprints },
    { label: "Pretiahni sa", category: "move", icon: Feather },
    { label: "Daj si teplý kúpeľ", category: "do", icon: Bath },
    { label: "Choď skôr spať", category: "do", icon: Bed },
    { label: "Píš si vďačnosť", category: "do", icon: BookOpen },
    { label: "Počúvaj svoje telo", category: "do", icon: Ear },
    { label: "Kakao ceremoniálne", category: "do", icon: HandHeart },
  ],
  folikularna: [
    { label: "Bielkoviny", category: "eat", icon: Egg, detail: "Môžu podporiť rast folikulov a svalov — vajcia, hydina, strukoviny." },
    { label: "Zdravé tuky", category: "eat", icon: Nut, detail: "Vitamín E z orechov, semienok, olivového oleja a listovej zeleniny." },
    { label: "Komplexné sacharidy", category: "eat", icon: Wheat, detail: "Vláknina a stabilná energia z celozrnných obilnín a strukovín." },
    { label: "Železo", category: "eat", icon: Beef, detail: "Môže podporiť doplnenie železa — tmavá listová zelenina, sušené marhule a figy, chudé červené mäso, šošovica, tofu, tekvicové semienka." },
    { label: "Čerstvá zelenina", category: "eat", icon: Salad, detail: "Vitamíny a antioxidanty z farebnej, sezónnej zeleniny." },
    { label: "Fermentované potraviny", category: "eat", icon: Milk, detail: "Môžu podporiť črevný mikrobióm — kimchi, jogurt, kefir." },
    { label: "Silový tréning", category: "move", icon: Dumbbell },
    { label: "Zabehni si naplno", category: "move", icon: Zap },
    { label: "Vyraz na bicykel", category: "move", icon: Bike },
    { label: "Rezká chôdza", category: "move", icon: Footprints },
    { label: "Naplánuj si niečo nové", category: "do", icon: Sparkles },
    { label: "Rozbehni nový nápad", category: "do", icon: Music },
    { label: "Stretni sa s divami", category: "do", icon: Users },
    { label: "Nauč sa niečo nové", category: "do", icon: NotebookPen },
  ],
  ovulacia: [
    { label: "Farebné ovocie a zelenina", category: "eat", icon: Salad, detail: "Vláknina, voda a antioxidanty z pestrého ovocia a zeleniny." },
    { label: "Vitamíny skupiny B", category: "eat", icon: Drumstick, detail: "Môžu podporiť energiu a nervy — mäso, vajcia, mliečne výrobky, obilniny." },
    { label: "Orechy a semienka", category: "eat", icon: Nut, detail: "Zdravé tuky a horčík pre energiu a hormonálnu rovnováhu." },
    { label: "Fermentované potraviny", category: "eat", icon: Milk, detail: "Môžu podporiť črevný mikrobióm — kimchi, jogurt, kefir." },
    { label: "Pi dosť vody", category: "eat", icon: GlassWater, detail: "Môže znížiť nadúvanie a podporiť energiu aj jasnú pleť." },
    { label: "Skús osobný rekord", category: "move", icon: Zap },
    { label: "Cvič s kamoškami", category: "move", icon: Users },
    { label: "Zatancuj si", category: "move", icon: Music },
    { label: "Poriadne sa rozcvič", category: "move", icon: Timer },
    { label: "Choď medzi ľudí", category: "do", icon: HeartHandshake },
    { label: "Vyrieš dôležitý rozhovor", category: "do", icon: MessageCircle },
    { label: "Ver si", category: "do", icon: Sparkles },
    { label: "Vyskúšaj niečo nové", category: "do", icon: Sparkle },
  ],
  lutealna: [
    { label: "Bielkoviny pri každom jedle", category: "eat", icon: Egg, detail: "Môže ťa vyživiť a upokojiť náladu — vajcia, hydina, ryby, strukoviny." },
    { label: "Zdravé tuky a omega-3", category: "eat", icon: Fish, detail: "Môžu jemne vyvažovať hormóny — mastné ryby, vlašské orechy, ľanové a chia semienka, olivový olej." },
    { label: "Komplexné sacharidy", category: "eat", icon: Wheat, detail: "Vláknina a stabilná energia z celozrnných obilnín a strukovín." },
    { label: "Vitamín B6", category: "eat", icon: Banana, detail: "Môže upokojiť výkyvy nálady — banány, vajcia, hydina, losos, cícer." },
    { label: "Horčík", category: "eat", icon: Cookie, detail: "Môže zmierniť PMS a dopriať pokoj — horká čokoláda, tmavá listová zelenina, mandle, avokádo." },
    { label: "Zinok", category: "eat", icon: Shell, detail: "Môže ťa podporiť v tomto citlivom období — tekvicové semienka, cícer, hovädzie mäso, ustrice." },
    { label: "Menej kofeínu a alkoholu", category: "eat", icon: Wine, detail: "Dopraj si jemnosť — menej podráždenosti a napätia v tele." },
    { label: "Jemná joga", category: "move", icon: PersonStanding },
    { label: "Pokojné plávanie", category: "move", icon: Waves },
    { label: "Prechádzka v prírode", category: "move", icon: Footprints },
    { label: "Tai chi", category: "move", icon: Flower },
    { label: "Spi o niečo dlhšie", category: "do", icon: Moon },
    { label: "Dopraj si rituál pokoja", category: "do", icon: Bath },
    { label: "Odľahči si program", category: "do", icon: Feather },
    { label: "Kakao ceremoniálne", category: "do", icon: HandHeart },
  ],
};

/** Phase of the cycle for any given date (past or future). */
export function getCyclePhaseForDate(
  lastPeriodDate: string,
  cycleLengthDays: number,
  date: Date,
): CyclePhaseKey | null {
  const last = toDateOnly(new Date(`${lastPeriodDate}T12:00:00`));
  if (Number.isNaN(last.getTime())) return null;
  const length = Math.min(Math.max(Math.round(cycleLengthDays), 21), 40);
  const target = toDateOnly(date);
  const daysSince = Math.floor((target.getTime() - last.getTime()) / DAY_MS);
  const dayOfCycle = ((daysSince % length) + length) % length + 1;
  if (dayOfCycle <= 5) return "menstruacna";
  if (dayOfCycle <= 12) return "folikularna";
  if (dayOfCycle <= 16) return "ovulacia";
  return "lutealna";
}

/** Day of the cycle for any given date (past or future). */
export function getCycleDayForDate(
  lastPeriodDate: string,
  cycleLengthDays: number,
  date: Date,
): number | null {
  const last = toDateOnly(new Date(`${lastPeriodDate}T12:00:00`));
  if (Number.isNaN(last.getTime())) return null;
  const length = Math.min(Math.max(Math.round(cycleLengthDays), 21), 40);
  const target = toDateOnly(date);
  const daysSince = Math.floor((target.getTime() - last.getTime()) / DAY_MS);
  return ((daysSince % length) + length) % length + 1;
}

export function formatCycleDate(date: Date, locale: string = "sk-SK") {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" }).format(date);
}
