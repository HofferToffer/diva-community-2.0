import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type Mode = "signin" | "signup" | "forgot";

const REMEMBER_KEY = "diva-remember-login";

function readRemembered(): { email: string; password: string } | null {
  try {
    const raw = localStorage.getItem(REMEMBER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { email?: string; password?: string };
    if (!parsed.email) return null;
    return { email: parsed.email, password: parsed.password ?? "" };
  } catch {
    return null;
  }
}

export default function CommunityAuth() {
  const { t } = useTranslation();
  const remembered = readRemembered();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState(remembered?.email ?? "");
  const [password, setPassword] = useState(remembered?.password ?? "");
  const [remember, setRemember] = useState(Boolean(remembered));
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthPending, setOauthPending] = useState(false);
  const [sentEmail, setSentEmail] = useState<null | "confirm" | "reset">(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (password !== passwordConfirm) {
          toast.error(t("auth.passwordMismatch"));
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/community`, data: { name } },
        });
        if (error) throw error;
        if (!data.session) setSentEmail("confirm");
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (remember) {
          localStorage.setItem(REMEMBER_KEY, JSON.stringify({ email, password }));
        } else {
          localStorage.removeItem(REMEMBER_KEY);
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setSentEmail("reset");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : t("auth.tryAgain");
      toast.error(
        message.includes("Invalid login credentials")
          ? t("auth.invalidCredentials")
          : message.includes("already registered")
            ? t("auth.emailAlreadyRegistered")
            : message,
      );
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    setLoading(true);
    setOauthPending(true);
    // If the Google popup is closed without completing sign-in, the promise
    // may never resolve — reset the UI so the user can return to the form.
    const fallback = window.setTimeout(() => {
      setLoading(false);
      setOauthPending(false);
    }, 15000);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/community`,
      });
      window.clearTimeout(fallback);
      setLoading(false);
      setOauthPending(false);
      if (result.error) {
        toast.error(t("auth.googleSignInFailed"));
        return;
      }
    } catch {
      window.clearTimeout(fallback);
      setLoading(false);
      setOauthPending(false);
      toast.error(t("auth.googleSignInFailed"));
    }
  };

  if (sentEmail) {
    return (
      <Wrapper>
        <h1 className="font-display text-3xl">{t("auth.checkEmailTitle")}</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {sentEmail === "confirm"
            ? t("auth.confirmEmailSent", { email })
            : t("auth.resetEmailSent", { email })}
        </p>
        <Button variant="outline" className="mt-6 w-full" onClick={() => setSentEmail(null)}>
          {t("auth.backButton")}
        </Button>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <p className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">Diva Community</p>
      <h1 className="mt-3 font-display text-4xl leading-tight">
        {mode === "signup" ? t("auth.welcomeSignup") : mode === "forgot" ? t("auth.forgotPasswordTitle") : t("auth.welcomeBack")}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {t("auth.subtitle")}
      </p>
      {mode !== "forgot" && (
        <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-center">
          <p className="font-display text-lg leading-snug">
            {t("auth.promoPrefix")} <span className="text-2xl font-light">100</span> {t("auth.promoMiddle")} <span className="uppercase">{t("auth.promoDivaWord")}</span> {t("auth.promoSuffix")}
          </p>
        </div>
      )}


      <form onSubmit={submit} className="mt-8 space-y-4">
        {mode === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="name">{t("auth.nameLabel")}</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">{t("auth.emailLabel")}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        {mode !== "forgot" && (
          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.passwordLabel")}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}
        {mode === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="password-confirm">{t("auth.passwordConfirmLabel")}</Label>
            <div className="relative">
              <Input
                id="password-confirm"
                type={showPassword ? "text" : "password"}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}
        {mode === "signin" && (
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(value) => {
                const next = value === true;
                setRemember(next);
                if (!next) localStorage.removeItem(REMEMBER_KEY);
              }}
            />
            <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
              {t("auth.rememberLabel")}
            </Label>
          </div>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {mode === "signup" ? t("auth.createAccountButton") : mode === "forgot" ? t("auth.sendLinkButton") : t("auth.signInButton")}
        </Button>
      </form>

      {mode !== "forgot" && (
        <>
          <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> {t("auth.orDivider")} <span className="h-px flex-1 bg-border" />
          </div>
          <Button variant="outline" className="w-full" onClick={googleSignIn} disabled={loading}>
            {t("auth.continueWithGoogle")}
          </Button>
          {oauthPending && (
            <div className="mt-3 text-center">
              <p className="text-xs text-muted-foreground">{t("auth.googleSignInPending")}</p>
              <button
                type="button"
                className="mt-1 text-sm underline"
                onClick={() => {
                  setOauthPending(false);
                  setLoading(false);
                }}
              >
                {t("auth.backButton")}
              </button>
            </div>
          )}
        </>
      )}

      <div className="mt-8 space-y-2 text-center text-sm text-muted-foreground">
        {mode === "signin" && (
          <>
            <button type="button" className="underline" onClick={() => setMode("signup")}>
              {t("auth.noAccountSignUp")}
            </button>
            <br />
            <button type="button" className="underline" onClick={() => setMode("forgot")}>
              {t("auth.forgotPasswordTitle")}
            </button>
          </>
        )}
        {mode !== "signin" && (
          <button type="button" className="underline" onClick={() => setMode("signin")}>
            {t("auth.backToSignIn")}
          </button>
        )}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        <Link to="/" className="underline">
          {t("auth.backToWebsite")}
        </Link>
      </p>
    </Wrapper>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
