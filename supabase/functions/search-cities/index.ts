const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

type PhotonFeature = {
  geometry: { coordinates: [number, number] };
  properties: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    osm_key?: string;
    osm_value?: string;
  };
};

/**
 * Live place autocomplete for the city field, via Photon (Komoot's
 * OSM-based geocoder) — returns a few candidate places with a readable
 * label (e.g. "Zvolen, Banskobystrický kraj, Slovensko") plus their
 * coordinates, so picking a suggestion needs no separate geocoding call
 * later. Uses Photon rather than Nominatim directly because Nominatim's
 * usage policy throttles/blocks shared cloud IPs (like Supabase Edge
 * Functions run on), which silently starved this of results.
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let q: string | undefined;
  try {
    const body = await req.json();
    q = typeof body?.q === "string" ? body.q.trim() : undefined;
  } catch {
    return json({ error: "Neplatná požiadavka." }, 400);
  }
  if (!q || q.length < 2) return json({ results: [] });

  const url = `https://photon.komoot.io/api/?limit=8&lang=sk&q=${encodeURIComponent(q)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("search-cities: photon responded", res.status, await res.text());
      return json({ results: [] });
    }
    const data = (await res.json()) as { features?: PhotonFeature[] };
    const features = data.features ?? [];
    const places = features.filter((f) => f.properties.osm_key === "place");
    const pool = places.length > 0 ? places : features;

    const seen = new Set<string>();
    const results = [];
    for (const f of pool) {
      const p = f.properties;
      const place = p.name || p.city;
      if (!place) continue;
      const label = [place, p.state, p.country].filter(Boolean).join(", ");
      if (seen.has(label)) continue;
      seen.add(label);
      const [lng, lat] = f.geometry.coordinates;
      results.push({ label, lat, lng });
      if (results.length >= 5) break;
    }

    return json({ results });
  } catch (err) {
    console.error("search-cities failed", err);
    return json({ results: [] });
  }
});
