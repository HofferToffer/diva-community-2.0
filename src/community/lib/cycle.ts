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
      description: "Prvé dni bývajú najnáročnejšie, energia je najnižšia. Telo si žiada teplo, pokoj a nič si nemusíš dokazovať.",
    };
  }
  if (dayOfCycle <= 5) {
    return {
      key: "menstruacna_doznievanie",
      name: "Menštruácia — doznievanie",
      description: "Krvácanie slabne a energia sa pomaly vracia. Skús ľahký pohyb, ak naň máš chuť, no netlač na seba.",
    };
  }
  if (dayOfCycle <= 9) {
    return {
      key: "folikularna_rozbeh",
      name: "Folikulárna — rozbeh",
      description: "Hormóny stúpajú a hlava sa čistí. Ideálny čas naštartovať nové plány, nápady a projekty.",
    };
  }
  if (dayOfCycle <= 12) {
    return {
      key: "folikularna_vrchol",
      name: "Folikulárna — vrchol energie",
      description: "Energia, sebadôvera aj výkon rastú. Telo teraz zvládne náročnejší tréning aj väčšiu záťaž.",
    };
  }
  if (dayOfCycle <= 16) {
    return {
      key: "ovulacia",
      name: "Ovulácia",
      description: "Si na vrchole cyklu — energia, sebavedomie aj chuť na spoločnosť sú najvyššie. Ideálny čas na osobné rekordy.",
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
      description: "Energia je ešte dobrá, no postupne sa spomaľuje. Skvelý čas dokončiť rozbehnuté veci pred spomalením.",
    };
  }
  if (dayOfCycle <= lutealStart + 2 * third - 1) {
    return {
      key: "lutealna_premenliva",
      name: "Luteálna — premenlivá",
      description: "Nálady môžu kolísať a telo je citlivejšie. Buď na seba trpezlivá a nezaraďuj náročné veci na neskôr.",
    };
  }
  return {
    key: "lutealna_neskora",
    name: "Luteálna — neskorá (PMS)",
    description: "Energia je najnižšia a PMS môže byť najsilnejšie cítiť. Zvoľ pokoj, jemnosť a čo najmenej záväzkov.",
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

/** Soft background fill + a stronger dot/marker color per phase, shared by the chart and calendar. */
export const CYCLE_PHASE_COLORS: Record<CyclePhaseKey, { fill: string; dot: string }> = {
  menstruacna: { fill: "hsl(var(--destructive) / 0.10)", dot: "hsl(var(--destructive))" },
  folikularna: { fill: "hsl(var(--primary) / 0.08)", dot: "hsl(var(--primary))" },
  ovulacia: { fill: "hsl(var(--accent) / 0.35)", dot: "hsl(var(--accent-foreground))" },
  lutealna: { fill: "hsl(var(--secondary) / 0.55)", dot: "hsl(var(--muted-foreground))" },
};

export type CycleTipCategory = "do" | "eat" | "move";

export type CycleTip = { label: string; category: CycleTipCategory; icon: LucideIcon };

export const CYCLE_TIP_CATEGORIES: Record<CycleTipCategory, string> = {
  do: "Rob",
  eat: "Jedz",
  move: "Pohyb",
};

/** Detailed, icon-tagged tips per phase — food, movement and rituals to browse like a tip grid. */
export const CYCLE_PHASE_TIPS: Record<CyclePhaseKey, CycleTip[]> = {
  menstruacna: [
    { label: "Horúci čaj", category: "eat", icon: Coffee },
    { label: "Špenát a strukoviny", category: "eat", icon: Leaf },
    { label: "Horká čokoláda", category: "eat", icon: Candy },
    { label: "Hydratácia", category: "eat", icon: Droplets },
    { label: "Jemná joga", category: "move", icon: PersonStanding },
    { label: "Prechádzka", category: "move", icon: Footprints },
    { label: "Strečing", category: "move", icon: Feather },
    { label: "Teplý kúpeľ", category: "do", icon: Bath },
    { label: "Skorší spánok", category: "do", icon: Bed },
    { label: "Denník vďačnosti", category: "do", icon: BookOpen },
  ],
  folikularna: [
    { label: "Čerstvé ovocie", category: "eat", icon: Apple },
    { label: "Bielkoviny", category: "eat", icon: Egg },
    { label: "Orechy", category: "eat", icon: Nut },
    { label: "Citrusy", category: "eat", icon: Citrus },
    { label: "Silový tréning", category: "move", icon: Dumbbell },
    { label: "Rýchlejší beh", category: "move", icon: Zap },
    { label: "Bicykel", category: "move", icon: Bike },
    { label: "Plánuj nové", category: "do", icon: Sparkles },
    { label: "Kreatívny projekt", category: "do", icon: Music },
    { label: "Stretnutie s divami", category: "do", icon: Users },
  ],
  ovulacia: [
    { label: "Farebná zelenina", category: "eat", icon: Salad },
    { label: "Hydratácia", category: "eat", icon: GlassWater },
    { label: "Ľahké bielkoviny", category: "eat", icon: Fish },
    { label: "Osobný rekord", category: "move", icon: Zap },
    { label: "Skupinový tréning", category: "move", icon: Users },
    { label: "Tanec", category: "move", icon: Music },
    { label: "Spoločenské akcie", category: "do", icon: HeartHandshake },
    { label: "Dôležité rozhovory", category: "do", icon: MessageCircle },
    { label: "Sebavedomé kroky", category: "do", icon: Sparkles },
  ],
  lutealna: [
    { label: "Horčík a orechy", category: "eat", icon: Nut },
    { label: "Komplexné sacharidy", category: "eat", icon: Wheat },
    { label: "Menej kofeínu", category: "eat", icon: Coffee },
    { label: "Upokojujúci čaj", category: "eat", icon: Droplets },
    { label: "Jemná joga", category: "move", icon: PersonStanding },
    { label: "Plávanie", category: "move", icon: Waves },
    { label: "Prechádzka v prírode", category: "move", icon: Footprints },
    { label: "Viac spánku", category: "do", icon: Moon },
    { label: "Upokojujúce rituály", category: "do", icon: Bath },
    { label: "Menej záväzkov", category: "do", icon: Feather },
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
