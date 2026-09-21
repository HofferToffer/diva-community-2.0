import { Link, useParams } from "react-router-dom";
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
        <p className="font-display text-2xl">Výzva sa nenašla.</p>
        <Button asChild variant="link">
          <Link to="/community/challenges">Späť na výzvy</Link>
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
            Späť k výzvam
          </Link>
        </Button>
        <p className="mt-3 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
          Challenge · {formatDate(challenge.start_date)} – {formatDate(challenge.end_date)}
        </p>
        <h1 className="mt-2 font-display text-3xl">{challenge.title}</h1>
        {challenge.description && (
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/85">{challenge.description}</p>
        )}
      </header>

      <section className="rounded-lg border border-border bg-card p-5">
        <Progress value={percent} aria-label="Spoločný progres" />
        <p className="mt-3 text-sm text-muted-foreground">
          Spolu {Math.round(progress?.progress ?? 0)} z {challenge.goal} km ·{" "}
          {progress?.participants ?? 0} {pluralDivy(progress?.participants ?? 0)}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Tvoj podiel: {Math.round(progress?.my_contribution ?? 0)} km
        </p>
        <Button
          className="mt-4 w-full"
          variant={joined ? "outline" : "default"}
          disabled={!profile || toggle.isPending}
          onClick={() =>
            toggle.mutate(joined, {
              onSuccess: () => toast.success(joined ? "Odišla si z výzvy." : "Si vo výzve. Ideme na to."),
              onError: () => toast.error("Nepodarilo sa uložiť."),
            })
          }
        >
          {joined ? "Odísť z výzvy" : "Zapojiť sa"}
        </Button>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl">Leaderboard</h2>
        <ol className="divide-y divide-border rounded-lg border border-border bg-card">
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
            <li className="px-4 py-6 text-center text-sm text-muted-foreground">Zatiaľ bez zapísaných aktivít.</li>
          )}
        </ol>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-2xl">Nástenka výzvy</h2>
          <p className="text-sm text-muted-foreground">
            Podpor ostatné divy srdiečkom alebo im napíš pár motivujúcich slov.
          </p>
        </div>
        {feedLoading && <Skeleton className="h-48 w-full" />}
        {!feedLoading && (feed?.length ?? 0) === 0 && (
          <EmptyState
            title="Zatiaľ tu nikto nič nezapísal"
            description="Buď prvá — zapíš aktivitu a ostatné ťa podporia."
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
