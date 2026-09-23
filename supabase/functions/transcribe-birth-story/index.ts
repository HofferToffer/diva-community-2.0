import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_BYTES = 13 * 1024 * 1024;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Neautorizované." }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) return json({ error: "Neautorizované." }, 401);

    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) return json({ error: "Prepis nie je nakonfigurovaný." }, 500);

    const declared = Number(req.headers.get("content-length") ?? 0);
    if (declared > MAX_BYTES) return json({ error: "Nahrávka je príliš veľká." }, 400);

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File) || !file.size) return json({ error: "Chýba zvukový súbor." }, 400);
    if (file.size > MAX_BYTES) return json({ error: "Nahrávka je príliš veľká." }, 400);

    // Browser MediaRecorder output can be labelled video/webm even when audio-only;
    // the transcription model requires an audio/* part.
    const audioType = file.type.startsWith("audio/")
      ? file.type
      : file.type.startsWith("video/")
        ? file.type.replace("video/", "audio/")
        : "audio/webm";
    const audioFile = new File([file], file.name || "nahravka.webm", { type: audioType });

    const upstream = new FormData();
    upstream.append("model", "google/gemini-3.5-transcribe");
    upstream.append("file", audioFile, audioFile.name);
    upstream.append("response_format", "json");
    upstream.append("stream", "true");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
      method: "POST",
      headers: { "Lovable-API-Key": key, Authorization: `Bearer ${key}` },
      body: upstream,
    });

    if (!res.ok || !res.body) {
      const detail = await res.text().catch(() => "");
      console.error("transcription upstream error", res.status, detail);
      return json({ error: "Prepis sa nepodaril. Skús to znova." }, 502);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let text = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx: number;
      while ((idx = buffer.indexOf("\n\n")) !== -1) {
        const event = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        for (const line of event.split("\n")) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const parsed = JSON.parse(payload);
            if (parsed.type === "transcript.text.delta" && typeof parsed.delta === "string") {
              text += parsed.delta;
            } else if (parsed.type === "transcript.text.done" && typeof parsed.text === "string") {
              text = parsed.text;
            }
          } catch {
            // ignore malformed events
          }
        }
      }
    }

    if (!text.trim()) {
      return json({ error: "V nahrávke som nerozoznala reč. Skús hovoriť bližšie k mikrofónu." }, 422);
    }
    return json({ text: text.trim() });
  } catch (e) {
    console.error("transcribe-birth-story failed", e);
    return json({ error: "Prepis sa nepodaril. Skús to znova." }, 500);
  }
});
