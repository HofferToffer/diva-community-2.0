import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import { getCycleInfo, formatCycleDate } from "@/community/lib/cycle";
import { getPregnancyInfo, TRIMESTER_LABEL } from "@/community/lib/pregnancy";
import { CycleCalendar } from "@/community/components/CycleCalendar";
import { CyclePhaseTips } from "@/community/components/CyclePhaseTips";
import { fadeUp } from "@/community/lib/motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RefreshCcw } from "lucide-react";

export default function CommunityCycle() {
  const { profile, refreshProfile, loadingProfile } = useCommunityAuth();
  const navigate = useNavigate();

  const [editingCycle, setEditingCycle] = useState(false);
  const [cycleLengthEdit, setCycleLengthEdit] = useState(String(profile?.cycle_length_days ?? 28));
  const [lastPeriodEdit, setLastPeriodEdit] = useState(profile?.last_period_date ?? "");
  const [savingCycle, setSavingCycle] = useState(false);

  if (loadingProfile || !profile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const cycle =
    !profile.is_pregnant && !profile.is_menopause && profile.last_period_date
      ? getCycleInfo(profile.last_period_date, profile.cycle_length_days ?? 28)
      : null;
  const pregnancy = profile.is_pregnant && profile.pregnancy_due_date ? getPregnancyInfo(profile.pregnancy_due_date) : null;

  const startEditingCycle = () => {
    setCycleLengthEdit(String(profile.cycle_length_days ?? 28));
    setLastPeriodEdit(profile.last_period_date ?? "");
    setEditingCycle(true);
  };

  const setPeriodStart = async (dateKey: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ last_period_date: dateKey } as never)
        .eq("id", profile.id);
      if (error) throw error;
      refreshProfile();
      toast.success("Dátum je upravený.");
    } catch {
      toast.error("Dátum sa nepodarilo upraviť.");
    }
  };

  const saveCycle = async () => {
    setSavingCycle(true);
    try {
      const length = Math.min(Math.max(parseInt(cycleLengthEdit, 10) || 28, 21), 40);
      const { error } = await supabase
        .from("profiles")
        .update({
          cycle_length_days: length,
          last_period_date: lastPeriodEdit || null,
        } as never)
        .eq("id", profile.id);
      if (error) throw error;
      refreshProfile();
      toast.success("Cyklus je upravený.");
      setEditingCycle(false);
    } catch {
      toast.error("Cyklus sa nepodarilo upraviť.");
    } finally {
      setSavingCycle(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.header {...fadeUp(0)} className="space-y-1">
        <h1 className="font-display text-3xl">Môj cyklus</h1>
        <p className="text-sm text-muted-foreground">
          Sleduj fázy cyklu a odporúčania, ktoré ti vedia pomôcť cítiť sa lepšie.
        </p>
      </motion.header>

      {profile.is_pregnant && (
        <motion.section {...fadeUp(1)} className="space-y-2 rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
          {pregnancy ? (
            <>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{TRIMESTER_LABEL[pregnancy.trimester]}</p>
              <p className="font-display text-2xl text-primary">{pregnancy.week}. týždeň tehotenstva</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {pregnancy.daysUntilDue > 0
                  ? `Do predpokladaného termínu pôrodu zostáva ${pregnancy.daysUntilDue} dní.`
                  : "Tvoj predpokladaný termín pôrodu už prešiel — nech je to v tvojom čase."}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Ešte si nezadala predpokladaný termín pôrodu.
            </p>
          )}
          <Button variant="ghost" size="sm" className="px-0" onClick={() => navigate("/community/profil")}>
            Upraviť v profile
          </Button>
        </motion.section>
      )}

      {profile.is_menopause && (
        <motion.section {...fadeUp(1)} className="space-y-2 rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Tvoja kapitola</p>
          <p className="font-display text-2xl text-primary">V menopauze</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Tvoje telo teraz prechádza inou fázou — bez tlaku sledovať cyklus. Počúvaj, čo potrebuješ dnes.
          </p>
          <Button variant="ghost" size="sm" className="px-0" onClick={() => navigate("/community/profil")}>
            Upraviť v profile
          </Button>
        </motion.section>
      )}

      {!profile.is_pregnant && !profile.is_menopause && (cycle ? (
        <motion.section {...fadeUp(1)} className="space-y-4 rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
          <div className="flex items-baseline justify-between gap-3">
            <div className="flex items-center gap-2">
              <RefreshCcw className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl">Prehľad cyklu</h2>
            </div>
            {!editingCycle && (
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">{cycle.dayOfCycle}. deň cyklu</p>
                <Button variant="ghost" size="sm" onClick={startEditingCycle}>
                  Upraviť
                </Button>
              </div>
            )}
          </div>

          {editingCycle ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cycle-last-period">Prvý deň poslednej menštruácie</Label>
                <Input
                  id="cycle-last-period"
                  type="date"
                  max={new Date().toISOString().slice(0, 10)}
                  value={lastPeriodEdit}
                  onChange={(e) => setLastPeriodEdit(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cycle-length">Dĺžka cyklu v dňoch</Label>
                <Input
                  id="cycle-length"
                  type="number"
                  inputMode="numeric"
                  min={21}
                  max={40}
                  value={cycleLengthEdit}
                  onChange={(e) => setCycleLengthEdit(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={saveCycle} disabled={savingCycle}>
                  Uložiť
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setEditingCycle(false)} disabled={savingCycle}>
                  Zrušiť
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{cycle.phase.name}</p>
              <p className="font-display text-xl text-primary">{cycle.subPhase.name}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{cycle.subPhase.description}</p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-border/50 p-3">
                  <p className="text-xs text-muted-foreground">Ďalšia menštruácia</p>
                  <p className="mt-1 font-medium">
                    {formatCycleDate(cycle.nextPeriodDate)}
                    <span className="ml-1 text-xs text-muted-foreground">(o {cycle.daysUntilNextPeriod} dní)</span>
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 p-3">
                  <p className="text-xs text-muted-foreground">Predpokladaná ovulácia</p>
                  <p className="mt-1 font-medium">{formatCycleDate(cycle.nextOvulationDate)}</p>
                </div>
              </div>

              <div className="rounded-xl border border-border/50 bg-background/60 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Tipy pre túto fázu
                </p>
                <div className="mt-4">
                  <CyclePhaseTips phase={cycle.phaseKey} />
                </div>
              </div>

              <CycleCalendar
                lastPeriodDate={profile.last_period_date!}
                cycleLengthDays={profile.cycle_length_days ?? 28}
                onSelectPeriodStart={setPeriodStart}
              />
            </>
          )}
        </motion.section>
      ) : (
        <motion.section {...fadeUp(1)} className="rounded-2xl border border-border/50 bg-card p-6 text-center shadow-sm">
          <h2 className="font-display text-xl">Zatiaľ nemáš nastavený cyklus</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Zadaj dátum poslednej menštruácie a dĺžku cyklu, aby sme ti mohli ukázať fázy a odporúčania.
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <div className="space-y-2 text-left">
              <Label htmlFor="cycle-last-period">Prvý deň poslednej menštruácie</Label>
              <Input
                id="cycle-last-period"
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                value={lastPeriodEdit}
                onChange={(e) => setLastPeriodEdit(e.target.value)}
              />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="cycle-length">Dĺžka cyklu v dňoch</Label>
              <Input
                id="cycle-length"
                type="number"
                inputMode="numeric"
                min={21}
                max={40}
                value={cycleLengthEdit}
                onChange={(e) => setCycleLengthEdit(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={saveCycle} disabled={savingCycle || !lastPeriodEdit}>
              Uložiť cyklus
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => navigate("/community/profil")}>
              Nastaviť v profile
            </Button>
          </div>
        </motion.section>
      ))}
    </div>
  );
}
