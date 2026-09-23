import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileAvatar } from "@/community/components/StoredImage";
import { EmptyState } from "@/community/components/EmptyState";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import { useConversations } from "@/community/hooks/queries";
import { formatRelative } from "@/community/lib/format";
import { fadeUp } from "@/community/lib/motion";

export default function CommunityMessages() {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === "en";
  const { profile } = useCommunityAuth();
  const { data: conversations, isLoading } = useConversations(profile?.id);

  return (
    <div className="space-y-6">
      <Link to="/community" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t("nav.home")}
      </Link>

      <header>
        <h1 className="font-display text-3xl">{t("messages.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("messages.subtitle")}</p>
      </header>

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {!isLoading && conversations?.length === 0 && (
        <EmptyState
          title={t("messages.emptyTitle")}
          description={t("messages.emptyDescription")}
        />
      )}

      <div className="space-y-2">
        {conversations?.map((c, i) => (
          <motion.div key={c.otherId} {...fadeUp(Math.min(i, 3))}>
            <Link
              to={`/community/spravy/${c.otherId}`}
              className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-colors hover:border-primary/40"
            >
              <ProfileAvatar path={c.otherAvatar} name={c.otherName ?? "Diva"} size={44} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-display text-lg leading-tight">{c.otherName}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatRelative(c.lastCreatedAt, isEnglish ? "en" : "sk")}</span>
                </div>
                <p className="truncate text-sm text-muted-foreground">{c.lastBody}</p>
              </div>
              {c.unreadCount > 0 && (
                <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[0.65rem] font-medium text-primary-foreground" style={{ background: "hsl(var(--primary))" }}>
                  {c.unreadCount}
                </span>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
