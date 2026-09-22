const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

type PhotonFeature = { geometry: { coordinates: [number, number] } };

/**
 * Turns a free-text city name into approximate city-level coordinates, using
 * Photon (Komoot's OSM-based geocoder) rather than Nominatim directly —
 * Nominatim's usage policy throttles/blocks requests from shared cloud IPs
 * (like Supabase Edge Functions run on), which silently returned nothing.
 * Only ever resolves to a city centroid, never a precise address.
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

  // `lang=en`: Photon rejects `lang=sk`, which silently returned nothing.
  const url = `https://photon.komoot.io/api/?limit=1&lang=en&q=${encodeURIComponent(city)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("geocode-city: photon responded", res.status, await res.text());
      return json({ lat: null, lng: null });
    }
    const data = (await res.json()) as { features?: PhotonFeature[] };
    const first = data.features?.[0];
    if (!first) return json({ lat: null, lng: null });
    const [lng, lat] = first.geometry.coordinates;
    return json({ lat, lng });
  } catch (err) {
    console.error("geocode-city failed", err);
    return json({ lat: null, lng: null });
  }
});
