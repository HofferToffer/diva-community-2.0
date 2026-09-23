import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityCard } from "@/community/components/ActivityCard";
import { EmptyState } from "@/community/components/EmptyState";
import { useActivityById } from "@/community/hooks/queries";

export default function CommunityActivityDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: activity, isLoading } = useActivityById(id);

  return (
    <div className="space-y-6">
      <Link to="/community" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t("nav.home")}
      </Link>

      {isLoading && <Skeleton className="h-64 w-full" />}

      {!isLoading && !activity && (
        <EmptyState title={t("activityDetail.notFoundTitle")} description={t("activityDetail.notFoundDescription")} />
      )}

      {activity && <ActivityCard activity={activity} interactive />}
    </div>
  );
}
