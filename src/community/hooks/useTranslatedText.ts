import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Module-level cache: the same admin-entered text (e.g. a challenge title)
// is requested by every viewer and every re-render, so translate it once
// and reuse the result for the lifetime of the tab.
const cache = new Map<string, string>();
const pending = new Map<string, Promise<string>>();

async function translateOne(text: string): Promise<string> {
  if (cache.has(text)) return cache.get(text)!;
  const inFlight = pending.get(text);
  if (inFlight) return inFlight;

  const promise = (async () => {
    try {
      const { data, error } = await supabase.functions.invoke("translate-text", { body: { texts: [text] } });
      if (error) throw error;
      const translated: string = data?.translations?.[0] ?? text;
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
 * free translation API called through the translate-text edge function.
 * Shows the original text immediately and swaps in the translation once it
 * arrives; falls back to the original on any failure. Nothing is stored —
 * admins never have to type an English version themselves.
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
