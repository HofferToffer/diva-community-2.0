import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity, Bell, Download, Footprints, KeyRound, Palette, ShieldAlert, Sparkles, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import { CityAutocomplete } from "@/community/components/CityAutocomplete";
import { MOVEMENT_INTERESTS } from "@/community/lib/constants";
import { normalizeUsername } from "@/community/lib/format";
import { downloadJson, exportMyData } from "@/community/lib/exportData";
import { cn } from "@/lib/utils";

export function ProfileSettings({ onSaved, focusChapter }: { onSaved?: () => void; focusChapter?: boolean }) {
  const { t } = useTranslation();
  const deleteConfirmWord = t("profile.deleteConfirmWord");
  const { profile, refreshProfile, signOut } = useCommunityAuth();
  const chapterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusChapter && chapterRef.current) {
      chapterRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [focusChapter]);

  // This is a long form — on mobile, the on-screen keyboard opening can leave
  // the field a woman just tapped hidden behind it. Scroll whatever gets
  // focused into view once the keyboard has had a moment to animate open.
  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches("input, textarea, select")) {
        setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
      }
    };
    document.addEventListener("focusin", onFocusIn);
    return () => document.removeEventListener("focusin", onFocusIn);
  }, []);
  const [name, setName] = useState(profile?.name ?? "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [gifts, setGifts] = useState(profile?.gifts ?? "");
  const [city, setCity] = useState(profile?.city ?? "");
  const [cityLat, setCityLat] = useState<number | null>(profile?.city_lat ?? null);
  const [cityLng, setCityLng] = useState<number | null>(profile?.city_lng ?? null);
  const [dateOfBirth, setDateOfBirth] = useState(profile?.date_of_birth ?? "");
  const [childrenCount, setChildrenCount] = useState(
    profile?.children_count != null ? String(profile.children_count) : "",
  );
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? []);
  const [isPublic, setIsPublic] = useState(profile?.is_public ?? true);
  const [cycleLength, setCycleLength] = useState(profile?.cycle_length_days ? String(profile.cycle_length_days) : "");
  const [lastPeriod, setLastPeriod] = useState(profile?.last_period_date ?? "");
  const [isPregnant, setIsPregnant] = useState(profile?.is_pregnant ?? false);
  const [isMenopause, setIsMenopause] = useState(profile?.is_menopause ?? false);
  const [isPostpartum, setIsPostpartum] = useState(profile?.is_postpartum ?? false);
  const [postpartumSince, setPostpartumSince] = useState(profile?.postpartum_since ?? "");
  const [isTryingToConceive, setIsTryingToConceive] = useState(profile?.is_trying_to_conceive ?? false);
  // Health data (cycle/pregnancy/menopause) needs its own explicit GDPR Art. 9
  // consent — pre-checked only if she already had some of this filled in
  // (i.e. she's consented already), unchecked the first time she fills it in.
  const [healthConsent, setHealthConsent] = useState(
    Boolean(
      profile?.is_pregnant ||
        profile?.is_menopause ||
        profile?.is_postpartum ||
        profile?.is_trying_to_conceive ||
        profile?.cycle_length_days ||
        profile?.last_period_date,
    ),
  );
  const [notifyLikes, setNotifyLikes] = useState(profile?.notify_likes ?? true);
  const [notifyComments, setNotifyComments] = useState(profile?.notify_comments ?? true);
  const [notifyChallenges, setNotifyChallenges] = useState(profile?.notify_challenges ?? true);
  const [dynamicTheme, setDynamicTheme] = useState(profile?.dynamic_theme ?? true);
  const [shareChapter, setShareChapter] = useState(profile?.share_chapter ?? false);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const queryClient = useQueryClient();
  const { data: stravaConnection } = useQuery({
    queryKey: ["strava-connection", profile?.id],
    enabled: !!profile,
    queryFn: async () => {
      const { data } = await supabase
        .from("strava_connections")
        .select("id, strava_athlete_id")
        .eq("profile_id", profile!.id)
        .maybeSingle();
      return data;
    },
  });

  const connectStrava = async () => {
    const { data, error } = await supabase.functions.invoke("strava-oauth", {
      body: {
        action: "url",
        redirect_uri: `${window.location.origin}/community/strava/callback`,
      },
    });
    if (error || !data?.url) return toast.error(t("profile.toastStravaNotSetUp"));
    window.location.href = data.url;
  };

  const disconnectStrava = async () => {
    if (!stravaConnection) return;
    const { error } = await supabase.from("strava_connections").delete().eq("id", stravaConnection.id);
    if (error) return toast.error(t("profile.toastStravaDisconnectFailed"));
    queryClient.invalidateQueries({ queryKey: ["strava-connection"] });
    toast.success(t("profile.toastStravaDisconnected"));
  };

  const hasHealthData = Boolean(
    isPregnant || isMenopause || isPostpartum || isTryingToConceive || cycleLength.trim() || lastPeriod,
  );

  const save = async () => {
    if (!profile) return;
    const cleanUsername = normalizeUsername(username);
    if (cleanUsername.length < 3) return toast.error(t("profile.toastUsernameTooShort"));
    if (hasHealthData && !healthConsent) {
      return toast.error(t("profile.toastHealthConsentRequired"));
    }
    setSaving(true);
    try {
      if (cleanUsername !== profile.username) {
        const { data: available } = await supabase.rpc("is_username_available", { _username: cleanUsername });
        if (!available) {
          setSaving(false);
          return toast.error(t("profile.toastUsernameTaken"));
        }
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
          date_of_birth: dateOfBirth || null,
          children_count: childrenCount.trim() ? Math.max(0, parseInt(childrenCount, 10) || 0) : null,
          interests,
          is_public: isPublic,
          notify_likes: notifyLikes,
          notify_comments: notifyComments,
          notify_challenges: notifyChallenges,
          dynamic_theme: dynamicTheme,
          share_chapter: shareChapter,
          cycle_length_days: cycleLength ? Math.min(Math.max(parseInt(cycleLength, 10) || 28, 21), 40) : null,
          last_period_date: lastPeriod || null,
          is_pregnant: isPregnant,
          is_menopause: isMenopause,
          is_postpartum: isPostpartum,
          postpartum_since: isPostpartum ? postpartumSince || null : null,
          is_trying_to_conceive: isTryingToConceive,
        } as never)
        .eq("id", profile.id);
      if (error) throw error;
      refreshProfile();
      toast.success(t("profile.toastChangesSaved"));
      onSaved?.();
    } catch {
      toast.error(t("profile.toastSaveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (newPassword.length < 8) return toast.error(t("profile.toastPasswordTooShort"));
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
      current_password: currentPassword,
    });
    if (error) {
      toast.error(t("profile.toastPasswordChangeFailed"));
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    toast.success(t("profile.toastPasswordChanged"));
  };

  const handleExportData = async () => {
    if (!profile) return;
    setExporting(true);
    try {
      const data = await exportMyData(profile.id);
      downloadJson(data, `diva-community-moje-udaje-${new Date().toISOString().slice(0, 10)}.json`);
      toast.success(t("profile.toastDataDownloaded"));
    } catch {
      toast.error(t("profile.toastDataDownloadFailed"));
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase.functions.invoke("delete-account", { body: {} });
      if (error) throw error;
      toast.success(t("profile.toastAccountDeleted"));
      await signOut();
    } catch {
      toast.error(t("profile.toastAccountDeleteFailed"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl">{t("profile.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("profile.subtitle")}</p>
      </div>

      <SectionCard icon={User} title={t("profile.basicInfoTitle")}>
        <div className="space-y-2">
          <Label htmlFor="s-name">{t("profile.nameLabel")}</Label>
          <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="s-username">{t("profile.usernameLabel")}</Label>
          <Input id="s-username" value={username} onChange={(e) => setUsername(normalizeUsername(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="s-city">{t("profile.cityLabel")}</Label>
          <CityAutocomplete
            id="s-city"
            value={city}
            onChange={(value, lat, lng) => {
              setCity(value);
              setCityLat(lat);
              setCityLng(lng);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="s-dob">{t("profile.dobLabel")}</Label>
          <Input
            id="s-dob"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">{t("profile.dobHint")}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="s-children">{t("profile.childrenLabel")}</Label>
          <Input
            id="s-children"
            type="number"
            inputMode="numeric"
            autoComplete="off"
            min={0}
            max={20}
            value={childrenCount}
            onChange={(e) => setChildrenCount(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">{t("profile.childrenHint")}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="s-bio">{t("profile.bioLabel")}</Label>
          <Textarea id="s-bio" rows={4} maxLength={300} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="s-gifts">{t("profile.giftsLabel")}</Label>
          <p className="text-xs text-muted-foreground">{t("profile.giftsHint")}</p>
          <Textarea
            id="s-gifts"
            rows={3}
            maxLength={300}
            placeholder={t("profile.giftsPlaceholder")}
            value={gifts}
            onChange={(e) => setGifts(e.target.value)}
          />
        </div>
      </SectionCard>

      <div ref={chapterRef}>
      <SectionCard
        icon={Sparkles}
        title={t("profile.chapterTitle")}
        description={t("profile.chapterDescription")}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="s-is-trying" className="text-sm">{t("profile.tryingToConceiveLabel")}</Label>
            <Switch
              id="s-is-trying"
              checked={isTryingToConceive}
              onCheckedChange={(v) => {
                setIsTryingToConceive(v);
                if (v) {
                  setIsPregnant(false);
                  setIsMenopause(false);
                  setIsPostpartum(false);
                }
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="s-is-pregnant" className="text-sm">{t("profile.pregnantLabel")}</Label>
            <Switch
              id="s-is-pregnant"
              checked={isPregnant}
              onCheckedChange={(v) => {
                setIsPregnant(v);
                if (v) {
                  setIsMenopause(false);
                  setIsPostpartum(false);
                  setIsTryingToConceive(false);
                }
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="s-is-postpartum" className="text-sm">{t("profile.postpartumLabel")}</Label>
            <Switch
              id="s-is-postpartum"
              checked={isPostpartum}
              onCheckedChange={(v) => {
                setIsPostpartum(v);
                if (v) {
                  setIsPregnant(false);
                  setIsMenopause(false);
                  setIsTryingToConceive(false);
                }
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="s-is-menopause" className="text-sm">{t("profile.menopauseLabel")}</Label>
            <Switch
              id="s-is-menopause"
              checked={isMenopause}
              onCheckedChange={(v) => {
                setIsMenopause(v);
                if (v) {
                  setIsPregnant(false);
                  setIsPostpartum(false);
                  setIsTryingToConceive(false);
                }
              }}
            />
          </div>
        </div>

        {isPostpartum && (
          <div className="space-y-2 border-t border-border/50 pt-4">
            <Label htmlFor="s-postpartum-since">{t("profile.postpartumSinceLabel")}</Label>
            <Input
              id="s-postpartum-since"
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              value={postpartumSince}
              onChange={(e) => setPostpartumSince(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">{t("profile.postpartumSinceHint")}</p>
          </div>
        )}
        {isMenopause && (
          <div className="space-y-2 border-t border-border/50 pt-4">
            <Label htmlFor="s-last-period">{t("profile.lastPeriodMenopauseLabel")}</Label>
            <Input
              id="s-last-period"
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">{t("profile.lastPeriodMenopauseHint")}</p>
          </div>
        )}
        {!isMenopause && !isPostpartum && (
          <div className="space-y-4 border-t border-border/50 pt-4">
            <div className="space-y-2">
              <Label htmlFor="s-last-period">
                {isPregnant ? t("profile.lastPeriodPregnantLabel") : t("profile.lastPeriodOptionalLabel")}
              </Label>
              <Input
                id="s-last-period"
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                value={lastPeriod}
                onChange={(e) => setLastPeriod(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {isPregnant
                  ? t("profile.lastPeriodHintPregnant")
                  : isTryingToConceive
                    ? t("profile.lastPeriodHintTTC")
                    : t("profile.lastPeriodHintCycle")}
              </p>
            </div>
            {!isPregnant && (
              <div className="space-y-2">
                <Label htmlFor="s-cycle-length">{t("profile.cycleLengthLabel")}</Label>
                <Input
                  id="s-cycle-length"
                  type="number"
                  inputMode="numeric"
                  min={21}
                  max={40}
                  placeholder={t("profile.cycleLengthPlaceholder")}
                  value={cycleLength}
                  onChange={(e) => setCycleLength(e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        {hasHealthData && (
          <div className="flex items-start gap-3 border-t border-border/50 pt-4">
            <Checkbox
              id="s-health-consent"
              checked={healthConsent}
              onCheckedChange={(v) => setHealthConsent(v === true)}
              className="mt-0.5"
            />
            <Label htmlFor="s-health-consent" className="text-xs font-normal leading-relaxed text-muted-foreground">
              {t("profile.healthConsentText")}{" "}
              <Link to="/zasady-ochrany-udajov" target="_blank" className="underline hover:text-foreground">
                {t("profile.healthConsentLinkText")}
              </Link>
              .
            </Label>
          </div>
        )}

        <div className="space-y-2 border-t border-border/50 pt-4">
          <ToggleRow
            label={t("profile.shareChapterLabel")}
            checked={shareChapter}
            onChange={setShareChapter}
          />
          <p className="text-xs text-muted-foreground">{t("profile.shareChapterHint")}</p>
        </div>
      </SectionCard>
      </div>

      <SectionCard icon={Footprints} title={t("profile.movementTitle")}>
        <div className="flex flex-wrap gap-2">
          {MOVEMENT_INTERESTS.map((item) => {
            const selected = interests.includes(item);
            return (
              <button
                key={item}
                type="button"
                aria-pressed={selected}
                onClick={() => setInterests((p) => (selected ? p.filter((i) => i !== item) : [...p, item]))}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  selected ? "border-primary bg-primary text-primary-foreground" : "border-border",
                )}
              >
                {item}
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard
        icon={Palette}
        title={t("profile.appearanceTitle")}
        description={t("profile.appearanceDescription")}
      >
        <ToggleRow label={t("profile.dynamicThemeLabel")} checked={dynamicTheme} onChange={setDynamicTheme} />
      </SectionCard>

      <SectionCard icon={Bell} title={t("profile.privacyTitle")}>
        <div className="space-y-2">
          <ToggleRow label={t("profile.publicProfileLabel")} checked={isPublic} onChange={setIsPublic} />
          <ToggleRow label={t("profile.notifyLikesLabel")} checked={notifyLikes} onChange={setNotifyLikes} />
          <ToggleRow label={t("profile.notifyCommentsLabel")} checked={notifyComments} onChange={setNotifyComments} />
          <ToggleRow label={t("profile.notifyChallengesLabel")} checked={notifyChallenges} onChange={setNotifyChallenges} />
        </div>
      </SectionCard>

      <Button className="w-full" size="lg" onClick={save} disabled={saving}>
        {t("profile.saveButton")}
      </Button>

      <div className="border-t border-border/60 pt-8">
        <p className="mb-4 text-xs uppercase tracking-[0.15em] text-muted-foreground">{t("profile.accountSection")}</p>
        <div className="space-y-6">
          <SectionCard icon={Activity} title={t("profile.stravaTitle")}>
            <p className="text-sm">
              {stravaConnection ? t("profile.stravaConnected") : t("profile.stravaNotConnected")}
            </p>
            {stravaConnection ? (
              <Button variant="outline" className="w-full" onClick={disconnectStrava}>
                {t("profile.stravaDisconnectButton")}
              </Button>
            ) : (
              <Button className="w-full" onClick={connectStrava}>
                {t("profile.stravaConnectButton")}
              </Button>
            )}
          </SectionCard>

          <SectionCard icon={KeyRound} title={t("profile.passwordTitle")}>
            <div className="space-y-2">
              <Label htmlFor="cur-pass">{t("profile.currentPasswordLabel")}</Label>
              <Input
                id="cur-pass"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-pass">{t("profile.newPasswordLabel")}</Label>
              <Input
                id="new-pass"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <ToggleRow label={t("profile.showPasswordLabel")} checked={showPassword} onChange={setShowPassword} />
            <Button variant="outline" className="w-full" onClick={changePassword}>
              {t("profile.changePasswordButton")}
            </Button>
          </SectionCard>

          <SectionCard
            icon={ShieldAlert}
            title={t("profile.dataTitle")}
            description={t("profile.dataDescription")}
          >
            <Button variant="outline" className="w-full gap-2" onClick={handleExportData} disabled={exporting}>
              <Download className="h-4 w-4" aria-hidden="true" />
              {exporting ? t("profile.downloading") : t("profile.downloadDataButton")}
            </Button>

            <AlertDialog onOpenChange={(open) => !open && setDeleteConfirmText("")}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  {t("profile.deleteAccountButton")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("profile.deleteConfirmTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("profile.deleteConfirmDescription")}{" "}
                    <strong className="text-foreground">{deleteConfirmWord}</strong>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Input
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={deleteConfirmWord}
                  aria-label={t("profile.deleteConfirmAriaLabel", { word: deleteConfirmWord })}
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("profile.cancelButton")}</AlertDialogCancel>
                  <AlertDialogAction
                    className={cn(buttonVariants({ variant: "destructive" }))}
                    disabled={deleteConfirmText !== deleteConfirmWord || deleting}
                    onClick={handleDeleteAccount}
                  >
                    {deleting ? t("profile.deleting") : t("profile.deletePermanentlyButton")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SectionCard>

          <Button variant="outline" className="w-full" onClick={signOut}>
            {t("profile.signOutButton")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof User;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <h3 className="font-display text-lg leading-tight">{title}</h3>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  );
}
