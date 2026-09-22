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
  Apple,
  Egg,
  Nut,
  Citrus,
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
  Cherry,
  Timer,
  Sparkle,
  Ear,
  NotebookPen,
  Flower,
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
      name: "Menštruácia — ťažké dni",
      description: "Prvé dni bývajú najťažšie. Energia je na dne, tak si dovoľ zastaviť sa — teplo, pokoj a nič si nemusíš dokazovať.",
    };
  }
  if (dayOfCycle <= 5) {
    return {
      key: "menstruacna_doznievanie",
      name: "Menštruácia — doznievanie",
      description: "Krvácanie slabne, sila sa pomaly vracia. Ak máš chuť na pohyb, vyber si krátku prechádzku, no netlač na seba.",
    };
  }
  if (dayOfCycle <= 9) {
    return {
      key: "folikularna_rozbeh",
      name: "Folikulárna — rozbeh",
      description: "Hormóny idú hore a hlava sa čistí. Skvelý čas naštartovať nové nápady a plány.",
    };
  }
  if (dayOfCycle <= 12) {
    return {
      key: "folikularna_vrchol",
      name: "Folikulárna — vrchol energie",
      description: "Si vo forme — energia, sebadôvera aj výkon rastú. Telo teraz unesie aj náročnejší tréning.",
    };
  }
  if (dayOfCycle <= 16) {
    return {
      key: "ovulacia",
      name: "Ovulácia",
      description: "Si na vrchole cyklu. Energia, sebavedomie aj chuť byť medzi ľuďmi sú najvyššie — čas na osobné rekordy.",
    };
  }

  const length = Math.min(Math.max(Math.round(cycleLengthDays), 21), 40);
  const lutealStart = 17;
  const lutealLength = Math.max(length - lutealStart + 1, 3);
  const third = Math.ceil(lutealLength / 3);

  if (dayOfCycle <= lutealStart + third - 1) {
    return {
      key: "lutealna_stabilna",
      name: "Luteálna — stabilná",
      description: "Energia je ešte dobrá, len sa pomaly stišuje. Dobehni rozbehnuté veci, kým na to máš silu.",
    };
  }
  if (dayOfCycle <= lutealStart + 2 * third - 1) {
    return {
      key: "lutealna_premenliva",
      name: "Luteálna — premenlivá",
      description: "Nálady môžu kolísať a si citlivejšia. Buď k sebe trpezlivá a na tieto dni si neplánuj nič náročné.",
    };
  }
  return {
    key: "lutealna_neskora",
    name: "Luteálna — neskorá (PMS)",
    description: "Energia je najnižšia a PMS sa hlási najviac. Dopraj si pokoj, jemnosť a čo najmenej povinností.",
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
            "Telo si odpočíva. Energia môže byť nižšia — buď na seba milá, choď do toho len toľko, koľko cítiš.",
        }
      : dayOfCycle <= 12
        ? {
            name: "Folikulárna fáza",
            description:
              "Energia stúpa. Skvelý čas na nové výzvy, silové tréningy a dlhšie behy.",
          }
        : dayOfCycle <= 16
          ? {
              name: "Ovulácia",
              description:
                "Si na vrchole energie a sebadôvery. Ideálny čas na osobné rekordy a aktivity v komunite.",
            }
          : {
              name: "Luteálna fáza",
              description:
                "Energia postupne klesá. Zvoľ jemnejší pohyb — joga, prechádzky, regenerácia.",
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

export type CycleTipCategory = "do" | "eat" | "move";

export type CycleTip = { label: string; category: CycleTipCategory; icon: LucideIcon };

export const CYCLE_TIP_CATEGORIES: Record<CycleTipCategory, string> = {
  do: "Rituály",
  eat: "Jedlo",
  move: "Pohyb",
};

/** Detailed, icon-tagged tips per phase — food, movement and rituals to browse like a tip grid. */
export const CYCLE_PHASE_TIPS: Record<CyclePhaseKey, CycleTip[]> = {
  menstruacna: [
    { label: "Horúci čaj", category: "eat", icon: Coffee },
    { label: "Špenát a strukoviny", category: "eat", icon: Leaf },
    { label: "Horká čokoláda", category: "eat", icon: Candy },
    { label: "Pi dosť vody", category: "eat", icon: Droplets },
    { label: "Mastné ryby", category: "eat", icon: Fish },
    { label: "Chia a ľanové semienka", category: "eat", icon: Nut },
    { label: "Jogurt a kyslá kapusta", category: "eat", icon: Milk },
    { label: "Jemná joga", category: "move", icon: PersonStanding },
    { label: "Choď sa prejsť", category: "move", icon: Footprints },
    { label: "Pretiahni sa", category: "move", icon: Feather },
    { label: "Daj si teplý kúpeľ", category: "do", icon: Bath },
    { label: "Choď skôr spať", category: "do", icon: Bed },
    { label: "Píš si vďačnosť", category: "do", icon: BookOpen },
    { label: "Počúvaj svoje telo", category: "do", icon: Ear },
  ],
  folikularna: [
    { label: "Čerstvé ovocie", category: "eat", icon: Apple },
    { label: "Bielkoviny", category: "eat", icon: Egg },
    { label: "Orechy", category: "eat", icon: Nut },
    { label: "Citrusy", category: "eat", icon: Citrus },
    { label: "Brokolica a kel", category: "eat", icon: Sprout },
    { label: "Celozrnné obilniny", category: "eat", icon: Wheat },
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
    { label: "Farebná zelenina", category: "eat", icon: Salad },
    { label: "Pi dosť vody", category: "eat", icon: GlassWater },
    { label: "Ľahké bielkoviny", category: "eat", icon: Fish },
    { label: "Sladké zemiaky a strukoviny", category: "eat", icon: Wheat },
    { label: "Bobuľové ovocie", category: "eat", icon: Cherry },
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
    { label: "Horčík a orechy", category: "eat", icon: Nut },
    { label: "Celozrnné jedlo", category: "eat", icon: Wheat },
    { label: "Obmedz kofeín", category: "eat", icon: Coffee },
    { label: "Upokojujúci čaj", category: "eat", icon: Droplets },
    { label: "Tekvicové semienka", category: "eat", icon: Nut },
    { label: "Listová zelenina a sladké zemiaky", category: "eat", icon: Sprout },
    { label: "Pi viac vody", category: "eat", icon: GlassWater },
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

export function formatCycleDate(date: Date) {
  return new Intl.DateTimeFormat("sk-SK", { day: "numeric", month: "long" }).format(date);
}
