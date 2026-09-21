import { useMemo } from "react";
import { Link } from "react-router-dom";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import { type DailyFeeling, useDailyFeelings, useProfileActivities } from "@/community/hooks/queries";
import FeelingScaleChart from "@/community/components/FeelingScaleChart";
import { levelForFeeling, scaleLabel } from "@/community/lib/consciousnessScale";
import { moodDetails } from "@/community/lib/feelings";
import { cn } from "@/lib/utils";

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function CommunityFeelingHistory() {
  const { profile } = useCommunityAuth();
  const { data: feelings, isLoading } = useDailyFeelings(profile?.id);
  const { data: allActivities } = useProfileActivities(profile?.id);
  const chartActivities = useMemo(
    () =>
      (allActivities ?? []).map((a) => ({
        activity_date: a.activity_date,
        kind: a.kind,
        activity_type: a.activity_type,
        distance_km: a.distance_km ?? null,
      })),
    [allActivities],
  );
  const today = useMemo(() => localDateKey(), []);
  const cycleData = useMemo(
    () =>
      profile?.last_period_date && profile?.cycle_length_days
        ? { lastPeriodDate: profile.last_period_date, cycleLengthDays: profile.cycle_length_days }
        : null,
    [profile?.last_period_date, profile?.cycle_length_days],
  );

  return (
    <div className="space-y-10">
      <section className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Moja cesta</p>
        <h1 className="mt-2 font-display text-4xl leading-tight">História môjho prežívania</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Graf tvojich pocitov v čase a prehľad všetkých záznamov podľa dátumov.
        </p>
      </section>

      {isLoading ? (
        <Skeleton className="h-72 w-full" />
      ) : !feelings?.length ? (
        <section className="rounded-lg border border-dashed border-border px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Zatiaľ nemáš zapísaný žiadny pocit. Keď si zapíšeš prvý, uvidíš tu svoj graf aj históriu.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/community/pocit">
              <PenLine className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Zapísať dnešný pocit
            </Link>
          </Button>
        </section>
      ) : (
        <>
          {!cycleData && (
            <p className="text-sm text-muted-foreground">
              Graf zatiaľ nezobrazuje fázy cyklu — doplň si dátum poslednej menštruácie v{" "}
              <Link to="/community/cyklus" className="underline hover:text-foreground">
                Môj cyklus
              </Link>
              .
            </p>
          )}
          <FeelingScaleChart feelings={feelings} cycle={cycleData} activities={chartActivities} />

          <div className="border-t border-border pt-8">
            <h2 className="font-display text-2xl">Moja história pocitov</h2>
            <p className="mt-1 text-sm text-muted-foreground">Prehľad všetkých zaznamenaných pocitov podľa dátumov.</p>
            <div className="mt-6 space-y-8">
              {Object.entries(
                feelings.reduce<Record<string, DailyFeeling[]>>((groups, item) => {
                  const key = new Intl.DateTimeFormat("sk-SK", { year: "numeric", month: "long" }).format(
                    new Date(`${item.feeling_date}T12:00:00`),
                  );
                  (groups[key] ??= []).push(item);
                  return groups;
                }, {}),
              ).map(([month, items]) => (
                <div key={month}>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">{month}</h3>
                  <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-card/40" aria-label={`História pocitov ${month}`}>
                    {items.map((item) => {
                      const details = moodDetails(item.mood);
                      const MoodIcon = details.icon;
                      const itemDate = new Date(`${item.feeling_date}T12:00:00`);
                      const isToday = item.feeling_date === today;
                      return (
                        <li key={item.id} className="flex items-start gap-4 px-4 py-4">
                          <div className="flex w-14 flex-col items-center justify-center rounded-md bg-secondary py-2 text-secondary-foreground">
                            <span className="text-[0.65rem] font-semibold uppercase leading-none">{new Intl.DateTimeFormat("sk-SK", { weekday: "short" }).format(itemDate)}</span>
                            <span className="mt-0.5 font-display text-xl leading-none">{itemDate.getDate()}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="font-medium">
                                <MoodIcon className="-mt-0.5 mr-1.5 inline h-4 w-4 text-primary" aria-hidden="true" />
                                {item.feeling_detail ? `${details.label} · ${item.feeling_detail}` : details.label}
                              </p>
                              <span className="rounded-full bg-secondary px-2 py-0.5 text-[0.65rem] text-secondary-foreground">
                                {levelForFeeling(item.mood, item.feeling_detail)} · {scaleLabel(levelForFeeling(item.mood, item.feeling_detail))}
                              </span>
                              <time className="text-xs text-muted-foreground" dateTime={item.feeling_date}>
                                {isToday ? "Dnes" : new Intl.DateTimeFormat("sk-SK", { day: "numeric", month: "long", year: itemDate.getFullYear() === new Date().getFullYear() ? undefined : "numeric" }).format(itemDate)}
                              </time>
                            </div>
                            {item.note && <p className={cn("mt-1.5 text-sm leading-relaxed text-muted-foreground", "break-words")}>{item.note}</p>}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
