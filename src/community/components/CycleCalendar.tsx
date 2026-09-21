import { useMemo, useRef, useState } from "react";
import { CalendarHeart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CYCLE_PHASES, CYCLE_PHASE_COLORS, getCyclePhaseForDate, type CyclePhaseKey } from "@/community/lib/cycle";

const WEEKDAYS = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

type Cell = { date: Date; phase: CyclePhaseKey | null };

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function CycleCalendar({
  lastPeriodDate,
  cycleLengthDays,
  onSelectPeriodStart,
}: {
  lastPeriodDate: string;
  cycleLengthDays: number;
  /** Called when the woman taps a day to correct/log the actual start of her period. */
  onSelectPeriodStart?: (dateKey: string) => void;
}) {
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()));
  const [pendingDate, setPendingDate] = useState<Date | null>(null);
  const today = new Date();
  const pendingPhase = pendingDate ? getCyclePhaseForDate(lastPeriodDate, cycleLengthDays, pendingDate) : null;

  const confirmPendingDate = () => {
    if (!pendingDate) return;
    onSelectPeriodStart?.(toDateKey(pendingDate));
    setPendingDate(null);
  };

  const goToPrevMonth = () => setMonthCursor((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const goToNextMonth = () => setMonthCursor((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) goToNextMonth();
    else goToPrevMonth();
  };

  const weeks = useMemo(() => {
    const first = startOfMonth(monthCursor);
    const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const leadingBlanks = (first.getDay() + 6) % 7; // Monday-first grid

    const cells: (Cell | null)[] = Array.from({ length: leadingBlanks }, () => null);
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(first.getFullYear(), first.getMonth(), day);
      cells.push({ date, phase: getCyclePhaseForDate(lastPeriodDate, cycleLengthDays, date) });
    }
    while (cells.length % 7 !== 0) cells.push(null);

    const rows: (Cell | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [monthCursor, lastPeriodDate, cycleLengthDays]);

  const monthLabel = new Intl.DateTimeFormat("sk-SK", { month: "long", year: "numeric" }).format(monthCursor);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" size="icon" aria-label="Predchádzajúci mesiac" onClick={goToPrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="font-display text-lg capitalize">{monthLabel}</p>
        <Button type="button" variant="ghost" size="icon" aria-label="Nasledujúci mesiac" onClick={goToNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[0.65rem] uppercase tracking-wide text-muted-foreground">
          {WEEKDAYS.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="mt-1 space-y-1">
        {weeks.map((week, i) => (
          <div key={i} className="grid grid-cols-7 gap-1">
            {week.map((cell, j) => {
              if (!cell) return <div key={j} aria-hidden="true" />;
              const isPeriodStart = toDateKey(cell.date) === lastPeriodDate;
              const isPast = cell.date <= today;
              const canEdit = !!onSelectPeriodStart && isPast;
              return (
                <button
                  key={j}
                  type="button"
                  disabled={!canEdit}
                  title={cell.phase ? CYCLE_PHASES[cell.phase].name : undefined}
                  aria-label={`${cell.date.getDate()}. ${monthLabel}${isPeriodStart ? " — začiatok poslednej menštruácie" : ""}`}
                  onClick={() => setPendingDate(cell.date)}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-full text-sm text-foreground/85 transition-all",
                    isSameDay(cell.date, today) && "font-semibold ring-2 ring-primary ring-offset-1 ring-offset-card",
                    isPeriodStart && "ring-2 ring-foreground ring-offset-1 ring-offset-card",
                    canEdit && "cursor-pointer hover:scale-110 hover:shadow-sm active:scale-95",
                  )}
                  style={{
                    background: cell.phase ? CYCLE_PHASE_COLORS[cell.phase].fill.replace(/0\.\d+\)/, "0.6)") : undefined,
                  }}
                >
                  {cell.date.getDate()}
                </button>
              );
            })}
          </div>
        ))}
        </div>
      </div>

      {onSelectPeriodStart && (
        <p className="mt-3 text-xs text-muted-foreground">
          Ťukni na deň, kedy ti naozaj začala posledná menštruácia, ak sa líši od odhadu.
        </p>
      )}

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-label="Legenda fáz cyklu">
        {(Object.keys(CYCLE_PHASES) as CyclePhaseKey[]).map((phase) => (
          <li key={phase} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="inline-block h-3 w-3 rounded-full"
              style={{ background: CYCLE_PHASE_COLORS[phase].fill.replace(/0\.\d+\)/, "0.6)") }}
            />
            {CYCLE_PHASES[phase].name}
          </li>
        ))}
      </ul>

      <Dialog open={!!pendingDate} onOpenChange={(open) => !open && setPendingDate(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <CalendarHeart className="h-6 w-6" aria-hidden="true" />
            </div>
            <DialogTitle className="text-center">
              {pendingDate && new Intl.DateTimeFormat("sk-SK", { day: "numeric", month: "long" }).format(pendingDate)}
            </DialogTitle>
            {pendingPhase && (
              <p className="text-center text-sm font-medium" style={{ color: CYCLE_PHASE_COLORS[pendingPhase].dot }}>
                {CYCLE_PHASES[pendingPhase].name}
              </p>
            )}
            <DialogDescription className="text-center">
              Nastaviť tento deň ako prvý deň poslednej menštruácie? Prepočítame podľa neho fázy cyklu.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setPendingDate(null)}>
              Zrušiť
            </Button>
            <Button className="flex-1" onClick={confirmPendingDate}>
              Nastaviť
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
