import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import { useIntimacyLogs, useToggleIntimacyLog, useIsAdmin } from "@/community/hooks/queries";
import { useAdminPreview, applyPreview } from "@/community/lib/adminPreview";
import { getCycleInfo, formatCycleDate, CYCLE_PHASE_ARCHETYPE, CYCLE_PHASE_SEASON, CYCLE_PHASE_CARD_TINT } from "@/community/lib/cycle";
import {
  getPregnancyInfo,
  pregnancyWeekIcon,
  pregnancyWeekSize,
  TRIMESTER_LABEL,
  PREGNANCY_TRIMESTER_ARCHETYPE,
  PREGNANCY_TIPS,
  PREGNANCY_TIP_COLOR,
  PREGNANCY_LATE_TIPS,
  PREGNANCY_LATE_NOTE,
  PREGNANCY_TIPS_INTRO,
  PARTNER_SUPPORT_NOTE_PREGNANCY,
} from "@/community/lib/pregnancy";
import {
  getPostpartumInfo,
  POSTPARTUM_TIPS,
  POSTPARTUM_TIP_COLOR,
  POSTPARTUM_BREASTFEEDING_TIPS,
  POSTPARTUM_NOT_BREASTFEEDING_TIPS,
  PARTNER_SUPPORT_NOTE_POSTPARTUM,
} from "@/community/lib/postpartum";
import { PREGNANCY_BOOKS, POSTPARTUM_BOOKS, AFFIRMATION_LINKS } from "@/community/lib/pregnancyResources";
import { CycleCalendar } from "@/community/components/CycleCalendar";
import { CyclePhaseTips, TipGrid } from "@/community/components/CyclePhaseTips";
import { MENOPAUSE_TIPS, MENOPAUSE_STAGES } from "@/community/lib/menopause";
import {
  TTC_ARCHETYPE,
  TTC_TIMELINE_NOTE,
  TTC_DOCTOR_GUIDANCE,
  TTC_TIPS,
  TTC_STRESS_NOTE,
  TTC_EMOTIONAL_NOTE,
  TTC_MYTHS,
} from "@/community/lib/tryingToConceive";
import { ConfettiBurst } from "@/community/components/ConfettiBurst";
import { getLifePhase, PHASE_LABEL } from "@/community/lib/quotes";
import { fadeUp } from "@/community/lib/motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, RefreshCcw, Check, Feather, ArrowDown, ImagePlus, Trash2, Mic, Square, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useSignedImage } from "@/community/hooks/useSignedImage";
import { useLiveDictation } from "@/community/hooks/useLiveDictation";
import { validateImage, normalizeImage, uploadImage, deleteStoredImage } from "@/community/lib/storage";
import { cn } from "@/lib/utils";
import MedicalNote from "@/community/components/MedicalNote";

function NotAloneNote() {
  const { t } = useTranslation();
  return (
    <p className="border-t border-border/50 pt-3 text-xs leading-relaxed text-muted-foreground">
      {t("notAloneNote.text")}{" "}
      <Link to="/community/diva-kruh" className="underline hover:text-primary">
        {t("notAloneNote.linkText")}
      </Link>
      .
    </p>
  );
}

export default function CommunityCycle() {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === "en";
  const { profile: realProfile, refreshProfile, loadingProfile } = useCommunityAuth();
  const { data: isAdmin } = useIsAdmin();
  const [adminPreview, setAdminPreview] = useAdminPreview();
  const previewActive = Boolean(isAdmin) && adminPreview.mode !== "off";
  const profile = realProfile && previewActive ? applyPreview(realProfile, adminPreview) : realProfile;
  const navigate = useNavigate();

  const [showMorePregnancy, setShowMorePregnancy] = useState(false);
  const [showMorePostpartum, setShowMorePostpartum] = useState(false);
  const [breastfeeding, setBreastfeeding] = useState<"yes" | "no">("yes");
  const [showMoreTTC, setShowMoreTTC] = useState(false);
  const [editingCycle, setEditingCycle] = useState(false);
  const [cycleLengthEdit, setCycleLengthEdit] = useState(String(profile?.cycle_length_days ?? 28));
  const [lastPeriodEdit, setLastPeriodEdit] = useState(profile?.last_period_date ?? "");
  const [savingCycle, setSavingCycle] = useState(false);
  const [justGaveBirth, setJustGaveBirth] = useState(false);
  const [birthStory, setBirthStory] = useState(profile?.birth_story ?? "");
  const [editingBirthStory, setEditingBirthStory] = useState(false);
  const [savingBirthStory, setSavingBirthStory] = useState(false);
  const birthStoryRef = useRef<HTMLDivElement>(null);
  const storyPhotoInputRef = useRef<HTMLInputElement>(null);
  const endPostpartumRef = useRef<HTMLDivElement>(null);
  const endPostpartumAnswerRef = useRef<HTMLDivElement>(null);
  const [uploadingStoryPhoto, setUploadingStoryPhoto] = useState(false);
  const birthStoryPhoto = useSignedImage(profile?.birth_story_photo);
  const birthStoryAudio = useSignedImage(profile?.birth_story_audio);
  const [savingStoryAudio, setSavingStoryAudio] = useState(false);
  const [transcribingStory, setTranscribingStory] = useState(false);
  const [fallbackRecording, setFallbackRecording] = useState(false);
  const fallbackRecorderRef = useRef<MediaRecorder | null>(null);
  const dictation = useLiveDictation((chunk) =>
    setBirthStory((prev) => {
      const base = prev.replace(/\s+$/, "");
      if (!base) return chunk.charAt(0).toUpperCase() + chunk.slice(1);
      return /[.!?]$/.test(base) ? `${base} ${chunk.charAt(0).toUpperCase()}${chunk.slice(1)}` : `${base} ${chunk}`;
    }),
  );
  const [endingPostpartum, setEndingPostpartum] = useState(false);
  const [periodReturnedChoice, setPeriodReturnedChoice] = useState<"yes" | "no" | null>(null);
  const [newLastPeriod, setNewLastPeriod] = useState("");
  const [savingEndPostpartum, setSavingEndPostpartum] = useState(false);
  const [menopauseStage, setMenopauseStage] = useState<string | null>(profile?.menopause_stage ?? null);
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

  const selectMenopauseStage = async (key: string) => {
    const next = menopauseStage === key ? null : key;
    const previous = menopauseStage;
    setMenopauseStage(next);
    try {
      const { error } = await supabase.from("profiles").update({ menopause_stage: next } as never).eq("id", profile.id);
      if (error) throw error;
      refreshProfile();
    } catch {
      setMenopauseStage(previous);
      toast.error("Nepodarilo sa uložiť fázu.");
    }
  };

  const saveBirthStory = async () => {
    setSavingBirthStory(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ birth_story: birthStory.trim() || null } as never)
        .eq("id", profile.id);
      if (error) throw error;
      refreshProfile();
      setEditingBirthStory(false);
      toast.success("Tvoj príbeh je uložený.");
    } catch {
      toast.error("Nepodarilo sa uložiť.");
    } finally {
      setSavingBirthStory(false);
    }
  };

  const handleStoryPhoto = async (file: File | undefined) => {
    if (!file || !profile) return;
    const validationError = validateImage(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setUploadingStoryPhoto(true);
    try {
      const normalized = await normalizeImage(file);
      const stored = await uploadImage("profile-gallery", profile.id, normalized);
      if (profile.birth_story_photo) await deleteStoredImage(profile.birth_story_photo);
      const { error } = await supabase
        .from("profiles")
        .update({ birth_story_photo: stored } as never)
        .eq("id", profile.id);
      if (error) throw error;
      refreshProfile();
      toast.success("Fotka je uložená.");
    } catch {
      toast.error("Fotku sa nepodarilo nahrať.");
    } finally {
      setUploadingStoryPhoto(false);
      if (storyPhotoInputRef.current) storyPhotoInputRef.current.value = "";
    }
  };

  const removeStoryPhoto = async () => {
    if (!profile?.birth_story_photo) return;
    setUploadingStoryPhoto(true);
    try {
      await deleteStoredImage(profile.birth_story_photo);
      const { error } = await supabase
        .from("profiles")
        .update({ birth_story_photo: null } as never)
        .eq("id", profile.id);
      if (error) throw error;
      refreshProfile();
      toast.success("Fotka je odstránená.");
    } catch {
      toast.error("Fotku sa nepodarilo odstrániť.");
    } finally {
      setUploadingStoryPhoto(false);
    }
  };

  /** Uloží text príbehu rovno do profilu, nech sa nadiktované slová nestratia. */
  const persistStory = async (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ birth_story: clean } as never)
        .eq("id", profile.id);
      if (error) throw error;
      refreshProfile();
    } catch (e) {
      console.error("birth story autosave failed", e);
    }
  };

  const transcribeBlob = async (blob: Blob, ext: string) => {
    setTranscribingStory(true);
    try {
      if (!blob.size) throw new Error("empty audio");
      const file = new File([blob], `porodny-pribeh.${ext}`, { type: blob.type || `audio/${ext}` });
      const form = new FormData();
      form.append("file", file);
      const { data, error } = await supabase.functions.invoke("transcribe-birth-story", { body: form });
      if (error) throw error;
      const text = String(data?.text ?? "").trim();
      if (!text) throw new Error("empty transcript");
      const merged = birthStory.trim() ? `${birthStory.trim()} ${text}` : text;
      setBirthStory(merged);
      setEditingBirthStory(true);
      await persistStory(merged);
      toast.success("Hotovo — text je uložený, môžeš ho ešte upraviť.");
    } catch (e) {
      console.error("dictation fallback failed", e);
      toast.error("Nahrávku sa nepodarilo prepísať. Skús to prosím znova.");
    } finally {
      setTranscribingStory(false);
    }
  };

  /** Safari/iOS nepodporuje živý prepis — nahráme zvuk a prepíšeme ho po skončení. */
  const startFallbackRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferred = ["audio/webm", "audio/mp4", "audio/aac"].find(
        (t) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported?.(t),
      );
      const recorder = new MediaRecorder(stream, preferred ? { mimeType: preferred } : undefined);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data?.size) chunks.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        fallbackRecorderRef.current = null;
        setFallbackRecording(false);
        const type = recorder.mimeType || "audio/webm";
        const ext = type.includes("mp4") || type.includes("aac") ? "mp4" : "webm";
        await transcribeBlob(new Blob(chunks, { type }), ext);
      };
      recorder.start();
      fallbackRecorderRef.current = recorder;
      setFallbackRecording(true);
      toast.success("Počúvam — keď skončíš, ťukni na štvorček a text sa doplní.");
    } catch (e) {
      console.error("microphone unavailable", e);
      toast.error("Nepodarilo sa spustiť mikrofón. Skontroluj povolenie mikrofónu v prehliadači.");
    }
  };

  const micActive = dictation.listening || fallbackRecording;

  const startDictation = () => {
    setEditingBirthStory(true);
    if (dictation.supported) {
      const ok = dictation.start();
      if (ok) {
        toast.success("Počúvam — hovor a text sa bude písať sám.");
        return;
      }
    }
    void startFallbackRecording();
  };

  const stopMic = () => {
    if (dictation.listening) {
      dictation.stop();
      void persistStory(birthStory);
      return;
    }
    try {
      fallbackRecorderRef.current?.stop();
    } catch {
      setFallbackRecording(false);
    }
  };

  const transcribeStoryAudio = async () => {
    if (!profile?.birth_story_audio || !birthStoryAudio) return;
    setTranscribingStory(true);
    try {
      const res = await fetch(birthStoryAudio);
      if (!res.ok) throw new Error("download failed");
      const blob = await res.blob();
      if (!blob.size) throw new Error("empty audio");
      const ext = (profile.birth_story_audio.split(".").pop() || "webm").toLowerCase();
      const type = blob.type.startsWith("audio/") ? blob.type : `audio/${ext === "m4a" ? "mp4" : ext}`;
      const file = new File([blob], `porodny-pribeh.${ext}`, { type });
      const form = new FormData();
      form.append("file", file);
      const { data, error } = await supabase.functions.invoke("transcribe-birth-story", { body: form });
      if (error) throw error;
      const text = String(data?.text ?? "").trim();
      if (!text) throw new Error("empty transcript");
      setBirthStory((prev) => (prev.trim() ? `${prev.trim()}\n\n${text}` : text));
      setEditingBirthStory(true);
      toast.success("Prepis je hotový — prečítaj si ho a ulož.");
    } catch (e) {
      console.error("birth story transcription failed", e);
      toast.error("Prepis sa nepodaril. Skús to znova.");
    } finally {
      setTranscribingStory(false);
    }
  };

  const removeStoryAudio = async () => {
    if (!profile?.birth_story_audio) return;
    setSavingStoryAudio(true);
    try {
      await deleteStoredImage(profile.birth_story_audio);
      const { error } = await supabase
        .from("profiles")
        .update({ birth_story_audio: null } as never)
        .eq("id", profile.id);
      if (error) throw error;
      refreshProfile();
      toast.success("Nahrávka je odstránená.");
    } catch {
      toast.error("Nahrávku sa nepodarilo odstrániť.");
    } finally {
      setSavingStoryAudio(false);
    }
  };

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
      // Po osláve jemne posuň pohľad na pôrodný príbeh.
      setTimeout(() => birthStoryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 4600);
    } catch {
      toast.error("Nepodarilo sa uložiť.");
    }
  };

  const startEndingPostpartum = () => {
    setPeriodReturnedChoice(null);
    setNewLastPeriod("");
    setEndingPostpartum(true);
    // Jemne posuň pohľad na otázky, aby ich bolo vidieť na mobile aj na počítači.
    setTimeout(() => endPostpartumRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
  };

  const confirmEndPostpartum = async () => {
    if (periodReturnedChoice === "yes" && !newLastPeriod) return;
    setSavingEndPostpartum(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          is_postpartum: false,
          postpartum_since: null,
          ...(periodReturnedChoice === "yes" ? { last_period_date: newLastPeriod } : {}),
        } as never)
        .eq("id", profile.id);
      if (error) throw error;
      refreshProfile();
      setEndingPostpartum(false);
      if (periodReturnedChoice === "yes") {
        toast.success("Šestonedelie je ukončené — cyklus je opäť nastavený.", {
          description: "Nezabudni na prehliadku u gynekológa/gynekologičky po šestonedelí.",
          duration: 7000,
        });
      } else {
        toast.success("Šestonedelie je ukončené.", {
          description:
            "To, že sa menštruácia ešte nevrátila, je úplne bežné — najmä pri dojčení sa vie vrátiť aj o mnoho mesiacov neskôr, niekedy aj vyše roka. Keď príde, len zadaj dátum v profile a cyklus sa ti spustí. Prehliadku u gynekológa/gynekologičky si však nechaj urobiť.",
          duration: 8000,
        });
      }
    } catch {
      toast.error("Nepodarilo sa uložiť.");
    } finally {
      setSavingEndPostpartum(false);
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
      toast.success(t("cycleCard.cycleSaved"));
      setEditingCycle(false);
    } catch {
      toast.error(t("cycleCard.cycleSaveFailed"));
    } finally {
      setSavingCycle(false);
    }
  };

  return (
    <div className="space-y-8">
      {previewActive && (
        <div className="sticky top-2 z-30 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-primary/10 px-4 py-3 text-sm shadow-sm backdrop-blur">
          <span>Admin náhľad — vidíš simulovanú fázu, tvoj profil sa nemení.</span>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="ghost" className="rounded-full">
              <Link to="/community/admin">Zmeniť fázu</Link>
            </Button>
            <Button
              size="sm"
              className="rounded-full"
              onClick={() => {
                setAdminPreview({ ...adminPreview, mode: "off" });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Vypnúť náhľad
            </Button>
          </div>
        </div>
      )}
      <Link to="/community" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t("nav.home")}
      </Link>

      <motion.header {...fadeUp(0)} className="space-y-1">
        <h1 className="font-display text-3xl">
          {isEnglish ? t(`phaseLabel.${getLifePhase(profile)}`) : PHASE_LABEL[getLifePhase(profile)]}
        </h1>
        <p className="text-sm text-muted-foreground">{t("cycleCard.pageIntro")}</p>
      </motion.header>

      {profile.is_pregnant && (
        <motion.section {...fadeUp(1)} className="relative space-y-2 overflow-hidden rounded-2xl border border-border/50 bg-card p-5 shadow-elevated-sm">
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
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {isEnglish ? t(`pregnancy.trimesterLabels.${pregnancy.trimester}`) : TRIMESTER_LABEL[pregnancy.trimester]}
              </p>
              <p className="font-display text-2xl text-primary">
                {t("pregnancyCard.weekCounter", { count: pregnancy.week })}
              </p>
              {pregnancyWeekSize(pregnancy.week) && (
                <p className="text-sm text-muted-foreground">
                  {t("pregnancyCard.babySizeNote", {
                    size: isEnglish ? t(`pregnancy.weekSize.${pregnancy.week}`) : pregnancyWeekSize(pregnancy.week),
                  })}
                </p>
              )}
              <p className="text-sm italic leading-relaxed text-foreground/85">
                „{isEnglish ? t(`pregnancy.soulNotes.${pregnancy.trimester}`) : pregnancy.soulNote}" —{" "}
                {isEnglish
                  ? t(`pregnancy.archetypes.${pregnancy.trimester}.archetype`)
                  : PREGNANCY_TRIMESTER_ARCHETYPE[pregnancy.trimester].archetype}
              </p>
              <p className="text-xs text-muted-foreground">
                {isEnglish
                  ? t(`pregnancy.archetypes.${pregnancy.trimester}.keywords`)
                  : PREGNANCY_TRIMESTER_ARCHETYPE[pregnancy.trimester].keywords}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {pregnancy.daysUntilDue > 0
                  ? t("pregnancyCard.daysUntilDue", { count: pregnancy.daysUntilDue })
                  : t("pregnancyCard.dueDatePassed")}
              </p>
              <p className="text-sm leading-relaxed text-foreground/85">
                {isEnglish ? t(`pregnancy.weekBands.${pregnancy.bandKey}.message`) : pregnancy.message}
              </p>
              <div className="rounded-2xl border border-border/50 bg-background/60 p-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("pregnancyCard.typicalThisWeekTitle")}
                </p>
                <ul className="mt-2 space-y-1 text-sm text-foreground/85">
                  {(isEnglish
                    ? (t(`pregnancy.weekBands.${pregnancy.bandKey}.symptoms`, { returnObjects: true }) as string[])
                    : pregnancy.symptoms
                  ).map((symptom) => (
                    <li key={symptom} className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between rounded-xl border-2 border-primary/40 bg-primary/10 px-4 py-5 font-semibold text-primary shadow-elevated-sm hover:border-primary/60 hover:bg-primary/15 hover:text-primary"
                onClick={() => setShowMorePregnancy((v) => !v)}
              >
                {showMorePregnancy ? t("pregnancyCard.showLessButton") : t("pregnancyCard.showMoreButton")}
                {showMorePregnancy ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              {showMorePregnancy && (
                <>
                  <div className="rounded-2xl border-2 border-primary/25 bg-primary/5 p-4 shadow-elevated-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {t("pregnancyCard.tipsTitle")}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {isEnglish ? t("pregnancy.tipsIntro") : PREGNANCY_TIPS_INTRO}
                    </p>
                    <div className="mt-4">
                      <TipGrid tips={PREGNANCY_TIPS[pregnancy.trimester]} color={PREGNANCY_TIP_COLOR} />
                    </div>
                  </div>
                  {pregnancy.week >= 34 && (
                    <div className="rounded-2xl border-2 border-primary/25 bg-primary/5 p-4 shadow-elevated-sm">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {t("pregnancyCard.latePrepTitle")}
                      </p>
                      <div className="mt-4">
                        <TipGrid tips={PREGNANCY_LATE_TIPS} color={PREGNANCY_TIP_COLOR} />
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                        {isEnglish ? t("pregnancy.lateNote") : PREGNANCY_LATE_NOTE}
                      </p>
                    </div>
                  )}
                  <p className="rounded-2xl border border-border/50 bg-background/60 p-4 text-sm leading-relaxed text-foreground/85">
                    {isEnglish ? t("pregnancy.partnerNote") : PARTNER_SUPPORT_NOTE_PREGNANCY}
                  </p>
                </>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{t("pregnancyCard.enterLastPeriod")}</p>
          )}
          {showMorePregnancy && (
            <div className="space-y-3 rounded-2xl border border-border/50 bg-background/60 p-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("pregnancyCard.prepareMindTitle")}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {t("pregnancyCard.prepareMindHint")}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {AFFIRMATION_LINKS.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-border/50 px-3 py-1.5 text-xs text-foreground/85 transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
              <div className="border-t border-border/50 pt-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("pregnancyCard.booksTitle")}
                </p>
                <ul className="mt-2 space-y-2">
                  {PREGNANCY_BOOKS.map((book) => (
                    <li key={book.title} className="text-sm">
                      <span className="font-medium text-foreground/85">{book.title}</span>
                      <p className="text-xs text-muted-foreground">{book.note}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" className="px-0" onClick={() => navigate("/community/profil", { state: { openEdit: true } })}>
              {t("pregnancyCard.editInProfileButton")}
            </Button>
            <Button size="sm" onClick={markBirth}>
              {t("pregnancyCard.babyBornButton")}
            </Button>
          </div>
          <NotAloneNote />
          <MedicalNote />
        </motion.section>
      )}

      {justGaveBirth &&
        createPortal(
          <>
            {/* The backdrop+card render first so the confetti below sits crisply on
                top of it, instead of being caught in its own backdrop-blur. Portalled
                straight to <body> so this full-screen layer actually sits above the
                fixed app header (z-40) instead of being trapped inside a lower local
                stacking context. */}
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 px-6 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-xs rounded-2xl border border-border/50 bg-card p-8 text-center shadow-lg"
              >
                <p className="font-display text-3xl text-primary">{t("pregnancyCard.congratsTitle")}</p>
                <p className="mt-2 text-sm text-muted-foreground">{t("pregnancyCard.congratsSubtitle")}</p>
              </motion.div>
            </div>
            <ConfettiBurst className="z-[101]" />
          </>,
          document.body,
        )}

      {profile.is_postpartum && (
        <motion.section {...fadeUp(1)} className="space-y-2 rounded-2xl border border-border/50 bg-card p-5 shadow-elevated-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{t("postpartumCard.title")}</p>
          {postpartum ? (
            <>
              <p className="font-display text-2xl text-primary">
                {t("postpartumCard.weekCounter", { count: postpartum.week })}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {isEnglish ? t(`postpartum.weekBands.${postpartum.bandKey}.message`) : postpartum.message}
              </p>
              <div className="rounded-2xl border border-border/50 bg-background/60 p-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("postpartumCard.symptomsTitle")}
                </p>
                <ul className="mt-2 space-y-1 text-sm text-foreground/85">
                  {(isEnglish
                    ? (t(`postpartum.weekBands.${postpartum.bandKey}.symptoms`, { returnObjects: true }) as string[])
                    : postpartum.symptoms
                  ).map((symptom) => (
                    <li key={symptom} className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-border/50 pt-3">
                <p className="text-sm italic leading-relaxed text-foreground/85">
                  „{isEnglish ? t(`postpartum.weekBands.${postpartum.bandKey}.mantra`) : postpartum.mantra}" —{" "}
                  {isEnglish ? t(`postpartum.weekBands.${postpartum.bandKey}.archetype`) : postpartum.archetype}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {isEnglish ? t(`postpartum.weekBands.${postpartum.bandKey}.keywords`) : postpartum.keywords}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between rounded-xl border-2 border-primary/40 bg-primary/10 px-4 py-5 font-semibold text-primary shadow-elevated-sm hover:border-primary/60 hover:bg-primary/15 hover:text-primary"
                onClick={() => setShowMorePostpartum((v) => !v)}
              >
                {showMorePostpartum ? t("postpartumCard.showLessButton") : t("postpartumCard.showMoreButton")}
                {showMorePostpartum ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              {showMorePostpartum && (
                <>
                  <div className="rounded-2xl border-2 border-primary/25 bg-primary/5 p-4 shadow-elevated-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {t("postpartumCard.tipsTitle")}
                    </p>
                    <div className="mt-4">
                      <TipGrid tips={POSTPARTUM_TIPS} color={POSTPARTUM_TIP_COLOR} />
                    </div>

                    <div className="mt-5 border-t border-primary/15 pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {t("postpartumCard.breastfeedingQuestion")}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant={breastfeeding === "yes" ? "default" : "outline"}
                          onClick={() => setBreastfeeding("yes")}
                        >
                          {t("postpartumCard.breastfeedingYes")}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={breastfeeding === "no" ? "default" : "outline"}
                          onClick={() => setBreastfeeding("no")}
                        >
                          {t("postpartumCard.breastfeedingNo")}
                        </Button>
                      </div>
                      <div className="mt-4">
                        <TipGrid
                          tips={breastfeeding === "yes" ? POSTPARTUM_BREASTFEEDING_TIPS : POSTPARTUM_NOT_BREASTFEEDING_TIPS}
                          color={POSTPARTUM_TIP_COLOR}
                        />
                      </div>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      {t("postpartumCard.hydrationNote")}
                    </p>
                  </div>
                  <p className="rounded-2xl border border-border/50 bg-background/60 p-4 text-sm leading-relaxed text-foreground/85">
                    {isEnglish ? t("postpartum.partnerNote") : PARTNER_SUPPORT_NOTE_POSTPARTUM}
                  </p>
                  <div className="rounded-2xl bg-secondary/30 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t("postpartumCard.booksTitle")}
                    </p>
                    <ul className="mt-2 space-y-2">
                      {POSTPARTUM_BOOKS.map((book) => (
                        <li key={book.title} className="text-sm">
                          <span className="font-medium text-foreground/85">{book.title}</span>
                          <p className="text-xs text-muted-foreground">{book.note}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{t("postpartumCard.enterBirthDate")}</p>
          )}

          <motion.div
            ref={birthStoryRef}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative space-y-2 overflow-hidden rounded-2xl border border-primary/25 bg-primary/5 p-4 shadow-elevated-sm"
          >
            {!profile.birth_story && !profile.birth_story_audio && !editingBirthStory && (
              <motion.span
                aria-hidden="true"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-4 top-3.5 text-primary/70"
              >
                <ArrowDown className="h-5 w-5" />
              </motion.span>
            )}
            <p className="flex items-center gap-2 font-display text-xl text-primary">
              <Feather className="h-4 w-4" aria-hidden="true" />
              {t("postpartumCard.storyTitle")}
            </p>
            {birthStoryPhoto && (
              <div className="overflow-hidden rounded-xl shadow-elevated-sm">
                <img
                  src={birthStoryPhoto}
                  alt={t("postpartumCard.storyPhotoAlt")}
                  className="max-h-72 w-full object-cover"
                />
              </div>
            )}
            {birthStoryAudio && (
              <audio controls src={birthStoryAudio} className="w-full" preload="metadata">
                {t("postpartumCard.audioNotSupported")}
              </audio>
            )}
            {editingBirthStory ? (
              <div className="space-y-2">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {t("postpartumCard.writingPrompt")}
                </p>
                <div className="relative">
                  <Textarea
                    rows={6}
                    className="rounded-2xl border-border/50 pr-14 text-base"
                    value={
                      dictation.interim
                        ? `${birthStory}${birthStory && !birthStory.endsWith(" ") ? " " : ""}${dictation.interim}`
                        : birthStory
                    }
                    onChange={(e) => {
                      if (dictation.listening) return;
                      setBirthStory(e.target.value);
                    }}
                    readOnly={dictation.listening}
                    placeholder={t("postpartumCard.storyPlaceholder")}
                  />
                  <button
                    type="button"
                    disabled={transcribingStory}
                    aria-label={micActive ? t("postpartumCard.stopDictationAriaLabel") : t("postpartumCard.startDictationAriaLabel")}
                    onClick={() => (micActive ? stopMic() : startDictation())}
                    className={cn(
                      "absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full shadow-elevated-sm transition-colors duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] disabled:opacity-60",
                      micActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/60 text-primary hover:bg-secondary",
                    )}
                  >
                    {micActive ? (
                      <Square className="h-4 w-4 animate-pulse" aria-hidden="true" />
                    ) : (
                      <Mic className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {micActive && (
                  <p className="flex items-center gap-2 text-xs text-primary">
                    <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" aria-hidden="true" />
                    {dictation.listening
                      ? t("postpartumCard.listeningActive")
                      : t("postpartumCard.listeningPaused")}
                  </p>
                )}
                {transcribingStory && !micActive && (
                  <p className="text-xs text-muted-foreground">{t("postpartumCard.transcribing")}</p>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    size="sm"
                    className="rounded-full"
                    disabled={savingBirthStory}
                    onClick={() => {
                      dictation.stop();
                      saveBirthStory();
                    }}
                  >
                    {savingBirthStory ? t("postpartumCard.savingButton") : t("postpartumCard.saveButton")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-muted-foreground"
                    onClick={() => {
                      dictation.stop();
                      setBirthStory(profile.birth_story ?? "");
                      setEditingBirthStory(false);
                    }}
                  >
                    {t("postpartumCard.cancelButton")}
                  </Button>
                </div>
              </div>
            ) : profile.birth_story ? (
              <>
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/85">{profile.birth_story}</p>
                <Button variant="ghost" size="sm" className="px-0" onClick={() => setEditingBirthStory(true)}>
                  {t("postpartumCard.editButton")}
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm font-medium leading-relaxed text-foreground/90">
                  {t("postpartumCard.storyDeservesPlace")}
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                   {t("postpartumCard.storyIntro")}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Button size="sm" className="rounded-full gap-2" onClick={() => setEditingBirthStory(true)}>
                    <Feather className="h-4 w-4" aria-hidden="true" />
                    {t("postpartumCard.writeStoryButton")}
                  </Button>
                  <button
                    type="button"
                    aria-label={t("postpartumCard.startDictationAriaLabel")}
                    onClick={startDictation}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/50 text-primary shadow-elevated-sm transition-colors duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:bg-secondary"
                  >
                    <Mic className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </>
            )}
            <input
              ref={storyPhotoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleStoryPhoto(e.target.files?.[0])}
            />
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {profile.birth_story_audio && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full bg-secondary/40 px-4 text-primary hover:bg-secondary/60"
                  disabled={transcribingStory}
                  onClick={transcribeStoryAudio}
                >
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  {transcribingStory ? t("postpartumCard.transcribingButton") : t("postpartumCard.transcribeButton")}
                </Button>
              )}
              {profile.birth_story_audio && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full bg-secondary/30 px-4 text-muted-foreground hover:bg-secondary/50"
                  onClick={removeStoryAudio}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  {t("postpartumCard.removeAudioButton")}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-secondary/40 px-4 text-primary hover:bg-secondary/60"
                disabled={uploadingStoryPhoto}
                onClick={() => storyPhotoInputRef.current?.click()}
              >
                <ImagePlus className="h-4 w-4" aria-hidden="true" />
                {uploadingStoryPhoto
                  ? t("postpartumCard.uploadingPhoto")
                  : profile.birth_story_photo
                    ? t("postpartumCard.changePhotoButton")
                    : t("postpartumCard.uploadPhotoButton")}
              </Button>
              {profile.birth_story_photo && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full bg-secondary/30 px-4 text-muted-foreground hover:bg-secondary/50"
                  disabled={uploadingStoryPhoto}
                  onClick={removeStoryPhoto}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  {t("postpartumCard.removePhotoButton")}
                </Button>
              )}
            </div>
          </motion.div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" className="px-0" onClick={() => navigate("/community/profil", { state: { openEdit: true } })}>
              {t("postpartumCard.editInProfileButton")}
            </Button>
            {!endingPostpartum && (
              <Button variant="outline" size="sm" onClick={startEndingPostpartum}>
                {t("postpartumCard.endPostpartumButton")}
              </Button>
            )}
          </div>

          {endingPostpartum && (
            <div ref={endPostpartumRef} className="scroll-mt-24 space-y-3 rounded-2xl border border-border/50 bg-background/60 p-4">
              <p className="text-sm font-medium text-foreground/85">{t("postpartumCard.periodReturnedQuestion")}</p>
              {periodReturnedChoice === null && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setPeriodReturnedChoice("yes");
                      setTimeout(
                        () => endPostpartumAnswerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
                        120,
                      );
                    }}
                  >
                    {t("postpartumCard.yesButton")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setPeriodReturnedChoice("no");
                      setTimeout(
                        () => endPostpartumAnswerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
                        120,
                      );
                    }}
                  >
                    {t("postpartumCard.notYetButton")}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEndingPostpartum(false)}>
                    {t("postpartumCard.cancelButton")}
                  </Button>
                </div>
              )}
              {periodReturnedChoice === "yes" && (
                <div ref={endPostpartumAnswerRef} className="scroll-mt-24 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="pp-last-period">{t("postpartumCard.lastPeriodDateLabel")}</Label>
                    <Input
                      id="pp-last-period"
                      type="date"
                      max={new Date().toISOString().slice(0, 10)}
                      value={newLastPeriod}
                      onChange={(e) => setNewLastPeriod(e.target.value)}
                    />
                  </div>
                  <p className="rounded-xl bg-secondary/40 p-3 text-xs leading-relaxed text-foreground/80">
                    {t("postpartumCard.gynecologistNoteAfterYes")}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" disabled={!newLastPeriod || savingEndPostpartum} onClick={confirmEndPostpartum}>
                      {savingEndPostpartum ? t("postpartumCard.savingButton") : t("postpartumCard.confirmButton")}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setPeriodReturnedChoice(null)}>
                      {t("postpartumCard.backButton")}
                    </Button>
                  </div>
                </div>
              )}
              {periodReturnedChoice === "no" && (
                <div ref={endPostpartumAnswerRef} className="scroll-mt-24 space-y-3">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {t("postpartumCard.periodNotReturnedNote")}
                  </p>
                  <p className="rounded-xl bg-secondary/40 p-3 text-xs leading-relaxed text-foreground/80">
                    {t("postpartumCard.gynecologistNoteAfterNo")}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" disabled={savingEndPostpartum} onClick={confirmEndPostpartum}>
                      {savingEndPostpartum ? t("postpartumCard.savingButton") : t("postpartumCard.understoodEndButton")}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setPeriodReturnedChoice(null)}>
                      {t("postpartumCard.backButton")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          <NotAloneNote />
          <MedicalNote />
        </motion.section>
      )}

      {profile.is_menopause && (
        <motion.section {...fadeUp(1)} className="space-y-4 rounded-2xl border border-border/50 bg-card p-5 shadow-elevated-sm">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{t("menopauseCard.chapterLabel")}</p>
            <p className="font-display text-2xl text-primary">{t("menopauseCard.title")}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t("menopauseCard.intro")}</p>
            <Button variant="ghost" size="sm" className="px-0" onClick={() => navigate("/community/profil", { state: { openEdit: true } })}>
              {t("menopauseCard.editProfileButton")}
            </Button>
          </div>

          <div className="rounded-2xl border-2 border-primary/25 bg-primary/5 p-4 shadow-elevated-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              {t("menopauseCard.tipsForYouTitle")}
            </p>
            <div className="mt-4">
              <TipGrid tips={MENOPAUSE_TIPS} color={{ fill: "hsl(265, 25%, 62%, 0.12)", dot: "hsl(265, 25%, 45%)" }} />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("menopauseCard.stagesTitle")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{t("menopauseCard.stagesHint")}</p>
            </div>
            {MENOPAUSE_STAGES.map((stage) => {
              const selected = menopauseStage === stage.key;
              // Before she's picked a stage, show all four in full so she can read and choose.
              // Once one is picked, the others collapse to a name she can still tap to switch.
              const expanded = selected || !menopauseStage;
              return (
                <button
                  key={stage.key}
                  type="button"
                  onClick={() => selectMenopauseStage(stage.key)}
                  className={cn(
                    "w-full rounded-2xl border p-4 text-left transition-colors",
                    selected ? "border-primary bg-primary/10" : "border-border/50 bg-background/60 hover:border-primary/40",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-lg text-primary">
                        {isEnglish ? t(`menopause.stages.${stage.key}.name`) : stage.name}
                      </p>
                      {!expanded && (
                        <p className="text-xs text-muted-foreground">
                          {isEnglish ? t(`menopause.stages.${stage.key}.ageRange`) : stage.ageRange}
                        </p>
                      )}
                    </div>
                    {selected && (
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3 w-3" aria-hidden="true" />
                      </span>
                    )}
                  </div>
                  {expanded && (
                    <>
                      <p className="text-xs text-muted-foreground">
                        {isEnglish ? t(`menopause.stages.${stage.key}.ageRange`) : stage.ageRange}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                        {isEnglish ? t(`menopause.stages.${stage.key}.message`) : stage.message}
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {(isEnglish
                          ? (t(`menopause.stages.${stage.key}.symptoms`, { returnObjects: true }) as string[])
                          : stage.symptoms
                        ).map((symptom) => (
                          <li key={symptom} className="flex items-start gap-2">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                            {symptom}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 border-t border-border/50 pt-3">
                        <p className="text-sm italic leading-relaxed text-foreground/85">
                          „{isEnglish ? t(`menopause.stages.${stage.key}.mantra`) : stage.mantra}" —{" "}
                          {isEnglish ? t(`menopause.stages.${stage.key}.archetype`) : stage.archetype}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {isEnglish ? t(`menopause.stages.${stage.key}.keywords`) : stage.keywords}
                        </p>
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
          <NotAloneNote />
          <MedicalNote />
        </motion.section>
      )}

      {!profile.is_pregnant && !profile.is_menopause && !profile.is_postpartum && (cycle ? (
        <motion.section {...fadeUp(1)} className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5 shadow-elevated-sm">
          {profile.dynamic_theme !== false && (
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: CYCLE_PHASE_CARD_TINT[cycle.phaseKey] }}
              aria-hidden="true"
            />
          )}
          <div className="relative space-y-4">
          <div className="flex items-baseline justify-between gap-3">
            <div className="flex items-center gap-2">
              <RefreshCcw className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl">{t("cycleCard.title")}</h2>
            </div>
            {!editingCycle && (
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">{t("cycleCard.dayOfCycle", { count: cycle.dayOfCycle })}</p>
                <Button variant="ghost" size="sm" onClick={startEditingCycle}>
                  {t("cycleCard.editButton")}
                </Button>
              </div>
            )}
          </div>

          {editingCycle ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cycle-last-period">{t("cycleCard.lastPeriodLabel")}</Label>
                <Input
                  id="cycle-last-period"
                  type="date"
                  max={new Date().toISOString().slice(0, 10)}
                  value={lastPeriodEdit}
                  onChange={(e) => setLastPeriodEdit(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cycle-length">{t("cycleCard.cycleLengthLabel")}</Label>
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
                  {t("cycleCard.saveButton")}
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setEditingCycle(false)} disabled={savingCycle}>
                  {t("cycleCard.cancelButton")}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {isEnglish ? t(`cycle.phases.${cycle.phaseKey}.name`) : cycle.phase.name} ·{" "}
                {isEnglish ? t(`cycle.seasons.${cycle.phaseKey}.season`) : CYCLE_PHASE_SEASON[cycle.phaseKey].season}
              </p>
              <p className="font-display text-xl text-primary">
                {isEnglish ? t(`cycle.subPhases.${cycle.subPhase.key}.name`) : cycle.subPhase.name}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {isEnglish ? t(`cycle.subPhases.${cycle.subPhase.key}.description`) : cycle.subPhase.description}
              </p>

              <div>
                <p className="text-sm italic leading-relaxed text-foreground/85">
                  „{isEnglish ? t(`cycle.archetypes.${cycle.phaseKey}.mantra`) : CYCLE_PHASE_ARCHETYPE[cycle.phaseKey].mantra}" —{" "}
                  {isEnglish ? t(`cycle.archetypes.${cycle.phaseKey}.archetype`) : CYCLE_PHASE_ARCHETYPE[cycle.phaseKey].archetype}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {isEnglish ? t(`cycle.archetypes.${cycle.phaseKey}.keywords`) : CYCLE_PHASE_ARCHETYPE[cycle.phaseKey].keywords}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {isEnglish ? t(`cycle.seasons.${cycle.phaseKey}.tagline`) : CYCLE_PHASE_SEASON[cycle.phaseKey].tagline}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-border/50 p-3">
                  <p className="text-xs text-muted-foreground">{t("cycleCard.nextPeriod")}</p>
                  <p className="mt-1 font-medium">
                    {formatCycleDate(cycle.nextPeriodDate, isEnglish ? "en-US" : "sk-SK")}
                    <span className="ml-1 text-xs text-muted-foreground">
                      {t("cycleCard.inDays", { count: cycle.daysUntilNextPeriod })}
                    </span>
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 p-3">
                  <p className="text-xs text-muted-foreground">{t("cycleCard.nextOvulation")}</p>
                  <p className="mt-1 font-medium">
                    {formatCycleDate(cycle.nextOvulationDate, isEnglish ? "en-US" : "sk-SK")}
                  </p>
                </div>
              </div>

              {profile.is_trying_to_conceive && (
                <div className="space-y-3 rounded-2xl border border-border/50 bg-background/60 p-4">
                  <p className="text-sm text-foreground/85">
                    {isEnglish ? t("ttc.intro") : "Snažíš sa o bábätko — dni okolo ovulácie sú v kalendári nižšie zvýraznené farebne. Ťuknutím na deň si vieš súkromne zapísať, kedy ste boli spolu."}
                  </p>
                  <div className="border-t border-border/50 pt-3">
                    <p className="text-sm italic leading-relaxed text-foreground/85">
                      „{isEnglish ? t("ttc.mantra") : TTC_ARCHETYPE.mantra}" — {isEnglish ? t("ttc.archetype") : TTC_ARCHETYPE.archetype}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {isEnglish ? t("ttc.keywords") : TTC_ARCHETYPE.keywords}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/85">
                    {isEnglish ? t("ttc.timelineNote") : TTC_TIMELINE_NOTE}
                  </p>
                  <p className="text-xs italic text-muted-foreground">
                    {isEnglish ? t("ttc.stressNote") : TTC_STRESS_NOTE}
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/85">
                    {isEnglish ? t("ttc.emotionalNote") : TTC_EMOTIONAL_NOTE}
                  </p>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between rounded-xl border-2 border-primary/40 bg-primary/10 px-4 py-5 font-semibold text-primary shadow-elevated-sm hover:border-primary/60 hover:bg-primary/15 hover:text-primary"
                    onClick={() => setShowMoreTTC((v) => !v)}
                  >
                    {showMoreTTC ? t("ttc.showLessButton") : t("ttc.showMoreButton")}
                    {showMoreTTC ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  {showMoreTTC && (
                    <>
                      <div className="rounded-2xl border border-border/50 bg-card p-3">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {t("ttc.doctorGuidanceTitle")}
                        </p>
                        <p className="mt-2 text-sm text-foreground/85">
                          {isEnglish ? t("ttc.ageUnder35") : TTC_DOCTOR_GUIDANCE.ageUnder35}
                        </p>
                        <p className="mt-1 text-sm text-foreground/85">
                          {isEnglish ? t("ttc.age35Plus") : TTC_DOCTOR_GUIDANCE.age35Plus}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">{t("ttc.soonerIfLabel")}</p>
                        <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                          {(isEnglish
                            ? (t("ttc.soonerIf", { returnObjects: true }) as string[])
                            : TTC_DOCTOR_GUIDANCE.soonerIf
                          ).map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border-2 border-primary/25 bg-primary/5 p-4 shadow-elevated-sm">
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                          {t("ttc.tipsTitle")}
                        </p>
                        <div className="mt-4">
                          <TipGrid tips={TTC_TIPS} color={{ fill: "hsl(354, 45%, 58%, 0.12)", dot: "hsl(354, 45%, 50%)" }} />
                        </div>
                      </div>

                      <div className="rounded-xl border border-border/50 bg-card p-3">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {t("ttc.mythsTitle")}
                        </p>
                        <ul className="mt-2 space-y-2 text-sm">
                          {(isEnglish
                            ? (t("ttc.myths", { returnObjects: true }) as { myth: string; fact: string }[])
                            : TTC_MYTHS
                          ).map((item) => (
                            <li key={item.myth}>
                              <span className="text-muted-foreground line-through">{item.myth}</span>
                              <br />
                              <span className="text-foreground/85">{item.fact}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="rounded-2xl border border-border/50 bg-background/60 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("cycleCard.tipsForThisPhase")}
                </p>
                {cycle.phaseKey === "lutealna" && (
                  <p className="mt-1 text-xs font-medium text-primary">
                    {cycle.subPhase.key === "lutealna_neskora"
                      ? t("cycleCard.lateLuteal")
                      : t("cycleCard.earlyLuteal")}
                  </p>
                )}
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
          <NotAloneNote />
          <MedicalNote />
        </motion.section>
      ) : (
        <motion.section {...fadeUp(1)} className="rounded-2xl border border-border/50 bg-card p-6 text-center shadow-elevated-sm">
          <h2 className="font-display text-xl">{t("cycleCard.noCycleTitle")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("cycleCard.noCycleDescription")}
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <div className="space-y-2 text-left">
              <Label htmlFor="cycle-last-period">{t("cycleCard.lastPeriodLabel")}</Label>
              <Input
                id="cycle-last-period"
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                value={lastPeriodEdit}
                onChange={(e) => setLastPeriodEdit(e.target.value)}
              />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="cycle-length">{t("cycleCard.cycleLengthLabel")}</Label>
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
              {t("cycleCard.saveCycleButton")}
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => navigate("/community/profil", { state: { openEdit: true } })}>
              {t("cycleCard.setInProfileButton")}
            </Button>
          </div>
          <MedicalNote className="mt-5 text-left" />
        </motion.section>
      ))}

      <p className="rounded-xl bg-secondary/30 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        {t("cycleCard.gynecologistNote")}
      </p>
    </div>
  );
}
