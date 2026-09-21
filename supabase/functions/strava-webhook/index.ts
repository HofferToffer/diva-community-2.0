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

const SPORT_MAP: Record<string, { kind: "run" | "move"; label: string }> = {
  Run: { kind: "run", label: "Beh" },
  TrailRun: { kind: "run", label: "Trailový beh" },
  VirtualRun: { kind: "run", label: "Beh" },
  Walk: { kind: "move", label: "Chôdza" },
  Hike: { kind: "move", label: "Turistika" },
  Ride: { kind: "move", label: "Bicykel" },
  EBikeRide: { kind: "move", label: "Bicykel" },
  VirtualRide: { kind: "move", label: "Bicykel" },
  MountainBikeRide: { kind: "move", label: "Bicykel" },
  GravelRide: { kind: "move", label: "Bicykel" },
  Swim: { kind: "move", label: "Plávanie" },
  Yoga: { kind: "move", label: "Joga" },
  Pilates: { kind: "move", label: "Pilates" },
  WeightTraining: { kind: "move", label: "Posilňovňa" },
  Workout: { kind: "move", label: "Tréning" },
  Crossfit: { kind: "move", label: "Tréning" },
  AlpineSki: { kind: "move", label: "Lyžovanie" },
  NordicSki: { kind: "move", label: "Bežky" },
  InlineSkate: { kind: "move", label: "Korčule" },
};

async function refreshTokenIfNeeded(
  admin: ReturnType<typeof createClient>,
  connection: {
    id: string;
    access_token: string;
    refresh_token: string;
    expires_at: number;
  },
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (connection.expires_at > now + 300) return connection.access_token;

  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: Deno.env.get("STRAVA_CLIENT_ID"),
      client_secret: Deno.env.get("STRAVA_CLIENT_SECRET"),
      grant_type: "refresh_token",
      refresh_token: connection.refresh_token,
    }),
  });
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`);
  const data = await res.json();
  await admin
    .from("strava_connections")
    .update({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
    })
    .eq("id", connection.id);
  return data.access_token;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const verifyToken = Deno.env.get("STRAVA_WEBHOOK_VERIFY_TOKEN");

  // Strava webhook validation handshake
  if (req.method === "GET") {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    if (mode === "subscribe" && token === verifyToken && challenge) {
      return json({ "hub.challenge": challenge });
    }
    return json({ error: "Forbidden" }, 403);
  }

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const event = await req.json().catch(() => null);
  if (!event || event.object_type !== "activity") return json({ ok: true });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const { data: connection } = await admin
    .from("strava_connections")
    .select("id, profile_id, access_token, refresh_token, expires_at")
    .eq("strava_athlete_id", event.owner_id)
    .maybeSingle();
  if (!connection) return json({ ok: true });

  try {
    if (event.aspect_type === "delete") {
      await admin
        .from("activities")
        .delete()
        .eq("strava_activity_id", event.object_id)
        .eq("profile_id", connection.profile_id);
      return json({ ok: true });
    }

    const accessToken = await refreshTokenIfNeeded(admin, connection);
    const actRes = await fetch(`https://www.strava.com/api/v3/activities/${event.object_id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!actRes.ok) {
      console.error("Fetch activity failed", actRes.status);
      return json({ ok: true });
    }
    const act = await actRes.json();

    const sportType: string = act.sport_type ?? act.type ?? "Workout";
    const mapped = SPORT_MAP[sportType] ?? { kind: "move" as const, label: "Pohyb" };
    const durationSeconds: number = act.moving_time ?? act.elapsed_time ?? 0;
    const distanceKm = act.distance ? Math.round((act.distance / 1000) * 100) / 100 : null;
    const paceSeconds =
      mapped.kind === "run" && distanceKm && distanceKm > 0
        ? Math.round(durationSeconds / distanceKm)
        : null;
    const activityDate = (act.start_date_local ?? act.start_date ?? "").slice(0, 10);

    const row = {
      profile_id: connection.profile_id,
      kind: mapped.kind,
      activity_type: mapped.label,
      activity_date: activityDate || new Date().toISOString().slice(0, 10),
      duration_seconds: durationSeconds,
      distance_km: distanceKm,
      pace_seconds: paceSeconds,
      note: act.name ? `Strava: ${act.name}` : null,
      visibility: "public",
      strava_activity_id: act.id,
    };

    if (event.aspect_type === "create") {
      const { error } = await admin
        .from("activities")
        .upsert(row, { onConflict: "strava_activity_id", ignoreDuplicates: true });
      if (error) console.error("Insert failed", error);
    } else if (event.aspect_type === "update") {
      const { error } = await admin
        .from("activities")
        .update({
          activity_date: row.activity_date,
          duration_seconds: row.duration_seconds,
          distance_km: row.distance_km,
          pace_seconds: row.pace_seconds,
          note: row.note,
        })
        .eq("strava_activity_id", event.object_id)
        .eq("profile_id", connection.profile_id);
      if (error) console.error("Update failed", error);
    }
  } catch (err) {
    console.error("Webhook error", err);
  }

  return json({ ok: true });
});
