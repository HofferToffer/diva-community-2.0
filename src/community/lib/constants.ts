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

/**
 * Jemné, tlmené farby pre jednotlivé typy aktivít — rovnaký {fill, dot} tvar ako CYCLE_PHASE_COLORS.
 * Všetky odtiene vychádzajú z palety značky (slivková, šalviová, terakotová, púdrová) — rôzne aktivity
 * majú svoj vlastný odtieň, ale pôsobia ako jedna ladená rodina, nie ako pestrofarebná "konfeta".
 */
export const ACTIVITY_TYPE_COLORS: Record<string, { fill: string; dot: string }> = {
  run: { fill: "hsl(340, 22%, 34%, 0.1)", dot: "hsl(340, 22%, 30%)" },
  nordic_walking: { fill: "hsl(101, 11%, 38%, 0.1)", dot: "hsl(101, 11%, 33%)" },
  walking: { fill: "hsl(16, 36%, 52%, 0.12)", dot: "hsl(16, 38%, 44%)" },
  cycling: { fill: "hsl(356, 30%, 44%, 0.1)", dot: "hsl(356, 30%, 40%)" },
  swimming: { fill: "hsl(160, 12%, 40%, 0.1)", dot: "hsl(160, 12%, 34%)" },
  yoga: { fill: "hsl(18, 45%, 62%, 0.1)", dot: "hsl(18, 40%, 46%)" },
  pilates: { fill: "hsl(340, 16%, 46%, 0.1)", dot: "hsl(340, 18%, 40%)" },
  dance: { fill: "hsl(16, 44%, 46%, 0.12)", dot: "hsl(16, 44%, 42%)" },
  strength: { fill: "hsl(0, 7%, 24%, 0.08)", dot: "hsl(0, 7%, 20%)" },
  stretching: { fill: "hsl(101, 14%, 50%, 0.1)", dot: "hsl(101, 14%, 38%)" },
  other: { fill: "hsl(340, 8%, 45%, 0.08)", dot: "hsl(340, 8%, 40%)" },
};

export function activityTypeLabel(kind: string, type: string): string {
  const all = [...ACTIVITY_TYPES, ...RUN_TYPES, ...MOVE_TYPES];
  return all.find((t) => t.value === type)?.label ?? type;
}
