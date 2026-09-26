import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { CYCLE_PHASE_COLORS, CYCLE_PHASE_SEASON, type CyclePhaseKey } from "@/community/lib/cycle";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const ORDER: CyclePhaseKey[] = ["menstruacna", "folikularna", "ovulacia", "lutealna"];

/**
 * Brand manual "Štyri fázy = štyri ročné obdobia": the four seasons side by
 * side in their colours, with the one she's in right now lifted and marked.
 */
export function CycleSeasonStrip({ current }: { current: CyclePhaseKey }) {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === "en";

  return (
    <div className="grid grid-cols-4 gap-2" role="list" aria-label={t("cycle.seasonStripAriaLabel", { defaultValue: "Ročné obdobia cyklu" })}>
      {ORDER.map((phase, i) => {
        const color = CYCLE_PHASE_COLORS[phase];
        const isCurrent = phase === current;
        return (
          <motion.div
            key={phase}
            role="listitem"
            aria-current={isCurrent ? "true" : undefined}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.1 + i * 0.08 }}
            className={cn(
              "flex flex-col items-center justify-center rounded-2xl px-1 py-3 text-center transition-transform duration-500",
              isCurrent ? "scale-105 shadow-lg" : "shadow-sm",
            )}
            style={{ background: color.solid, color: color.onSolid }}
          >
            <span className="font-display text-base leading-tight">
              {isEnglish ? t(`cycle.seasons.${phase}.season`) : CYCLE_PHASE_SEASON[phase].season}
            </span>
            <span className={cn("mt-1 h-1 w-1 rounded-full", isCurrent ? "opacity-100" : "opacity-0")} style={{ background: color.onSolid }} aria-hidden="true" />
          </motion.div>
        );
      })}
    </div>
  );
}
