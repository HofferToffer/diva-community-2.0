const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

type MyMemoryResponse = { responseData?: { translatedText?: string }; responseStatus?: number | string };

/**
 * Translates free-text (challenge titles/descriptions — content admins type
 * in Slovak, not static UI copy) to English on the fly, via MyMemory's free
 * translation API. No storage: called live whenever an English-language
 * viewer needs it, so admins never have to type an English version
 * themselves. Falls back to the original text on any failure.
 */
async function translateOne(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=sk|en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MyMemory responded ${res.status}`);
  const data = (await res.json()) as MyMemoryResponse;
  const translated = data.responseData?.translatedText;
  if (!translated) throw new Error("MyMemory returned no translation");
  return translated;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let texts: unknown;
  try {
    const body = await req.json();
    texts = body?.texts;
  } catch {
    return json({ error: "Neplatná požiadavka." }, 400);
  }
  if (!Array.isArray(texts) || texts.some((t) => typeof t !== "string")) {
    return json({ error: "`texts` musí byť pole reťazcov." }, 400);
  }
  const input = texts as string[];
  if (input.length === 0) return json({ translations: [] });
  if (input.length > 20) return json({ error: "Príliš veľa textov naraz." }, 400);

  const translations = await Promise.all(
    input.map(async (text) => {
      try {
        return await translateOne(text);
      } catch (err) {
        console.error("translate-text: failed for one text", err);
        return text;
      }
    }),
  );

  return json({ translations });
});
