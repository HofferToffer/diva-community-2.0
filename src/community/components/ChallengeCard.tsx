import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { StoredImage } from "./StoredImage";
import { useChallengeProgress, useLeaderboard, type Challenge } from "../hooks/queries";
import { formatDate, pluralDivy } from "../lib/format";
import { useTranslatedText } from "../hooks/useTranslatedText";

export function goalUnit(goalType: string) {
  switch (goalType) {
    case "community_distance":
    case "individual_distance":
      return "km";
    case "move_minutes":
      return "min";
    case "active_days":
      return "dní";
    default:
      return "aktivít";
  }
}

function leaderboardMetric(goalType: string): "km" | "activities" | "minutes" {
  switch (goalType) {
    case "community_distance":
    case "individual_distance":
      return "km";
    case "move_minutes":
      return "minutes";
    default:
      return "activities";
  }
}

function leaderboardUnit(goalType: string): string {
  switch (goalType) {
    case "community_distance":
    case "individual_distance":
      return "km";
    case "move_minutes":
      return "min";
    case "active_days":
      return "dní";
    default:
      return "aktivít";
  }
}

function formatValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
}

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === "en";
  const goalUnitTranslations = t("goalUnit", { returnObjects: true, defaultValue: {} }) as Record<string, string>;
  const { data } = useChallengeProgress(challenge.id);
  const [open, setOpen] = useState(false);
  const progress = data?.progress ?? 0;
  const percent = challenge.goal > 0 ? Math.min(100, Math.round((progress / challenge.goal) * 100)) : 0;
  const { data: leaderboard, isLoading: leaderboardLoading } = useLeaderboard(
    open ? challenge.id : undefined,
    leaderboardMetric(challenge.goal_type),
  );
  const unit = leaderboardUnit(challenge.goal_type);
  const translatedUnit = isEnglish ? goalUnitTranslations[unit] ?? unit : unit;
  const goalUnitValue = goalUnit(challenge.goal_type);
  const translatedGoalUnit = isEnglish ? goalUnitTranslations[goalUnitValue] ?? goalUnitValue : goalUnitValue;
  const participants = data?.participants ?? 0;
  const title = useTranslatedText(challenge.title, isEnglish);
  const description = useTranslatedText(challenge.description ?? "", isEnglish);

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-elevated-sm transition-colors hover:border-primary/40">
      <Link to={`/community/challenges/${challenge.id}`} className="block">
        {challenge.image_url && (
          <StoredImage path={challenge.image_url} alt={title} className="h-40 w-full object-cover" />
        )}
        <div className="p-5">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
            {formatDate(challenge.start_date, isEnglish ? "en" : "sk")} – {formatDate(challenge.end_date, isEnglish ? "en" : "sk")}
          </p>
          <h3 className="mt-1 font-display text-2xl text-foreground">{title}</h3>
          {challenge.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{description}</p>
          )}
          <div className="mt-4">
            <Progress value={percent} aria-label={t("challenges.progressAriaLabel")} />
            <p className="mt-2 text-xs text-muted-foreground">
              {Math.round(progress)} / {challenge.goal} {translatedGoalUnit} ·{" "}
              {isEnglish ? t("challenges.divasCount", { count: participants }) : `${participants} ${pluralDivy(participants)}`}
            </p>
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between border-t border-border px-5 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
      >
        <span>{t("challenges.leaderboardToggle")}</span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {open && (
        <div className="border-t border-border px-5 py-3">
          {leaderboardLoading && (
            <p className="py-2 text-center text-xs text-muted-foreground">{t("challenges.leaderboardLoading")}</p>
          )}
          {!leaderboardLoading && (leaderboard?.length ?? 0) === 0 && (
            <p className="py-2 text-center text-xs text-muted-foreground">
              {t("challenges.leaderboardEmpty")}
            </p>
          )}
          {!leaderboardLoading && leaderboard && leaderboard.length > 0 && (
            <ul className="max-h-56 space-y-2 overflow-y-auto pr-1">
              {leaderboard.map((row, i) => (
                <li key={row.profile_id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex min-w-0 items-center gap-2 text-foreground">
                    <span className="w-5 shrink-0 text-xs text-muted-foreground">{i + 1}.</span>
                    <span className="truncate">{row.name}</span>
                  </span>
                  <span className="shrink-0 text-muted-foreground">
                    {formatValue(Number(row.value))} {translatedUnit}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
