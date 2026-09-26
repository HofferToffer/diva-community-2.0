import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CYCLE_PHASES, CYCLE_PHASE_COLORS, getCyclePhaseForDate, type CyclePhaseKey } from "@/community/lib/cycle";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function phaseFill(phase: CyclePhaseKey) {
  return CYCLE_PHASE_COLORS[phase].solid;
}

/** One month as a tiny grid of phase-coloured days — Monday-first, like the main calendar. */
function MiniMonth({
  year,
  month,
  lastPeriodDate,
  cycleLengthDays,
  periodLengthDays,
  isSelected,
  dateLocale,
  onPick,
}: {
  year: number;
  month: number;
  lastPeriodDate: string;
  cycleLengthDays: number;
  periodLengthDays: number;
  isSelected: boolean;
  dateLocale: string;
  onPick: () => void;
}) {
  const todayKey = toDateKey(new Date());
  const cells = useMemo(() => {
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const leadingBlanks = (first.getDay() + 6) % 7;
    const list: ({ date: Date; phase: CyclePhaseKey | null } | null)[] = Array.from({ length: leadingBlanks }, () => null);
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      list.push({ date, phase: getCyclePhaseForDate(lastPeriodDate, cycleLengthDays, date, periodLengthDays) });
    }
    return list;
  }, [year, month, lastPeriodDate, cycleLengthDays, periodLengthDays]);

  const monthName = new Intl.DateTimeFormat(dateLocale, { month: "long" }).format(new Date(year, month, 1));

  return (
    <button
      type="button"
      onClick={onPick}
      aria-label={`${monthName} ${year}`}
      className={cn(
        "w-full rounded-2xl p-2.5 text-left transition-all duration-500 ease-out hover:bg-secondary/30 hover:shadow-sm active:scale-[0.98]",
        isSelected && "bg-secondary/30",
      )}
    >
      <p className="mb-1.5 px-0.5 font-display text-sm capitalize">{monthName}</p>
      <div className="grid grid-cols-7 gap-[3px]">
        {cells.map((cell, i) => {
          if (!cell) return <span key={i} aria-hidden="true" />;
          const key = toDateKey(cell.date);
          return (
            <span
              key={i}
              aria-hidden="true"
              className={cn(
                "flex aspect-square items-center justify-center rounded-full text-[0.5rem] leading-none text-foreground/75",
                key === todayKey && "font-semibold text-foreground ring-1 ring-primary",
                key === lastPeriodDate && "ring-1 ring-foreground",
              )}
              style={cell.phase ? { background: phaseFill(cell.phase), color: CYCLE_PHASE_COLORS[cell.phase].onSolid } : undefined}
            >
              {cell.date.getDate()}
            </span>
          );
        })}
      </div>
    </button>
  );
}

/**
 * Whole-year overview of the (estimated) cycle phases. Tapping a month
 * closes the overview and jumps the main calendar to that month.
 */
export function CycleYearCalendar({
  open,
  onOpenChange,
  initialYear,
  selectedMonth,
  lastPeriodDate,
  cycleLengthDays,
  periodLengthDays,
  onPickMonth,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialYear: number;
  /** The month the main calendar currently shows, highlighted softly. */
  selectedMonth: Date;
  lastPeriodDate: string;
  cycleLengthDays: number;
  periodLengthDays: number;
  onPickMonth: (month: Date) => void;
}) {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === "en" ? "en-US" : "sk-SK";
  const phaseName = (phase: CyclePhaseKey) =>
    i18n.language === "en" ? t(`cycle.phaseNames.${phase}`) : CYCLE_PHASES[phase].name;
  const [year, setYear] = useState(initialYear);

  // Re-sync to the main calendar's year each time the overview opens.
  const [lastOpen, setLastOpen] = useState(open);
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) setYear(initialYear);
  }

  // Swipe left/right changes the year; keep the gesture away from the
  // app-wide swipe-back listener, same as the month calendar.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchMove = (e: React.TouchEvent) => e.stopPropagation();
  const onTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    setYear((y) => (dx < 0 ? y + 1 : y - 1));
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/25 backdrop-blur-sm duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-card p-4 shadow-lg duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:p-6"
        >
          <div className="flex items-center justify-between gap-2 pr-8">
            <Button type="button" variant="ghost" size="icon" aria-label={t("calendar.prevYear")} onClick={() => setYear((y) => y - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <DialogPrimitive.Title className="font-display text-2xl">{year}</DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-xs text-muted-foreground">
                {t("calendar.yearSubtitle")}
              </DialogPrimitive.Description>
            </div>
            <Button type="button" variant="ghost" size="icon" aria-label={t("calendar.nextYear")} onClick={() => setYear((y) => y + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <DialogPrimitive.Close
            className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={t("calendar.closeYear")}
          >
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>

          <motion.div
            key={year}
            className="mt-4 grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-2"
            initial="hidden"
            animate="shown"
            variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.04 } } }}
          >
            {Array.from({ length: 12 }, (_, month) => (
              <motion.div
                key={month}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
                }}
              >
                <MiniMonth
                  year={year}
                  month={month}
                  lastPeriodDate={lastPeriodDate}
                  cycleLengthDays={cycleLengthDays}
                  periodLengthDays={periodLengthDays}
                  dateLocale={dateLocale}
                  isSelected={selectedMonth.getFullYear() === year && selectedMonth.getMonth() === month}
                  onPick={() => {
                    onPickMonth(new Date(year, month, 1));
                    onOpenChange(false);
                  }}
                />
              </motion.div>
            ))}
          </motion.div>

          <p className="mt-4 text-xs text-muted-foreground">{t("calendar.yearHint")}</p>

          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-label={t("calendar.legendAriaLabel")}>
            {(Object.keys(CYCLE_PHASES) as CyclePhaseKey[]).map((phase) => (
              <li key={phase} className="flex items-center gap-1.5">
                <span aria-hidden="true" className="inline-block h-3 w-3 rounded-full" style={{ background: phaseFill(phase) }} />
                {phaseName(phase)}
              </li>
            ))}
          </ul>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
