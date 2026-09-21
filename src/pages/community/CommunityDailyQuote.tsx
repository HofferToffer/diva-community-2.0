import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { QuoteCard } from "@/community/components/QuoteCard";
import { quoteForDate } from "@/community/lib/quotes";

export default function CommunityDailyQuote() {
  const quote = quoteForDate();

  return (
    <div className="space-y-6">
      <Link to="/community" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Domov
      </Link>

      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Citát dňa</p>
        <h1 className="mt-2 font-display text-3xl">Pre teba, Diva</h1>
      </header>

      <QuoteCard quote={quote} variant="full" />
    </div>
  );
}
