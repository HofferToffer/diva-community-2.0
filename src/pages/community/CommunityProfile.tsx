import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
import { getCycleInfo, formatCycleDate } from "@/community/lib/cycle";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ImageCropDialog } from "@/community/components/ImageCropDialog";
import { validateImage, uploadImage } from "@/community/lib/storage";

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
  const { username } = useParams<{ username: string }>();
  const { profile: me, refreshProfile, user } = useCommunityAuth();
  const other = useProfileByUsername(username);
  const profile = username ? (other.data as typeof me | null) : me;
  const isMe = !username || profile?.id === me?.id;

  const { data: stats } = useProfileStats(profile?.id);
  const [kind, setKind] = useState<"all" | "run" | "move">("all");
  const [editingProfile, setEditingProfile] = useState(false);
  const editRef = useRef<HTMLDivElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const friends = useFriends(me?.id);
  const toggleFriend = useToggleFriend(me?.id);
  const activities = useProfileActivities(profile?.id, kind === "all" ? undefined : kind);
  const { data: achievements } = useAchievements();

  useEffect(() => {
    if (editingProfile && editRef.current) {
      editRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [editingProfile]);

  const [editingCycle, setEditingCycle] = useState(false);
  const [cycleLengthEdit, setCycleLengthEdit] = useState(String(profile?.cycle_length_days ?? 28));
  const [lastPeriodEdit, setLastPeriodEdit] = useState(profile?.last_period_date ?? "");
  const [savingCycle, setSavingCycle] = useState(false);

  const [cropImage, setCropImage] = useState<string | null>(null);
  const [avatarPath, setAvatarPath] = useState<string | null>(profile?.avatar_url ?? null);

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

  const cycle = isMe && profile.last_period_date ? getCycleInfo(profile.last_period_date, profile.cycle_length_days ?? 28) : null;

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
      <header className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-2">
          <ProfileAvatar path={displayAvatar} name={profile.name} size={80} />
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
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl leading-tight">{profile.name || "Diva"}</h1>
          {profile.username && <p className="text-sm text-muted-foreground">@{profile.username}</p>}
          {(profile.city || profile.country) && (
            <p className="mt-1 text-sm text-muted-foreground">
              {[profile.city, profile.country].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      </header>

      {!isMe && me && (
        <Button
          className="w-full"
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
      )}

      {profile.bio && <p className="text-sm leading-relaxed text-foreground/85">{profile.bio}</p>}

      {profile.gifts && (
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Moje dary</p>
          <p className="text-sm leading-relaxed text-foreground/85">{profile.gifts}</p>
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

      {cycle && (
        <section className="space-y-3 rounded-lg border border-border bg-card p-5">
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
              <p className="font-medium text-primary">{cycle.phase.name}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{cycle.phase.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border border-border p-3">
                  <p className="text-xs text-muted-foreground">Ďalšia menštruácia</p>
                  <p className="mt-1 font-medium">
                    {formatCycleDate(cycle.nextPeriodDate)}
                    <span className="ml-1 text-xs text-muted-foreground">(o {cycle.daysUntilNextPeriod} dní)</span>
                  </p>
                </div>
                <div className="rounded-md border border-border p-3">
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
              <ProfileSettings onSaved={() => setEditingProfile(false)} />
            </>
          ) : (
            <Button className="w-full" onClick={() => setEditingProfile(true)}>
              Upraviť profil
            </Button>
          )}
        </section>
      )}
    </div>
  );
}
