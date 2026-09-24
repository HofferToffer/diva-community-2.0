import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type SubInfo = { callback_url?: string; subscriptions?: unknown };

export default function AdminStravaWebhook() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState(false);

  const check = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke<SubInfo>("strava-webhook-subscription", {
      method: "GET",
    });
    if (!error && data) {
      setActive(Array.isArray(data.subscriptions) && data.subscriptions.length > 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    void check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = async () => {
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("strava-webhook-subscription", {
      method: "POST",
    });
    setBusy(false);
    if (error) {
      toast.error("Registrácia sa nepodarila. Skús to znova.");
      return;
    }
    toast.success((data as { message?: string })?.message ?? "Hotovo");
    void check();
  };

  return (
    <div className="rounded-2xl bg-secondary/30 p-5 shadow-elevated-sm">
      <h3 className="font-display text-xl">Automatický import zo Stravy</h3>
      <p className="mt-2 font-body text-sm text-muted-foreground">
        {loading
          ? "Zisťujem stav…"
          : active
            ? "Aktívne — nové aktivity sa importujú automaticky."
            : "Zatiaľ nie je zapnuté. Po zapnutí sa aktivity členiek načítajú samé."}
      </p>
      {!loading && !active && (
        <Button className="mt-4 rounded-full" onClick={register} disabled={busy}>
          {busy ? "Zapínam…" : "Zapnúť automatický import"}
        </Button>
      )}
    </div>
  );
}
