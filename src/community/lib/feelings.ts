import { Angry, CloudRain, Eye, Frown, ShieldAlert, Smile, Sparkles, type LucideIcon } from "lucide-react";
import type { DailyFeeling } from "@/community/hooks/queries";

export const MOODS: Array<{
  value: DailyFeeling["mood"];
  icon: LucideIcon;
  label: string;
  feelings: Array<{ label: string; specifics: string[] }>;
}> = [
  {
    value: "radostna", icon: Smile, label: "Šťastne",
    feelings: [
      { label: "hravo", specifics: ["nabudene", "smelo"] },
      { label: "spokojne", specifics: ["radostne", "slobodne"] },
      { label: "zaujato", specifics: ["sústredene", "zvedavo"] },
      { label: "hrdo", specifics: ["sebaisto", "úspešne"] },
      { label: "prijato", specifics: ["hodnotne", "rešpektovane"] },
      { label: "energeticky", specifics: ["kreatívne", "odvážne"] },
      { label: "pokojne", specifics: ["s láskou", "vďačne"] },
      { label: "dôverčivo", specifics: ["dôverne", "citlivo"] },
      { label: "optimisticky", specifics: ["inšpirovane", "nádejne"] },
    ],
  },
  {
    value: "smutna", icon: CloudRain, label: "Smutno",
    feelings: [
      { label: "osamelo", specifics: ["opustene", "izolovane"] },
      { label: "zraniteľne", specifics: ["krehko", "ubližene"] },
      { label: "zúfalo", specifics: ["bezmocne", "zarmútene"] },
      { label: "previnilo", specifics: ["zahanbene", "kajúcne"] },
      { label: "depresívne", specifics: ["prázdno", "podradne"] },
      { label: "zranene", specifics: ["sklamane", "trápne"] },
    ],
  },
  {
    value: "prekvapena", icon: Sparkles, label: "Prekvapene",
    feelings: [
      { label: "nadšene", specifics: ["dychtivo", "energicky"] },
      { label: "ohromene", specifics: ["omráčene", "užasnuto"] },
      { label: "zmätene", specifics: ["rozčarovane", "rozpačito"] },
      { label: "zaskočene", specifics: ["šokovane", "vyľakane"] },
    ],
  },
  {
    value: "hrozne", icon: Frown, label: "Hrozne",
    feelings: [
      { label: "vystresovane", specifics: ["nesústredene", "nevyspato"] },
      { label: "unavene", specifics: ["stracam kontrolu", "udusivo"] },
      { label: "zamestnane", specifics: ["pod tlakom", "apaticky", "bez zaujmu"] },
    ],
  },
  {
    value: "bojazliva", icon: ShieldAlert, label: "Bojazlivo",
    feelings: [
      { label: "vystrašene", specifics: ["vydesene", "bezmocne"] },
      { label: "úzkostne", specifics: ["zaplavene", "ustarane"] },
      { label: "slabo", specifics: ["bezcenne", "nedôležito"] },
      { label: "odmietnuto", specifics: ["vylúčene", "utlačovaný/á"] },
      { label: "neisto", specifics: ["nedostatočne", "menejcenne"] },
      { label: "ohrozene", specifics: ["nervózne", "neohránene"] },
    ],
  },
  {
    value: "nahnevana", icon: Angry, label: "Rozhnevane",
    feelings: [
      { label: "sklamane", specifics: ["zradene", "zosmiešnene"] },
      { label: "ponížene", specifics: ["zneúctene", "rozhorčene"] },
      { label: "zatrpknuto", specifics: ["zneužito", "mrzuto"] },
      { label: "nahnevane", specifics: ["zúrivo", "žiarlivo"] },
      { label: "agresívne", specifics: ["vyprovokovane", "nepriatelsky"] },
      { label: "frustrovane", specifics: ["rozzúrene", "upäto"] },
      { label: "odťažito", specifics: ["otupelo", "sklamane"] },
      { label: "kriticky", specifics: ["skepticky", "odmietavo"] },
    ],
  },
  {
    value: "znechutena", icon: Eye, label: "Znechutene",
    feelings: [
      { label: "odmietavo", specifics: ["odsudzujúco", "trápne"] },
      { label: "sklamane", specifics: ["zhrozene", "nespokojne"] },
      { label: "zle", specifics: ["na zvracanie", "zhnusene"] },
      { label: "odpudení/á", specifics: ["zdesene", "zdŕahavo"] },
    ],
  },
];

/**
 * Jemné, tlmené farby pre jednotlivé nálady — rovnaký {fill, dot} tvar ako
 * ACTIVITY_TYPE_COLORS, v tom istom úzkom teplom rozsahu (nie rozhádzané po
 * celom farebnom kolese), aby si žena vedela na prvý pohľad rozlíšiť nálady
 * pri zápise pocitu, no zároveň to stále pôsobilo ako jedna ladená rodina.
 */
export const MOOD_COLORS: Record<string, { fill: string; dot: string }> = {
  radostna: { fill: "hsl(38, 45%, 48%, 0.14)", dot: "hsl(38, 45%, 42%)" },
  smutna: { fill: "hsl(330, 22%, 42%, 0.12)", dot: "hsl(330, 22%, 38%)" },
  prekvapena: { fill: "hsl(15, 40%, 50%, 0.14)", dot: "hsl(15, 40%, 44%)" },
  hrozne: { fill: "hsl(20, 15%, 38%, 0.12)", dot: "hsl(20, 15%, 32%)" },
  bojazliva: { fill: "hsl(300, 18%, 40%, 0.12)", dot: "hsl(300, 18%, 36%)" },
  nahnevana: { fill: "hsl(356, 40%, 42%, 0.14)", dot: "hsl(356, 40%, 38%)" },
  znechutena: { fill: "hsl(40, 20%, 34%, 0.12)", dot: "hsl(40, 20%, 28%)" },
};

export const DETAIL_SEPARATOR = " · ";

export const LEGACY_MOODS: Record<string, { label: string; icon: LucideIcon }> = {
  vycerpana: { label: "Vyčerpaná", icon: CloudRain },
  neutralna: { label: "Tak všelijako", icon: Eye },
  dobre: { label: "Dobre", icon: Smile },
  skvelo: { label: "Skvelo", icon: Sparkles },
};

export function moodDetails(value: DailyFeeling["mood"]) {
  return MOODS.find((mood) => mood.value === value) ?? LEGACY_MOODS[value] ?? MOODS[0];
}
