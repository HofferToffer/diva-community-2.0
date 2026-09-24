import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  ReferenceArea,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import type { DailyFeeling } from "@/community/hooks/queries";
import { SCALE_LEVELS, levelForFeeling, scaleLabel } from "@/community/lib/consciousnessScale";
import { CYCLE_PHASES, CYCLE_PHASE_COLORS, getCycleDayForDate, getCyclePhaseForDate, type CyclePhaseKey } from "@/community/lib/cycle";
import { activityTypeLabel } from "@/community/lib/constants";

const RANGES = [
  { key: "week", label: "Týždeň", labelKey: "rangeWeek", days: 7 },
  { key: "month", label: "Mesiac", labelKey: "rangeMonth", days: 30 },
  { key: "quarter", label: "3 mesiace", labelKey: "rangeQuarter", days: 90 },
  { key: "year", label: "Rok", labelKey: "rangeYear", days: 365 },
] as const;

const DAY_MS = 24 * 60 * 60 * 1000;

const PHASE_STYLES = CYCLE_PHASE_COLORS;

export type FeelingChartCycle = {
  lastPeriodDate: string;
  cycleLengthDays: number;
  periodLengthDays?: number;
};

export type FeelingChartActivity = {
  activity_date: string;
  kind: "run" | "move";
  activity_type: string;
  distance_km: number | null;
};

const ACTIVITY_Y = 15;
const ACTIVITY_COLOR = "hsl(344, 37%, 65%)"; // fixed, not hsl(var(--accent)) — see note on feelingScaleFill above

export default function FeelingScaleChart({
  feelings,
  cycle,
  activities,
}: {
  feelings: DailyFeeling[];
  cycle?: FeelingChartCycle | null;
  activities?: FeelingChartActivity[];
}) {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === "en";
  const phaseNameTranslations = t("cycle.phaseNames", { returnObjects: true, defaultValue: {} }) as Record<string, string>;
  const translatePhaseName = (phase: CyclePhaseKey) => (isEnglish ? phaseNameTranslations[phase] ?? CYCLE_PHASES[phase].name : CYCLE_PHASES[phase].name);
  const scaleTranslations = t("consciousnessScale", { returnObjects: true, defaultValue: {} }) as Record<string, string>;
  const translateScale = (label: string) => (isEnglish ? scaleTranslations[label] ?? label : label);
  const activityTypeTranslations = t("activityTypeLabel", { returnObjects: true, defaultValue: {} }) as Record<string, string>;
  const translateActivityType = (label: string) => (isEnglish ? activityTypeTranslations[label] ?? label : label);
  const [range, setRange] = useState<(typeof RANGES)[number]["key"]>("month");
  const days = RANGES.find((item) => item.key === range)?.days ?? 30;

  const { data, phaseBands, hasFeelings, hasActivities } = useMemo(() => {
    const byDate = new Map(feelings.map((item) => [item.feeling_date, item]));
    const activitiesByDate = new Map<string, { labels: Set<string>; km: number }>();
    for (const activity of activities ?? []) {
      const entry = activitiesByDate.get(activity.activity_date) ?? { labels: new Set<string>(), km: 0 };
      entry.labels.add(translateActivityType(activityTypeLabel(activity.kind, activity.activity_type)));
      if (activity.distance_km) entry.km += activity.distance_km;
      activitiesByDate.set(activity.activity_date, entry);
    }
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const points: Array<{
      ts: number;
      date: string;
      level: number | null;
      name: string | null;
      phase: CyclePhaseKey | null;
      dayOfCycle: number | null;
      activityLabel: string | null;
      activityKm: number | null;
      activityY: number | null;
    }> = [];

    for (let i = days - 1; i >= 0; i -= 1) {
      const date = new Date(today.getTime() - i * DAY_MS);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const feeling = byDate.get(key);
      const level = feeling ? levelForFeeling(feeling.mood, feeling.feeling_detail) : null;
      const dayActivities = activitiesByDate.get(key);
      points.push({
        ts: date.getTime(),
        date: key,
        level,
        name: level !== null ? translateScale(scaleLabel(level)) : null,
        phase: cycle ? getCyclePhaseForDate(cycle.lastPeriodDate, cycle.cycleLengthDays, date, cycle.periodLengthDays ?? 5) : null,
        dayOfCycle: cycle ? getCycleDayForDate(cycle.lastPeriodDate, cycle.cycleLengthDays, date) : null,
        activityLabel: dayActivities ? Array.from(dayActivities.labels).join(", ") : null,
        activityKm: dayActivities?.km ? Math.round(dayActivities.km * 100) / 100 : null,
        activityY: dayActivities ? ACTIVITY_Y : null,
      });
    }

    // Group consecutive days of the same phase into bands.
    const bands: Array<{ from: number; to: number; phase: CyclePhaseKey }> = [];
    for (const point of points) {
      if (!point.phase) continue;
      const lastBand = bands[bands.length - 1];
      if (lastBand && lastBand.phase === point.phase) {
        lastBand.to = point.ts;
      } else {
        bands.push({ from: point.ts, to: point.ts, phase: point.phase });
      }
    }

    return {
      data: points,
      phaseBands: bands,
      hasFeelings: points.some((point) => point.level !== null),
      hasActivities: points.some((point) => point.activityLabel !== null),
    };
  }, [feelings, days, cycle, activities, isEnglish]);

  const levels = data.filter((point) => point.level !== null);
  const average = levels.length
    ? Math.round(levels.reduce((sum, item) => sum + (item.level ?? 0), 0) / levels.length)
    : null;

  const formatDay = (ts: number) =>
    new Intl.DateTimeFormat(isEnglish ? "en-US" : "sk-SK", {
      day: "numeric",
      month: "numeric",
      ...(days > 90 ? { year: "2-digit" } : {}),
    }).format(new Date(ts));

  const tickInterval = Math.max(1, Math.floor(days / 8));

  return (
    <section className="border-t border-border pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">{t("feelingChart.title")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("feelingChart.subtitle")}
            {cycle ? t("feelingChart.subtitleWithCycle") : ""}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {RANGES.map((item) => (
            <Button
              key={item.key}
              type="button"
              size="sm"
              variant={range === item.key ? "default" : "outline"}
              aria-pressed={range === item.key}
              onClick={() => setRange(item.key)}
            >
              {t(`feelingChart.${item.labelKey}`)}
            </Button>
          ))}
        </div>
      </div>

      {hasFeelings || hasActivities ? (
        <>
          {average !== null && (
            <p className="mt-4 text-sm text-muted-foreground">
              {t("feelingChart.averageLabel")} <span className="font-medium text-foreground">{average} · {translateScale(scaleLabel(average))}</span>
            </p>
          )}
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
                <defs>
                  {/* Fixed color, not hsl(var(--primary)) — that shifts with today's cycle-phase
                      theme, which would recolor this whole multi-month trend line to whatever
                      phase you're in today, clashing with the per-day phase bands/dots below. */}
                  <linearGradient id="feelingScaleFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(344, 28%, 62%)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(344, 28%, 62%)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="ts"
                  type="number"
                  domain={["dataMin", "dataMax"]}
                  tickFormatter={formatDay}
                  ticks={data.filter((_, index) => index % tickInterval === 0).map((point) => point.ts)}
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  domain={[0, 700]}
                  ticks={SCALE_LEVELS.map((level) => level.value).reverse()}
                  tick={{ fontSize: 10 }}
                  width={44}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelFormatter={(value) => t("feelingChart.dateLabel", { date: formatDay(Number(value)) })}
                  formatter={(value: number | null, _name, item) => {
                    const payload = item?.payload as {
                      name?: string | null;
                      phase?: CyclePhaseKey | null;
                      dayOfCycle?: number | null;
                      activityLabel?: string | null;
                      activityKm?: number | null;
                    } | undefined;
                    if (item?.dataKey === "activityY") {
                      const kmText = payload?.activityKm ? ` · ${payload.activityKm} km` : "";
                      return [`${payload?.activityLabel}${kmText}`, t("feelingChart.activityTooltipLabel")];
                    }
                    const lines = [
                      value !== null && value !== undefined ? `${value} · ${payload?.name}` : t("feelingChart.noRecordTooltip"),
                    ];
                    if (payload?.activityLabel) {
                      const kmText = payload.activityKm ? ` · ${payload.activityKm} km` : "";
                      lines.push(`${payload.activityLabel}${kmText}`);
                    }
                    if (payload?.phase) {
                      const phaseName = translatePhaseName(payload.phase);
                      const cycleLine = payload.dayOfCycle
                        ? isEnglish
                          ? `${phaseName} · day ${payload.dayOfCycle}`
                          : `${phaseName} · deň ${payload.dayOfCycle}.`
                        : phaseName;
                      lines.push(cycleLine);
                    }
                    return [lines.filter(Boolean).join(" · "), t("feelingChart.levelTooltipLabel")];
                  }}
                />
                {phaseBands.map((band) => (
                  <ReferenceArea
                    key={`${band.phase}-${band.from}`}
                    x1={band.from}
                    x2={band.to === band.from ? band.to + DAY_MS : band.to}
                    fill={PHASE_STYLES[band.phase].fill}
                    strokeOpacity={0}
                  />
                ))}
                <Area
                  type="monotone"
                  dataKey="level"
                  connectNulls
                  stroke="hsl(344, 28%, 62%)"
                  strokeWidth={2}
                  fill="url(#feelingScaleFill)"
                  dot={(props: {
                    cx?: number;
                    cy?: number;
                    payload?: { level: number | null; phase: CyclePhaseKey | null };
                  }) => {
                    const { cx, cy, payload } = props;
                    if (payload?.level == null || cx == null || cy == null) return <g key={String(cx)} />;
                    return (
                      <circle
                        key={`${cx}-${cy}`}
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill={payload.phase ? PHASE_STYLES[payload.phase].dot : "hsl(344, 28%, 62%)"}
                        stroke="hsl(var(--card))"
                        strokeWidth={1.5}
                      />
                    );
                  }}
                />
                {hasActivities && (
                  <Scatter
                    dataKey="activityY"
                    fill={ACTIVITY_COLOR}
                    shape={(props: { cx?: number; cy?: number; payload?: { activityY: number | null } }) => {
                      const { cx, cy, payload } = props;
                      if (payload?.activityY == null || cx == null || cy == null) return <g key={String(cx)} />;
                      return (
                        <circle
                          key={`activity-${cx}-${cy}`}
                          cx={cx}
                          cy={cy}
                          r={5}
                          fill={ACTIVITY_COLOR}
                          stroke="hsl(var(--card))"
                          strokeWidth={1.5}
                        />
                      );
                    }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          {cycle && (
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-label={t("feelingChart.cyclePhaseLegendAriaLabel")}>
              {(Object.keys(CYCLE_PHASES) as CyclePhaseKey[]).map((phase) => (
                <li key={phase} className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="inline-block h-3 w-3 rounded-sm border border-border"
                    style={{ background: PHASE_STYLES[phase].fill.replace(/0\.\d+\)/, "0.5)") }}
                  />
                  {translatePhaseName(phase)}
                </li>
              ))}
            </ul>
          )}
          {hasActivities && (
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-label={t("feelingChart.activityLegendAriaLabel")}>
              <li className="flex items-center gap-1.5">
                <span aria-hidden="true" className="inline-block h-3 w-3 rounded-full" style={{ background: ACTIVITY_COLOR }} />
                {t("feelingChart.activityLegendText")}
              </li>
            </ul>
          )}
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {SCALE_LEVELS.filter((level) => level.value >= 20).slice(0, 8).map((level) => (
              <li key={level.value}>{level.value} {translateScale(level.label)}</li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          {t("feelingChart.emptyText")}
        </p>
      )}
    </section>
  );
}
