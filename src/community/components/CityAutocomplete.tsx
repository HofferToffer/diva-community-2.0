import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CitySuggestion = { label: string; lat: number; lng: number };

/**
 * A free-text city field with live place suggestions (like "Zvolen,
 * Banskobystrický kraj, Slovensko"), the way most apps do it. Picking a
 * suggestion hands the parent its coordinates directly — typing without
 * picking one clears the coordinates so the caller knows to geocode the
 * plain text itself as a fallback.
 */
export function CityAutocomplete({
  id,
  value,
  onChange,
}: {
  id?: string;
  value: string;
  onChange: (city: string, lat: number | null, lng: number | null) => void;
}) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // Set right before setQuery() in pick(), so the effect it triggers can skip re-searching for what was just chosen.
  const justPickedRef = useRef(false);

  useEffect(() => setQuery(value), [value]);

  useEffect(() => {
    if (justPickedRef.current) {
      justPickedRef.current = false;
      return;
    }
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      const { data } = await supabase.functions.invoke("search-cities", { body: { q: trimmed } });
      setSuggestions(data?.results ?? []);
      setOpen(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const pick = (s: CitySuggestion) => {
    justPickedRef.current = true;
    setQuery(s.label);
    onChange(s.label, s.lat, s.lng);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        id={id}
        value={query}
        autoComplete="off"
        placeholder="napr. Zvolen"
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value, null, null);
        }}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-border bg-card py-1 shadow-lg">
          {suggestions.map((s, i) => (
            <li key={`${s.label}-${i}`}>
              <button
                type="button"
                className={cn("w-full px-3 py-2 text-left text-sm hover:bg-muted")}
                onClick={() => pick(s)}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
