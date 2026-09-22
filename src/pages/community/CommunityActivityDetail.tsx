import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityCard } from "@/community/components/ActivityCard";
import { EmptyState } from "@/community/components/EmptyState";
import { useActivityById } from "@/community/hooks/queries";

export default function CommunityActivityDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: activity, isLoading } = useActivityById(id);

  return (
    <div className="space-y-6">
      <Link to="/community" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Domov
      </Link>

      {isLoading && <Skeleton className="h-64 w-full" />}

      {!isLoading && !activity && (
        <EmptyState title="Aktivita sa nenašla" description="Možno bola zmazaná." />
      )}

      {activity && <ActivityCard activity={activity} interactive />}
    </div>
  );
}
