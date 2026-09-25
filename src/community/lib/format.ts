export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatMinutes(seconds: number): string {
  return `${Math.round(seconds / 60)} min`;
}

export function formatKm(km: number | null | undefined): string {
  if (km === null || km === undefined) return "—";
  return `${Number(km).toFixed(2).replace(/\.00$/, "")} km`;
}

export function formatPace(paceSeconds: number | null | undefined): string {
  if (!paceSeconds || paceSeconds <= 0) return "—";
  const m = Math.floor(paceSeconds / 60);
  const s = Math.round(paceSeconds % 60);
  return `${m}:${String(s).padStart(2, "0")} / km`;
}

export function computePaceSeconds(distanceKm: number, durationSeconds: number): number | null {
  if (!distanceKm || distanceKm <= 0 || !durationSeconds) return null;
  return Math.round(durationSeconds / distanceKm);
}

export function parseDurationInput(hours: string, minutes: string, seconds: string): number {
  const h = Number(hours || 0);
  const m = Number(minutes || 0);
  const s = Number(seconds || 0);
  return h * 3600 + m * 60 + s;
}

const SK_MONTHS = [
  "januára", "februára", "marca", "aprila", "mája", "júna",
  "júla", "augusta", "septembra", "októbra", "novembra", "decembra",
];

const EN_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatDate(value: string, locale: "sk" | "en" = "sk"): string {
  const d = new Date(value);
  if (locale === "en") return `${EN_MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  return `${d.getDate()}. ${SK_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatRelative(value: string, locale: "sk" | "en" = "sk"): string {
  const then = new Date(value).getTime();
  const diff = Date.now() - then;
  const min = Math.round(diff / 60000);
  if (locale === "en") {
    if (min < 1) return "just now";
    if (min < 60) return `${min} min ago`;
    const hours = Math.round(min / 60);
    if (hours < 24) return `${hours} h ago`;
    const days = Math.round(hours / 24);
    if (days < 7) return `${days} d ago`;
    return formatDate(value, "en");
  }
  if (min < 1) return "práve teraz";
  if (min < 60) return `pred ${min} min`;
  const hours = Math.round(min / 60);
  if (hours < 24) return `pred ${hours} h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `pred ${days} d`;
  return formatDate(value);
}

export function pluralDivy(count: number): string {
  if (count === 1) return "Diva";
  if (count >= 2 && count <= 4) return "Divy";
  return "Div";
}

export function pluralRuns(count: number): string {
  if (count === 1) return "beh";
  if (count >= 2 && count <= 4) return "behy";
  return "behov";
}

export function pluralWorkouts(count: number): string {
  if (count === 1) return "tréning";
  if (count >= 2 && count <= 4) return "tréningy";
  return "tréningov";
}

export function pluralDays(count: number): string {
  if (count === 1) return "deň";
  if (count >= 2 && count <= 4) return "dni";
  return "dní";
}

export function pluralActivities(count: number): string {
  if (count === 1) return "aktivita";
  if (count >= 2 && count <= 4) return "aktivity";
  return "aktivít";
}

export function pluralChildren(count: number): string {
  if (count === 1) return "dieťa";
  if (count >= 2 && count <= 4) return "deti";
  return "detí";
}


export function greeting(_name: string | null | undefined): string {
  return "Ahoj milá Diva.";
}

export function normalizeUsername(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9._]/g, "")
    .slice(0, 24);
}
