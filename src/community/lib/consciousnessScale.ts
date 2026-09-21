// Škála vedomia (Hawkins) prepojená na koleso emócií z Denného pocitu.

export type ScaleLevel = { value: number; label: string };

export const SCALE_LEVELS: ScaleLevel[] = [
  { value: 700, label: "Osvietenie" },
  { value: 600, label: "Pokoj" },
  { value: 540, label: "Radosť" },
  { value: 500, label: "Láska" },
  { value: 400, label: "Rozum" },
  { value: 350, label: "Prijatie" },
  { value: 310, label: "Ochota" },
  { value: 250, label: "Neutralita" },
  { value: 200, label: "Odvaha" },
  { value: 175, label: "Pýcha" },
  { value: 150, label: "Hnev" },
  { value: 125, label: "Túžba" },
  { value: 100, label: "Strach" },
  { value: 75, label: "Žiaľ" },
  { value: 50, label: "Apatia" },
  { value: 30, label: "Vina" },
  { value: 20, label: "Hanba" },
];

const MOOD_LEVELS: Record<string, number> = {
  radostna: 500,
  smutna: 75,
  prekvapena: 250,
  hrozne: 75,
  bojazliva: 100,
  nahnevana: 150,
  znechutena: 150,
  // staršie hodnoty
  vycerpana: 50,
  neutralna: 250,
  dobre: 350,
  skvelo: 540,
};

const DETAIL_LEVELS: Record<string, number> = {
  // Šťastne
  hravo: 540,
  spokojne: 600,
  zaujato: 400,
  hrdo: 400,
  prijato: 350,
  energeticky: 310,
  pokojne: 500,
  "dôverčivo": 500,
  optimisticky: 310,
  // Smutno
  osamelo: 75,
  "zraniteľne": 75,
  "zúfalo": 50,
  previnilo: 30,
  "depresívne": 50,
  zranene: 75,
  // Prekvapene
  nadšene: 310,
  ohromene: 250,
  "zmätene": 125,
  "zaskočene": 100,
  // Hrozne
  vystresovane: 100,
  unavene: 50,
  zamestnane: 50,
  // Bojazlivo
  "vystrašene": 100,
  "úzkostne": 100,
  slabo: 20,
  odmietnuto: 30,
  neisto: 20,
  ohrozene: 100,
  // Rozhnevane
  sklamane: 150,
  "ponížene": 30,
  zatrpknuto: 150,
  nahnevane: 150,
  "agresívne": 150,
  frustrovane: 125,
  "odťažito": 50,
  kriticky: 175,
  // Znechutene
  odmietavo: 150,
  zle: 50,
  "odpudení/á": 100,
};

export function levelForFeeling(mood: string, feelingDetail?: string | null): number {
  const detail = feelingDetail?.split(" · ")[0]?.trim().toLowerCase();
  if (detail && DETAIL_LEVELS[detail] !== undefined) return DETAIL_LEVELS[detail];
  return MOOD_LEVELS[mood] ?? 250;
}

export function scaleLabel(value: number): string {
  return SCALE_LEVELS.reduce((best, level) =>
    Math.abs(level.value - value) < Math.abs(best.value - value) ? level : best,
  SCALE_LEVELS[0]).label;
}
