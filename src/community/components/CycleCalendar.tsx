import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarHeart, ChevronLeft, ChevronRight, Egg, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  intimacyDates,
  onToggleIntimacy,
}: {
  lastPeriodDate: string;
  cycleLengthDays: number;
  /** Called when the woman taps a day to correct/log the actual start of her period. */
  onSelectPeriodStart?: (dateKey: string) => void;
  /** Dates (YYYY-MM-DD) she's logged, for women trying to conceive. */
  intimacyDates?: Set<string>;
  onToggleIntimacy?: (dateKey: string) => void;
}) {
  const { t, i18n } = useTranslation();
  // Only the phase name text is translated here — the calendar's swipe/tap
  // handling and date math below are untouched.
  const phaseName = (phase: CyclePhaseKey) =>
    i18n.language === "en" ? t(`cycle.phaseNames.${phase}`) : CYCLE_PHASES[phase].name;
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()));
  const [pendingDateKey, setPendingDateKey] = useState<string | null>(null);
  const today = new Date();

  const confirmPendingDate = (date: Date) => {
    onSelectPeriodStart?.(toDateKey(date));
    setPendingDateKey(null);
  };

  const goToPrevMonth = () => setMonthCursor((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const goToNextMonth = () => setMonthCursor((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  // Swiping over the calendar changes month, not "go back" — stop the touch
  // from bubbling up to the app-wide swipe-back listener on window.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
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
    <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" size="icon" aria-label="Predchádzajúci mesiac" onClick={goToPrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="font-display text-lg capitalize">{monthLabel}</p>
        <Button type="button" variant="ghost" size="icon" aria-label="Nasledujúci mesiac" onClick={goToNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
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
              const dateKey = toDateKey(cell.date);
              const isPeriodStart = dateKey === lastPeriodDate;
              const isPast = cell.date <= today;
              const canLogIntimacy = !!onToggleIntimacy && isPast;
              const canEdit = !!onSelectPeriodStart && isPast && !canLogIntimacy;
              const canPreview = !isPast; // future days: tap to see which phase it'll be
              const canOpen = canEdit || canLogIntimacy || canPreview;
              const isPending = pendingDateKey === dateKey;
              const isLogged = intimacyDates?.has(dateKey) ?? false;
              const isPeakFertility = cell.phase === "ovulacia";

              const dayButton = (
                <button
                  type="button"
                  disabled={!canOpen}
                  title={cell.phase ? phaseName(cell.phase) : undefined}
                  aria-label={
                    canLogIntimacy
                      ? `${cell.date.getDate()}. ${monthLabel}${isLogged ? " — zapísané, ťuknutím odznačíš" : " — ťuknutím zapíšeš"}`
                      : `${cell.date.getDate()}. ${monthLabel}${isPeriodStart ? " — začiatok poslednej menštruácie" : ""}`
                  }
                  onClick={() => (canLogIntimacy ? onToggleIntimacy!(dateKey) : setPendingDateKey(dateKey))}
                  className={cn(
                    "relative flex aspect-square w-full items-center justify-center rounded-full text-sm text-foreground/85 transition-all",
                    isSameDay(cell.date, today) && "font-semibold ring-2 ring-primary ring-offset-1 ring-offset-card",
                    isPeriodStart && "ring-2 ring-foreground ring-offset-1 ring-offset-card",
                    canOpen && "cursor-pointer hover:scale-110 hover:shadow-sm active:scale-95",
                  )}
                  style={{
                    background: cell.phase ? CYCLE_PHASE_COLORS[cell.phase].fill.replace(/0\.\d+\)/, "0.6)") : undefined,
                  }}
                >
                  {cell.date.getDate()}
                  {isLogged && (
                    <Heart
                      className="absolute -bottom-0.5 -right-0.5 h-3 w-3"
                      style={{ color: "hsl(354, 45%, 50%)", fill: "hsl(354, 45%, 50%)" }}
                      aria-hidden="true"
                    />
                  )}
                  {isPeakFertility && !isLogged && (
                    <Egg
                      className="absolute -bottom-0.5 -right-0.5 h-3 w-3"
                      style={{ color: "hsl(32, 45%, 46%)" }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );

              if (!canEdit && !canPreview) return <div key={j}>{dayButton}</div>;

              return (
                <Popover key={j} open={isPending} onOpenChange={(open) => !open && setPendingDateKey(null)}>
                  <PopoverTrigger asChild>{dayButton}</PopoverTrigger>
                  <PopoverContent className="w-64 rounded-2xl border-none shadow-lg" align="center">
                    <div className="flex items-center gap-3">
                      <CalendarHeart className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="font-display text-lg leading-tight">
                          {new Intl.DateTimeFormat("sk-SK", { day: "numeric", month: "long" }).format(cell.date)}
                        </p>
                        {cell.phase && (
                          <p className="text-sm font-medium" style={{ color: CYCLE_PHASE_COLORS[cell.phase].dot }}>
                            {phaseName(cell.phase)}
                            {isPeakFertility && " · najvyššia šanca na otehotnenie"}
                          </p>
                        )}
                      </div>
                    </div>

                    {canEdit ? (
                      <>
                        <p className="mt-3 text-sm text-muted-foreground">
                          Nastaviť tento deň ako prvý deň poslednej menštruácie? Prepočítame podľa neho fázy cyklu.
                        </p>
                        <div className="mt-3 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => setPendingDateKey(null)}>
                            Zrušiť
                          </Button>
                          <Button size="sm" className="flex-1" onClick={() => confirmPendingDate(cell.date)}>
                            Nastaviť
                          </Button>
                        </div>
                      </>
                    ) : (
                      <p className="mt-3 text-sm text-muted-foreground">Odhad podľa tvojho cyklu.</p>
                    )}
                  </PopoverContent>
                </Popover>
              );
            })}
          </div>
        ))}
        </div>
      </div>

      {onToggleIntimacy && (
        <p className="mt-3 text-xs text-muted-foreground">
          Ťukni na deň a označ ho srdiečkom{" "}
          <Heart className="inline h-3 w-3 align-[-1px]" style={{ color: "hsl(354, 45%, 50%)", fill: "hsl(354, 45%, 50%)" }} aria-hidden="true" />{" "}
          — deň, kedy ste mali sex. Znova ťukni, ak ho chceš odznačiť.
        </p>
      )}

      {onSelectPeriodStart && !onToggleIntimacy && (
        <p className="mt-3 text-xs text-muted-foreground">
          Ťukni na deň, kedy ti naozaj začala posledná menštruácia, ak sa líši od odhadu.
        </p>
      )}

      <p className="mt-3 text-xs text-muted-foreground">
        Ťukni aj na budúci deň — ukážeme ti, akú fázu vtedy podľa odhadu budeš mať.
      </p>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-label="Legenda fáz cyklu">
        {(Object.keys(CYCLE_PHASES) as CyclePhaseKey[]).map((phase) => (
          <li key={phase} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="inline-block h-3 w-3 rounded-full"
              style={{ background: CYCLE_PHASE_COLORS[phase].fill.replace(/0\.\d+\)/, "0.6)") }}
            />
            {phaseName(phase)}
          </li>
        ))}
        {onToggleIntimacy && (
          <li className="flex items-center gap-1.5">
            <Heart
              className="h-3 w-3"
              style={{ color: "hsl(354, 45%, 50%)", fill: "hsl(354, 45%, 50%)" }}
              aria-hidden="true"
            />
            Sex
          </li>
        )}
        <li className="flex items-center gap-1.5">
          <Egg className="h-3 w-3" style={{ color: "hsl(32, 45%, 46%)" }} aria-hidden="true" />
          Najvyššia šanca na otehotnenie
        </li>
      </ul>
    </div>
  );
}
