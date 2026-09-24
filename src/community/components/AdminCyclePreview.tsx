import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getCycleInfo } from "@/community/lib/cycle";
import { useAdminPreview, type PreviewMode } from "@/community/lib/adminPreview";

const MODES: { key: PreviewMode; label: string }[] = [
  { key: "off", label: "Môj skutočný profil" },
  { key: "cycle", label: "Cyklus" },
  { key: "ttc", label: "Snaha otehotnieť" },
  { key: "pregnant", label: "Tehotenstvo" },
  { key: "postpartum", label: "Šestonedelie" },
  { key: "menopause", label: "Menopauza" },
];

const QUICK_DAYS = [
  { day: 1, label: "Menštruácia" },
  { day: 7, label: "Folikulárna" },
  { day: 14, label: "Ovulácia" },
  { day: 18, label: "Luteálna – začiatok" },
  { day: 22, label: "Luteálna – stred" },
  { day: 27, label: "Luteálna – koniec" },
];

export default function AdminCyclePreview() {
  const [p, setP] = useAdminPreview();
  const info = getCycleInfo(new Date().toISOString().slice(0, 10), p.cycleLength);
  const dayInfo = (() => {
    const d = new Date();
    d.setDate(d.getDate() - (p.cycleDay - 1));
    return getCycleInfo(d.toISOString().slice(0, 10), p.cycleLength);
  })();
  void info;

  const detailRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (p.mode === "off") return;
    requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }, [p.mode]);

  return (
    <section className="space-y-5 rounded-2xl bg-card p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <Eye className="mt-1 h-5 w-5 text-primary" />
        <div>
          <h2 className="font-display text-2xl">Náhľad fáz cyklu</h2>
          <p className="text-sm text-muted-foreground">
            Prepni si fázu a pozri, ako stránka Cyklus vyzerá. Vidíš to len ty, tvoj profil sa nemení.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <Button
            key={m.key}
            size="sm"
            variant={p.mode === m.key ? "default" : "secondary"}
            className="rounded-full"
            onClick={() => setP({ ...p, mode: m.key })}
          >
            {m.label}
          </Button>
        ))}
      </div>

      <div ref={detailRef} className="scroll-mt-4 space-y-5">
        {(p.mode === "cycle" || p.mode === "ttc") && (
          <div className="space-y-4 rounded-2xl bg-secondary/30 p-4">
            <div className="flex flex-wrap gap-2">
              {QUICK_DAYS.map((q) => (
                <Button
                  key={q.day}
                  size="sm"
                  variant={p.cycleDay === q.day ? "default" : "ghost"}
                  className="rounded-full"
                  onClick={() => setP({ ...p, cycleDay: Math.min(q.day, p.cycleLength) })}
                >
                  {q.label}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-sm">
                Deň cyklu: <strong>{p.cycleDay}</strong> z {p.cycleLength}
                {dayInfo && <span className="text-muted-foreground"> · {dayInfo.subPhase.name}</span>}
              </p>
              <Slider
                min={1}
                max={p.cycleLength}
                step={1}
                value={[p.cycleDay]}
                onValueChange={([v]) => setP({ ...p, cycleDay: v })}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm">Dĺžka cyklu: <strong>{p.cycleLength}</strong> dní</p>
              <Slider
                min={21}
                max={40}
                step={1}
                value={[p.cycleLength]}
                onValueChange={([v]) => setP({ ...p, cycleLength: v, cycleDay: Math.min(p.cycleDay, v) })}
              />
            </div>
          </div>
        )}

        {p.mode === "pregnant" && (
          <div className="space-y-2 rounded-2xl bg-secondary/30 p-4">
            <p className="text-sm">Týždeň tehotenstva: <strong>{p.pregnancyWeek}</strong></p>
            <Slider min={1} max={42} step={1} value={[p.pregnancyWeek]} onValueChange={([v]) => setP({ ...p, pregnancyWeek: v })} />
          </div>
        )}

        {p.mode === "postpartum" && (
          <div className="space-y-2 rounded-2xl bg-secondary/30 p-4">
            <p className="text-sm">Týždeň po pôrode: <strong>{p.postpartumWeek}</strong></p>
            <Slider min={1} max={12} step={1} value={[p.postpartumWeek]} onValueChange={([v]) => setP({ ...p, postpartumWeek: v })} />
          </div>
        )}

        {p.mode !== "off" && (
          <Button asChild className="rounded-full">
            <Link to="/community/cyklus">Otvoriť stránku Cyklus</Link>
          </Button>
        )}
      </div>
    </section>
  );
}
