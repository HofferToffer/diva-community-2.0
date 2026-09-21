import {
  Bed,
  Dumbbell,
  Egg,
  Footprints,
  GlassWater,
  Leaf,
  MessageCircle,
  Milk,
  PersonStanding,
  Snowflake,
  Sprout,
  Waves,
} from "lucide-react";
import type { CycleTip } from "@/community/lib/cycle";

/**
 * Tips for menopause, in the same do/eat/move shape as the cycle-phase tips.
 * Sourced from Cleveland Clinic, Mayo Clinic and Healthline guidance on
 * menopause nutrition and exercise (protein + resistance training for muscle
 * and bone loss, iron and hydration against fatigue/brain fog, phytoestrogens
 * and calcium/vitamin D for symptom and bone support).
 */
export const MENOPAUSE_TIPS: CycleTip[] = [
  { label: "Bielkoviny pri každom jedle", category: "eat", icon: Egg },
  { label: "Vápnik a vitamín D", category: "eat", icon: Milk },
  { label: "Potraviny bohaté na železo", category: "eat", icon: Leaf },
  { label: "Sójové a strukovinové jedlá", category: "eat", icon: Sprout },
  { label: "Dostatok vody", category: "eat", icon: GlassWater },
  { label: "Silový tréning", category: "move", icon: Dumbbell },
  { label: "Rezká chôdza", category: "move", icon: Footprints },
  { label: "Joga a strečing", category: "move", icon: PersonStanding },
  { label: "Cvičenia na panvové dno", category: "move", icon: Waves },
  { label: "Chladenie pri návaloch", category: "do", icon: Snowflake },
  { label: "Pravidelný spánkový režim", category: "do", icon: Bed },
  { label: "Hovor o tom nahlas", category: "do", icon: MessageCircle },
];
