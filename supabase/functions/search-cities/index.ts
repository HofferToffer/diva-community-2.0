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
 * Live place autocomplete for the city field, via OpenStreetMap's
 * Nominatim — returns a few candidate places with a readable label
 * (e.g. "Zvolen, Banskobystrický kraj, Slovensko") plus their coordinates,
 * so picking a suggestion needs no separate geocoding call later.
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

  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&accept-language=sk&q=${encodeURIComponent(q)}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "DivaCommunity/1.0 (https://divacommunity.sk)" },
    });
    if (!res.ok) return json({ results: [] });
    const raw = (await res.json()) as {
      display_name: string;
      lat: string;
      lon: string;
      address?: Record<string, string>;
    }[];

    const results = raw.map((r) => {
      const a = r.address ?? {};
      const place = a.city || a.town || a.village || a.municipality || a.county || r.display_name.split(",")[0];
      const region = a.state || a.county;
      const country = a.country;
      const label = [place, region, country].filter(Boolean).join(", ");
      return { label, lat: parseFloat(r.lat), lng: parseFloat(r.lon) };
    });

    return json({ results });
  } catch {
    return json({ results: [] });
  }
});
