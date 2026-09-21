import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function CycleCalendar({
  lastPeriodDate,
  cycleLengthDays,
}: {
  lastPeriodDate: string;
  cycleLengthDays: number;
}) {
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()));
  const today = new Date();

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
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Predchádzajúci mesiac"
          onClick={() => setMonthCursor((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="font-display text-lg capitalize">{monthLabel}</p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Nasledujúci mesiac"
          onClick={() => setMonthCursor((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[0.65rem] uppercase tracking-wide text-muted-foreground">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="mt-1 space-y-1">
        {weeks.map((week, i) => (
          <div key={i} className="grid grid-cols-7 gap-1">
            {week.map((cell, j) =>
              cell ? (
                <div
                  key={j}
                  title={cell.phase ? CYCLE_PHASES[cell.phase].name : undefined}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-full text-xs text-foreground/85",
                    isSameDay(cell.date, today) && "font-semibold ring-2 ring-primary ring-offset-1 ring-offset-card",
                  )}
                  style={{
                    background: cell.phase ? CYCLE_PHASE_COLORS[cell.phase].fill.replace(/0\.\d+\)/, "0.6)") : undefined,
                  }}
                >
                  {cell.date.getDate()}
                </div>
              ) : (
                <div key={j} aria-hidden="true" />
              ),
            )}
          </div>
        ))}
      </div>

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
    </div>
  );
}
