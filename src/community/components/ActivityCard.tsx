import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, MessageCircle, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProfileAvatar, StoredImage } from "./StoredImage";
import { useCommunityAuth } from "../context/CommunityAuthProvider";
import {
  useCommentMutations,
  useComments,
  useDeleteActivity,
  useToggleLike,
  type FeedActivity,
} from "../hooks/queries";
import { activityTypeLabel } from "../lib/constants";
import { formatDuration, formatKm, formatRelative } from "../lib/format";

export function ActivityCard({
  activity,
  interactive = false,
}: {
  activity: FeedActivity;
  interactive?: boolean;
}) {
  const navigate = useNavigate();
  const { profile } = useCommunityAuth();
  const [showComments, setShowComments] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const photoRef = useRef<HTMLDivElement>(null);
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showPhoto) return;
    requestAnimationFrame(() => {
      photoRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }, [showPhoto]);

  useEffect(() => {
    if (!showComments) return;
    requestAnimationFrame(() => {
      commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }, [showComments]);
  const [draft, setDraft] = useState("");
  const toggleLike = useToggleLike();
  const deleteActivity = useDeleteActivity();
  const comments = useComments(activity.id, showComments);
  const { add, remove } = useCommentMutations(activity.id);

  const liked = !!profile && activity.activity_likes.some((l) => l.profile_id === profile.id);
  const likeCount = activity.activity_likes.length;
  const commentCount = activity.activity_comments.length;
  const isMine = profile?.id === activity.profile_id;
  const author = activity.profile;

  const submitComment = async () => {
    const body = draft.trim();
    if (!body || !profile) return;
    try {
      await add.mutateAsync({ profileId: profile.id, body });
      setDraft("");
    } catch {
      toast.error("Komentár sa nepodarilo pridať.");
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
      <header className="flex items-center gap-3 px-4 pt-4">
        <ProfileAvatar path={author?.avatar_url} name={author?.name ?? "Diva"} size={44} />
        <div className="min-w-0 flex-1">
          {author?.username ? (
            <Link
              to={`/community/divy/${author.username}`}
              className="block truncate font-display text-lg leading-tight text-foreground hover:text-primary"
            >
              {author.name}
            </Link>
          ) : (
            <p className="truncate font-display text-lg leading-tight text-foreground">
              {author?.name ?? "Diva"}
            </p>
          )}
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            {activityTypeLabel(activity.kind, activity.activity_type)} ·{" "}
            {formatRelative(activity.created_at)}
          </p>
        </div>
        {isMine && (
          <div className="flex items-center">
            <button
              type="button"
              aria-label="Upraviť aktivitu"
              className="p-2 text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => navigate(`/community/aktivita/${activity.id}/upravit`)}
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Zmazať aktivitu"
              className="p-2 text-muted-foreground transition-colors hover:text-destructive"
              onClick={() => {
                if (window.confirm("Naozaj zmazať túto aktivitu?")) {
                  deleteActivity.mutate(activity.id, {
                    onError: () => toast.error("Aktivitu sa nepodarilo zmazať."),
                    onSuccess: () => toast.success("Aktivita zmazaná."),
                  });
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </header>

      <div
        role={activity.photo_url ? "button" : undefined}
        tabIndex={activity.photo_url ? 0 : undefined}
        aria-label={activity.photo_url ? "Zobraziť fotku aktivity" : undefined}
        aria-expanded={activity.photo_url ? showPhoto : undefined}
        className={activity.photo_url ? "cursor-pointer" : undefined}
        onClick={activity.photo_url ? () => setShowPhoto((v) => !v) : undefined}
        onKeyDown={
          activity.photo_url
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") setShowPhoto((v) => !v);
              }
            : undefined
        }
      >
        <div className={`grid gap-2 px-4 py-4 ${activity.distance_km ? "grid-cols-1" : "grid-cols-2"}`}>
          {activity.distance_km ? (
            <Metric label="Vzdialenosť" value={formatKm(activity.distance_km)} large />
          ) : (
            <>
              <Metric label="Typ" value={activityTypeLabel(activity.kind, activity.activity_type)} />
              {activity.duration_seconds > 0 ? (
                <Metric label="Čas" value={formatDuration(activity.duration_seconds)} large />
              ) : (
                <Metric label="Dátum" value={new Date(activity.activity_date).toLocaleDateString("sk-SK")} large />
              )}
            </>
          )}
        </div>

        {activity.note && <p className="px-4 pb-4 text-sm leading-relaxed text-foreground/85">{activity.note}</p>}

        {activity.photo_url && (
          <AnimatePresence>
            {showPhoto && (
              <motion.div
                ref={photoRef}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <StoredImage
                  path={activity.photo_url}
                  alt="Fotka z aktivity"
                  className="aspect-[4/5] w-full object-cover"
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {interactive && (
      <footer className="flex items-center gap-1 px-2 py-2">
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          aria-label={liked ? "Zrušiť podporu" : "Podporiť"}
          aria-pressed={liked}
          disabled={!profile || toggleLike.isPending}
          onClick={() =>
            profile &&
            toggleLike.mutate(
              { activityId: activity.id, profileId: profile.id, liked },
              { onError: () => toast.error("Nepodarilo sa uložiť.") },
            )
          }
        >
          <Heart
            className="h-4 w-4"
            style={liked ? { fill: "hsl(var(--shop))", color: "hsl(var(--shop))" } : undefined}
          />
          {likeCount}
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          aria-expanded={showComments}
          onClick={() => setShowComments((v) => !v)}
        >
          <MessageCircle className="h-4 w-4" />
          {commentCount}
        </button>
      </footer>
      )}

      {interactive && showComments && (
        <div ref={commentsRef} className="border-t border-border px-4 py-4">
          <ul className="space-y-4">
            {comments.data?.map((c) => (
              <li key={c.id} className="flex gap-3">
                <ProfileAvatar path={c.profile?.avatar_url} name={c.profile?.name ?? "Diva"} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{c.profile?.name ?? "Diva"}</span>{" "}
                    <span className="text-xs text-muted-foreground">{formatRelative(c.created_at)}</span>
                  </p>
                  <p className="text-sm text-foreground/85">{c.body}</p>
                </div>
                {c.profile_id === profile?.id && (
                  <button
                    type="button"
                    aria-label="Zmazať komentár"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => remove.mutate(c.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </li>
            ))}
            {comments.data?.length === 0 && (
              <li className="text-sm text-muted-foreground">Zatiaľ bez komentárov. Buď prvá.</li>
            )}
          </ul>
          <div className="mt-4 space-y-2">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Napíš pár milých slov..."
              rows={2}
              maxLength={500}
              aria-label="Nový komentár"
            />
            <Button size="sm" onClick={submitComment} disabled={!draft.trim() || add.isPending}>
              Pridať komentár
            </Button>
          </div>
        </div>
      )}
    </article>
  );
}

function Metric({ label, value, large }: { label: string; value: string; large?: boolean }) {
  return (
    <div>
      <p className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display font-semibold leading-none text-foreground ${large ? "text-3xl" : "text-xl"}`}>
        {value}
      </p>
    </div>
  );
}
