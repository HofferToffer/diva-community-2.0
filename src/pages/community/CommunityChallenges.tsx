import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ChallengeCard } from "@/community/components/ChallengeCard";
import { EmptyState } from "@/community/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useChallenges } from "@/community/hooks/queries";
import { fadeUp } from "@/community/lib/motion";

export default function CommunityChallenges() {
  const { data, isLoading } = useChallenges();
  const today = new Date().toISOString().slice(0, 10);
  const active = data?.filter((c) => c.active && c.end_date >= today) ?? [];
  const past = data?.filter((c) => !c.active || c.end_date < today) ?? [];

  return (
    <div className="space-y-8">
      <Link to="/community" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Domov
      </Link>

      <motion.header {...fadeUp(0)} className="space-y-1">
        <h1 className="font-display text-3xl">Challenges</h1>
        <p className="text-sm text-muted-foreground">Spoločné výzvy, kde sa počíta každý krok každej z nás.</p>
      </motion.header>

      {isLoading && <Skeleton className="h-56 w-full" />}

      {!isLoading && active.length === 0 && past.length === 0 && (
        <EmptyState title="Zatiaľ žiadna výzva" description="Prvá spoločná výzva sa pripravuje. Ozveme sa ti." />
      )}

      {active.length > 0 && (
        <motion.section {...fadeUp(1)} className="space-y-4">
          <h2 className="font-display text-2xl">Prebiehajúce</h2>
          {active.map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </motion.section>
      )}

      {past.length > 0 && (
        <motion.section {...fadeUp(2)} className="space-y-4">
          <h2 className="font-display text-2xl">Uzavreté</h2>
          {past.map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </motion.section>
      )}
    </div>
  );
}
