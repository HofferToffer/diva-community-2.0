import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import { useIntimacyLogs, useToggleIntimacyLog } from "@/community/hooks/queries";
import { getCycleInfo, formatCycleDate, CYCLE_PHASE_ARCHETYPE, CYCLE_PHASE_CARD_TINT } from "@/community/lib/cycle";
import { getPregnancyInfo, pregnancyWeekIcon, pregnancyWeekSize, TRIMESTER_LABEL } from "@/community/lib/pregnancy";
import { getPostpartumInfo } from "@/community/lib/postpartum";
import { CycleCalendar } from "@/community/components/CycleCalendar";
import { CyclePhaseTips, TipGrid } from "@/community/components/CyclePhaseTips";
import { MENOPAUSE_TIPS } from "@/community/lib/menopause";
import { ConfettiBurst } from "@/community/components/ConfettiBurst";
import { getLifePhase, PHASE_LABEL } from "@/community/lib/quotes";
import { fadeUp } from "@/community/lib/motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, RefreshCcw } from "lucide-react";

export default function CommunityCycle() {
  const { profile, refreshProfile, loadingProfile } = useCommunityAuth();
  const navigate = useNavigate();

  const [editingCycle, setEditingCycle] = useState(false);
  const [cycleLengthEdit, setCycleLengthEdit] = useState(String(profile?.cycle_length_days ?? 28));
  const [lastPeriodEdit, setLastPeriodEdit] = useState(profile?.last_period_date ?? "");
  const [savingCycle, setSavingCycle] = useState(false);
  const [justGaveBirth, setJustGaveBirth] = useState(false);
  const { data: intimacyDates } = useIntimacyLogs(profile?.id);
  const toggleIntimacy = useToggleIntimacyLog(profile?.id);

  if (loadingProfile || !profile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const cycle =
    !profile.is_pregnant && !profile.is_menopause && !profile.is_postpartum && profile.last_period_date
      ? getCycleInfo(profile.last_period_date, profile.cycle_length_days ?? 28)
      : null;
  const pregnancy = profile.is_pregnant && profile.last_period_date ? getPregnancyInfo(profile.last_period_date) : null;
  const postpartum = profile.is_postpartum && profile.postpartum_since ? getPostpartumInfo(profile.postpartum_since) : null;

  const markBirth = async () => {
    if (!window.confirm("Narodilo sa ti bábätko? Toto ukončí sledovanie tehotenstva.")) return;
    try {
      const today = new Date().toISOString().slice(0, 10);
      const { error } = await supabase
        .from("profiles")
        .update({ is_pregnant: false, is_postpartum: true, postpartum_since: today } as never)
        .eq("id", profile.id);
      if (error) throw error;
      refreshProfile();
      setJustGaveBirth(true);
      setTimeout(() => setJustGaveBirth(false), 4500);
    } catch {
      toast.error("Nepodarilo sa uložiť.");
    }
  };

  const endPostpartum = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_postpartum: false, postpartum_since: null } as never)
        .eq("id", profile.id);
      if (error) throw error;
      refreshProfile();
      toast.success("Šestonedelie je ukončené.");
    } catch {
      toast.error("Nepodarilo sa uložiť.");
    }
  };

  const startEditingCycle = () => {
    setCycleLengthEdit(String(profile.cycle_length_days ?? 28));
    setLastPeriodEdit(profile.last_period_date ?? "");
    setEditingCycle(true);
  };

  const handleToggleIntimacy = (dateKey: string) => {
    toggleIntimacy.mutate(
      { date: dateKey, logged: intimacyDates?.has(dateKey) ?? false },
      { onError: () => toast.error("Nepodarilo sa uložiť.") },
    );
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
      <Link to="/community" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Domov
      </Link>

      <motion.header {...fadeUp(0)} className="space-y-1">
        <h1 className="font-display text-3xl">{PHASE_LABEL[getLifePhase(profile)]}</h1>
        <p className="text-sm text-muted-foreground">
          Sleduj fázy cyklu a odporúčania, ktoré ti vedia pomôcť cítiť sa lepšie.
        </p>
      </motion.header>

      {profile.is_pregnant && (
        <motion.section {...fadeUp(1)} className="relative space-y-2 overflow-hidden rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
          {pregnancy && (() => {
            const Icon = pregnancyWeekIcon(pregnancy.week);
            return (
              <Icon
                className="pointer-events-none absolute -bottom-4 -right-4 h-24 w-24 stroke-1 text-primary/15"
                aria-hidden="true"
              />
            );
          })()}
          {pregnancy ? (
            <>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{TRIMESTER_LABEL[pregnancy.trimester]}</p>
              <p className="font-display text-2xl text-primary">{pregnancy.week}. týždeň tehotenstva</p>
              {pregnancyWeekSize(pregnancy.week) && (
                <p className="text-sm text-muted-foreground">
                  Vaše bábätko má teraz veľkosť ako {pregnancyWeekSize(pregnancy.week)}.
                </p>
              )}
              <p className="text-sm italic leading-relaxed text-foreground/85">{pregnancy.soulNote}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {pregnancy.daysUntilDue > 0
                  ? `Do predpokladaného termínu pôrodu zostáva ${pregnancy.daysUntilDue} dní.`
                  : "Tvoj predpokladaný termín pôrodu už prešiel — nech je to v tvojom čase."}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Zadaj prvý deň poslednej menštruácie v profile, aby sme ti vedeli ukázať týždeň tehotenstva.
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" className="px-0" onClick={() => navigate("/community/profil", { state: { openEdit: true } })}>
              Upraviť v profile
            </Button>
            <Button size="sm" onClick={markBirth}>
              Narodilo sa bábätko 🎉
            </Button>
          </div>
        </motion.section>
      )}

      {justGaveBirth && (
        <>
          <ConfettiBurst />
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 px-6 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xs rounded-2xl border border-border/50 bg-card p-8 text-center shadow-lg"
            >
              <p className="font-display text-3xl text-primary">Gratulujeme, Diva! 🎉</p>
              <p className="mt-2 text-sm text-muted-foreground">Vitaj v novej kapitole.</p>
            </motion.div>
          </div>
        </>
      )}

      {profile.is_postpartum && (
        <motion.section {...fadeUp(1)} className="space-y-2 rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Šestonedelie</p>
          {postpartum ? (
            <>
              <p className="font-display text-2xl text-primary">{postpartum.week}. týždeň po pôrode</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{postpartum.message}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Zadaj dátum pôrodu v profile.</p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" className="px-0" onClick={() => navigate("/community/profil", { state: { openEdit: true } })}>
              Upraviť v profile
            </Button>
            <Button variant="outline" size="sm" onClick={endPostpartum}>
              Ukončiť šestonedelie
            </Button>
          </div>
        </motion.section>
      )}

      {profile.is_menopause && (
        <motion.section {...fadeUp(1)} className="space-y-4 rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Tvoja kapitola</p>
            <p className="font-display text-2xl text-primary">V menopauze</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Tvoje telo teraz prechádza inou fázou — bez tlaku sledovať cyklus. Únava, návaly aj výkyvy energie sú
              normálna súčasť tejto kapitoly, nie zlyhanie. Počúvaj, čo potrebuješ dnes.
            </p>
            <Button variant="ghost" size="sm" className="px-0" onClick={() => navigate("/community/profil", { state: { openEdit: true } })}>
              Upraviť v profile
            </Button>
          </div>

          <div className="rounded-xl border border-border/50 bg-background/60 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Tipy pre teba</p>
            <div className="mt-4">
              <TipGrid tips={MENOPAUSE_TIPS} color={{ fill: "hsl(265, 25%, 62%, 0.12)", dot: "hsl(265, 25%, 45%)" }} />
            </div>
          </div>
        </motion.section>
      )}

      {!profile.is_pregnant && !profile.is_menopause && !profile.is_postpartum && (cycle ? (
        <motion.section {...fadeUp(1)} className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: CYCLE_PHASE_CARD_TINT[cycle.phaseKey] }}
            aria-hidden="true"
          />
          <div className="relative space-y-4">
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

              <div>
                <p className="text-sm italic leading-relaxed text-foreground/85">
                  „{CYCLE_PHASE_ARCHETYPE[cycle.phaseKey].mantra}" — {CYCLE_PHASE_ARCHETYPE[cycle.phaseKey].archetype}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{CYCLE_PHASE_ARCHETYPE[cycle.phaseKey].keywords}</p>
              </div>

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

              {profile.is_trying_to_conceive && (
                <div className="rounded-xl border border-border/50 bg-background/60 p-4">
                  <p className="text-sm text-foreground/85">
                    Snažíš sa o bábätko — dni okolo ovulácie sú v kalendári nižšie zvýraznené farebne. Ťuknutím na
                    deň si vieš súkromne zapísať, kedy ste boli spolu.
                  </p>
                </div>
              )}

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
                intimacyDates={profile.is_trying_to_conceive ? intimacyDates : undefined}
                onToggleIntimacy={profile.is_trying_to_conceive ? handleToggleIntimacy : undefined}
              />
            </>
          )}
          </div>
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
            <Button variant="ghost" className="w-full" onClick={() => navigate("/community/profil", { state: { openEdit: true } })}>
              Nastaviť v profile
            </Button>
          </div>
        </motion.section>
      ))}
    </div>
  );
}
