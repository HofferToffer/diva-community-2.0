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

  try {
    // Admin-only: verify caller JWT and admin role
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Missing authorization" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await admin.auth.getUser(token);
    if (authError || !user) return json({ error: "Unauthorized" }, 401);

    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return json({ error: "Forbidden" }, 403);

    const clientId = Deno.env.get("STRAVA_CLIENT_ID");
    const clientSecret = Deno.env.get("STRAVA_CLIENT_SECRET");
    const verifyToken = Deno.env.get("STRAVA_WEBHOOK_VERIFY_TOKEN");
    if (!clientId || !clientSecret || !verifyToken) {
      return json({ error: "Strava nie je nakonfigurovaná" }, 500);
    }

    const callbackUrl = `${supabaseUrl}/functions/v1/strava-webhook`;

    // Check existing subscription
    const listRes = await fetch(
      `https://www.strava.com/api/v3/push_subscriptions?client_id=${clientId}&client_secret=${clientSecret}`
    );
    const existing = await listRes.json();

    if (req.method === "GET") {
      return json({ callback_url: callbackUrl, subscriptions: existing });
    }

    if (req.method === "POST") {
      if (Array.isArray(existing) && existing.length > 0) {
        return json({ message: "Subscription už existuje", subscriptions: existing });
      }
      const res = await fetch("https://www.strava.com/api/v3/push_subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          callback_url: callbackUrl,
          verify_token: verifyToken,
        }),
      });
      const data = await res.json();
      if (!res.ok) return json({ error: "Strava API error", details: data }, res.status);
      return json({ message: "Subscription vytvorená", subscription: data });
    }

    if (req.method === "DELETE") {
      if (Array.isArray(existing) && existing.length > 0) {
        for (const sub of existing) {
          await fetch(
            `https://www.strava.com/api/v3/push_subscriptions/${sub.id}?client_id=${clientId}&client_secret=${clientSecret}`,
            { method: "DELETE" }
          );
        }
      }
      return json({ message: "Subscription zrušená" });
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
