import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  useChallenges,
  useDeleteChallenge,
  useSaveChallenge,
  type Challenge,
} from "@/community/hooks/queries";

const GOAL_TYPES = [
  { value: "community_distance", label: "Spoločné kilometre celej komunity" },
  { value: "individual_distance", label: "Kilometre každej Divy zvlášť" },
];

const SK_MONTHS = ["jan", "feb", "mar", "apr", "máj", "jún", "júl", "aug", "sep", "okt", "nov", "dec"];

function fmt(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${d.getDate()}. ${SK_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

type FormState = {
  id?: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  goal: string;
  goal_type: string;
  active: boolean;
};

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = (): FormState => ({
  title: "",
  description: "",
  start_date: today(),
  end_date: today(),
  goal: "100",
  goal_type: "community_distance",
  active: true,
});

const toForm = (c: Challenge): FormState => ({
  id: c.id,
  title: c.title,
  description: c.description ?? "",
  start_date: c.start_date,
  end_date: c.end_date,
  goal: String(c.goal),
  goal_type: c.goal_type,
  active: c.active,
});

export default function AdminChallenges() {
  const { data: challenges, isLoading } = useChallenges();
  const save = useSaveChallenge();
  const remove = useDeleteChallenge();
  const [form, setForm] = useState<FormState | null>(null);

  const submit = () => {
    if (!form) return;
    if (!form.title.trim()) {
      toast.error("Napíš názov výzvy.");
      return;
    }
    const goal = Number(String(form.goal).replace(",", "."));
    if (!Number.isFinite(goal) || goal <= 0) {
      toast.error("Zadaj cieľ v kilometroch, napríklad 100.");
      return;
    }
    if (form.end_date < form.start_date) {
      toast.error("Koniec výzvy nemôže byť skôr ako začiatok.");
      return;
    }
    save.mutate(
      {
        id: form.id,
        title: form.title.trim(),
        description: form.description.trim() || null,
        start_date: form.start_date,
        end_date: form.end_date,
        goal,
        goal_type: form.goal_type,
        active: form.active,
      },
      {
        onSuccess: () => {
          toast.success(form.id ? "Výzva je upravená." : "Výzva je vytvorená.");
          setForm(null);
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "Nepodarilo sa uložiť výzvu."),
      },
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Tu si vytvoríš a upravíš bežecké výzvy — z počítača, tabletu aj mobilu. Cieľ sa vždy počíta v kilometroch.
      </p>

      {!form && (
        <Button onClick={() => setForm(emptyForm())} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Nová výzva
        </Button>
      )}

      {form && (
        <div className="space-y-4 rounded-2xl border border-border/50 bg-card p-4 shadow-elevated-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl">{form.id ? "Upraviť výzvu" : "Nová výzva"}</h3>
            <Button variant="ghost" size="icon" onClick={() => setForm(null)} aria-label="Zavrieť">
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ch-title">Názov výzvy</Label>
            <Input
              id="ch-title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Napríklad: Septembrové kilometre"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ch-desc">Popis pre Divy</Label>
            <Textarea
              id="ch-desc"
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Čo je cieľom výzvy a ako sa do nej zapojiť."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ch-start">Začiatok</Label>
              <Input
                id="ch-start"
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ch-end">Koniec</Label>
              <Input
                id="ch-end"
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ch-goal">Cieľ v kilometroch</Label>
              <Input
                id="ch-goal"
                type="number"
                inputMode="decimal"
                min="1"
                step="1"
                value={form.goal}
                onChange={(e) => setForm({ ...form, goal: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ch-type">Ako sa cieľ počíta</Label>
              <select
                id="ch-type"
                value={form.goal_type}
                onChange={(e) => setForm({ ...form, goal_type: e.target.value })}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {GOAL_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/50 px-3 py-2">
            <Label htmlFor="ch-active" className="text-sm">
              Výzva je viditeľná pre Divy
            </Label>
            <Switch
              id="ch-active"
              checked={form.active}
              onCheckedChange={(v) => setForm({ ...form, active: v })}
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={submit} disabled={save.isPending} className="sm:w-auto">
              {save.isPending ? "Ukladám…" : "Uložiť výzvu"}
            </Button>
            <Button variant="outline" onClick={() => setForm(null)} className="sm:w-auto">
              Zrušiť
            </Button>
          </div>
        </div>
      )}

      {isLoading && <Skeleton className="h-32 w-full" />}

      {challenges && challenges.length > 0 && (
        <ul className="divide-y divide-border rounded-2xl border border-border/50 bg-card shadow-elevated-sm">
          {challenges.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0 space-y-1">
                <p className="truncate font-body">
                  {c.title}
                  {!c.active && (
                    <span className="ml-2 text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground">
                      skrytá
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {fmt(c.start_date)} – {fmt(c.end_date)} · cieľ {c.goal} km
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" onClick={() => setForm(toForm(c))} aria-label="Upraviť výzvu">
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Zmazať výzvu"
                  onClick={() => {
                    if (!window.confirm(`Naozaj zmazať výzvu „${c.title}“?`)) return;
                    remove.mutate(c.id, {
                      onSuccess: () => toast.success("Výzva je zmazaná."),
                      onError: () =>
                        toast.error("Výzvu sa nepodarilo zmazať — možno sú do nej zapojené Divy."),
                    });
                  }}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {challenges && challenges.length === 0 && (
        <p className="text-sm text-muted-foreground">Zatiaľ nemáš žiadnu výzvu.</p>
      )}
    </div>
  );
}
