import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
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
  // Set whenever `query` changes programmatically rather than by the user typing
  // (picking a suggestion, or an external `value` change, e.g. the initial load
  // of a saved city) so the search effect below doesn't treat that as a fresh
  // search and pop the dropdown open on its own — e.g. right after opening
  // "Upraviť profil" with a saved city already filled in.
  const skipSearchRef = useRef(true);

  useEffect(() => {
    // Typing calls onChange(), which the parent echoes straight back down as a
    // new `value` — that's not an external change, so only treat this as one
    // (and skip the resulting search) when `value` actually differs from what
    // we already have locally.
    setQuery((current) => {
      if (current === value) return current;
      skipSearchRef.current = true;
      return value;
    });
  }, [value]);

  useEffect(() => {
    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return;
    }
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const { data, error } = await supabase.functions.invoke("search-cities", { body: { q: trimmed } });
        if (error) {
          toast.error(`Vyhľadávanie miest zlyhalo: ${error.message}`);
          setSuggestions([]);
          return;
        }
        setSuggestions(data?.results ?? []);
        setOpen(true);
      } catch (err) {
        toast.error(`Vyhľadávanie miest zlyhalo: ${err instanceof Error ? err.message : String(err)}`);
        setSuggestions([]);
      }
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
    skipSearchRef.current = true;
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
