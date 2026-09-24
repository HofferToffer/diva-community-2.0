import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  CYCLE_PHASE_TIPS,
  CYCLE_PHASE_COLORS,
  CYCLE_TIP_CATEGORIES,
  type CycleTip,
  type CyclePhaseKey,
  type CycleTipCategory,
} from "@/community/lib/cycle";
import { floatIcon } from "@/community/lib/motion";

export function CyclePhaseTips({ phase }: { phase: CyclePhaseKey }) {
  return <TipGrid tips={CYCLE_PHASE_TIPS[phase]} color={CYCLE_PHASE_COLORS[phase]} />;
}

/**
 * Tip labels and category filters are translated here, in the one shared
 * component every tip grid app-wide renders through (cycle/menopause/
 * postpartum/pregnancy/TTC) — via i18next's defaultValue fallback, so
 * Slovak (the default) needs no "tips" resource bundle at all, and English
 * lights up automatically for every label added to en/common.json's "tips"
 * namespace, without touching any content file.
 */
export function TipGrid({ tips, color }: { tips: CycleTip[]; color: { fill: string; dot: string } }) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<CycleTipCategory | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const visible = filter === "all" ? tips : tips.filter((tip) => tip.category === filter);
  const softFill = color.fill.replace(/0\.\d+\)/, "0.6)");
  // Looked up as a plain object (not a dotted t() key) because several Slovak
  // labels contain periods, which i18next's default key separator would
  // otherwise try to parse as nested paths.
  const tipTranslations = t("tips", { returnObjects: true, defaultValue: {} }) as Record<string, string>;
  const tipDetailTranslations = t("tipDetails", { returnObjects: true, defaultValue: {} }) as Record<string, string>;

  const filters: Array<{ key: CycleTipCategory | "all"; label: string }> = [
    { key: "all", label: t("tipCategories.all", { defaultValue: "Všetko" }) },
    { key: "do", label: t("tipCategories.do", { defaultValue: CYCLE_TIP_CATEGORIES.do }) },
    { key: "eat", label: t("tipCategories.eat", { defaultValue: CYCLE_TIP_CATEGORIES.eat }) },
    { key: "move", label: t("tipCategories.move", { defaultValue: CYCLE_TIP_CATEGORIES.move }) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t("tipCategories.filterAriaLabel", { defaultValue: "Filter tipov" })}>
        {filters.map((item) => (
          <motion.button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={filter === item.key}
            onClick={() => setFilter(item.key)}
            whileTap={{ scale: 0.94 }}
            animate={{ scale: filter === item.key ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              filter === item.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
            )}
          >
            {item.label}
          </motion.button>
        ))}
      </div>

      <div key={filter} className="grid grid-cols-3 gap-x-2 gap-y-5 sm:grid-cols-4">
        {visible.map((tip, i) => {
          const Icon = tip.icon;
          const detailText = tip.detail ? tipDetailTranslations[tip.label] ?? tip.detail : null;
          const isOpen = expanded === tip.label;
          return (
            <motion.div
              key={tip.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <button
                type="button"
                disabled={!detailText}
                aria-expanded={detailText ? isOpen : undefined}
                onClick={() => setExpanded((prev) => (prev === tip.label ? null : tip.label))}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl p-1 transition-colors",
                  detailText ? "cursor-pointer active:bg-foreground/5" : "cursor-default",
                )}
              >
                <motion.span
                  {...floatIcon(i)}
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                  style={{ background: softFill }}
                  aria-hidden="true"
                >
                  <Icon className="h-6 w-6" style={{ color: color.dot }} />
                </motion.span>
                <span className="text-xs leading-tight text-foreground/85">
                  {tipTranslations[tip.label] ?? tip.label}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && detailText && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden text-[0.65rem] leading-snug text-muted-foreground"
                  >
                    {detailText}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {visible.some((tip) => tip.category === "eat") && (
        <p className="pt-1 text-center text-[0.65rem] text-muted-foreground/80">
          Lucia Loderer — sprievodkyňa harmonizáciou menštruačného cyklu pomocou výživy a rituálov.
        </p>
      )}
    </div>
  );
}
