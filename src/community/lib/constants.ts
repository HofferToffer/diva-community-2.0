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

/** Jemné farby pre jednotlivé typy aktivít — rovnaký {fill, dot} tvar ako CYCLE_PHASE_COLORS. */
export const ACTIVITY_TYPE_COLORS: Record<string, { fill: string; dot: string }> = {
  run: { fill: "hsl(354, 45%, 55%, 0.12)", dot: "hsl(354, 45%, 50%)" },
  nordic_walking: { fill: "hsl(20, 45%, 50%, 0.12)", dot: "hsl(20, 45%, 45%)" },
  walking: { fill: "hsl(38, 50%, 48%, 0.14)", dot: "hsl(38, 50%, 42%)" },
  cycling: { fill: "hsl(178, 35%, 38%, 0.12)", dot: "hsl(178, 35%, 34%)" },
  swimming: { fill: "hsl(200, 45%, 50%, 0.12)", dot: "hsl(200, 45%, 45%)" },
  yoga: { fill: "hsl(265, 25%, 55%, 0.12)", dot: "hsl(265, 25%, 45%)" },
  pilates: { fill: "hsl(300, 22%, 50%, 0.12)", dot: "hsl(300, 22%, 42%)" },
  dance: { fill: "hsl(8, 55%, 58%, 0.14)", dot: "hsl(8, 55%, 50%)" },
  strength: { fill: "hsl(222, 18%, 42%, 0.1)", dot: "hsl(222, 18%, 38%)" },
  stretching: { fill: "hsl(140, 22%, 38%, 0.12)", dot: "hsl(140, 22%, 32%)" },
  other: { fill: "hsl(240, 6%, 46%, 0.1)", dot: "hsl(240, 6%, 40%)" },
};

export function activityTypeLabel(kind: string, type: string): string {
  const all = [...ACTIVITY_TYPES, ...RUN_TYPES, ...MOVE_TYPES];
  return all.find((t) => t.value === type)?.label ?? type;
}
