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

async function geocode(city: string): Promise<{ lat: number; lng: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&featuretype=city&q=${encodeURIComponent(city)}`;
  const res = await fetch(url, { headers: { "User-Agent": "DivaCommunity/1.0 (https://divacommunity.sk)" } });
  if (!res.ok) return null;
  const results = (await res.json()) as { lat: string; lon: string }[];
  const first = results[0];
  if (!first) return null;
  return { lat: parseFloat(first.lat), lng: parseFloat(first.lon) };
}

/**
 * One-off, admin-only backfill: geocodes every already-saved city that's
 * missing coordinates (women who filled in their city before the map
 * feature existed). Not automatic/scheduled — an admin runs it once from
 * the admin screen, and it's safe to re-run any time since it only ever
 * touches rows still missing coordinates.
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const authHeader = req.headers.get("Authorization") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: isAdmin, error: adminError } = await userClient.rpc("is_admin");
  if (adminError || !isAdmin) return json({ error: "Len pre administrátorku." }, 403);

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: profiles, error } = await admin
    .from("profiles")
    .select("id, city")
    .not("city", "is", null)
    .or("city_lat.is.null,city_lng.is.null");
  if (error) return json({ error: error.message }, 500);

  const cities = new Map<string, { original: string; ids: string[] }>();
  for (const p of profiles ?? []) {
    const city = ((p.city as string) ?? "").trim();
    if (!city) continue;
    const key = city.toLowerCase();
    if (!cities.has(key)) cities.set(key, { original: city, ids: [] });
    cities.get(key)!.ids.push(p.id as string);
  }

  let citiesGeocoded = 0;
  let profilesUpdated = 0;
  const notFound: string[] = [];

  for (const [, { original, ids }] of cities) {
    const coords = await geocode(original);
    if (!coords) {
      notFound.push(original);
      continue;
    }
    citiesGeocoded++;
    const { error: updateError } = await admin
      .from("profiles")
      .update({ city_lat: coords.lat, city_lng: coords.lng })
      .in("id", ids);
    if (!updateError) profilesUpdated += ids.length;
    // Nominatim fair use policy: max ~1 request/sec.
    await new Promise((r) => setTimeout(r, 1100));
  }

  return json({
    cities_total: cities.size,
    cities_geocoded: citiesGeocoded,
    profiles_updated: profilesUpdated,
    not_found: notFound,
  });
});
