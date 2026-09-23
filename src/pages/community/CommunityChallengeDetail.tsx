import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileAvatar, StoredImage } from "@/community/components/StoredImage";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import { ActivityCard } from "@/community/components/ActivityCard";
import { EmptyState } from "@/community/components/EmptyState";
import {
  useChallenge,
  useChallengeFeed,
  useChallengeParticipation,
  useChallengeProgress,
  useLeaderboard,
} from "@/community/hooks/queries";
import { formatDate, pluralDivy } from "@/community/lib/format";

export default function CommunityChallengeDetail() {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === "en";
  const { id } = useParams<{ id: string }>();
  const { profile } = useCommunityAuth();
  const { data: challenge, isLoading } = useChallenge(id);
  const { data: progress } = useChallengeProgress(id);
  const { data: leaderboard } = useLeaderboard(id, "km");
  const { joined, toggle } = useChallengeParticipation(id, profile?.id);
  const { data: feed, isLoading: feedLoading } = useChallengeFeed(
    id,
    challenge?.start_date,
    challenge?.end_date,
  );

  if (isLoading) return <Skeleton className="h-72 w-full" />;
  if (!challenge)
    return (
      <div className="py-12 text-center">
        <p className="font-display text-2xl">{t("challenges.notFoundTitle")}</p>
        <Button asChild variant="link">
          <Link to="/community/challenges">{t("challenges.notFoundBack")}</Link>
        </Button>
      </div>
    );

  const percent =
    challenge.goal > 0 ? Math.min(100, Math.round(((progress?.progress ?? 0) / challenge.goal) * 100)) : 0;

  return (
    <div className="space-y-8">
      {challenge.image_url && (
        <StoredImage
          path={challenge.image_url}
          alt={challenge.title}
          loading="eager"
          className="h-56 w-full rounded-lg object-cover"
        />
      )}

      <header>
        <Button asChild variant="ghost" size="sm" className="-ml-2 h-auto px-2 py-1 text-muted-foreground hover:text-foreground">
          <Link to="/community/challenges" className="inline-flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            {t("challenges.backToChallenges")}
          </Link>
        </Button>
        <p className="mt-3 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
          {t("challenges.challengeLabel")} · {formatDate(challenge.start_date, isEnglish ? "en" : "sk")} –{" "}
          {formatDate(challenge.end_date, isEnglish ? "en" : "sk")}
        </p>
        <h1 className="mt-2 font-display text-3xl">{challenge.title}</h1>
        {challenge.description && (
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/85">{challenge.description}</p>
        )}
      </header>

      <section className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
        <Progress value={percent} aria-label={t("challenges.detailProgressAriaLabel")} />
        <p className="mt-3 text-sm text-muted-foreground">
          {t("challenges.detailProgressText", {
            progress: Math.round(progress?.progress ?? 0),
            goal: challenge.goal,
            count: isEnglish
              ? t("challenges.divasCount", { count: progress?.participants ?? 0 })
              : `${progress?.participants ?? 0} ${pluralDivy(progress?.participants ?? 0)}`,
          })}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("challenges.myShare", { value: Math.round(progress?.my_contribution ?? 0) })}
        </p>
        <Button
          className="mt-4 w-full"
          variant={joined ? "outline" : "default"}
          disabled={!profile || toggle.isPending}
          onClick={() =>
            toggle.mutate(joined, {
              onSuccess: () => toast.success(joined ? t("challenges.toastLeft") : t("challenges.toastJoined")),
              onError: () => toast.error(t("challenges.toastSaveFailed")),
            })
          }
        >
          {joined ? t("challenges.leaveButton") : t("challenges.joinButton")}
        </Button>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl">{t("challenges.leaderboardTitle")}</h2>
        <ol className="divide-y divide-border rounded-2xl border border-border/50 bg-card shadow-sm">
          {leaderboard?.map((row, index) => (
            <li key={row.profile_id} className="flex items-center gap-3 px-4 py-3">
              <span className="w-6 font-display text-lg text-muted-foreground">{index + 1}</span>
              <ProfileAvatar path={row.avatar_url} name={row.name} size={36} />
              <div className="min-w-0 flex-1">
                {row.username ? (
                  <Link to={`/community/divy/${row.username}`} className="truncate hover:text-primary">
                    {row.name}
                  </Link>
                ) : (
                  <span className="truncate">{row.name}</span>
                )}
              </div>
              <span className="font-display text-lg">{Math.round(Number(row.value))} km</span>
            </li>
          ))}
          {leaderboard?.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-muted-foreground">{t("challenges.leaderboardNoActivities")}</li>
          )}
        </ol>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-2xl">{t("challenges.boardTitle")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("challenges.boardSubtitle")}
          </p>
        </div>
        {feedLoading && <Skeleton className="h-48 w-full" />}
        {!feedLoading && (feed?.length ?? 0) === 0 && (
          <EmptyState
            title={t("challenges.boardEmptyTitle")}
            description={t("challenges.boardEmptyDescription")}
          />
        )}
        <div className="space-y-6">
          {feed?.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} interactive />
          ))}
        </div>
      </section>
    </div>
  );
}
