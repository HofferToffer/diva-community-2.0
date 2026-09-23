import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileAvatar } from "@/community/components/StoredImage";
import { ActivityCard } from "@/community/components/ActivityCard";
import { EmptyState, StatTile } from "@/community/components/EmptyState";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import {
  useAchievements,
  useFriends,
  useToggleFriend,
  useDailyFeelings,
  useProfileActivities,
  useProfileByUsername,
  useProfileStats,
} from "@/community/hooks/queries";
import { formatKm, pluralActivities } from "@/community/lib/format";
import { ProfileSettings } from "@/community/components/ProfileSettings";
import { getCycleInfo, formatCycleDate, CYCLE_PHASE_ARCHETYPE, CYCLE_PHASE_SEASON } from "@/community/lib/cycle";
import { getArchetype } from "@/community/lib/archetype";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ImageCropDialog } from "@/community/components/ImageCropDialog";
import { ProfileGallery } from "@/community/components/ProfileGallery";
import { validateImage, uploadImage, deleteStoredImage, normalizeImage } from "@/community/lib/storage";
import { useSignedImage } from "@/community/hooks/useSignedImage";

function MonthFeelingsTile({ profileId }: { profileId: string | undefined }) {
  const { data: feelings } = useDailyFeelings(profileId);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const daysElapsed = now.getDate();

  const monthDays = (feelings ?? []).filter((f) => {
    const [y, m] = f.feeling_date.split("-").map(Number);
    return y === currentYear && m - 1 === currentMonth;
  }).length;

  return <StatTile label="Zapísané pocity tento mesiac" value={`${monthDays} / ${daysElapsed}`} />;
}

export default function CommunityProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = useParams<{ username: string }>();
  const { profile: me, refreshProfile, user } = useCommunityAuth();
  const other = useProfileByUsername(username);
  const profile = username ? (other.data as typeof me | null) : me;
  const isMe = !username || profile?.id === me?.id;

  const { data: stats } = useProfileStats(profile?.id);
  const [kind, setKind] = useState<"all" | "run" | "move">("all");
  const [editingProfile, setEditingProfile] = useState(false);
  const [focusChapter, setFocusChapter] = useState(false);
  const editRef = useRef<HTMLDivElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const friends = useFriends(me?.id);
  const toggleFriend = useToggleFriend(me?.id);
  const activities = useProfileActivities(profile?.id, kind === "all" ? undefined : kind);
  const { data: achievements } = useAchievements();

  useEffect(() => {
    if ((location.state as { openEdit?: boolean } | null)?.openEdit) {
      setEditingProfile(true);
      setFocusChapter(true);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    if (editingProfile && editRef.current && !focusChapter) {
      editRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [editingProfile, focusChapter]);

  const [editingCycle, setEditingCycle] = useState(false);
  const [cycleLengthEdit, setCycleLengthEdit] = useState(String(profile?.cycle_length_days ?? 28));
  const [lastPeriodEdit, setLastPeriodEdit] = useState(profile?.last_period_date ?? "");
  const [savingCycle, setSavingCycle] = useState(false);

  const [cropImage, setCropImage] = useState<string | null>(null);
  const [avatarPath, setAvatarPath] = useState<string | null>(profile?.avatar_url ?? null);
  const [coverCropImage, setCoverCropImage] = useState<string | null>(null);
  const [coverPath, setCoverPath] = useState<string | null>(profile?.cover_photo_url ?? null);
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>(profile?.gallery_photos ?? []);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const coverUrl = useSignedImage(coverPath ?? profile?.cover_photo_url);

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
      const newPath = await uploadImage("avatars", user!.id, file);
      setAvatarPath(newPath);
      if (profile) {
        const { error } = await supabase.from("profiles").update({ avatar_url: newPath } as never).eq("id", profile.id);
        if (error) throw error;
        refreshProfile();
        toast.success("Profilová fotka je uložená.");
      }
    } catch {
      toast.error("Fotku sa nepodarilo nahrať.");
    } finally {
      closeCrop();
    }
  };

  const pickCover = (file: File) => {
    const problem = validateImage(file);
    if (problem) return toast.error(problem);
    setCoverCropImage(URL.createObjectURL(file));
  };

  const closeCoverCrop = () => {
    if (coverCropImage) URL.revokeObjectURL(coverCropImage);
    setCoverCropImage(null);
  };

  const handleCover = async (file: File) => {
    try {
      const newPath = await uploadImage("profile-cover", user!.id, file);
      setCoverPath(newPath);
      if (profile) {
        const { error } = await supabase
          .from("profiles")
          .update({ cover_photo_url: newPath } as never)
          .eq("id", profile.id);
        if (error) throw error;
        refreshProfile();
        toast.success("Titulná fotka je uložená.");
      }
    } catch {
      toast.error("Fotku sa nepodarilo nahrať.");
    } finally {
      closeCoverCrop();
    }
  };

  const addGalleryPhotos = async (files: File[]) => {
    if (!profile || !user) return;
    const remaining = Math.max(12 - galleryPhotos.length, 0);
    const toUpload = files.slice(0, remaining);
    if (toUpload.length === 0) return;
    setGalleryUploading(true);
    setGalleryError(null);
    try {
      const newPaths: string[] = [];
      const failures: string[] = [];
      for (const rawFile of toUpload) {
        const file = await normalizeImage(rawFile);
        const problem = validateImage(file);
        if (problem) {
          toast.error(problem);
          failures.push(problem);
          continue;
        }
        try {
          newPaths.push(await uploadImage("profile-gallery", user.id, file));
        } catch (err) {
          console.error("Nepodarilo sa nahrať fotku do albumu:", err);
          failures.push(err instanceof Error ? err.message : String(err));
        }
      }
      if (newPaths.length === 0) {
        if (failures.length > 0) {
          toast.error("Fotky sa nepodarilo nahrať.");
          setGalleryError(`Nahrávanie zlyhalo: ${failures.join(" / ")}`);
        }
        return;
      }
      const updated = [...galleryPhotos, ...newPaths];
      const { error } = await supabase.from("profiles").update({ gallery_photos: updated } as never).eq("id", profile.id);
      if (error) throw error;
      setGalleryPhotos(updated);
      refreshProfile();
      toast.success("Fotky sú pridané.");
    } catch (err) {
      console.error("Nepodarilo sa uložiť album:", err);
      const message = err instanceof Error ? err.message : String(err);
      toast.error("Fotky sa nepodarilo nahrať.");
      setGalleryError(`Uloženie zlyhalo: ${message}`);
    } finally {
      setGalleryUploading(false);
    }
  };

  const removeGalleryPhoto = async (index: number) => {
    if (!profile) return;
    const removed = galleryPhotos[index];
    const updated = galleryPhotos.filter((_, i) => i !== index);
    setGalleryPhotos(updated);
    try {
      const { error } = await supabase.from("profiles").update({ gallery_photos: updated } as never).eq("id", profile.id);
      if (error) throw error;
      refreshProfile();
      void deleteStoredImage(removed);
    } catch {
      setGalleryPhotos(galleryPhotos);
      toast.error("Fotku sa nepodarilo odstrániť.");
    }
  };

  const startEditingCycle = () => {
    setCycleLengthEdit(String(profile?.cycle_length_days ?? 28));
    setLastPeriodEdit(profile?.last_period_date ?? "");
    setEditingCycle(true);
  };

  const saveCycle = async () => {
    if (!profile) return;
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

  if (username && other.isLoading) return <Skeleton className="h-64 w-full" />;
  if (!profile)
    return <EmptyState title="Profil sa nenašiel" description="Možno bola prezývka zmenená alebo profil je súkromný." />;

  const earned = (achievements ?? []).filter((a) => {
    const value =
      a.metric === "km"
        ? (stats?.total_km ?? 0)
        : a.metric === "runs"
          ? (stats?.total_runs ?? 0)
          : a.metric === "workouts"
            ? (stats?.total_workouts ?? 0)
            : a.metric === "streak"
              ? (stats?.streak_days ?? 0)
              : 0;
  return Number(value) >= Number(a.threshold);
  });

  const cycle =
    isMe && !profile.is_pregnant && !profile.is_menopause && !profile.is_postpartum && profile.last_period_date
      ? getCycleInfo(profile.last_period_date, profile.cycle_length_days ?? 28)
      : null;

  const archetype = isMe ? getArchetype(profile) : null;

  const isFriend = (friends.data ?? []).some((f) => f.following_id === profile.id);

  const displayAvatar = avatarPath ?? profile.avatar_url;

  return (
    <div className="space-y-6">
      {!isMe && (
        <Link
          to="/community/divy"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Späť k Divám
        </Link>
      )}
      <header className="overflow-hidden rounded-2xl border border-border/50 shadow-sm">
        <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-primary/25 via-secondary/30 to-accent/25 sm:h-56">
          {coverUrl && <img src={coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
          {isMe && (
            <>
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="absolute right-3 top-3 rounded-full bg-foreground/45 px-3 py-1.5 text-xs text-background backdrop-blur-sm transition-colors hover:bg-foreground/60"
              >
                Zmeniť titulnú fotku
              </button>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) pickCover(file);
                }}
              />
              <ImageCropDialog
                image={coverCropImage}
                aspect={2.5}
                title="Uprav si titulnú fotku"
                onCancel={closeCoverCrop}
                onConfirm={handleCover}
              />
            </>
          )}
          <div className="absolute inset-x-4 bottom-16">
            <h1 className="font-display text-2xl leading-tight text-white drop-shadow-sm sm:text-3xl">
              {profile.name || "Diva"}
            </h1>
            {profile.username && <p className="text-sm text-white/85">@{profile.username}</p>}
          </div>
        </div>

        <div className="flex items-end justify-between gap-3 bg-card px-4 pb-4">
          <div className="relative -mt-9 flex flex-col items-start gap-2">
            <ProfileAvatar path={displayAvatar} name={profile.name} size={80} className="ring-4 ring-card" />
            {isMe && (
              <>
                <button
                  type="button"
                  className="cursor-pointer text-xs underline text-muted-foreground"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  Zmeniť fotku
                </button>
                <input
                  ref={avatarInputRef}
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
                  title="Uprav si profilovú fotku"
                  onCancel={closeCrop}
                  onConfirm={handleAvatar}
                />
              </>
            )}
          </div>
          {(profile.city || profile.country) && (
            <p className="pb-1 text-sm text-muted-foreground">
              {[profile.city, profile.country].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      </header>

      {!isMe && me && (
        <div className="flex gap-2">
          <Button
            className="flex-1"
            variant={isFriend ? "outline" : "default"}
            disabled={toggleFriend.isPending}
            onClick={() =>
              toggleFriend.mutate(
                { targetId: profile.id, isFriend },
                {
                  onSuccess: () =>
                    toast.success(isFriend ? "Odobrala si kamošku." : `${profile.name} je tvoja kamoška.`),
                  onError: () => toast.error("Nepodarilo sa uložiť."),
                },
              )
            }
          >
            {isFriend ? "Kamoška – odobrať" : "Pridať kamošku"}
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => navigate(`/community/spravy/${profile.id}`)}>
            <MessageCircle className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Napísať správu
          </Button>
        </div>
      )}

      {profile.bio && <p className="text-sm leading-relaxed text-foreground/85">{profile.bio}</p>}

      {profile.gifts && (
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Moje dary</p>
          <p className="text-sm leading-relaxed text-foreground/85">{profile.gifts}</p>
        </div>
      )}

      {archetype && (
        <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">Tvoj životný archetyp</p>
          <h2 className="mt-1 font-display text-2xl text-primary">{archetype.name}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{archetype.keywords}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{archetype.description}</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/85">{archetype.energyNote}</p>

          {cycle && (
            <div className="mt-4 border-t border-border/50 pt-4">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                A dnes v cykle · {CYCLE_PHASE_SEASON[cycle.phaseKey].season}
              </p>
              <p className="mt-1 font-display text-lg text-primary">
                {CYCLE_PHASE_ARCHETYPE[cycle.phaseKey].archetype}
              </p>
              <p className="mt-1 text-sm italic text-foreground/85">
                „{CYCLE_PHASE_ARCHETYPE[cycle.phaseKey].mantra}"
              </p>
            </div>
          )}
        </div>
      )}

      {profile.interests?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {profile.interests.map((i) => (
            <span key={i} className="rounded-full border border-border px-3 py-1 text-xs">
              {i}
            </span>
          ))}
        </div>
      )}

      <ProfileGallery
        photos={isMe ? galleryPhotos : (profile.gallery_photos ?? [])}
        isMe={isMe}
        uploading={galleryUploading}
        onAdd={isMe ? addGalleryPhotos : undefined}
        onRemove={isMe ? removeGalleryPhoto : undefined}
      />
      {isMe && galleryError && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
          {galleryError}
        </p>
      )}

      {cycle && (
        <section className="space-y-3 rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl">Môj cyklus</h2>
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
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {cycle.phase.name} · {CYCLE_PHASE_SEASON[cycle.phaseKey].season}
              </p>
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
            </>
          )}
        </section>
      )}

      <section className="grid grid-cols-3 gap-3">
        <StatTile label="Tento mesiac" value={formatKm(stats?.month_km ?? 0)} />
        <StatTile
          label={`${pluralActivities((stats?.month_runs ?? 0) + (stats?.month_workouts ?? 0))} tento mesiac`}
          value={String((stats?.month_runs ?? 0) + (stats?.month_workouts ?? 0))}
        />
        <MonthFeelingsTile profileId={profile?.id} />
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl">Achievements</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(achievements ?? []).map((a) => {
            const unlocked = earned.some((e) => e.id === a.id);
            return (
              <li
                key={a.id}
                className={cn(
                  "rounded-lg border p-4 text-center",
                  unlocked ? "border-primary/60 bg-card" : "border-dashed border-border bg-card/50 opacity-60",
                )}
              >
                <p className="font-display text-lg leading-tight">{a.title}</p>
                {a.description && <p className="mt-1 text-xs text-muted-foreground">{a.description}</p>}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl">{isMe ? "Moja história" : "Aktivity"}</h2>
        <Tabs value={kind} onValueChange={(v) => setKind(v as typeof kind)}>
          <TabsList>
            <TabsTrigger value="all">Všetko</TabsTrigger>
            <TabsTrigger value="run">Run</TabsTrigger>
            <TabsTrigger value="move">Move</TabsTrigger>
          </TabsList>
          <TabsContent value={kind} className="mt-4 space-y-4">
            {activities.isLoading && <Skeleton className="h-40 w-full" />}
            {activities.data?.length === 0 && (
              <EmptyState title="Zatiaľ žiadne aktivity" description="Prvý zápis je vždy najkrajší." />
            )}
            {activities.data?.map((a) => (
              <ActivityCard key={a.id} activity={a} interactive />
            ))}
          </TabsContent>
        </Tabs>
      </section>

      {isMe && (
        <section ref={editRef} className="space-y-4 border-t border-border pt-8">
          {editingProfile ? (
            <>
              <div className="flex items-center justify-end">
                <Button variant="outline" size="sm" onClick={() => setEditingProfile(false)}>
                  Zrušiť
                </Button>
              </div>
              <ProfileSettings
                focusChapter={focusChapter}
                onSaved={() => {
                  setEditingProfile(false);
                  navigate("/community");
                }}
              />
            </>
          ) : (
            <Button className="w-full" onClick={() => { setEditingProfile(true); setFocusChapter(false); }}>
              Upraviť profil
            </Button>
          )}
        </section>
      )}
    </div>
  );
}
