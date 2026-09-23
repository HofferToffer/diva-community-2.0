import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/community/components/EmptyState";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import { useNotifications } from "@/community/hooks/queries";
import { formatRelative } from "@/community/lib/format";

export default function CommunityNotifications() {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === "en";
  const { profile } = useCommunityAuth();
  const { data, isLoading, refetch } = useNotifications(profile?.id);

  useEffect(() => {
    const unread = data?.filter((n) => !n.read_at).map((n) => n.id) ?? [];
    if (unread.length === 0) return;
    supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .in("id", unread)
      .then(() => refetch());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.length]);

  return (
    <div className="space-y-6">
      <Link to="/community" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t("nav.home")}
      </Link>

      <h1 className="font-display text-3xl">{t("notifications.title")}</h1>
      {isLoading && <Skeleton className="h-32 w-full" />}
      {data?.length === 0 && (
        <EmptyState title={t("notifications.emptyTitle")} description={t("notifications.emptyDescription")} />
      )}
      <ul className="divide-y divide-border rounded-2xl border border-border/50 bg-card shadow-sm">
        {data?.map((n) => (
          <li key={n.id} className="px-4 py-4">
            {n.link ? (
              <Link to={n.link} className="block hover:text-primary">
                <p className="text-sm font-medium">{n.title}</p>
              </Link>
            ) : (
              <p className="text-sm font-medium">{n.title}</p>
            )}
            {n.body && <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>}
            <p className="mt-1 text-xs text-muted-foreground">{formatRelative(n.created_at, isEnglish ? "en" : "sk")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
