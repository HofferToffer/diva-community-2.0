import { Cigarette, Coffee, Dumbbell, HeartHandshake, MessageCircle, Pill, Scale, Timer } from "lucide-react";
import type { CycleTip } from "@/community/lib/cycle";

/**
 * Content for women trying to conceive, especially those on a longer
 * journey. Grounded in ASRM, ACOG, Mayo Clinic and Cleveland Clinic
 * guidance — written warm and encouraging, never falsely reassuring and
 * never implying stress or "just relaxing" is why it hasn't happened yet
 * (ASRM: no proven causal link between stress and infertility).
 */

/**
 * The energetic/inner layer for this journey — in the same shape as
 * CYCLE_PHASE_ARCHETYPE, but a single one rather than per-stage, since trying
 * to conceive has no fixed stages to move through, just an open stretch of
 * time to hold with patience.
 */
export const TTC_ARCHETYPE = {
  archetype: "Trpezlivá nádej",
  keywords: "nádej • trpezlivosť • dôvera • vytrvalosť",
  mantra: "Dôverujem svojmu telu aj jeho vlastnému času.",
};

/** Realistic, encouraging framing of how long conception typically takes. */
export const TTC_TIMELINE_NOTE =
  "Asi 30 % žien otehotnie hneď v prvom cykle, 66–80 % do 6 mesiacov a približne 85 % do roka pravidelných pokusov. Ak skúšaš už 9 mesiacov, si stále úplne v bežnom rozmedzí — to, že to ešte neprišlo, neznamená, že niečo nie je v poriadku.";

export type TtcDoctorGuidance = {
  ageUnder35: string;
  age35Plus: string;
  soonerIf: string[];
};

export const TTC_DOCTOR_GUIDANCE: TtcDoctorGuidance = {
  ageUnder35: "Do 35 rokov sa vyšetrenie zvyčajne odporúča po 12 mesiacoch pravidelných pokusov bez počatia.",
  age35Plus: "Od 35 rokov je to už po 6 mesiacoch, a nad 40 rokov je dobré poradiť sa hneď, bez čakania.",
  soonerIf: [
    "nepravidelný alebo chýbajúci cyklus",
    "diagnostikovaný PCOS, endometrióza alebo myómy",
    "predchádzajúca operácia v oblasti panvy",
    "2 a viac potratov v minulosti",
    "známy alebo podozrivý faktor na strane partnera",
  ],
};

/** Evidence-based things that genuinely help — same {label, category, icon} shape as the cycle/menopause tips. */
export const TTC_TIPS: CycleTip[] = [
  { label: "Sex každý 1.–2. deň okolo ovulácie", category: "do", icon: Timer },
  { label: "Kyselina listová / prenatálne vitamíny", category: "eat", icon: Pill },
  { label: "Zdravá váha a mierny pohyb", category: "move", icon: Scale },
  { label: "Nefajčiť", category: "do", icon: Cigarette },
  { label: "Menej alkoholu, kofeín do 1–2 káv denne", category: "eat", icon: Coffee },
  { label: "Mierne, nie extrémne cvičenie", category: "move", icon: Dumbbell },
  { label: "Podpora — partner, kamošky, poradňa", category: "do", icon: HeartHandshake },
  { label: "Hovor o tom nahlas, keď je to ťažké", category: "do", icon: MessageCircle },
];

export const TTC_MYTHS: { myth: string; fact: string }[] = [
  {
    myth: "Po sexe treba ešte chvíľu ležať so zdvihnutými nohami.",
    fact: "Nič to nemení — spermie sa dostanú tam, kam majú, v priebehu pár minút bez ohľadu na polohu.",
  },
  {
    myth: "Na otehotnenie je lepšia nejaká konkrétna poloha.",
    fact: "Žiadny výskum nepotvrdzuje, že by poloha pri sexe ovplyvňovala šancu na počatie.",
  },
  {
    myth: "Ak si nedosiahla orgazmus, šanca je nižšia.",
    fact: "Otehotnieť sa dá s orgazmom aj bez neho — nie je to podmienka.",
  },
];

export const TTC_STRESS_NOTE =
  "Dôležité: neexistuje dôkaz, že by stres priamo spôsoboval neplodnosť. Ak je to náročné, je to náročné samo osebe — nie preto, že by si sa \"dostatočne neuvoľnila\". Starostlivosť o seba má zmysel pre teba, nie ako spôsob, ako si to \"vymodliť\".";

export const TTC_EMOTIONAL_NOTE =
  "Smútok, úzkosť aj to dvojtýždňové čakanie na výsledok testu sú skutočné a uznané — nie prehnaná reakcia. Rozhovor s niekým, kto tomu rozumie (partner, kamošky, podporná skupina, poradňa), naozaj pomáha uniesť to.";
