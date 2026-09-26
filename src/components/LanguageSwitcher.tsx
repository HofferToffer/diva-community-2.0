import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLang, type Lang } from "@/lib/lang";

/** SK · EN toggle for the website. Her choice is remembered and shared with the app. */
export default function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  const location = useLocation();
  const navigate = useNavigate();

  const choose = (next: Lang) => {
    if (next === lang) return;
    void setLang(next);
    // Drop a `?lang=` from a shared link so it doesn't override her choice on reload.
    const params = new URLSearchParams(location.search);
    if (params.has("lang")) {
      params.delete("lang");
      const search = params.toString();
      navigate({ pathname: location.pathname, search: search ? `?${search}` : "", hash: location.hash }, { replace: true });
    }
  };

  return (
    <div className={cn("flex items-center gap-1 font-body text-[10px] md:text-xs tracking-[0.2em]", className)} role="group" aria-label="Jazyk / Language">
      {(["sk", "en"] as const).map((code, i) => (
        <span key={code} className="flex items-center gap-1">
          {i > 0 && <span className="text-primary-foreground/30" aria-hidden="true">·</span>}
          <button
            type="button"
            onClick={() => choose(code)}
            aria-pressed={lang === code}
            lang={code}
            aria-label={code === "sk" ? "Slovensky" : "English"}
            className={cn(
              "uppercase transition-colors duration-500",
              lang === code ? "text-primary-foreground" : "text-primary-foreground/45 hover:text-primary-foreground/80",
            )}
          >
            {code}
          </button>
        </span>
      ))}
    </div>
  );
}
