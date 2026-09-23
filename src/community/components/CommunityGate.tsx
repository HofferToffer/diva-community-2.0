import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "diva-community-access";
const ACCESS_CODE = "DIVA";

export function CommunityGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === ACCESS_CODE;
    } catch {
      return false;
    }
  });
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  if (unlocked) return <>{children}</>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().toUpperCase() === ACCESS_CODE) {
      try {
        localStorage.setItem(STORAGE_KEY, ACCESS_CODE);
      } catch {
        /* ignore */
      }
      setUnlocked(true);
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-sm text-center">
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">Diva Community</p>
        <h1 className="mt-3 font-display text-3xl leading-tight">{t("gate.title")}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("gate.subtitle")}
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4 text-left">
          <div className="space-y-2">
            <Label htmlFor="access-code">{t("gate.codeLabel")}</Label>
            <Input
              id="access-code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(false);
              }}
              autoFocus
              autoComplete="off"
            />
            {error && <p className="text-sm text-destructive">{t("gate.wrongCode")}</p>}
          </div>
          <Button type="submit" className="w-full">
            {t("gate.enterButton")}
          </Button>
        </form>

        <p className="mt-8 text-xs text-muted-foreground">
          <Link to="/" className="underline">
            {t("auth.backToWebsite")}
          </Link>
        </p>
      </div>
    </div>
  );
}
