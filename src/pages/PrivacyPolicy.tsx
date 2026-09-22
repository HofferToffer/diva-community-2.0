import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="space-y-3 font-body text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 py-16 md:px-12 lg:px-0">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Späť na hlavnú
        </Link>

        <h1 className="mt-8 font-display text-4xl md:text-5xl">Zásady ochrany osobných údajov</h1>
        <p className="mt-3 font-body text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Platné od 22. septembra 2026
        </p>

        <div className="mt-12 space-y-10">
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
        </div>
      </div>

      <Footer />
    </div>
  );
}
