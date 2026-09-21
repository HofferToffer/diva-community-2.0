import { ChallengeCard } from "@/community/components/ChallengeCard";
import { EmptyState } from "@/community/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useChallenges } from "@/community/hooks/queries";

export default function CommunityChallenges() {
  const { data, isLoading } = useChallenges();
  const today = new Date().toISOString().slice(0, 10);
  const active = data?.filter((c) => c.active && c.end_date >= today) ?? [];
  const past = data?.filter((c) => !c.active || c.end_date < today) ?? [];

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="font-display text-3xl">Challenges</h1>
        <p className="text-sm text-muted-foreground">Spoločné výzvy, kde sa počíta každý krok každej z nás.</p>
      </header>

      {isLoading && <Skeleton className="h-56 w-full" />}

      {!isLoading && active.length === 0 && past.length === 0 && (
        <EmptyState title="Zatiaľ žiadna výzva" description="Prvá spoločná výzva sa pripravuje. Ozveme sa ti." />
      )}

      {active.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-2xl">Prebiehajúce</h2>
          {active.map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </section>
      )}

      {past.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-2xl">Uzavreté</h2>
          {past.map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </section>
      )}
    </div>
  );
}
