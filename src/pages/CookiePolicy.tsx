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

export default function CookiePolicy() {
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

        <h1 className="mt-8 font-display text-4xl md:text-5xl">Zásady používania cookies</h1>
        <p className="mt-3 font-body text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Platné od 22. septembra 2026
        </p>

        <div className="mt-12 space-y-10">
          <Section title="Čo sú cookies">
            <p>
              Cookies sú malé textové súbory, ktoré si webová stránka ukladá v tvojom prehliadači. Táto stránka
              nepoužíva žiadne reklamné ani analytické cookies (napr. Google Analytics) — nesledujeme ťa naprieč
              webom ani ti nezobrazujeme cielenú reklamu.
            </p>
          </Section>

          <Section title="Čo v skutočnosti používame">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-foreground">Prihlásenie do appky</strong> — na udržanie tvojho prihlásenia
                používame technológiu localStorage (nie klasický cookie), ktorá funguje len v tvojom prehliadači a
                slúži výlučne na to, aby si sa pri návrate do appky nemusela znova prihlasovať.
              </li>
              <li>
                <strong className="text-foreground">Stripe</strong> — pri platbe v e-shope nastavuje spoločnosť
                Stripe vlastné, nevyhnutné cookies potrebné na bezpečné spracovanie platby a ochranu pred podvodmi.
                Bez nich platba nemôže prebehnúť. Viac v{" "}
                <a
                  href="https://stripe.com/cookies-policy/legal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  zásadách cookies spoločnosti Stripe
                </a>
                .
              </li>
              <li>
                <strong className="text-foreground">Google Fonts</strong> — písma na stránke načítavame z Google
                Fonts, čo znamená, že tvoja IP adresa sa pri návšteve stránky odošle Googlu (bez cookies, bez
                sledovania).
              </li>
            </ul>
          </Section>

          <Section title="Ako môžeš cookies spravovať">
            <p>
              Nevyhnutné cookies (napr. od Stripe pri platbe) nie je možné odmietnuť bez toho, aby prestala
              fungovať daná funkcia (platba). Všetky cookies vieš kedykoľvek zmazať alebo zablokovať v nastaveniach
              svojho prehliadača — appka bude aj tak fungovať, len sa budeš musieť znova prihlásiť.
            </p>
          </Section>

          <Section title="Kontakt">
            <p>
              Otázky k používaniu cookies nám môžeš poslať na{" "}
              <a href="mailto:didka0105@gmail.com" className="underline hover:text-foreground">
                didka0105@gmail.com
              </a>
              . Viac o spracúvaní osobných údajov nájdeš v{" "}
              <Link to="/zasady-ochrany-udajov" className="underline hover:text-foreground">
                Zásadách ochrany osobných údajov
              </Link>
              .
            </p>
          </Section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
