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
  type LucideIcon,
} from "lucide-react";

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
  return { week, trimester, daysUntilDue, soulNote: TRIMESTER_SOUL_NOTE[trimester] };
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
const WEEK_ICON: Partial<Record<number, LucideIcon>> = {
  6: Bean,
  9: Cherry,
  13: Bean,
  14: Citrus,
  15: Apple,
  20: Banana,
  21: Carrot,
  24: Wheat,
  30: LeafyGreen,
  36: LeafyGreen,
};

export function pregnancyWeekIcon(week: number): LucideIcon {
  return WEEK_ICON[week] ?? Sprout;
}
