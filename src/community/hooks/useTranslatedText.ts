import { useEffect, useState } from "react";

// Module-level cache: the same admin-entered text (e.g. a challenge title)
// is requested by every viewer and every re-render, so translate it once
// and reuse the result for the lifetime of the tab.
const cache = new Map<string, string>();
const pending = new Map<string, Promise<string>>();

// MyMemory's free engine occasionally mangles short unit abbreviations in
// fitness content (seen: "100 km" → "100 HP") — patch the ones we've hit
// back to the correct unit whenever the source text clearly meant it.
const UNIT_FIXES: { source: RegExp; wrong: RegExp; correct: string }[] = [
  { source: /\bkm\b|kilometr/i, wrong: /\bHP\b/g, correct: "km" },
];

function fixKnownMistranslations(source: string, translated: string): string {
  return UNIT_FIXES.reduce(
    (result, { source: sourcePattern, wrong, correct }) =>
      sourcePattern.test(source) ? result.replace(wrong, correct) : result,
    translated,
  );
}

async function translateOne(text: string): Promise<string> {
  if (cache.has(text)) return cache.get(text)!;
  const inFlight = pending.get(text);
  if (inFlight) return inFlight;

  const promise = (async () => {
    try {
      // Called directly from the browser (MyMemory allows cross-origin
      // requests) rather than through a Supabase edge function — no backend
      // deploy step needed, so it works the moment this code ships.
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=sk|en`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`MyMemory responded ${res.status}`);
      const data = (await res.json()) as { responseData?: { translatedText?: string } };
      const rawTranslated = data.responseData?.translatedText;
      if (!rawTranslated) throw new Error("MyMemory returned no translation");
      const translated = fixKnownMistranslations(text, rawTranslated);
      cache.set(text, translated);
      return translated;
    } catch (err) {
      console.error("useTranslatedText: translation failed, showing original text", err);
      cache.set(text, text);
      return text;
    } finally {
      pending.delete(text);
    }
  })();
  pending.set(text, promise);
  return promise;
}

/**
 * Live-translates admin-entered content (a challenge title/description —
 * free text, not static UI copy) to English when `enabled` is true, via a
 * free translation API called directly from the browser. Shows the
 * original text immediately and swaps in the translation once it arrives;
 * falls back to the original on any failure. Nothing is stored — admins
 * never have to type an English version themselves.
 */
export function useTranslatedText(text: string, enabled: boolean): string {
  const [translated, setTranslated] = useState(() => (enabled && text && cache.has(text) ? cache.get(text)! : text));

  useEffect(() => {
    if (!enabled || !text) {
      setTranslated(text);
      return;
    }
    if (cache.has(text)) {
      setTranslated(cache.get(text)!);
      return;
    }
    let cancelled = false;
    translateOne(text).then((result) => {
      if (!cancelled) setTranslated(result);
    });
    return () => {
      cancelled = true;
    };
  }, [text, enabled]);

  return translated;
}
