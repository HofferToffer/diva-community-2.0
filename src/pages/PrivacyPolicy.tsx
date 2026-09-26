import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/lib/lang";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="space-y-3 font-body text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function SkContent() {
  return (
    <>
      <Section title="1. Kto sme">
        <p>
          Prevádzkovateľom stránky DIVA Community (divacommunity.sk) a komunitnej aplikácie je Tomáš Hofbauer,
          IČO 50976869, A. Nográdyho 716/31, 960 01 Zvolen, Slovenská republika („my", „nás").
        </p>
        <p>
          Vo veciach ochrany osobných údajov nás kontaktuj na{" "}
          <a href="mailto:didka0105@gmail.com" className="underline hover:text-foreground">
            didka0105@gmail.com
          </a>
          .
        </p>
      </Section>

      <Section title="2. Aké údaje spracúvame">
        <p>
          <strong className="text-foreground">Bežné osobné údaje</strong> — meno, prezývka, e-mail, mesto (a
          približná poloha mesta, ak si ju vyplníš alebo ju vyhľadáš cez pole „Mesto"), profilová fotka, texty,
          ktoré o sebe napíšeš (bio, dary/talenty), záujmy, aktivity (pohyb — typ, vzdialenosť, trvanie),
          komentáre, správy a podpory (srdiečka) v komunite.
        </p>
        <p>
          <strong className="text-foreground">Osobitná kategória údajov — zdravotné údaje</strong> (čl. 9 GDPR):
          ak sa pre to rozhodneš, môžeš nám dobrovoľne poskytnúť dátum narodenia, dĺžku menštruačného cyklu,
          dátum poslednej menštruácie, informácie o tehotenstve a predpokladanom termíne pôrodu, o šestonedelí, o
          menopauze alebo o tom, že sa snažíš otehotnieť. Tieto polia sú vždy nepovinné a slúžia výlučne na to,
          aby ti appka vedela ukázať relevantný obsah (napr. aktuálnu fázu cyklu, tipy, citáty) — nikdy ich
          nezdieľame s inými používateľkami bez tvojho výslovného súhlasu (pozri „Životná kapitola" nižšie).
        </p>
        <p>
          <strong className="text-foreground">Platobné údaje</strong> — pri nákupe v e-shope spracúva platobné
          údaje priamo Stripe, my k číslu tvojej karty nemáme prístup.
        </p>
      </Section>

      <Section title="3. Prečo tieto údaje spracúvame">
        <ul className="list-disc space-y-1 pl-5">
          <li>aby appka fungovala — vytvorenie a správa konta, prihlásenie, zobrazenie tvojho profilu;</li>
          <li>
            aby sme ti ukázali obsah šitý na tvoju životnú kapitolu — fázu cyklu, tehotenstvo, šestonedelie
            alebo menopauzu (citáty, tipy, kalendár);
          </li>
          <li>aby si sa mohla spojiť s ostatnými Divami — vyhľadávanie podľa mesta, správy, komentáre;</li>
          <li>
            aby fungovala Mapa Divy — ak vyplníš mesto, zobrazí sa na mape ako približná poloha (nikdy nie
            presná adresa);
          </li>
          <li>na spracovanie objednávok v e-shope;</li>
          <li>na zasielanie notifikácií, o ktoré si si v appke požiadala (napr. na nové srdiečka, komentáre).</li>
        </ul>
      </Section>

      <Section title="4. Právny základ spracúvania">
        <p>
          Bežné osobné údaje spracúvame na základe tvojho súhlasu pri registrácii (čl. 6 ods. 1 písm. a GDPR)
          alebo plnenia zmluvy pri nákupe (čl. 6 ods. 1 písm. b GDPR). Zdravotné údaje spracúvame výlučne na
          základe tvojho výslovného súhlasu (čl. 9 ods. 2 písm. a GDPR) — bez neho tieto polia jednoducho
          nevyplníš a appka bude fungovať aj tak, len bez personalizovaného obsahu pre danú kapitolu.
        </p>
      </Section>

      <Section title="5. Životná kapitola a mapa — čo vidia ostatné">
        <p>
          Tvoje meno, prezývka, profilová fotka, bio, mesto a záujmy sú viditeľné ostatným Divám, ak máš profil
          nastavený ako verejný (dá sa to kedykoľvek vypnúť v Nastaveniach). Tvoja aktuálna „životná kapitola"
          (napr. že si tehotná alebo v menopauze) sa nikdy nezobrazuje ostatným, pokiaľ si v Nastaveniach
          výslovne nezapneš prepínač „Zobrazovať moju kapitolu ostatným Divám".
        </p>
      </Section>

      <Section title="6. Komu údaje poskytujeme">
        <p>Tvoje údaje spracúvajú v našom mene tieto tretie strany (sprostredkovatelia):</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-foreground">Supabase</strong> — databáza, autentifikácia a serverová
            infraštruktúra appky;
          </li>
          <li>
            <strong className="text-foreground">Stripe</strong> — spracovanie platieb v e-shope;
          </li>
          <li>
            <strong className="text-foreground">Komoot (Photon) / OpenStreetMap</strong> — keď vyplníš mesto,
            pošle sa jeho názov (nie tvoje meno ani iné údaje) tejto službe, aby vrátila súradnice mesta pre
            mapu a zoznam Divy.
          </li>
        </ul>
        <p>Tvoje údaje nikdy nepredávame a nezdieľame na reklamné účely.</p>
      </Section>

      <Section title="7. Ako dlho údaje uchovávame">
        <p>
          Tvoje údaje uchovávame, kým máš aktívne konto. Ak konto vymažeš (Nastavenia → Vymazať účet), tvoj
          profil a osobné údaje sa natrvalo odstránia; údaje z účtovných/daňových dokladov k prípadným
          objednávkam uchovávame po dobu vyžadovanú zákonom.
        </p>
      </Section>

      <Section title="8. Tvoje práva">
        <p>Podľa GDPR máš právo:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>na prístup k svojim údajom a na ich kópiu — priamo v appke (Nastavenia → Stiahnuť moje dáta);</li>
          <li>na opravu nesprávnych údajov — priamo v Nastaveniach profilu;</li>
          <li>na vymazanie („právo na zabudnutie") — priamo v appke (Nastavenia → Vymazať účet);</li>
          <li>na obmedzenie spracúvania a na namietanie voči spracúvaniu;</li>
          <li>na prenosnosť údajov;</li>
          <li>kedykoľvek odvolať súhlas, bez toho aby to malo vplyv na zákonnosť spracúvania pred odvolaním;</li>
          <li>
            podať sťažnosť na Úrad na ochranu osobných údajov Slovenskej republiky (dataprotection.gov.sk).
          </li>
        </ul>
        <p>
          Kedykoľvek nás môžeš kontaktovať na{" "}
          <a href="mailto:didka0105@gmail.com" className="underline hover:text-foreground">
            didka0105@gmail.com
          </a>
          .
        </p>
      </Section>

      <Section title="9. Zabezpečenie">
        <p>
          Prístup k tvojim údajom je obmedzený pravidlami na úrovni databázy (row-level security) — tvoje
          zdravotné údaje vidíš len ty, nikdy iná používateľka ani administrátorka appky bez tvojho súhlasu.
          Komunikácia medzi tvojím zariadením a serverom je šifrovaná (HTTPS).
        </p>
      </Section>

      <Section title="10. Vek">
        <p>Appka nie je určená osobám mladším ako 16 rokov.</p>
      </Section>

      <Section title="11. Zmeny týchto zásad">
        <p>
          Tieto zásady môžeme priebežne aktualizovať. O podstatných zmenách ťa budeme informovať v appke.
          Aktuálny dátum platnosti nájdeš vždy v hornej časti tejto stránky.
        </p>
      </Section>
    </>
  );
}

function EnContent() {
  return (
    <>
      <Section title="1. Who we are">
        <p>
          DIVA Community (divacommunity.sk) and the community app are run by Tomáš Hofbauer, Company ID (IČO)
          50976869, A. Nográdyho 716/31, 960 01 Zvolen, Slovak Republic ("we", "us").
        </p>
        <p>
          For anything to do with your personal data, reach us at{" "}
          <a href="mailto:didka0105@gmail.com" className="underline hover:text-foreground">
          didka0105@gmail.com
        </a>
          .
        </p>
      </Section>

      <Section title="2. What data we process">
        <p>
          <strong className="text-foreground">Regular personal data</strong> — your name, nickname, email, city (and
          the approximate location of that city, if you fill it in or look it up in the "City" field), profile
          photo, what you write about yourself (bio, gifts/talents), interests, activities (movement — type,
          distance, duration), comments, messages and support (hearts) in the community.
        </p>
        <p>
          <strong className="text-foreground">Special category data — health data</strong> (Art. 9 GDPR): if you
          choose to, you can voluntarily give us your date of birth, cycle length, the date of your last period,
          information about pregnancy and your due date, the postpartum period, menopause, or the fact that you're
          trying to conceive. These fields are always optional and are used only so the app can show you relevant
          content (e.g. your current cycle phase, tips, quotes). We never share them with other users without your
          explicit consent (see "Life chapter" below).
        </p>
        <p>
          <strong className="text-foreground">Payment data</strong> — when you buy from the shop, your payment
          details are processed directly by Stripe. We never have access to your card number.
        </p>
      </Section>

      <Section title="3. Why we process this data">
        <ul className="list-disc space-y-1 pl-5">
          <li>so the app works — creating and managing your account, logging in, showing your profile;</li>
          <li>
            so we can show you content made for your life chapter — your cycle phase, pregnancy, the postpartum
            period or menopause (quotes, tips, calendar);
          </li>
          <li>so you can connect with other Divas — searching by city, messages, comments;</li>
          <li>
            so the Diva map works — if you fill in your city, it shows on the map as an approximate location (never
            an exact address);
          </li>
          <li>to process orders from the shop;</li>
          <li>to send you the notifications you asked for in the app (e.g. new hearts or comments).</li>
        </ul>
      </Section>

      <Section title="4. Legal basis">
        <p>
          We process regular personal data based on the consent you give when you sign up (Art. 6(1)(a) GDPR), or
          to fulfil a contract when you buy something (Art. 6(1)(b) GDPR). We process health data only with your
          explicit consent (Art. 9(2)(a) GDPR). Without it, you simply leave those fields empty, and the app still
          works, just without the personalised content for that chapter.
        </p>
      </Section>

      <Section title="5. Life chapter and the map — what others can see">
        <p>
          Your name, nickname, profile photo, bio, city and interests are visible to other Divas if your profile is
          set to public (you can switch this off any time in Settings). Your current "life chapter" (e.g. that
          you're pregnant or in menopause) is never shown to others unless you explicitly turn on "Show my chapter
          to other Divas" in Settings.
        </p>
      </Section>

      <Section title="6. Who we share data with">
        <p>These third parties process your data on our behalf (processors):</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-foreground">Supabase</strong> — the app's database, authentication and server
            infrastructure;
          </li>
          <li>
            <strong className="text-foreground">Stripe</strong> — payment processing for the shop;
          </li>
          <li>
            <strong className="text-foreground">Komoot (Photon) / OpenStreetMap</strong> — when you fill in your
            city, its name (not your name or any other data) is sent to this service so it can return the city's
            coordinates for the map and the Divas directory.
          </li>
        </ul>
        <p>We never sell your data or share it for advertising.</p>
      </Section>

      <Section title="7. How long we keep data">
        <p>
          We keep your data for as long as your account is active. If you delete your account (Settings → Delete
          account), your profile and personal data are permanently removed. Accounting and tax records for any
          orders are kept for as long as the law requires.
        </p>
      </Section>

      <Section title="8. Your rights">
        <p>Under GDPR, you have the right:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>to access your data and get a copy of it — right in the app (Settings → Download my data);</li>
          <li>to correct inaccurate data — right in your profile Settings;</li>
          <li>to erasure (the "right to be forgotten") — right in the app (Settings → Delete account);</li>
          <li>to restrict processing and to object to processing;</li>
          <li>to data portability;</li>
          <li>to withdraw your consent at any time, without affecting the lawfulness of processing before that;</li>
          <li>
            to lodge a complaint with the Office for Personal Data Protection of the Slovak Republic
            (dataprotection.gov.sk).
          </li>
        </ul>
        <p>
          You can contact us any time at{" "}
          <a href="mailto:didka0105@gmail.com" className="underline hover:text-foreground">
          didka0105@gmail.com
        </a>
          .
        </p>
      </Section>

      <Section title="9. Security">
        <p>
          Access to your data is restricted by database-level rules (row-level security). Your health data is
          visible only to you, never to another user or an app admin without your consent. Communication between
          your device and the server is encrypted (HTTPS).
        </p>
      </Section>

      <Section title="10. Age">
        <p>The app isn't meant for anyone under 16.</p>
      </Section>

      <Section title="11. Changes to this policy">
        <p>
          We may update this policy from time to time. We'll let you know about any significant changes in the app.
          You'll always find the current effective date at the top of this page.
        </p>
      </Section>
    </>
  );
}

export default function PrivacyPolicy() {
  const { l, lang } = useLang();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 py-16 md:px-12 lg:px-0">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          {l("Späť na hlavnú", "Back to home")}
        </Link>

        <h1 className="mt-8 font-display text-4xl md:text-5xl">{l("Zásady ochrany osobných údajov", "Privacy Policy")}</h1>
        <p className="mt-3 font-body text-xs uppercase tracking-[0.15em] text-muted-foreground">
          {l("Platné od 22. septembra 2026", "Effective from 22 September 2026")}
        </p>
        {lang === "en" && (
          <p className="mt-6 rounded-2xl bg-secondary/30 px-5 py-4 font-body text-sm leading-relaxed text-muted-foreground">
            This is an English translation to make things easier for you. If anything is ever unclear, the Slovak
            version is the legally binding one.
          </p>
        )}

        <div className="mt-12 space-y-10">
          {lang === "en" ? <EnContent /> : <SkContent />}
        </div>
      </div>

      <Footer />
    </div>
  );
}
