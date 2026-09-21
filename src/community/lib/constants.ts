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

export function activityTypeLabel(kind: string, type: string): string {
  const all = [...ACTIVITY_TYPES, ...RUN_TYPES, ...MOVE_TYPES];
  return all.find((t) => t.value === type)?.label ?? type;
}
