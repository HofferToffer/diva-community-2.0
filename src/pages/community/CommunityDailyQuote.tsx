import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { QuoteCard } from "@/community/components/QuoteCard";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import { getLifePhase, quoteForDate } from "@/community/lib/quotes";

export default function CommunityDailyQuote() {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === "en";
  const quoteTranslations = t("quotes", { returnObjects: true, defaultValue: {} }) as Record<string, string>;
  const { profile } = useCommunityAuth();
  const rawQuote = quoteForDate(getLifePhase(profile));
  const quote = isEnglish ? quoteTranslations[rawQuote] ?? rawQuote : rawQuote;
  const navigate = useNavigate();

  // Sharing a quote (e.g. to Instagram) backgrounds the app; when she
  // switches back to it, land on Home rather than leaving her stuck on
  // this one-off share screen.
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") navigate("/community");
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [navigate]);

  return (
    <div className="space-y-6">
      <Link to="/community" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t("nav.home")}
      </Link>

      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("dailyQuote.kicker")}</p>
        <h1 className="mt-2 font-display text-3xl">{t("dailyQuote.title")}</h1>
      </header>

      <QuoteCard quote={quote} variant="full" />
    </div>
  );
}
