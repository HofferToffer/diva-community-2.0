const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

/**
 * Turns a free-text city name into approximate city-level coordinates, using
 * OpenStreetMap's Nominatim (no API key, but requires a real User-Agent and
 * fair use — one lookup per profile save, never a bulk job). Only ever
 * resolves to a city centroid, never a precise address.
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let city: string | undefined;
  try {
    const body = await req.json();
    city = typeof body?.city === "string" ? body.city.trim() : undefined;
  } catch {
    return json({ error: "Neplatná požiadavka." }, 400);
  }
  if (!city) return json({ lat: null, lng: null });

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&featuretype=city&q=${encodeURIComponent(city)}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "DivaCommunity/1.0 (https://divacommunity.sk)" },
    });
    if (!res.ok) return json({ lat: null, lng: null });
    const results = (await res.json()) as { lat: string; lon: string }[];
    const first = results[0];
    if (!first) return json({ lat: null, lng: null });
    return json({ lat: parseFloat(first.lat), lng: parseFloat(first.lon) });
  } catch {
    return json({ lat: null, lng: null });
  }
});
