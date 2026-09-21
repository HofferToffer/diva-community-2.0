import { useState } from "react";
import { ArrowLeft } from "lucide-react";
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
import { uploadImage, validateImage } from "@/community/lib/storage";
import { ProfileAvatar } from "@/community/components/StoredImage";
import { ImageCropDialog } from "@/community/components/ImageCropDialog";
import { cn } from "@/lib/utils";

export default function CommunityOnboarding() {
  const { profile, user, refreshProfile } = useCommunityAuth();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile?.name || (user?.user_metadata?.name as string) || "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [gifts, setGifts] = useState(profile?.gifts ?? "");
  const [city, setCity] = useState(profile?.city ?? "");
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? []);
  const [isPublic, setIsPublic] = useState(profile?.is_public ?? true);
  const [cycleLength, setCycleLength] = useState(profile?.cycle_length_days ? String(profile.cycle_length_days) : "");
  const [lastPeriod, setLastPeriod] = useState(profile?.last_period_date ?? "");
  const [avatarPath, setAvatarPath] = useState<string | null>(profile?.avatar_url ?? null);
  const [saving, setSaving] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);

  const returnToSignIn = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error("Návrat na prihlásenie sa nepodaril. Skús to prosím znova.");
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
      toast.error("Fotku sa nepodarilo nahrať.");
    } finally {
      closeCrop();
    }
  };

  const finish = async () => {
    if (!profile) return;
    const cleanUsername = normalizeUsername(username);
    if (!name.trim()) return toast.error("Zadaj prosím svoje meno.");
    if (cleanUsername.length < 3) return toast.error("Prezývka musí mať aspoň 3 znaky.");
    setSaving(true);
    try {
      const { data: available, error: checkError } = await supabase.rpc("is_username_available", {
        _username: cleanUsername,
      });
      if (checkError) throw checkError;
      if (!available && cleanUsername !== profile.username) {
        setSaving(false);
        return toast.error("Táto prezývka je už obsadená.");
      }
      const { error } = await supabase
        .from("profiles")
        .update({
          name: name.trim(),
          username: cleanUsername,
          bio: bio.trim() || null,
          gifts: gifts.trim() || null,
          city: city.trim() || null,
          interests,
          is_public: isPublic,
          avatar_url: avatarPath,
          cycle_length_days: cycleLength ? Math.min(Math.max(parseInt(cycleLength, 10) || 28, 21), 40) : null,
          last_period_date: lastPeriod || null,
          onboarding_completed: true,
        } as never)
        .eq("id", profile.id);
      if (error) throw error;
      refreshProfile();
      toast.success("Vitaj v komunite.");
    } catch {
      toast.error("Profil sa nepodarilo uložiť.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-md px-5 py-12">
      {step === 0 && (
        <Button variant="ghost" className="mb-5 -ml-3 gap-2" onClick={returnToSignIn}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Späť na prihlásenie
        </Button>
      )}
      <p className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
        Krok {step + 1} zo 4
      </p>

      {step === 0 && (
        <section className="mt-4 space-y-6">
          <h1 className="font-display text-3xl">Povedz nám, kto si</h1>
          <div className="flex items-center gap-4">
            <ProfileAvatar path={avatarPath} name={name || "Diva"} size={72} />
            <div>
              <Label htmlFor="avatar" className="cursor-pointer underline">
                Nahrať fotku
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
                title="Uprav si profilovú fotku"
                onCancel={closeCrop}
                onConfirm={handleAvatar}
              />
              <p className="mt-1 text-xs text-muted-foreground">Nepovinné, môžeš pridať kedykoľvek.</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="onb-name">Meno</Label>
            <Input id="onb-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="onb-username">Prezývka</Label>
            <Input
              id="onb-username"
              value={username}
              onChange={(e) => setUsername(normalizeUsername(e.target.value))}
              placeholder="napr. diva.michaela"
            />
            <p className="text-xs text-muted-foreground">Tvoja adresa: /community/divy/{username || "prezyvka"}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="onb-city">Mesto</Label>
            <Input id="onb-city" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <Button className="w-full" onClick={() => setStep(1)} disabled={!name.trim() || username.length < 3}>
            Pokračovať
          </Button>
        </section>
      )}

      {step === 1 && (
        <section className="mt-4 space-y-6">
          <h1 className="font-display text-3xl">Ako sa hýbeš?</h1>
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
            <Label htmlFor="onb-bio">Pár slov o tebe</Label>
            <Textarea id="onb-bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} maxLength={300} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="onb-gifts">Moje dary</Label>
            <p className="text-xs text-muted-foreground">
              Čo môžeš priniesť do komunity? Napr. kaderníčka, maliarka, strih videí, fotografka, jogínka, koučka, masérka...
            </p>
            <Textarea
              id="onb-gifts"
              value={gifts}
              onChange={(e) => setGifts(e.target.value)}
              rows={3}
              maxLength={300}
              placeholder="Čo môžeš priniesť do komunity?"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep(0)}>
              Späť
            </Button>
            <Button className="flex-1" onClick={() => setStep(2)}>
              Pokračovať
            </Button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="mt-4 space-y-6">
          <h1 className="font-display text-3xl">Tvoj cyklus</h1>
          <p className="text-sm text-muted-foreground">
            Nepovinné. Ak nám povieš dĺžku svojho cyklu a dátum poslednej menštruácie, v profile ti ukážeme, v ktorej
            fáze sa práve nachádzaš a kedy príde ďalšia.
          </p>
          <div className="space-y-2">
            <Label htmlFor="onb-cycle-length">Dĺžka cyklu v dňoch</Label>
            <Input
              id="onb-cycle-length"
              type="number"
              inputMode="numeric"
              min={21}
              max={40}
              placeholder="napr. 28"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Zvyčajne 21 až 40 dní, najčastejšie 28.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="onb-last-period">Prvý deň poslednej menštruácie</Label>
            <Input
              id="onb-last-period"
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Tieto údaje vidíš len ty. Vyplniť ich môžeš aj neskôr v Nastaveniach.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
              Späť
            </Button>
            <Button className="flex-1" onClick={() => setStep(3)}>
              Pokračovať
            </Button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="mt-4 space-y-6">
          <h1 className="font-display text-3xl">Tvoje súkromie</h1>
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
            <div>
              <p className="font-medium">Verejný profil</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ostatné divy uvidia tvoj profil a aktivity, ktoré zdieľaš s komunitou.
              </p>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} aria-label="Verejný profil" />
          </div>
          <p className="text-sm text-muted-foreground">
            Pri každej aktivite si vyberáš, či ju vidí celá komunita alebo len ty. Nastavenia môžeš kedykoľvek zmeniť.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
              Späť
            </Button>
            <Button className="flex-1" onClick={finish} disabled={saving}>
              Vstúpiť do komunity
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
