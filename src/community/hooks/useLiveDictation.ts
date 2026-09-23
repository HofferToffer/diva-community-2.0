import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
};

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export const liveDictationSupported = () => getRecognitionCtor() !== null;

/**
 * Live speech-to-text: final chunks are appended through `onText`,
 * `interim` holds the words currently being recognised.
 */
export function useLiveDictation(onText: (chunk: string) => void, lang = "sk-SK") {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const shouldListenRef = useRef(false);
  const onTextRef = useRef(onText);
  onTextRef.current = onText;

  const stop = useCallback(() => {
    shouldListenRef.current = false;
    setListening(false);
    setInterim("");
    try {
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }
    recognitionRef.current = null;
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return false;
    if (recognitionRef.current) return true;

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let pending = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcript = String(result[0]?.transcript ?? "");
        if (result.isFinal) {
          const clean = transcript.trim();
          if (clean) onTextRef.current(clean);
        } else {
          pending += transcript;
        }
      }
      setInterim(pending.trim());
    };

    recognition.onerror = (event: any) => {
      if (event?.error === "no-speech" || event?.error === "aborted") return;
      shouldListenRef.current = false;
      setListening(false);
      setInterim("");
    };

    recognition.onend = () => {
      setInterim("");
      if (shouldListenRef.current) {
        // Browsers stop after a pause — keep dictation running.
        try {
          recognition.start();
          return;
        } catch {
          // ignore
        }
      }
      recognitionRef.current = null;
      setListening(false);
    };

    try {
      recognition.start();
    } catch {
      return false;
    }
    recognitionRef.current = recognition;
    shouldListenRef.current = true;
    setListening(true);
    return true;
  }, [lang]);

  useEffect(() => () => {
    shouldListenRef.current = false;
    try {
      recognitionRef.current?.abort();
    } catch {
      // ignore
    }
  }, []);

  return { listening, interim, start, stop, supported: getRecognitionCtor() !== null };
}
