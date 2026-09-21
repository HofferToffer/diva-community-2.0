function daysBetween(a: Date, b: Date): number {
  const start = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const end = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export type PostpartumInfo = {
  week: number;
  message: string;
};

/**
 * Šestonedelie ("the sixth week") is the common name, but recovery — and often
 * breastfeeding — runs well past six weeks. The message softens as time passes
 * instead of implying a hard 6-week deadline.
 */
export function getPostpartumInfo(sinceDate: string, today = new Date()): PostpartumInfo {
  const since = new Date(sinceDate);
  const days = Math.max(daysBetween(since, today), 0);
  const week = Math.floor(days / 7) + 1;

  const message =
    week <= 6
      ? "Si v posvätnom období, ktoré niektoré kultúry nazývajú štvrtý trimester. Telo sa hojí, duša sa učí byť matkou — daj si na to toľko času, koľko potrebuješ, nie koľko hovorí kalendár."
      : week <= 12
        ? "Šestonedelie sa podľa mena končí po šiestich týždňoch, ale táto premena pokračuje ďalej — najmä ak dojčíš. Tvoje telo nesie múdrosť, ktorá sa nedá uponáhľať."
        : "Si už niekoľko mesiacov na tejto novej ceste. Hojenie, hormóny aj puto s dieťaťom si idú vlastným tempom — dôveruj mu, nie je to preteky.";

  return { week, message };
}
