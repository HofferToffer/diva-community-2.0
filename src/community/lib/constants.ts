export const MOVEMENT_INTERESTS = [
  "Running",
  "Walking",
  "Strength",
  "Yoga",
  "Pilates",
  "Mobility",
  "Dance",
  "Heels",
  "Cycling",
  "Swimming",
  "Other",
] as const;

export const RUN_TYPES = [
  { value: "easy", label: "Easy Run" },
  { value: "long", label: "Long Run" },
  { value: "intervals", label: "Intervals" },
  { value: "tempo", label: "Tempo" },
  { value: "race", label: "Race" },
  { value: "trail", label: "Trail" },
  { value: "other", label: "Iné" },
] as const;

export const MOVE_TYPES = [
  { value: "strength", label: "Strength" },
  { value: "yoga", label: "Yoga" },
  { value: "pilates", label: "Pilates" },
  { value: "mobility", label: "Mobility" },
  { value: "dance", label: "Dance" },
  { value: "heels", label: "Heels" },
  { value: "cycling", label: "Cycling" },
  { value: "swimming", label: "Swimming" },
  { value: "walking", label: "Walking" },
  { value: "hiit", label: "HIIT" },
  { value: "stretching", label: "Stretching" },
  { value: "other", label: "Iné" },
] as const;

/** Aktivity, ktoré si divy zapisujú v apke. `distance` = zadáva sa vzdialenosť v km, `duration` = zadáva sa čas v minútach. */
export const ACTIVITY_TYPES = [
  { value: "run", label: "Beh", distance: true, duration: false },
  { value: "nordic_walking", label: "Nordic walking", distance: true, duration: false },
  { value: "walking", label: "Chôdza", distance: true, duration: false },
  { value: "cycling", label: "Bicykel", distance: true, duration: false },
  { value: "swimming", label: "Plávanie", distance: true, duration: false },
  { value: "yoga", label: "Joga", distance: false, duration: true },
  { value: "pilates", label: "Pilates", distance: false, duration: true },
  { value: "dance", label: "Tanec", distance: false, duration: true },
  { value: "strength", label: "Silový tréning", distance: false, duration: true },
  { value: "stretching", label: "Stretching", distance: false, duration: true },
  { value: "other", label: "Iné", distance: false, duration: false },
] as const;

/** Jemné, tlmené farby pre jednotlivé typy aktivít — rovnaký {fill, dot} tvar ako CYCLE_PHASE_COLORS, ladené do rovnakej prítmenej palety ako --primary (dusty rose), nie sýte "krikľavé" odtiene. */
export const ACTIVITY_TYPE_COLORS: Record<string, { fill: string; dot: string }> = {
  run: { fill: "hsl(344, 30%, 52%, 0.1)", dot: "hsl(344, 30%, 46%)" },
  nordic_walking: { fill: "hsl(18, 32%, 46%, 0.1)", dot: "hsl(18, 32%, 40%)" },
  walking: { fill: "hsl(38, 34%, 42%, 0.12)", dot: "hsl(38, 34%, 36%)" },
  cycling: { fill: "hsl(185, 22%, 36%, 0.1)", dot: "hsl(185, 22%, 32%)" },
  swimming: { fill: "hsl(205, 22%, 42%, 0.1)", dot: "hsl(205, 22%, 36%)" },
  yoga: { fill: "hsl(270, 16%, 46%, 0.1)", dot: "hsl(270, 16%, 40%)" },
  pilates: { fill: "hsl(310, 16%, 44%, 0.1)", dot: "hsl(310, 16%, 38%)" },
  dance: { fill: "hsl(8, 32%, 50%, 0.12)", dot: "hsl(8, 32%, 44%)" },
  strength: { fill: "hsl(30, 12%, 32%, 0.08)", dot: "hsl(30, 12%, 28%)" },
  stretching: { fill: "hsl(140, 16%, 34%, 0.1)", dot: "hsl(140, 16%, 30%)" },
  other: { fill: "hsl(30, 8%, 42%, 0.08)", dot: "hsl(30, 8%, 38%)" },
};

export function activityTypeLabel(kind: string, type: string): string {
  const all = [...ACTIVITY_TYPES, ...RUN_TYPES, ...MOVE_TYPES];
  return all.find((t) => t.value === type)?.label ?? type;
}
