export type CycleInfo = {
  dayOfCycle: number;
  phaseKey: CyclePhaseKey;
  phase: { name: string; description: string };
  nextPeriodDate: Date;
  nextOvulationDate: Date;
  daysUntilNextPeriod: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function toDateOnly(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
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

  return { dayOfCycle, phaseKey, phase, nextPeriodDate, nextOvulationDate, daysUntilNextPeriod };
}

export type CyclePhaseKey = "menstruacna" | "folikularna" | "ovulacia" | "lutealna";

export const CYCLE_PHASES: Record<CyclePhaseKey, { name: string }> = {
  menstruacna: { name: "Menštruačná fáza" },
  folikularna: { name: "Folikulárna fáza" },
  ovulacia: { name: "Ovulácia" },
  lutealna: { name: "Luteálna fáza" },
};

export const CYCLE_PHASE_RECOMMENDATIONS: Record<CyclePhaseKey, string[]> = {
  menstruacna: [
    "Dopraj si pokoj a teplo — horúci čaj, kúpeľ, pokojný spánok.",
    "Pohyb zvoľ jemný: prechádzka, joga alebo strečing.",
    "Jedz výživne — železo (strukoviny, špenát), horčík a zdravé tuky.",
    "Vypočuj si telo a bez výčitiek spomal.",
  ],
  folikularna: [
    "Energia stúpa — ideálny čas začať niečo nové.",
    "Skús silový tréning alebo rýchlejší beh, telo zvládne viac.",
    "Stav na ľahké, čerstvé jedlá a dostatok bielkovín.",
    "Plánuj, tvor a stretávaj sa — kreativita aj sebadôvera rastú.",
  ],
  ovulacia: [
    "Si na vrchole — skús osobný rekord alebo náročnejší tréning.",
    "Skvelý čas na spoločenské aktivity a beh s komunitou.",
    "Nezabudni na hydratáciu a antioxidanty (ovocie, zelenina).",
    "Využi energiu naplno, ale telo po tréningu aj zregeneruj.",
  ],
  lutealna: [
    "Energia postupne klesá — striedaj pohyb s oddychom.",
    "Zvoľ jemnejšie tempo: joga, plávanie, prechádzky v prírode.",
    "Pomôže magnézium, komplexné sacharidy a menej kofeínu a soli.",
    "Dopraj si viac spánku a rituály, ktoré ťa upokojujú.",
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
