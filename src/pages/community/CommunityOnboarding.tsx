import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import { MOVEMENT_INTERESTS } from "@/community/lib/constants";
import { normalizeUsername } from "@/community/lib/format";
import { uploadImage, validateImage } from "@/community/lib/storage";
import { ProfileAvatar } from "@/community/components/StoredImage";
import { ImageCropDialog } from "@/community/components/ImageCropDialog";
import { CityAutocomplete } from "@/community/components/CityAutocomplete";
import { cn } from "@/lib/utils";

export default function CommunityOnboarding() {
  const { t } = useTranslation();
  const { profile, user, refreshProfile } = useCommunityAuth();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile?.name || (user?.user_metadata?.name as string) || "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [gifts, setGifts] = useState(profile?.gifts ?? "");
  const [city, setCity] = useState(profile?.city ?? "");
  const [cityLat, setCityLat] = useState<number | null>(profile?.city_lat ?? null);
  const [cityLng, setCityLng] = useState<number | null>(profile?.city_lng ?? null);
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? []);
  const [isPublic, setIsPublic] = useState(profile?.is_public ?? true);
  const [cycleLength, setCycleLength] = useState(profile?.cycle_length_days ? String(profile.cycle_length_days) : "");
  const [lastPeriod, setLastPeriod] = useState(profile?.last_period_date ?? "");
  // Health data (cycle info) needs its own explicit GDPR Art. 9 consent — pre-checked
  // only if she already had this filled in before (i.e. she's consented already).
  const [healthConsent, setHealthConsent] = useState(
    Boolean(profile?.cycle_length_days || profile?.last_period_date),
  );
  const [avatarPath, setAvatarPath] = useState<string | null>(profile?.avatar_url ?? null);
  const [saving, setSaving] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);

  const returnToSignIn = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(t("onboarding.signOutFailed"));
  };

  const pickAvatar = (file: File) => {
    const problem = validateImage(file);
    if (problem) return toast.error(problem);
    setCropImage(URL.createObjectURL(file));
  };

  const closeCrop = () => {
    if (cropImage) URL.revokeObjectURL(cropImage);
    setCropImage(null);
  };

  const handleAvatar = async (file: File) => {
    try {
      const path = await uploadImage("avatars", user!.id, file);
      setAvatarPath(path);
    } catch {
      toast.error(t("onboarding.photoUploadFailed"));
    } finally {
      closeCrop();
    }
  };

  const finish = async () => {
    if (!profile) return;
    const cleanUsername = normalizeUsername(username);
    if (!name.trim()) return toast.error(t("onboarding.nameRequired"));
    if (cleanUsername.length < 3) return toast.error(t("onboarding.usernameTooShort"));
    setSaving(true);
    try {
      const { data: available, error: checkError } = await supabase.rpc("is_username_available", {
        _username: cleanUsername,
      });
      if (checkError) throw checkError;
      if (!available && cleanUsername !== profile.username) {
        setSaving(false);
        return toast.error(t("onboarding.usernameTaken"));
      }
      const trimmedCity = city.trim();
      let finalCityLat = trimmedCity ? cityLat : null;
      let finalCityLng = trimmedCity ? cityLng : null;
      if (trimmedCity && (finalCityLat == null || finalCityLng == null)) {
        // Typed by hand without picking a suggestion — geocode the plain text as a fallback.
        const { data: geo } = await supabase.functions.invoke("geocode-city", { body: { city: trimmedCity } });
        finalCityLat = geo?.lat ?? null;
        finalCityLng = geo?.lng ?? null;
      }
      const { error } = await supabase
        .from("profiles")
        .update({
          name: name.trim(),
          username: cleanUsername,
          bio: bio.trim() || null,
          gifts: gifts.trim() || null,
          city: trimmedCity || null,
          city_lat: finalCityLat,
          city_lng: finalCityLng,
          interests,
          is_public: isPublic,
          avatar_url: avatarPath,
          cycle_length_days: healthConsent && cycleLength ? Math.min(Math.max(parseInt(cycleLength, 10) || 28, 21), 40) : null,
          last_period_date: healthConsent ? lastPeriod || null : null,
          onboarding_completed: true,
        } as never)
        .eq("id", profile.id);
      if (error) throw error;
      refreshProfile();
      toast.success(t("onboarding.welcomeSuccess"));
    } catch {
      toast.error(t("onboarding.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-md px-5 py-12">
      {step === 0 && (
        <Button variant="ghost" className="mb-5 -ml-3 gap-2" onClick={returnToSignIn}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t("onboarding.backToSignIn")}
        </Button>
      )}
      <p className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
        {t("onboarding.stepLabel", { step: step + 1 })}
      </p>

      {step === 0 && (
        <section className="mt-4 space-y-6">
          <h1 className="font-display text-3xl">{t("onboarding.step0Title")}</h1>
          <div className="flex items-center gap-4">
            <ProfileAvatar path={avatarPath} name={name || "Diva"} size={72} />
            <div>
              <Label htmlFor="avatar" className="cursor-pointer underline">
                {t("onboarding.uploadPhoto")}
              </Label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) pickAvatar(file);
                }}
              />
              <ImageCropDialog
                image={cropImage}
                aspect={1}
                round
                title={t("onboarding.editPhotoTitle")}
                onCancel={closeCrop}
                onConfirm={handleAvatar}
              />
              <p className="mt-1 text-xs text-muted-foreground">{t("onboarding.photoOptional")}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="onb-name">{t("onboarding.nameLabel")}</Label>
            <Input id="onb-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="onb-username">{t("onboarding.usernameLabel")}</Label>
            <Input
              id="onb-username"
              value={username}
              onChange={(e) => setUsername(normalizeUsername(e.target.value))}
              placeholder={t("onboarding.usernamePlaceholder")}
            />
            <p className="text-xs text-muted-foreground">
              {t("onboarding.usernameHint", { username: username || t("onboarding.usernamePlaceholderShort") })}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="onb-city">{t("onboarding.cityLabel")}</Label>
            <CityAutocomplete
              id="onb-city"
              value={city}
              onChange={(value, lat, lng) => {
                setCity(value);
                setCityLat(lat);
                setCityLng(lng);
              }}
            />
          </div>
          <Button className="w-full" onClick={() => setStep(1)} disabled={!name.trim() || username.length < 3}>
            {t("onboarding.continueButton")}
          </Button>
        </section>
      )}

      {step === 1 && (
        <section className="mt-4 space-y-6">
          <h1 className="font-display text-3xl">{t("onboarding.step1Title")}</h1>
          <div className="flex flex-wrap gap-2">
            {MOVEMENT_INTERESTS.map((item) => {
              const selected = interests.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={selected}
                  onClick={() =>
                    setInterests((prev) => (selected ? prev.filter((i) => i !== item) : [...prev, item]))
                  }
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-colors",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground hover:border-primary/50",
                  )}
                >
                  {item}
                </button>
              );
            })}
          </div>
          <div className="space-y-2">
            <Label htmlFor="onb-bio">{t("onboarding.bioLabel")}</Label>
            <Textarea id="onb-bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} maxLength={300} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="onb-gifts">{t("onboarding.giftsLabel")}</Label>
            <p className="text-xs text-muted-foreground">
              {t("onboarding.giftsHint")}
            </p>
            <Textarea
              id="onb-gifts"
              value={gifts}
              onChange={(e) => setGifts(e.target.value)}
              rows={3}
              maxLength={300}
              placeholder={t("onboarding.giftsPlaceholder")}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep(0)}>
              {t("onboarding.backButton")}
            </Button>
            <Button className="flex-1" onClick={() => setStep(2)}>
              {t("onboarding.continueButton")}
            </Button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="mt-4 space-y-6">
          <h1 className="font-display text-3xl">{t("onboarding.step2Title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("onboarding.step2Subtitle")}
          </p>
          <div className="space-y-2">
            <Label htmlFor="onb-cycle-length">{t("onboarding.cycleLengthLabel")}</Label>
            <Input
              id="onb-cycle-length"
              type="number"
              inputMode="numeric"
              min={21}
              max={40}
              placeholder={t("onboarding.cycleLengthPlaceholder")}
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">{t("onboarding.cycleLengthHint")}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="onb-last-period">{t("onboarding.lastPeriodLabel")}</Label>
            <Input
              id="onb-last-period"
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {t("onboarding.privateDataHint")}
          </p>
          {(cycleLength.trim() || lastPeriod) && (
            <div className="flex items-start gap-3 rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
              <Checkbox
                id="onb-health-consent"
                checked={healthConsent}
                onCheckedChange={(v) => setHealthConsent(v === true)}
                className="mt-0.5"
              />
              <Label htmlFor="onb-health-consent" className="text-xs font-normal leading-relaxed text-muted-foreground">
                {t("onboarding.healthConsentText")}{" "}
                <Link to="/zasady-ochrany-udajov" target="_blank" className="underline hover:text-foreground">
                  {t("onboarding.healthConsentLinkText")}
                </Link>
                .
              </Label>
            </div>
          )}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
              {t("onboarding.backButton")}
            </Button>
            <Button
              className="flex-1"
              onClick={() => setStep(3)}
              disabled={Boolean(cycleLength.trim() || lastPeriod) && !healthConsent}
            >
              {t("onboarding.continueButton")}
            </Button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="mt-4 space-y-6">
          <h1 className="font-display text-3xl">{t("onboarding.step3Title")}</h1>
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
            <div>
              <p className="font-medium">{t("onboarding.publicProfileLabel")}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("onboarding.publicProfileDescription")}
              </p>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} aria-label={t("onboarding.publicProfileLabel")} />
          </div>
          <p className="text-sm text-muted-foreground">
            {t("onboarding.activityVisibilityHint")}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
              {t("onboarding.backButton")}
            </Button>
            <Button className="flex-1" onClick={finish} disabled={saving}>
              {t("onboarding.enterCommunityButton")}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
