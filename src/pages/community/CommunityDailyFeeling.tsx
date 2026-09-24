import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, Check, History, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import { type DailyFeeling, useDailyFeelings, useSaveDailyFeeling } from "@/community/hooks/queries";
import { DETAIL_SEPARATOR, MOODS } from "@/community/lib/feelings";
import { fadeUp } from "@/community/lib/motion";
import { cn } from "@/lib/utils";
import MedicalNote from "@/community/components/MedicalNote";

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function CommunityDailyFeeling() {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === "en";
  const feelingTranslations = t("feelingWheel", { returnObjects: true, defaultValue: {} }) as Record<string, string>;
  const translateFeeling = (label: string) => (isEnglish ? feelingTranslations[label] ?? label : label);
  const navigate = useNavigate();
  const { profile } = useCommunityAuth();
  const { data: feelings, isLoading } = useDailyFeelings(profile?.id);
  const saveFeeling = useSaveDailyFeeling(profile?.id);
  const today = useMemo(() => localDateKey(), []);
  const todayFeeling = feelings?.find((item) => item.feeling_date === today);
  const [mood, setMood] = useState<DailyFeeling["mood"] | null>(null);
  const [detail, setDetail] = useState<string | null>(null);
  const [specific, setSpecific] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const detailRef = useRef<HTMLDivElement>(null);
  const specificRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);

  const scrollToNext = (ref: React.RefObject<HTMLDivElement>) => {
    requestAnimationFrame(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  useEffect(() => {
    if (!todayFeeling) return;
    setMood(todayFeeling.mood);
    const [savedDetail, savedSpecific] = todayFeeling.feeling_detail?.split(DETAIL_SEPARATOR) ?? [];
    setDetail(savedDetail || null);
    setSpecific(savedSpecific || null);
    setNote(todayFeeling.note ?? "");
  }, [todayFeeling]);

  const save = async () => {
    if (!mood) {
      toast.error(t("dailyFeeling.moodRequired"));
      return;
    }
    if (!detail || !specific) {
      toast.error(t("dailyFeeling.levelsRequired"));
      return;
    }
    try {
      await saveFeeling.mutateAsync({ mood, detail: `${detail}${DETAIL_SEPARATOR}${specific}`, note, date: today });
      toast.success(todayFeeling ? t("dailyFeeling.editSuccess") : t("dailyFeeling.createSuccess"));
      navigate("/community/pocit/historia");
    } catch {
      toast.error(t("dailyFeeling.saveFailed"));
    }
  };

  return (
    <div className="space-y-10">
      <Link to="/community" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t("nav.home")}
      </Link>

      <motion.section {...fadeUp(0)} className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("dailyFeeling.kicker")}</p>
        <h1 className="mt-2 font-display text-4xl leading-tight">{t("dailyFeeling.title")}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {t("dailyFeeling.subtitle")}
        </p>
      </motion.section>

      {isLoading ? (
        <Skeleton className="h-72 w-full" />
      ) : (
        <motion.section {...fadeUp(1)} className="space-y-7" aria-labelledby="feeling-picker-title">
          <div>
            <h2 id="feeling-picker-title" className="sr-only">{t("dailyFeeling.pickerSrTitle")}</h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {MOODS.map((item) => {
                const selected = mood === item.value;
                const MoodIcon = item.icon;
                return (
                  <Button
                    key={item.value}
                    type="button"
                    variant={selected ? "default" : "outline"}
                    aria-pressed={selected}
                    aria-label={translateFeeling(item.label)}
                    onClick={() => {
                      setMood(item.value);
                      setDetail(null);
                      setSpecific(null);
                      scrollToNext(detailRef);
                    }}
                    className={cn(
                      "relative h-auto min-h-24 flex-col gap-2 whitespace-normal rounded-2xl px-1 py-3 shadow-elevated-sm transition-all",
                      !selected && "border-border/50",
                    )}
                  >
                    <MoodIcon aria-hidden="true" className="h-6 w-6" />
                    <span className="text-[0.65rem] leading-tight sm:text-xs">{translateFeeling(item.label)}</span>
                    {selected && <Check className="absolute right-1 top-1 h-3.5 w-3.5" aria-hidden="true" />}
                  </Button>
                );
              })}
            </div>
          </div>

          {mood && MOODS.some((item) => item.value === mood) && (
            <div ref={detailRef} className="space-y-3 scroll-mt-4">
              <h2 className="font-display text-2xl">{t("dailyFeeling.whichFeelingTitle")}</h2>
              <div className="flex flex-wrap gap-2">
                {(MOODS.find((item) => item.value === mood)?.feelings ?? []).map((feeling) => (
                  <Button
                    key={feeling.label}
                    type="button"
                    size="sm"
                    variant={detail === feeling.label ? "default" : "outline"}
                    aria-pressed={detail === feeling.label}
                    onClick={() => {
                      setDetail(feeling.label);
                      setSpecific(null);
                      scrollToNext(specificRef);
                    }}
                    className={cn(
                      "h-auto min-h-10 whitespace-normal rounded-full",
                      detail !== feeling.label && "border-border/50",
                    )}
                  >
                    {translateFeeling(feeling.label)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {mood && detail && (
            <div ref={specificRef} className="space-y-3 scroll-mt-4">
              <h2 className="font-display text-2xl">{t("dailyFeeling.howExactlyTitle")}</h2>
              <div className="flex flex-wrap gap-2">
                {(MOODS.find((item) => item.value === mood)?.feelings.find((feeling) => feeling.label === detail)?.specifics ?? []).map((item) => (
                  <Button
                    key={item}
                    type="button"
                    size="sm"
                    variant={specific === item ? "default" : "outline"}
                    aria-pressed={specific === item}
                    onClick={() => {
                      setSpecific(item);
                      scrollToNext(noteRef);
                    }}
                    className={cn(
                      "h-auto min-h-10 whitespace-normal rounded-full",
                      specific !== item && "border-border/50",
                    )}
                  >
                    {translateFeeling(item)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div ref={noteRef} className="space-y-2 scroll-mt-4">
            <Label htmlFor="feeling-note">{t("dailyFeeling.noteLabel")}</Label>
            <Textarea
              id="feeling-note"
              rows={4}
              maxLength={500}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={t("dailyFeeling.notePlaceholder")}
              className="rounded-2xl border-border/50 shadow-elevated-sm"
            />
            <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><LockKeyhole className="h-3.5 w-3.5" /> {t("dailyFeeling.privateOnly")}</span>
              <span>{note.length}/500</span>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={save} disabled={saveFeeling.isPending || !mood || !detail || !specific}>
            {saveFeeling.isPending ? t("dailyFeeling.saving") : todayFeeling ? t("dailyFeeling.editButton") : t("dailyFeeling.saveButton")}
          </Button>

          {!!feelings?.length && (
            <div className="text-center">
              <Button variant="link" asChild>
                <Link to="/community/pocit/historia">
                  <History className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  {t("dailyFeeling.viewHistoryButton")}
                </Link>
              </Button>
            </div>
          )}
          <MedicalNote extra={t("dailyFeeling.medicalNoteExtra")} />
        </motion.section>
      )}
    </div>
  );
}
