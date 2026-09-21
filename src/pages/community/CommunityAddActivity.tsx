import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import { ACTIVITY_TYPES } from "@/community/lib/constants";
import { uploadImage, validateImage } from "@/community/lib/storage";
import { StoredImage } from "@/community/components/StoredImage";
import { ImageCropDialog } from "@/community/components/ImageCropDialog";
import { cn } from "@/lib/utils";


export default function CommunityAddActivity() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { profile, user } = useCommunityAuth();

  const [activityType, setActivityType] = useState<string>(ACTIVITY_TYPES[0].value);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [distance, setDistance] = useState("");
  const [note, setNote] = useState("");
  const [shareToFeed, setShareToFeed] = useState(true);
  const [photoPath, setPhotoPath] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selected = ACTIVITY_TYPES.find((t) => t.value === activityType) ?? ACTIVITY_TYPES[0];
  const needsDistance = selected.distance;
  const needsDuration = "duration" in selected && selected.duration;
  const distanceKm = distance ? Number(distance.replace(",", ".")) : 0;
  const [duration, setDuration] = useState("");
  const durationSeconds = needsDuration && duration ? Math.round(Number(duration) * 60) : 0;

  const [cropImage, setCropImage] = useState<string | null>(null);

  const pickPhoto = (file: File) => {
    const problem = validateImage(file);
    if (problem) return toast.error(problem);
    setCropImage(URL.createObjectURL(file));
  };

  const closeCrop = () => {
    if (cropImage) URL.revokeObjectURL(cropImage);
    setCropImage(null);
  };

  const handlePhoto = async (file: File) => {
    try {
      setPhotoPath(await uploadImage("activity-photos", user!.id, file));
    } catch {
      toast.error("Fotku sa nepodarilo nahrať.");
    } finally {
      closeCrop();
    }
  };

  const save = async () => {
    if (!profile) return;
    if (needsDistance && distanceKm <= 0) return toast.error("Zadaj prosím vzdialenosť.");
    if (needsDuration && durationSeconds <= 0) return toast.error("Zadaj prosím čas v minútach.");
    setSaving(true);
    try {
      const { error } = await supabase.from("activities").insert({
        profile_id: profile.id,
        kind: needsDistance ? "run" : "move",
        activity_type: activityType,
        activity_date: date,
        duration_seconds: durationSeconds,
        distance_km: needsDistance ? distanceKm : null,
        note: note || null,
        visibility: shareToFeed ? "public" : "private",
        photo_url: photoPath,
      });
      if (error) throw error;
      await queryClient.invalidateQueries();
      toast.success("Aktivita je uložená.");
      navigate("/community");
    } catch {
      toast.error("Aktivitu sa nepodarilo uložiť.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-3xl">Zapíš svoju aktivitu</h1>
        <p className="text-sm text-muted-foreground">Dnes stačí urobiť to, čo môžeš.</p>
      </header>



      <div className="space-y-2">
        <Label>Aktivita</Label>
        <div className="flex flex-wrap gap-2">
          {ACTIVITY_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              aria-pressed={activityType === t.value}
              onClick={() => setActivityType(t.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                activityType === t.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/50",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Dátum</Label>
        <Input id="date" type="date" value={date} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} />
      </div>

      {needsDistance && (
      <div className="space-y-2">
        <Label htmlFor="distance">Vzdialenosť (km)</Label>
        <Input
          id="distance"
          type="text"
          inputMode="decimal"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          placeholder="napr. 5,2"
        />
      </div>
      )}

      {needsDuration && (
      <div className="space-y-2">
        <Label htmlFor="duration">Čas (minúty)</Label>
        <Input
          id="duration"
          type="number"
          inputMode="numeric"
          min={1}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="napr. 45"
        />
      </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="note">Ako si sa cítila?</Label>
        <Textarea id="note" rows={4} maxLength={800} value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo" className="cursor-pointer underline">
          Pridať fotku
        </Label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) pickPhoto(file);
          }}
        />
        <ImageCropDialog
          image={cropImage}
          aspect={4 / 3}
          title="Uprav si fotku aktivity"
          onCancel={closeCrop}
          onConfirm={handlePhoto}
        />
        {photoPath && <StoredImage path={photoPath} alt="Náhľad fotky" className="h-48 w-full rounded-lg object-cover" />}
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
        <div>
          <p className="font-medium">Zdieľať s komunitou</p>
          <p className="text-sm text-muted-foreground">Ak vypneš, aktivita zostane len tvoja.</p>
        </div>
        <Switch checked={shareToFeed} onCheckedChange={setShareToFeed} aria-label="Zdieľať s komunitou" />
      </div>

      <Button className="w-full" size="lg" onClick={save} disabled={saving}>
        Uložiť aktivitu
      </Button>
    </div>
  );
}
