import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Route, Activity, HeartPulse, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import { ActivityCard } from "@/community/components/ActivityCard";
import { EmptyState } from "@/community/components/EmptyState";
import { QuoteCard } from "@/community/components/QuoteCard";
import { goalUnit } from "@/community/components/ChallengeCard";
import { useActiveChallenge, useChallengeProgress, useDailyFeelings, useFeed, useProfileStats } from "@/community/hooks/queries";
import { useSignedImage } from "@/community/hooks/useSignedImage";
import { formatKm, greeting, pluralActivities, pluralDivy } from "@/community/lib/format";
import { getCycleInfo } from "@/community/lib/cycle";
import { quoteForDate } from "@/community/lib/quotes";
import { fadeUp } from "@/community/lib/motion";
import { CyclePhaseWave } from "@/community/components/CyclePhaseWave";

function HomeStatTile({ icon: Icon, label, value, i }: { icon: LucideIcon; label: string; value: string; i: number }) {
  return (
    <motion.div {...fadeUp(i)} className="rounded-lg border border-border bg-card px-3 py-4 text-center">
      <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="mt-2 font-display text-2xl leading-none text-foreground">{value}</p>
      <p className="mt-1.5 text-[0.6rem] uppercase leading-tight tracking-[0.14em] text-muted-foreground">{label}</p>
    </motion.div>
  );
}

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

  return <HomeStatTile icon={HeartPulse} label="Zapísané pocity tento mesiac" value={`${monthDays} / ${daysElapsed}`} i={2} />;
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
      <motion.section {...fadeUp(0)} className="relative rounded-lg border border-border bg-card px-6 py-6">
        <Link
          to="/community/profil"
          aria-label="Môj profil"
          className="group absolute top-1 right-1 md:top-3 md:right-4"
        >
          <GreetingAvatar name={profile?.name} path={profile?.avatar_url} />
        </Link>
        <div className="relative z-10 pr-20 md:pr-36">
          <h1 className="font-display text-3xl leading-tight">{greeting(profile?.name?.split(" ")[0])}</h1>
          <p className="mt-1 font-display text-lg italic text-muted-foreground">V jemnosti je naša sila.</p>
        </div>
      </motion.section>

      <section className="grid grid-cols-3 gap-3">
        <HomeStatTile icon={Route} label="Tento mesiac" value={formatKm(stats?.month_km ?? 0)} i={1} />
        <HomeStatTile
          icon={Activity}
          label={`${pluralActivities((stats?.month_runs ?? 0) + (stats?.month_workouts ?? 0))} tento mesiac`}
          value={String((stats?.month_runs ?? 0) + (stats?.month_workouts ?? 0))}
          i={1}
        />
        <MonthFeelingsTile profileId={profile?.id} />
      </section>

      <motion.section {...fadeUp(3)}>
        <Button asChild size="lg" className="w-full">
          <Link to="/community/pridat/run">Pridať aktivitu</Link>
        </Button>
      </motion.section>

      <motion.section {...fadeUp(3)} className="rounded-lg border border-border bg-card p-5">
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">Citát dňa</p>
        <div className="mt-3">
          <QuoteCard quote={quoteForDate()} variant="compact" />
        </div>
        <Link
          to="/community/citat"
          className="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground"
        >
          Vlastná fotka a ďalšie možnosti →
        </Link>
      </motion.section>

      {cycle && (
        <motion.div {...fadeUp(4)}>
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
        </motion.div>
      )}

      {challenge && (
        <motion.section {...fadeUp(5)} className="relative overflow-hidden rounded-lg border border-border bg-card p-5">
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
        </motion.section>
      )}

      <motion.section {...fadeUp(6)} className="space-y-4">
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
      </motion.section>
    </div>
  );
}
