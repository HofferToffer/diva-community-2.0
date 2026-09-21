import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const clientId = Deno.env.get("STRAVA_CLIENT_ID");
  const clientSecret = Deno.env.get("STRAVA_CLIENT_SECRET");
  if (!clientId || !clientSecret) return json({ error: "Strava nie je nakonfigurovaná." }, 500);

  const authHeader = req.headers.get("Authorization") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) return json({ error: "Neprihlásený používateľ." }, 401);

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("user_id", userData.user.id)
    .single();
  if (!profile) return json({ error: "Profil neexistuje." }, 404);

  const body = await req.json().catch(() => ({}));
  const { action, code, redirect_uri: redirectUri } = body as {
    action?: string;
    code?: string;
    redirect_uri?: string;
  };

  if (action === "url") {
    if (!redirectUri) return json({ error: "Chýba redirect_uri." }, 400);
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      approval_prompt: "auto",
      scope: "read,activity:read_all",
    });
    return json({ url: `https://www.strava.com/oauth/authorize?${params.toString()}` });
  }

  if (action === "exchange") {
    if (!code) return json({ error: "Chýba kód." }, 400);
    const tokenRes = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
      }),
    });
    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.error("Strava token exchange failed", tokenRes.status, text);
      return json({ error: "Prepojenie so Stravou zlyhalo." }, 400);
    }
    const tokenData = await tokenRes.json();
    const athleteId = tokenData.athlete?.id;
    if (!athleteId) return json({ error: "Strava nevrátila údaje športovca." }, 400);

    const { error: upsertError } = await admin.from("strava_connections").upsert(
      {
        profile_id: profile.id,
        strava_athlete_id: athleteId,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: tokenData.expires_at,
      },
      { onConflict: "profile_id" },
    );
    if (upsertError) {
      console.error("Upsert failed", upsertError);
      return json({ error: "Prepojenie sa nepodarilo uložiť." }, 500);
    }
    return json({ ok: true, athlete_id: athleteId });
  }

  return json({ error: "Neznáma akcia." }, 400);
});
