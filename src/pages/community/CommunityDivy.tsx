import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileAvatar } from "@/community/components/StoredImage";
import { EmptyState } from "@/community/components/EmptyState";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import {
  useFriends,
  useSearchDivas,
  useSuggestedDivas,
  useToggleFriend,
  type DivaProfile,
} from "@/community/hooks/queries";

function DivaRow({
  diva,
  isFriend,
  onToggle,
  pending,
}: {
  diva: DivaProfile;
  isFriend: boolean;
  onToggle: () => void;
  pending: boolean;
}) {
  const inner = (
    <>
      <ProfileAvatar path={diva.avatar_url} name={diva.name} size={44} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-lg leading-tight">{diva.name || "Diva"}</p>
        <p className="truncate text-xs text-muted-foreground">
          {diva.username ? `@${diva.username}` : diva.city || "Diva"}
        </p>
      </div>
    </>
  );

  return (
    <li className="flex items-center gap-3 px-4 py-3">
      {diva.username ? (
        <Link to={`/community/divy/${diva.username}`} className="flex min-w-0 flex-1 items-center gap-3 hover:text-primary">
          {inner}
        </Link>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-3">{inner}</div>
      )}
      <Button size="sm" variant={isFriend ? "outline" : "default"} disabled={pending} onClick={onToggle}>
        {isFriend ? "Kamoška" : "Pridať"}
      </Button>
    </li>
  );
}

export default function CommunityDivy() {
  const { profile } = useCommunityAuth();
  const [term, setTerm] = useState("");
  const search = useSearchDivas(term);
  const suggested = useSuggestedDivas();
  const friends = useFriends(profile?.id);
  const toggle = useToggleFriend(profile?.id);

  const friendIds = new Set((friends.data ?? []).map((f) => f.following_id));
  const searching = term.trim().length >= 2;
  const list = (searching ? search.data : suggested.data)?.filter((d) => d.id !== profile?.id) ?? [];
  const isLoading = searching ? search.isLoading : suggested.isLoading;

  const handleToggle = (diva: DivaProfile) => {
    const isFriend = friendIds.has(diva.id);
    toggle.mutate(
      { targetId: diva.id, isFriend },
      {
        onSuccess: () =>
          toast.success(isFriend ? `${diva.name} už nie je medzi kamoškami.` : `${diva.name} je tvoja kamoška.`),
        onError: () => toast.error("Nepodarilo sa uložiť."),
      },
    );
  };

  const myFriends = (friends.data ?? []).map((f) => f.following).filter(Boolean) as DivaProfile[];

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="font-display text-3xl">Divy</h1>
        <p className="text-sm text-muted-foreground">
          Nájdi si Divu, ktorá ťa inšpiruje a podporuje.
        </p>
      </header>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Hľadaj podľa mena alebo prezývky"
          aria-label="Hľadať divu"
          className="pl-9"
        />
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-2xl">{searching ? "Výsledky hľadania" : "Divy v komunite"}</h2>
        {isLoading && <Skeleton className="h-32 w-full" />}
        {!isLoading && list.length === 0 && (
          <EmptyState
            title="Nikoho sme nenašli"
            description="Skús iné meno alebo prezývku."
          />
        )}
        {list.length > 0 && (
          <ul className="divide-y divide-border rounded-lg border border-border bg-card">
            {list.map((d) => (
              <DivaRow
                key={d.id}
                diva={d}
                isFriend={friendIds.has(d.id)}
                pending={toggle.isPending}
                onToggle={() => handleToggle(d)}
              />
            ))}
          </ul>
        )}
      </section>

      {myFriends.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-2xl">Moje kamošky</h2>
          <ul className="divide-y divide-border rounded-lg border border-border bg-card">
            {myFriends.map((d) => (
              <DivaRow
                key={d.id}
                diva={d}
                isFriend
                pending={toggle.isPending}
                onToggle={() => handleToggle(d)}
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
