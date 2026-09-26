import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/lang";

const STORAGE_KEY = "diva-cookie-consent";

export default function CookieConsent() {
  const { l } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // Private browsing / blocked storage — just don't show the banner rather than nag every visit.
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Ignore — worst case the banner reappears next visit.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4">
      <div className="mx-auto flex max-w-2xl flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <p className="font-body text-xs leading-relaxed text-muted-foreground">
          {l(
            "Táto stránka nepoužíva reklamné ani sledovacie cookies. Používame len technológie nevyhnutné na prihlásenie a bezpečnú platbu.",
            "No ad or tracking cookies here. We only use what's needed to log you in and keep payments safe.",
          )}{" "}
          <Link to="/cookies" className="underline hover:text-foreground">
            {l("Viac o cookies", "More about cookies")}
          </Link>
          .
        </p>
        <Button size="sm" className="w-full shrink-0 sm:w-auto" onClick={dismiss}>
          {l("Rozumiem", "Got it")}
        </Button>
      </div>
    </div>
  );
}
