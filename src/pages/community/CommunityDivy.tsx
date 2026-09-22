import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfileAvatar } from "@/community/components/StoredImage";
import { EmptyState } from "@/community/components/EmptyState";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import { fadeUp } from "@/community/lib/motion";
import { MOVEMENT_INTERESTS } from "@/community/lib/constants";
import { PHASE_LABEL, type LifePhase } from "@/community/lib/quotes";
import {
  useFriends,
  useSearchDivas,
  useSuggestedDivas,
  useToggleFriend,
  type DivaProfile,
} from "@/community/hooks/queries";

const CHAPTER_OPTIONS: LifePhase[] = ["cycle", "trying", "pregnant", "postpartum", "menopause"];

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
        {diva.chapter && (
          <p className="truncate text-xs text-primary">
            {PHASE_LABEL[diva.chapter as LifePhase] ?? diva.chapter}
          </p>
        )}
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
  const [city, setCity] = useState("");
  const [interest, setInterest] = useState<string>("");
  const [chapter, setChapter] = useState<string>("");

  const filters = {
    city: city.trim() || undefined,
    interest: interest || undefined,
    chapter: chapter || undefined,
  };
  const hasFilters = !!(filters.city || filters.interest || filters.chapter);

  const search = useSearchDivas(term, filters);
  const suggested = useSuggestedDivas(filters);
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
      <Link to="/community" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Domov
      </Link>

      <motion.header {...fadeUp(0)} className="space-y-1">
        <h1 className="font-display text-3xl">Divy</h1>
        <p className="text-sm text-muted-foreground">
          Nájdi si Divu, ktorá ťa inšpiruje a podporuje — podľa mena, mesta, obľúbeného pohybu alebo životnej kapitoly.
        </p>
      </motion.header>

      <motion.div {...fadeUp(1)} className="space-y-3">
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
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Mesto"
            aria-label="Filtrovať podľa mesta"
          />
          <Select value={interest || "all"} onValueChange={(v) => setInterest(v === "all" ? "" : v)}>
            <SelectTrigger aria-label="Filtrovať podľa pohybu">
              <SelectValue placeholder="Pohyb" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Všetky druhy pohybu</SelectItem>
              {MOVEMENT_INTERESTS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={chapter || "all"} onValueChange={(v) => setChapter(v === "all" ? "" : v)}>
            <SelectTrigger aria-label="Filtrovať podľa životnej kapitoly">
              <SelectValue placeholder="Životná kapitola" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Všetky kapitoly</SelectItem>
              {CHAPTER_OPTIONS.map((key) => (
                <SelectItem key={key} value={key}>
                  {PHASE_LABEL[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {filters.chapter && (
          <p className="text-xs text-muted-foreground">
            Zobrazujeme len Divy, ktoré sa rozhodli svoju životnú kapitolu zdieľať s komunitou.
          </p>
        )}
      </motion.div>

      <motion.section {...fadeUp(2)} className="space-y-3">
        <h2 className="font-display text-2xl">{searching || hasFilters ? "Výsledky hľadania" : "Divy v komunite"}</h2>
        {isLoading && <Skeleton className="h-32 w-full" />}
        {!isLoading && list.length === 0 && (
          <EmptyState
            title="Nikoho sme nenašli"
            description="Skús iné meno, mesto alebo filter."
          />
        )}
        {list.length > 0 && (
          <ul className="divide-y divide-border rounded-2xl border border-border/50 bg-card shadow-sm">
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
      </motion.section>

      {myFriends.length > 0 && (
        <motion.section {...fadeUp(3)} className="space-y-3">
          <h2 className="font-display text-2xl">Moje kamošky</h2>
          <ul className="divide-y divide-border rounded-2xl border border-border/50 bg-card shadow-sm">
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
        </motion.section>
      )}
    </div>
  );
}
