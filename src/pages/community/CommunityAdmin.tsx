import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatTile } from "@/community/components/EmptyState";
import AdminChallenges from "@/community/components/AdminChallenges";
import { useAdminMembers, useAdminSeries, useAdminStats, useIsAdmin } from "@/community/hooks/queries";
import { pluralDivy } from "@/community/lib/format";

const SK_MONTHS = ["jan", "feb", "mar", "apr", "máj", "jún", "júl", "aug", "sep", "okt", "nov", "dec"];

function formatDate(value: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getDate()}. ${SK_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function num(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function count(value: unknown) {
  const n = num(value);
  return n === null ? "—" : String(n);
}

function decimal(value: unknown, suffix = "") {
  const n = num(value);
  return n === null ? "—" : `${n.toFixed(1)}${suffix}`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl">{title}</h2>
      {children}
    </section>
  );
}

export default function CommunityAdmin() {
  const { data: isAdmin, isLoading: loadingRole } = useIsAdmin();
  const enabled = isAdmin === true;
  const { data: stats, isLoading: loadingStats, isError: statsError } = useAdminStats(enabled);
  const { data: members, isLoading: loadingMembers, isError: membersError } = useAdminMembers(enabled);
  const { data: series, isError: seriesError } = useAdminSeries(enabled, 30);

  const types = useMemo(() => {
    const raw = stats?.activity_types;
    return Array.isArray(raw) ? raw : [];
  }, [stats]);

  const maxDay = useMemo(
    () => Math.max(1, ...(series ?? []).map((d) => (num(d.activities) ?? 0) + (num(d.signups) ?? 0))),
    [series],
  );

  if (loadingRole) return <Skeleton className="h-64 w-full" />;

  if (!isAdmin) {
    return (
      <div className="space-y-4 py-10 text-center">
        <h1 className="font-display text-3xl">Táto časť je len pre administrátora</h1>
        <p className="text-sm text-muted-foreground">Ak si tu omylom, vráť sa na domovskú stránku.</p>
        <Link to="/community" className="inline-block text-sm uppercase tracking-[0.16em] underline">
          Domov
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <Link to="/community" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Domov
      </Link>

      <header className="flex items-start gap-3">
        <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div className="space-y-1">
          <h1 className="font-display text-3xl">Admin prehľad</h1>
          <p className="text-sm text-muted-foreground">Celá komunita na jednom mieste — čísla, členky a aktivita.</p>
        </div>
      </header>

      <Section title="Blog">
        <Button asChild className="w-full">
          <Link to="/community/admin/blog">Spravovať blog</Link>
        </Button>
      </Section>

      <Section title="Výzvy">
        <AdminChallenges />
      </Section>


      {loadingStats && <Skeleton className="h-40 w-full" />}

      {statsError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Súhrnné údaje sa nepodarilo načítať. Namiesto neoverených núl ich nezobrazujeme.
        </p>
      )}

      {stats && (
        <>
          <Section title="Členky">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile label="Registrované ženy" value={count(stats.members_total)} />
              <StatTile label="Nové za 7 dní" value={count(stats.members_7d)} />
              <StatTile label="Nové za 30 dní" value={count(stats.members_30d)} />
              <StatTile label="Potvrdený e-mail" value={count(stats.members_confirmed)} />
              <StatTile label="Dokončený profil" value={count(stats.profiles_onboarded)} />
              <StatTile label="Verejný profil" value={count(stats.profiles_public)} />
              <StatTile label="Profilová fotka" value={count(stats.profiles_with_avatar)} />
              <StatTile label="Zadaný cyklus" value={count(stats.profiles_with_cycle)} />
            </div>
          </Section>

          <Section title="Pohyb">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile label="Aktivity celkom" value={count(stats.activities_total)} />
              <StatTile label="Aktivity za 7 dní" value={count(stats.activities_7d)} />
              <StatTile label="Aktivity za 30 dní" value={count(stats.activities_30d)} />
              <StatTile label="Aktívne ženy za 30 dní" value={count(stats.active_members_30d)} />
              <StatTile label="Kilometre celkom" value={decimal(stats.km_total, " km")} />
              <StatTile label="Kilometre za 30 dní" value={decimal(stats.km_30d, " km")} />
              <StatTile label="Minúty pohybu celkom" value={count(stats.minutes_total)} />
              <StatTile label="Prepojené so Stravou" value={count(stats.strava_connections)} />
            </div>
          </Section>

          <Section title="Prežívanie a komunita">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile label="Pocity celkom" value={count(stats.feelings_total)} />
              <StatTile label="Pocity za 7 dní" value={count(stats.feelings_7d)} />
              <StatTile label="Podporenia" value={count(stats.likes_total)} />
              <StatTile label="Viditeľné komentáre" value={count(stats.comments_total)} />
              <StatTile label="Prebiehajúce výzvy" value={count(stats.challenges_active)} />
              <StatTile label="Ženy zapojené do výziev" value={count(stats.challenge_participants)} />
              <StatTile label="Všetky zapojenia do výziev" value={count(stats.challenge_entries)} />
              <StatTile label="Vzájomné sledovania" value={count(stats.follows_total)} />
            </div>
          </Section>

          <Section title="Eshop">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatTile label="Objednávky celkom" value={count(stats.orders_total)} />
              <StatTile label="Zaplatené objednávky" value={count(stats.orders_paid)} />
              <StatTile
                label="Zaplatený obrat"
                value={num(stats.orders_revenue_cents) === null ? "—" : `${((num(stats.orders_revenue_cents) ?? 0) / 100).toFixed(2)} €`}
              />
            </div>
          </Section>

          {types.length > 0 && (
            <Section title="Najčastejšie aktivity">
              <ul className="divide-y divide-border rounded-2xl border border-border/50 bg-card shadow-sm">
                {types.map((t) => (
                  <li key={t.activity_type} className="flex items-center justify-between px-4 py-3 text-sm">
                    <span className="capitalize">{t.activity_type.replace(/_/g, " ")}</span>
                    <span className="font-body text-muted-foreground">{count(t.count)}×</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </>
      )}

      {series && series.length > 0 && (
        <Section title="Posledných 30 dní">
          <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
            <div className="flex h-32 items-end gap-[3px]">
              {series.map((d) => {
                const total = (num(d.activities) ?? 0) + (num(d.signups) ?? 0);
                return (
                  <div
                    key={d.day}
                    title={`${formatDate(d.day)} · ${count(d.signups)} registrácií, ${count(d.activities)} aktivít, ${count(d.feelings)} pocitov`}
                    className="flex-1 rounded-t bg-secondary"
                    style={{ height: `${Math.max(4, (total / maxDay) * 100)}%` }}
                  />
                );
              })}
            </div>
            <p className="mt-3 text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
              Registrácie + aktivity za deň
            </p>
          </div>
        </Section>
      )}

      {seriesError && <p className="text-sm text-destructive">Graf posledných 30 dní sa nepodarilo načítať.</p>}

      <Section title="Zoznam registrovaných žien">
        <p className="text-sm text-muted-foreground">
          Každý riadok je jedna žena s vlastným kontom: kedy sa zaregistrovala, kedy sa naposledy prihlásila, koľko má
          zapísaných aktivít, kilometrov a pocitov. Spolu {members?.length ?? 0} {pluralDivy(members?.length ?? 0)}.
        </p>
        {loadingMembers && <Skeleton className="h-40 w-full" />}
        {membersError && <p className="text-sm text-destructive">Zoznam žien sa nepodarilo načítať.</p>}

        {members && (
          <div className="overflow-x-auto rounded-2xl border border-border/50 bg-card shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                  <th className="px-3 py-3">Meno</th>
                  <th className="px-3 py-3">E-mail</th>
                  <th className="px-3 py-3">Registrácia</th>
                  <th className="px-3 py-3">Naposledy prihlásená</th>
                  <th className="px-3 py-3 text-right">Aktivity</th>
                  <th className="px-3 py-3 text-right">Km</th>
                  <th className="px-3 py-3 text-right">Pocity</th>
                  <th className="px-3 py-3">Posledná aktivita</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.profile_id} className="border-b border-border/60 last:border-0">
                    <td className="whitespace-nowrap px-3 py-3">
                      {m.name || "—"}
                      {m.is_admin && (
                        <span className="ml-2 rounded bg-secondary px-1.5 py-0.5 text-[0.6rem] uppercase tracking-[0.12em]">
                          admin
                        </span>
                      )}
                      {!m.onboarding_completed && (
                        <span className="ml-2 text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground">
                          nedokončené
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{m.email}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{formatDate(m.registered_at)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{formatDate(m.last_sign_in_at)}</td>
                    <td className="px-3 py-3 text-right">{num(m.activities)}</td>
                    <td className="px-3 py-3 text-right">{decimal(m.km)}</td>
                    <td className="px-3 py-3 text-right">{num(m.feelings)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{formatDate(m.last_activity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  );
}
