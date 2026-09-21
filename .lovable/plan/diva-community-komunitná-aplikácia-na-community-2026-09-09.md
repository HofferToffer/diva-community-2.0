# DIVA COMMUNITY — komunitná aplikácia na /community

## Čo už na webe je (nič sa nemaže)
Existujúci web DIVA COMMUNITY: úvodná stránka, DIVA RUN, blog (9 článkov), eshop s produktmi a platbami, ReCrete, footer s údajmi prevádzkovateľa. Dizajn: olivovo-zemité tóny, Cormorant Garamond + Josefin Sans. Backend (Lovable Cloud) už je zapnutý, existuje tabuľka objednávok a e-mailové funkcie.

Komunitná aplikácia vznikne ako **nová samostatná podstránka na /community** s vlastnou navigáciou (dole na mobile). Existujúci web zostáva presne ako je — pridá sa iba odkaz do menu. Neskoršie presunutie na /app alebo subdoménu bude jednoduché, lebo všetko bude v jednom module.

Jazyk: texty slovensky, názvy sekcií anglicky (HOME, RUN, MOVE, CHALLENGES, PROFILE).
Prihlásenie: e-mail + heslo aj Google.
Vo feede budú na začiatok ukážkové členky (jasne oddelené od reálnych).

## Ako to bude vyzerať
Rovnaká DIVA estetika, ale ako premiová mobilná appka: veľa bieleho priestoru, elegantná typografia, jemné karty a tiene, mäkké animácie. Žiadne športové grafy a agresívne štatistiky.

Obrazovky:
- **Vitajte** (nepri­hlásená) — DIVA COMMUNITY, „V jemnosti je naša sila.“, registrácia / prihlásenie
- **Onboarding** — meno, prihlasovacie meno, odkiaľ si, aký pohyb máš rada → „WELCOME TO DIVA.“
- **HOME** — pozdrav podľa času dňa, aktuálna komunitná výzva s progresom, rýchle akcie, komunitný feed
- **RUN / MOVE** — pridanie behu (km, čas, typ, foto, poznámka, automatické tempo) a pohybu (typ, minúty)
- **CHALLENGES** — zoznam výziev, detail s progresom, mojím prínosom a pozitívnym poradím
- **PROFILE** — foto, bio, mesto, štatistiky (km, behy, tréningy, minúty), séria dní, história aktivít s filtrami, ocenenia
- **Nastavenia** — profil, súkromie, notifikácie, heslo, odhlásenie

## Databáza (Lovable Cloud)
Tabuľky: `profiles`, `activities`, `activity_likes`, `activity_comments`, `challenges`, `challenge_participants`, `notifications`, `achievements`, `user_achievements`, `user_roles` (admin), a pripravené `follows`, `circles`, `circle_members`, `events`, `event_participants`.

- `activities` pokrýva beh aj tréning (typ, dátum, trvanie, vzdialenosť, tempo, foto, poznámka, viditeľnosť) — jednoduché a rozšíriteľné.
- Prihlasovacie meno je unikátne; profil sa vytvorí automaticky po registrácii.
- Prísne prístupové pravidlá: každá žena vidí verejné aktivity a spravuje len svoje vlastné (aktivity, komentáre, lajky, profil). Admin rola v samostatnej tabuľke.
- Štatistiky, progres výziev a séria dní sa počítajú na strane databázy, aby bola appka rýchla.
- Úložisko: `avatars` (verejné), `activity-photos` (verejné), `challenge-images` — s kontrolou typu a veľkosti súboru.

## Postup po fázach
1. **Fáza 1** — databáza, prihlásenie (e-mail + Google), profil, onboarding, navigácia, /community
2. **Fáza 2** — HOME, feed, pridanie behu, pridanie pohybu
3. **Fáza 3** — lajky, komentáre, história aktivít
4. **Fáza 4** — výzvy, progres, poradie
5. **Fáza 5** — štatistiky, séria dní, ocenenia, notifikácie
6. **Fáza 6** — inštalácia do telefónu (PWA), rýchlosť, prístupnosť, doladenie vzhľadu

Po každej fáze si to prezriem a otestujem, až potom pokračujem ďalej.

## Technické detaily
- Nový modul `src/community/**` (routes, komponenty, hooky) + `src/pages/Community*.tsx`; existujúce súbory sa nemenia okrem pridania trás v `App.tsx` a odkazu v `Navbar.tsx`.
- Vlastný layout s `BottomNavigation` (mobil) a bočnou/hornou navigáciou na desktope; `AuthProvider` + chránené trasy.
- Dizajnové tokeny appky pridané do `index.css` ako nová sada premenných (`--diva-*`), bez zásahu do existujúcich.
- Google prihlásenie cez `lovable.auth.signInWithOAuth` + `configure_social_auth`.
- Znovupoužiteľné komponenty: Button/Card/Avatar/ActivityCard/ChallengeCard/ProgressBar/StatCard/EmptyState/Skeleton/Badge/AchievementBadge nad existujúcim shadcn základom.
- Ukážkové dáta ako seed s príznakom `is_demo`, aby sa dali kedykoľvek zmazať.
- PWA: manifest + ikony (bez offline režimu), aby appka šla pridať na plochu telefónu.
