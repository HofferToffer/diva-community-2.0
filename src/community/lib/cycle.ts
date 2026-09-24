import type { LucideIcon } from "lucide-react";
import {
  Coffee,
  Leaf,
  Candy,
  Droplets,
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
  Sprout,
  Timer,
  Sparkle,
  Ear,
  NotebookPen,
  Flower,
  Beef,
  Drumstick,
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
        "Energia je ešte dobrá, len sa pomaly stišuje, ako teplé septembrové dni. Dobehni rozbehnuté veci, kým na to máš silu.",
    };
  }
  if (dayOfCycle <= lutealStart + 2 * third - 1) {
    return {
      key: "lutealna_premenliva",
      name: "Jeseň — vietor sa mení",
      description:
        "Nálady môžu kolísať a si citlivejšia, podobne ako sa mení jesenné počasie. Buď k sebe trpezlivá a na tieto dni si neplánuj nič náročné.",
    };
  }
  return {
    key: "lutealna_neskora",
    name: "Jeseň — posledné lístie padá",
    description:
      "Energia je najnižšia a PMS sa hlási najviac, presne pred príchodom pokojnej zimy. Dopraj si pokoj, jemnosť a čo najmenej povinností.",
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
    { label: "Horúci čaj", category: "eat", icon: Coffee, detail: "Zohreje a zmierni kŕče — skús zázvorový alebo harmančekový čaj." },
    { label: "Špenát a strukoviny", category: "eat", icon: Leaf, detail: "Dopĺňajú železo, ktoré telo stráca počas menštruácie." },
    { label: "Horká čokoláda", category: "eat", icon: Candy, detail: "Horčík v čokoláde nad 70 % zmierňuje kŕče aj chute na sladké." },
    { label: "Pi dosť vody", category: "eat", icon: Droplets, detail: "Znižuje nadúvanie a podporuje energiu aj jasnú pleť." },
    { label: "Mastné ryby", category: "eat", icon: Fish, detail: "Omega-3 z lososa, makrely či sardiniek tlmí zápal a bolesť." },
    { label: "Chia a ľanové semienka", category: "eat", icon: Nut, detail: "Omega-3 a vláknina pre hormonálnu rovnováhu." },
    { label: "Jogurt a kyslá kapusta", category: "eat", icon: Milk, detail: "Probiotiká podporujú trávenie a zdravé črevo." },
    { label: "Jemná joga", category: "move", icon: PersonStanding },
    { label: "Choď sa prejsť", category: "move", icon: Footprints },
    { label: "Pretiahni sa", category: "move", icon: Feather },
    { label: "Daj si teplý kúpeľ", category: "do", icon: Bath },
    { label: "Choď skôr spať", category: "do", icon: Bed },
    { label: "Píš si vďačnosť", category: "do", icon: BookOpen },
    { label: "Počúvaj svoje telo", category: "do", icon: Ear },
  ],
  folikularna: [
    { label: "Bielkoviny", category: "eat", icon: Egg, detail: "Podporujú rast folikulov a svalov — vajcia, hydina, strukoviny." },
    { label: "Zdravé tuky", category: "eat", icon: Nut, detail: "Vitamín E z orechov, semienok, olivového oleja a listovej zeleniny." },
    { label: "Komplexné sacharidy", category: "eat", icon: Wheat, detail: "Vláknina a stabilná energia z celozrnných obilnín a strukovín." },
    { label: "Železo", category: "eat", icon: Beef, detail: "Dopĺňa zásoby po menštruácii — červené mäso, špenát, šošovica." },
    { label: "Čerstvá zelenina", category: "eat", icon: Salad, detail: "Vitamíny a antioxidanty z farebnej, sezónnej zeleniny." },
    { label: "Fermentované potraviny", category: "eat", icon: Milk, detail: "Podporujú črevný mikrobióm — kimchi, jogurt, kefir." },
    { label: "Zacvič si posilku", category: "move", icon: Dumbbell },
    { label: "Zabehni si naplno", category: "move", icon: Zap },
    { label: "Vyraz na bicykli", category: "move", icon: Bike },
    { label: "Rezká chôdza", category: "move", icon: Footprints },
    { label: "Naplánuj si niečo nové", category: "do", icon: Sparkles },
    { label: "Rozbehni nový nápad", category: "do", icon: Music },
    { label: "Stretni sa s divami", category: "do", icon: Users },
    { label: "Nauč sa niečo nové", category: "do", icon: NotebookPen },
  ],
  ovulacia: [
    { label: "Farebné ovocie a zelenina", category: "eat", icon: Salad, detail: "Vláknina, voda a antioxidanty z pestrého ovocia a zeleniny." },
    { label: "Vitamíny skupiny B", category: "eat", icon: Drumstick, detail: "Podporujú energiu a nervy — mäso, vajcia, mliečne výrobky, obilniny." },
    { label: "Orechy a semienka", category: "eat", icon: Nut, detail: "Zdravé tuky a horčík pre energiu a hormonálnu rovnováhu." },
    { label: "Fermentované potraviny", category: "eat", icon: Milk, detail: "Podporujú črevný mikrobióm — kimchi, jogurt, kefir." },
    { label: "Pi dosť vody", category: "eat", icon: GlassWater, detail: "Znižuje nadúvanie a podporuje energiu aj jasnú pleť." },
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
    { label: "Horčík a orechy", category: "eat", icon: Nut, detail: "Horčík zmierňuje PMS, kŕče aj chute na sladké." },
    { label: "Celozrnné jedlo", category: "eat", icon: Wheat, detail: "Stabilizuje hladinu cukru v krvi aj náladu." },
    { label: "Obmedz kofeín", category: "eat", icon: Coffee, detail: "Znižuje podráždenosť a citlivosť prsníkov." },
    { label: "Upokojujúci čaj", category: "eat", icon: Droplets, detail: "Harmanček alebo medovka pre pokoj a lepší spánok." },
    { label: "Tekvicové semienka", category: "eat", icon: Nut, detail: "Zinok a horčík pre hormonálnu rovnováhu." },
    { label: "Listová zelenina a sladké zemiaky", category: "eat", icon: Sprout, detail: "Vitamín B6 zmierňuje výkyvy nálady pred menštruáciou." },
    { label: "Pi viac vody", category: "eat", icon: GlassWater, detail: "Pomáha proti nadúvaniu pred menštruáciou." },
    { label: "Jemná joga", category: "move", icon: PersonStanding },
    { label: "Zajdi si zaplávať", category: "move", icon: Waves },
    { label: "Prechádzka v prírode", category: "move", icon: Footprints },
    { label: "Tai chi", category: "move", icon: Flower },
    { label: "Spi o niečo dlhšie", category: "do", icon: Moon },
    { label: "Dopraj si rituál pokoja", category: "do", icon: Bath },
    { label: "Odľahči si program", category: "do", icon: Feather },
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
