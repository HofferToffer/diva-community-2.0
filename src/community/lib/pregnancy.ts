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
};

/** Computes the current pregnancy week from the expected due date. */
export function getPregnancyInfo(dueDate: string, today = new Date()): PregnancyInfo {
  const due = new Date(dueDate);
  const daysUntilDue = daysBetween(today, due);
  const daysPregnant = Math.min(Math.max(GESTATION_DAYS - daysUntilDue, 0), GESTATION_DAYS + 14);
  const week = Math.min(Math.max(Math.floor(daysPregnant / 7) + 1, 1), 42);
  const trimester: 1 | 2 | 3 = week <= 13 ? 1 : week <= 27 ? 2 : 3;
  return { week, trimester, daysUntilDue };
}

export const TRIMESTER_LABEL: Record<1 | 2 | 3, string> = {
  1: "1. trimester",
  2: "2. trimester",
  3: "3. trimester",
};
