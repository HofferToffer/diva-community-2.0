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
