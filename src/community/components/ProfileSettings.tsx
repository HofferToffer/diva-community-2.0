import { useEffect, useRef, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity, Bell, Footprints, KeyRound, Palette, Sparkles, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";
import { MOVEMENT_INTERESTS } from "@/community/lib/constants";
import { normalizeUsername } from "@/community/lib/format";
import { cn } from "@/lib/utils";

export function ProfileSettings({ onSaved, focusChapter }: { onSaved?: () => void; focusChapter?: boolean }) {
  const { profile, refreshProfile, signOut } = useCommunityAuth();
  const chapterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusChapter && chapterRef.current) {
      chapterRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [focusChapter]);
  const [name, setName] = useState(profile?.name ?? "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [gifts, setGifts] = useState(profile?.gifts ?? "");
  const [city, setCity] = useState(profile?.city ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(profile?.date_of_birth ?? "");
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? []);
  const [isPublic, setIsPublic] = useState(profile?.is_public ?? true);
  const [cycleLength, setCycleLength] = useState(profile?.cycle_length_days ? String(profile.cycle_length_days) : "");
  const [lastPeriod, setLastPeriod] = useState(profile?.last_period_date ?? "");
  const [isPregnant, setIsPregnant] = useState(profile?.is_pregnant ?? false);
  const [isMenopause, setIsMenopause] = useState(profile?.is_menopause ?? false);
  const [isPostpartum, setIsPostpartum] = useState(profile?.is_postpartum ?? false);
  const [postpartumSince, setPostpartumSince] = useState(profile?.postpartum_since ?? "");
  const [isTryingToConceive, setIsTryingToConceive] = useState(profile?.is_trying_to_conceive ?? false);
  const [notifyLikes, setNotifyLikes] = useState(profile?.notify_likes ?? true);
  const [notifyComments, setNotifyComments] = useState(profile?.notify_comments ?? true);
  const [notifyChallenges, setNotifyChallenges] = useState(profile?.notify_challenges ?? true);
  const [dynamicTheme, setDynamicTheme] = useState(profile?.dynamic_theme ?? true);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    if (error || !data?.url) return toast.error("Strava zatiaľ nie je nastavená.");
    window.location.href = data.url;
  };

  const disconnectStrava = async () => {
    if (!stravaConnection) return;
    const { error } = await supabase.from("strava_connections").delete().eq("id", stravaConnection.id);
    if (error) return toast.error("Odpojenie sa nepodarilo.");
    queryClient.invalidateQueries({ queryKey: ["strava-connection"] });
    toast.success("Strava je odpojená.");
  };

  const save = async () => {
    if (!profile) return;
    const cleanUsername = normalizeUsername(username);
    if (cleanUsername.length < 3) return toast.error("Prezývka musí mať aspoň 3 znaky.");
    setSaving(true);
    try {
      if (cleanUsername !== profile.username) {
        const { data: available } = await supabase.rpc("is_username_available", { _username: cleanUsername });
        if (!available) {
          setSaving(false);
          return toast.error("Táto prezývka je už obsadená.");
        }
      }
      const { error } = await supabase
        .from("profiles")
        .update({
          name: name.trim(),
          username: cleanUsername,
          bio: bio.trim() || null,
          gifts: gifts.trim() || null,
          city: city.trim() || null,
          date_of_birth: dateOfBirth || null,
          interests,
          is_public: isPublic,
          notify_likes: notifyLikes,
          notify_comments: notifyComments,
          notify_challenges: notifyChallenges,
          dynamic_theme: dynamicTheme,
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
      toast.success("Zmeny sú uložené.");
      onSaved?.();
    } catch {
      toast.error("Nastavenia sa nepodarilo uložiť.");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (newPassword.length < 8) return toast.error("Nové heslo musí mať aspoň 8 znakov.");
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
      current_password: currentPassword,
    });
    if (error) {
      toast.error("Heslo sa nepodarilo zmeniť. Skontroluj súčasné heslo.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    toast.success("Heslo je zmenené.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl">Upraviť profil</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tieto zmeny uložíš jedným tlačidlom nižšie. Strava, heslo a odhlásenie sa riešia samostatne.
        </p>
      </div>

      <SectionCard icon={User} title="Základné údaje">
        <div className="space-y-2">
          <Label htmlFor="s-name">Meno</Label>
          <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="s-username">Prezývka</Label>
          <Input id="s-username" value={username} onChange={(e) => setUsername(normalizeUsername(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="s-city">Mesto</Label>
          <Input id="s-city" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="s-dob">Dátum narodenia (nepovinné)</Label>
          <Input
            id="s-dob"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Podľa toho ti tu v profile ukážeme tvoj životný archetyp. Vidíš to len ty.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="s-bio">O mne</Label>
          <Textarea id="s-bio" rows={4} maxLength={300} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="s-gifts">Moje dary</Label>
          <p className="text-xs text-muted-foreground">
            Čo môžeš priniesť do komunity? Napr. kaderníčka, maliarka, strih videí, fotografka, jogínka, koučka, masérka...
          </p>
          <Textarea
            id="s-gifts"
            rows={3}
            maxLength={300}
            placeholder="Čo môžeš priniesť do komunity?"
            value={gifts}
            onChange={(e) => setGifts(e.target.value)}
          />
        </div>
      </SectionCard>

      <div ref={chapterRef}>
      <SectionCard
        icon={Sparkles}
        title="Moja životná kapitola"
        description="Vyber si, kde práve si — podľa toho ti prispôsobíme citáty, kalendár aj tipy na Domove. Vidíš to len ty."
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="s-is-trying" className="text-sm">Cesta k bábätku</Label>
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
            <Label htmlFor="s-is-pregnant" className="text-sm">Moje tehotenstvo</Label>
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
            <Label htmlFor="s-is-postpartum" className="text-sm">Šestonedelie / Obnova</Label>
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
            <Label htmlFor="s-is-menopause" className="text-sm">Moja menopauza</Label>
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
            <Label htmlFor="s-postpartum-since">Dátum pôrodu</Label>
            <Input
              id="s-postpartum-since"
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              value={postpartumSince}
              onChange={(e) => setPostpartumSince(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Šestonedelie sa síce podľa mena končí po šiestich týždňoch, ale vieme, že to zvyčajne trvá dlhšie —
              táto sekcia zostáva, kým si ju sama nevypneš.
            </p>
          </div>
        )}
        {isMenopause && (
          <div className="space-y-2 border-t border-border/50 pt-4">
            <Label htmlFor="s-last-period">Prvý deň poslednej menštruácie (nepovinné)</Label>
            <Input
              id="s-last-period"
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Nikde ti to nezobrazujeme ako odpočítavanie — necháme si to len ako tichý údaj, ktorý sa môže zísť
              napríklad na gynekológii. Vidíš ho len ty.
            </p>
          </div>
        )}
        {!isMenopause && !isPostpartum && (
          <div className="space-y-4 border-t border-border/50 pt-4">
            <div className="space-y-2">
              <Label htmlFor="s-last-period">
                {isPregnant ? "Prvý deň poslednej menštruácie" : "Prvý deň poslednej menštruácie (nepovinné)"}
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
                  ? "Podľa toho ti na Domove ukážeme, koľký týždeň tehotenstva máš a predpokladaný termín pôrodu."
                  : isTryingToConceive
                    ? "Podľa toho ti v kalendári zvýrazníme plodné dni. Tieto údaje vidíš len ty."
                    : "Podľa toho ti tu ukážeme aktuálnu fázu cyklu. Tieto údaje vidíš len ty."}
              </p>
            </div>
            {!isPregnant && (
              <div className="space-y-2">
                <Label htmlFor="s-cycle-length">Dĺžka cyklu v dňoch (nepovinné)</Label>
                <Input
                  id="s-cycle-length"
                  type="number"
                  inputMode="numeric"
                  min={21}
                  max={40}
                  placeholder="napr. 28"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(e.target.value)}
                />
              </div>
            )}
          </div>
        )}
      </SectionCard>
      </div>

      <SectionCard icon={Footprints} title="Ako sa hýbem">
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
        title="Vzhľad appky"
        description="Keď je zapnuté, farby appky sa jemne menia podľa toho, v akej fáze cyklu práve si."
      >
        <ToggleRow label="Automaticky podľa fázy cyklu" checked={dynamicTheme} onChange={setDynamicTheme} />
      </SectionCard>

      <SectionCard icon={Bell} title="Súkromie a notifikácie">
        <div className="space-y-2">
          <ToggleRow label="Verejný profil" checked={isPublic} onChange={setIsPublic} />
          <ToggleRow label="Upozornenia na podporu (srdiečka)" checked={notifyLikes} onChange={setNotifyLikes} />
          <ToggleRow label="Upozornenia na komentáre" checked={notifyComments} onChange={setNotifyComments} />
          <ToggleRow label="Upozornenia na výzvy" checked={notifyChallenges} onChange={setNotifyChallenges} />
        </div>
      </SectionCard>

      <Button className="w-full" size="lg" onClick={save} disabled={saving}>
        Uložiť zmeny
      </Button>

      <div className="border-t border-border/60 pt-8">
        <p className="mb-4 text-xs uppercase tracking-[0.15em] text-muted-foreground">Účet</p>
        <div className="space-y-6">
          <SectionCard icon={Activity} title="Strava">
            <p className="text-sm">
              {stravaConnection
                ? "Strava je prepojená. Nové aktivity sa importujú automaticky."
                : "Prepoj si Strava účet a tvoje aktivity sa budú importovať automaticky."}
            </p>
            {stravaConnection ? (
              <Button variant="outline" className="w-full" onClick={disconnectStrava}>
                Odpojiť Stravu
              </Button>
            ) : (
              <Button className="w-full" onClick={connectStrava}>
                Pripojiť Stravu
              </Button>
            )}
          </SectionCard>

          <SectionCard icon={KeyRound} title="Zmena hesla">
            <div className="space-y-2">
              <Label htmlFor="cur-pass">Súčasné heslo</Label>
              <Input
                id="cur-pass"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-pass">Nové heslo</Label>
              <Input
                id="new-pass"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <ToggleRow label="Zobraziť heslo" checked={showPassword} onChange={setShowPassword} />
            <Button variant="outline" className="w-full" onClick={changePassword}>
              Zmeniť heslo
            </Button>
          </SectionCard>

          <Button variant="outline" className="w-full" onClick={signOut}>
            Odhlásiť sa
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
