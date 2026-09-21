import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import { ActivityCard } from "@/community/components/ActivityCard";
import { EmptyState, StatTile } from "@/community/components/EmptyState";
import { goalUnit } from "@/community/components/ChallengeCard";
import { useActiveChallenge, useChallengeProgress, useDailyFeelings, useFeed, useProfileStats } from "@/community/hooks/queries";
import { useSignedImage } from "@/community/hooks/useSignedImage";
import { formatKm, greeting, pluralActivities, pluralDivy } from "@/community/lib/format";
import { getCycleInfo } from "@/community/lib/cycle";
import { CyclePhaseWave } from "@/community/components/CyclePhaseWave";

function GreetingAvatar({ name, path }: { name?: string | null; path: string | null | undefined }) {
  const url = useSignedImage(path);
  const initials = (name || "D")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <span className="relative block">
      <span className="absolute -inset-1.5 rounded-full border border-accent/30" />
      <span className="absolute -inset-3 rounded-full border border-dashed border-accent/20" />
      <span className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-secondary ring-2 ring-background shadow-sm md:h-28 md:w-28">
        {url ? (
          <img src={url} alt={name ?? "Profil"} className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-base text-secondary-foreground md:text-2xl">{initials}</span>
        )}
      </span>
    </span>
  );
}

function MonthFeelingsTile({ profileId }: { profileId: string | undefined }) {
  const { data: feelings } = useDailyFeelings(profileId);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const daysElapsed = now.getDate();

  const monthDays = (feelings ?? []).filter((f) => {
    const [y, m] = f.feeling_date.split("-").map(Number);
    return y === currentYear && m - 1 === currentMonth;
  }).length;

  return <StatTile label="Zapísané pocity tento mesiac" value={`${monthDays} / ${daysElapsed}`} />;
}

export default function CommunityHome() {
  const { profile } = useCommunityAuth();
  const { data: stats } = useProfileStats(profile?.id);
  const feed = useFeed();
  const { data: challenge } = useActiveChallenge();
  const { data: challengeProgress } = useChallengeProgress(challenge?.id);

  const percent =
    challenge && challenge.goal > 0
      ? Math.min(100, Math.round(((challengeProgress?.progress ?? 0) / challenge.goal) * 100))
      : 0;

  const cycle = useMemo(
    () =>
      profile?.last_period_date
        ? getCycleInfo(profile.last_period_date, profile.cycle_length_days ?? 28)
        : null,
    [profile?.last_period_date, profile?.cycle_length_days],
  );

  return (
    <div className="space-y-8">
      <section className="relative rounded-lg border border-border bg-card px-6 py-6">
        <Link
          to="/community/profil"
          aria-label="Môj profil"
          className="group absolute top-1 right-1 md:top-3 md:right-4"
        >
          <GreetingAvatar name={profile?.name} path={profile?.avatar_url} />
        </Link>
        <div className="relative z-10 pr-20 md:pr-36">
          <h1 className="font-display text-3xl leading-tight">{greeting(profile?.name?.split(" ")[0])}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Robíš to hlavne pre seba.</p>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <StatTile label="Tento mesiac" value={formatKm(stats?.month_km ?? 0)} />
        <StatTile
          label={`${pluralActivities((stats?.month_runs ?? 0) + (stats?.month_workouts ?? 0))} tento mesiac`}
          value={String((stats?.month_runs ?? 0) + (stats?.month_workouts ?? 0))}
        />
        <MonthFeelingsTile profileId={profile?.id} />
      </section>


      <section>
        <Button asChild size="lg" className="w-full">
          <Link to="/community/pridat/run">Pridať aktivitu</Link>
        </Button>
      </section>

      {cycle && (
        <Link
          to="/community/cyklus"
          className="block rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40"
        >
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
            {cycle.dayOfCycle}. deň cyklu · {cycle.phase.name}
          </p>
          <h2 className="mt-1 font-display text-2xl text-primary">{cycle.subPhase.name}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cycle.subPhase.description}</p>
          <div className="mt-4">
            <CyclePhaseWave
              dayOfCycle={cycle.dayOfCycle}
              cycleLengthDays={profile?.cycle_length_days ?? 28}
              phaseKey={cycle.phaseKey}
            />
          </div>
        </Link>
      )}

      {challenge && (
        <section className="relative overflow-hidden rounded-lg border border-border bg-card p-5">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">Aktuálna výzva</p>
          <h2 className="mt-1 font-display text-2xl">{challenge.title}</h2>
          <Progress value={percent} className="mt-4" aria-label="Progres výzvy" />
          <p className="mt-2 text-xs text-muted-foreground">
            {Math.round(challengeProgress?.progress ?? 0)} / {challenge.goal} {goalUnit(challenge.goal_type)} ·{" "}
            {challengeProgress?.participants ?? 0} {pluralDivy(challengeProgress?.participants ?? 0)} · ty{" "}
            {Math.round(challengeProgress?.my_contribution ?? 0)}{" "}
            {goalUnit(challenge.goal_type)}
          </p>
          <Button asChild variant="link" className="mt-2 px-0">
            <Link to={`/community/challenges/${challenge.id}`}>Zobraziť výzvu</Link>
          </Button>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="font-display text-2xl">Feed</h2>
        {feed.isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        )}
        {feed.data?.length === 0 && (
          <EmptyState
            title="Feed je zatiaľ tichý"
            description="Zapíš svoju prvú aktivitu a inšpiruj ostatné divy."
            action={
              <Button asChild>
                <Link to="/community/pridat/run">Pridať aktivitu</Link>
              </Button>
            }
          />
        )}
        {feed.data?.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} interactive />
        ))}
      </section>
    </div>
  );
}
