import { useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/community/components/EmptyState";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import { useNotifications } from "@/community/hooks/queries";
import { formatRelative } from "@/community/lib/format";

export default function CommunityNotifications() {
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
      <h1 className="font-display text-3xl">Notifikácie</h1>
      {isLoading && <Skeleton className="h-32 w-full" />}
      {data?.length === 0 && (
        <EmptyState title="Nič nové" description="Keď ťa niekto podporí alebo odpovie, nájdeš to tu." />
      )}
      <ul className="divide-y divide-border rounded-lg border border-border bg-card">
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
            <p className="mt-1 text-xs text-muted-foreground">{formatRelative(n.created_at)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
