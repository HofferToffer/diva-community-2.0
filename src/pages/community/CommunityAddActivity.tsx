import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import { ACTIVITY_TYPE_COLORS, ACTIVITY_TYPES } from "@/community/lib/constants";
import { uploadImage, validateImage, normalizeImage } from "@/community/lib/storage";
import { StoredImage } from "@/community/components/StoredImage";
import { fadeUp } from "@/community/lib/motion";


export default function CommunityAddActivity() {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === "en";
  const activityTypeTranslations = t("activityTypeLabel", { returnObjects: true, defaultValue: {} }) as Record<string, string>;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { profile, user } = useCommunityAuth();
  const { id: editId } = useParams();

  const { data: existing } = useQuery({
    queryKey: ["community-activity-edit", editId],
    enabled: !!editId,
    queryFn: async () => {
      const { data, error } = await supabase.from("activities").select("*").eq("id", editId!).single();
      if (error) throw error;
      return data;
    },
  });

  const [activityType, setActivityType] = useState<string>(ACTIVITY_TYPES[0].value);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [distance, setDistance] = useState("");
  const [note, setNote] = useState("");
  const [shareToFeed, setShareToFeed] = useState(true);
  const [photoPath, setPhotoPath] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (!existing) return;
    setActivityType(existing.activity_type);
    setDate(existing.activity_date);
    setDistance(existing.distance_km ? String(existing.distance_km).replace(".", ",") : "");
    setNote(existing.note ?? "");
    setShareToFeed(existing.visibility === "public");
    setPhotoPath(existing.photo_url);
    if (existing.duration_seconds) setDuration(String(Math.round(existing.duration_seconds / 60)));
  }, [existing]);

  const selected = ACTIVITY_TYPES.find((t) => t.value === activityType) ?? ACTIVITY_TYPES[0];
  const needsDistance = selected.distance;
  const needsDuration = "duration" in selected && selected.duration;
  const distanceKm = distance ? Number(distance.replace(",", ".")) : 0;
  const durationSeconds = needsDuration && duration ? Math.round(Number(duration) * 60) : 0;

  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const pickPhoto = async (rawFile: File) => {
    setUploadingPhoto(true);
    try {
      const file = await normalizeImage(rawFile);
      const problem = validateImage(file);
      if (problem) return toast.error(problem);
      setPhotoPath(await uploadImage("activity-photos", user!.id, file));
    } catch (err) {
      console.error("Nepodarilo sa nahrať fotku aktivity:", err);
      toast.error(t("addActivity.photoUploadFailed"));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const save = async () => {
    if (!profile) return;
    if (needsDistance && distanceKm <= 0) return toast.error(t("addActivity.distanceRequired"));
    if (needsDuration && durationSeconds <= 0) return toast.error(t("addActivity.durationRequired"));
    setSaving(true);
    try {
      const payload = {
        kind: needsDistance ? "run" : "move",
        activity_type: activityType,
        activity_date: date,
        duration_seconds: durationSeconds,
        distance_km: needsDistance ? distanceKm : null,
        note: note || null,
        visibility: shareToFeed ? "public" : "private",
        photo_url: photoPath,
      };
      const { error } = editId
        ? await supabase.from("activities").update(payload).eq("id", editId)
        : await supabase.from("activities").insert({ ...payload, profile_id: profile.id });
      if (error) throw error;
      await queryClient.invalidateQueries();
      toast.success(editId ? t("addActivity.editSuccess") : t("addActivity.createSuccess"));
      navigate("/community");
    } catch {
      toast.error(t("addActivity.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/community" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t("nav.home")}
      </Link>

      <motion.header {...fadeUp(0)} className="space-y-1">
        <h1 className="font-display text-3xl">{editId ? t("addActivity.editTitle") : t("addActivity.createTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("addActivity.subtitle")}</p>
      </motion.header>

      <motion.div {...fadeUp(1)} className="space-y-6">

      <div className="space-y-2">
        <Label>{t("addActivity.activityLabel")}</Label>
        <div className="flex flex-wrap gap-2">
          {ACTIVITY_TYPES.map((type) => {
            const color = ACTIVITY_TYPE_COLORS[type.value];
            const selected = activityType === type.value;
            return (
              <button
                key={type.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setActivityType(type.value)}
                className="rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition-all"
                style={{
                  borderColor: selected ? color.dot : color.fill.replace(/0\.\d+\)/, "0.4)"),
                  background: selected ? color.dot : color.fill,
                  color: selected ? "hsl(var(--primary-foreground))" : color.dot,
                }}
              >
                {isEnglish ? activityTypeTranslations[type.label] ?? type.label : type.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-5 rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="date">{t("addActivity.dateLabel")}</Label>
          <Input
            id="date"
            type="date"
            value={date}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border-border/50"
          />
        </div>

        {needsDistance && (
        <div className="space-y-2">
          <Label htmlFor="distance">{t("addActivity.distanceLabel")}</Label>
          <Input
            id="distance"
            type="text"
            inputMode="decimal"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder={t("addActivity.distancePlaceholder")}
            className="rounded-xl border-border/50"
          />
        </div>
        )}

        {needsDuration && (
        <div className="space-y-2">
          <Label htmlFor="duration">{t("addActivity.durationLabel")}</Label>
          <Input
            id="duration"
            type="number"
            inputMode="numeric"
            min={1}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder={t("addActivity.durationPlaceholder")}
            className="rounded-xl border-border/50"
          />
        </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="note">{t("addActivity.noteLabel")}</Label>
          <Textarea
            id="note"
            rows={4}
            maxLength={800}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="rounded-xl border-border/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="photo" className="cursor-pointer underline">
            {uploadingPhoto ? t("addActivity.photoUploading") : t("addActivity.photoAdd")}
          </Label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={uploadingPhoto}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void pickPhoto(file);
            }}
          />
          {photoPath && <StoredImage path={photoPath} alt={t("addActivity.photoPreviewAlt")} className="h-48 w-full rounded-2xl object-cover" />}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
        <div>
          <p className="font-medium">{t("addActivity.shareTitle")}</p>
          <p className="text-sm text-muted-foreground">{t("addActivity.shareDescription")}</p>
        </div>
        <Switch checked={shareToFeed} onCheckedChange={setShareToFeed} aria-label={t("addActivity.shareAriaLabel")} />
      </div>

      <Button className="w-full" size="lg" onClick={save} disabled={saving}>
        {editId ? t("addActivity.saveChanges") : t("addActivity.saveNew")}
      </Button>
      </motion.div>
    </div>
  );
}
