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
import { formatKm, greeting, pluralActivities, pluralDivy } from "@/community/lib/format";
import { getCycleInfo, CYCLE_PHASE_ARCHETYPE, CYCLE_PHASE_CARD_TINT } from "@/community/lib/cycle";
import { getPregnancyInfo, pregnancyWeekIcon, pregnancyWeekSize, TRIMESTER_LABEL } from "@/community/lib/pregnancy";
import { getPostpartumInfo } from "@/community/lib/postpartum";
import { getLifePhase, quoteForDate } from "@/community/lib/quotes";
import { fadeUp } from "@/community/lib/motion";
import { CyclePhaseWave } from "@/community/components/CyclePhaseWave";

function PregnancyWeekIconBg({ week }: { week: number }) {
  const Icon = pregnancyWeekIcon(week);
  return (
    <Icon
      className="pointer-events-none absolute -bottom-4 -right-4 h-24 w-24 stroke-1 text-primary/15"
      aria-hidden="true"
    />
  );
}

function HomeStatTile({ icon: Icon, label, value, i }: { icon: LucideIcon; label: string; value: string; i: number }) {
  return (
    <motion.div {...fadeUp(i)} className="rounded-2xl bg-secondary/30 px-3 py-4 text-center">
      <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="mt-2 font-display text-2xl leading-none text-foreground">{value}</p>
      <p className="mt-1.5 text-[0.6rem] uppercase leading-tight tracking-[0.14em] text-muted-foreground">{label}</p>
    </motion.div>
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
      !profile?.is_pregnant && !profile?.is_menopause && !profile?.is_postpartum && profile?.last_period_date
        ? getCycleInfo(profile.last_period_date, profile.cycle_length_days ?? 28)
        : null,
    [profile?.is_pregnant, profile?.is_menopause, profile?.is_postpartum, profile?.last_period_date, profile?.cycle_length_days],
  );

  const pregnancy = useMemo(
    () => (profile?.is_pregnant && profile?.last_period_date ? getPregnancyInfo(profile.last_period_date) : null),
    [profile?.is_pregnant, profile?.last_period_date],
  );

  const postpartum = useMemo(
    () => (profile?.is_postpartum && profile?.postpartum_since ? getPostpartumInfo(profile.postpartum_since) : null),
    [profile?.is_postpartum, profile?.postpartum_since],
  );

  return (
    <div className="space-y-8">
      <motion.section {...fadeUp(0)} className="relative px-1 py-2">
        <h1 className="font-display text-3xl leading-tight">{greeting(profile?.name?.split(" ")[0])}</h1>
        <p className="mt-1 font-display text-lg font-light tracking-wide text-muted-foreground">V jemnosti je naša sila.</p>
      </motion.section>

      {profile?.is_pregnant && (
        <motion.div {...fadeUp(1)}>
          <Link
            to="/community/cyklus"
            className="relative block overflow-hidden rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-colors hover:border-primary/40"
          >
            {pregnancy && (
              <PregnancyWeekIconBg week={pregnancy.week} />
            )}
            {pregnancy ? (
              <>
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                  {TRIMESTER_LABEL[pregnancy.trimester]}
                </p>
                <h2 className="mt-1 font-display text-2xl text-primary">{pregnancy.week}. týždeň tehotenstva</h2>
                {pregnancyWeekSize(pregnancy.week) && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Vaše bábätko má teraz veľkosť ako {pregnancyWeekSize(pregnancy.week)}.
                  </p>
                )}
                <p className="mt-2 text-sm italic leading-relaxed text-foreground/85">{pregnancy.soulNote}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pregnancy.daysUntilDue > 0
                    ? `Do predpokladaného termínu pôrodu zostáva ${pregnancy.daysUntilDue} dní.`
                    : "Tvoj predpokladaný termín pôrodu už prešiel — nech je to v tvojom čase."}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Zadaj prvý deň poslednej menštruácie v profile, aby sme ti tu vedeli ukázať týždeň tehotenstva.
              </p>
            )}
          </Link>
        </motion.div>
      )}

      {profile?.is_postpartum && (
        <motion.div {...fadeUp(1)}>
          <Link
            to="/community/cyklus"
            className="block rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-colors hover:border-primary/40"
          >
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">Šestonedelie</p>
            {postpartum ? (
              <>
                <h2 className="mt-1 font-display text-2xl text-primary">{postpartum.week}. týždeň po pôrode</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{postpartum.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Typické tento týždeň: {postpartum.symptoms.join(" · ")}
                </p>
              </>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">Zadaj dátum pôrodu v profile.</p>
            )}
          </Link>
        </motion.div>
      )}

      {profile?.is_menopause && (
        <motion.div {...fadeUp(1)}>
          <Link
            to="/community/cyklus"
            className="block rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-colors hover:border-primary/40"
          >
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">Tvoja kapitola</p>
            <h2 className="mt-1 font-display text-2xl text-primary">V menopauze</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Únava, návaly aj výkyvy energie sú normálna súčasť tejto kapitoly, nie zlyhanie. Tipy pre teba nájdeš tu.
            </p>
          </Link>
        </motion.div>
      )}

      {cycle && (
        <motion.div {...fadeUp(1)}>
          <Link
            to="/community/cyklus"
            className="relative block overflow-hidden rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-colors hover:border-primary/40"
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: CYCLE_PHASE_CARD_TINT[cycle.phaseKey] }}
              aria-hidden="true"
            />
            <div className="relative">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                {cycle.dayOfCycle}. deň cyklu · {cycle.phase.name}
              </p>
              <h2 className="mt-1 font-display text-2xl text-primary">{cycle.subPhase.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cycle.subPhase.description}</p>
              <p className="mt-2 text-sm italic leading-relaxed text-foreground/85">
                „{CYCLE_PHASE_ARCHETYPE[cycle.phaseKey].mantra}"
              </p>
              <div className="mt-4">
                <CyclePhaseWave
                  dayOfCycle={cycle.dayOfCycle}
                  cycleLengthDays={profile?.cycle_length_days ?? 28}
                  phaseKey={cycle.phaseKey}
                />
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      <section className="grid grid-cols-3 gap-3">
        <HomeStatTile icon={Route} label="Tento mesiac" value={formatKm(stats?.month_km ?? 0)} i={2} />
        <HomeStatTile
          icon={Activity}
          label={`${pluralActivities((stats?.month_runs ?? 0) + (stats?.month_workouts ?? 0))} tento mesiac`}
          value={String((stats?.month_runs ?? 0) + (stats?.month_workouts ?? 0))}
          i={2}
        />
        <MonthFeelingsTile profileId={profile?.id} />
      </section>

      <motion.section {...fadeUp(3)}>
        <Button asChild size="lg" className="w-full">
          <Link to="/community/pridat/run">Pridať aktivitu</Link>
        </Button>
      </motion.section>

      <motion.section {...fadeUp(3)}>
        <p className="text-center text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">Citát dňa</p>
        <div className="mt-3">
          <QuoteCard quote={quoteForDate(getLifePhase(profile))} variant="compact" />
        </div>
        <Link
          to="/community/citat"
          className="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground"
        >
          Vlastná fotka a ďalšie možnosti →
        </Link>
      </motion.section>

      {challenge && (
        <motion.section {...fadeUp(5)} className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
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
