import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function CommunityStravaCallback() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const code = params.get("code");
    const error = params.get("error");
    if (error || !code) {
      toast.error(t("stravaCallback.connectionCancelled"));
      navigate("/community/profil", { replace: true });
      return;
    }

    (async () => {
      try {
        const { error: fnError } = await supabase.functions.invoke("strava-oauth", {
          body: {
            action: "exchange",
            code,
            redirect_uri: `${window.location.origin}/community/strava/callback`,
          },
        });
        if (fnError) throw fnError;
        toast.success(t("stravaCallback.connectionSuccess"));
      } catch {
        toast.error(t("stravaCallback.connectionFailed"));
      } finally {
        navigate("/community/profil", { replace: true });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, navigate]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <p className="font-display text-xl text-muted-foreground">{t("stravaCallback.connecting")}</p>
    </div>
  );
}
