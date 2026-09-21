import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  CYCLE_PHASE_TIPS,
  CYCLE_PHASE_COLORS,
  CYCLE_TIP_CATEGORIES,
  type CyclePhaseKey,
  type CycleTipCategory,
} from "@/community/lib/cycle";

const FILTERS: Array<{ key: CycleTipCategory | "all"; label: string }> = [
  { key: "all", label: "Všetko" },
  { key: "do", label: CYCLE_TIP_CATEGORIES.do },
  { key: "eat", label: CYCLE_TIP_CATEGORIES.eat },
  { key: "move", label: CYCLE_TIP_CATEGORIES.move },
];

export function CyclePhaseTips({ phase }: { phase: CyclePhaseKey }) {
  const [filter, setFilter] = useState<CycleTipCategory | "all">("all");
  const tips = CYCLE_PHASE_TIPS[phase];
  const visible = filter === "all" ? tips : tips.filter((tip) => tip.category === filter);
  const color = CYCLE_PHASE_COLORS[phase];
  const softFill = color.fill.replace(/0\.\d+\)/, "0.6)");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter tipov">
        {FILTERS.map((item) => (
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
          return (
            <motion.div
              key={tip.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                style={{ background: softFill }}
                aria-hidden="true"
              >
                <Icon className="h-6 w-6" style={{ color: color.dot }} />
              </span>
              <p className="text-xs leading-tight text-foreground/85">{tip.label}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
