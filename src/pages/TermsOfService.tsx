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

export default function TermsOfService() {
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

        <h1 className="mt-8 font-display text-4xl md:text-5xl">Podmienky používania</h1>
        <p className="mt-3 font-body text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Platné od 22. septembra 2026
        </p>

        <div className="mt-12 space-y-10">
          <Section title="1. O appke">
            <p>
              DIVA Community (ďalej len „appka") je komunitná aplikácia pre ženy, ktorú prevádzkuje Tomáš Hofbauer,
              IČO 50976869, A. Nográdyho 716/31, 960 01 Zvolen. Používaním appky súhlasíš s týmito podmienkami.
            </p>
          </Section>

          <Section title="2. Registrácia a konto">
            <p>
              Na používanie komunitnej časti appky je potrebné vytvoriť si konto s platnou e-mailovou adresou. Za
              údaje, ktoré do svojho profilu vložíš, zodpovedáš ty. Konto je osobné a neprenosné.
            </p>
          </Section>

          <Section title="3. Pravidlá správania sa v komunite">
            <p>DIVA Community je bezpečný priestor pre ženy. V appke je zakázané:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>obťažovať, ponižovať alebo inak ubližovať iným Divám;</li>
              <li>zdieľať nepravdivé, urážlivé alebo nenávistné obsahy;</li>
              <li>zneužívať cudzie osobné údaje alebo sa vydávať za inú osobu;</li>
              <li>propagovať tovary, služby alebo obsah nesúvisiaci s poslaním komunity bez nášho súhlasu.</li>
            </ul>
            <p>
              Pri porušení týchto pravidiel si vyhradzujeme právo príspevok odstrániť alebo konto obmedziť či
              zrušiť.
            </p>
          </Section>

          <Section title="4. Obsah, ktorý zdieľaš">
            <p>
              Za obsah (texty, fotky, komentáre), ktorý v appke zdieľaš, zodpovedáš sám(-a). Nezdieľaj obsah, na
              ktorý nemáš práva, alebo ktorý porušuje práva tretích osôb.
            </p>
          </Section>

          <Section title="5. Zdravotné informácie v appke">
            <p>
              Obsah appky (tipy, informácie o cykle, tehotenstve, šestonedelí či menopauze) má informatívny a
              podporný charakter a nenahrádza odbornú lekársku starostlivosť. V otázkach zdravia sa vždy obráť na
              svojho lekára.
            </p>
          </Section>

          <Section title="6. E-shop">
            <p>
              Nákup v e-shope sa riadi platnými právnymi predpismi Slovenskej republiky o ochrane spotrebiteľa,
              vrátane práva na odstúpenie od zmluvy do 14 dní od prevzatia tovaru, pokiaľ zákon neustanovuje inak.
            </p>
          </Section>

          <Section title="7. Zrušenie konta">
            <p>
              Svoje konto môžeš kedykoľvek zrušiť v Nastaveniach profilu. My si vyhradzujeme právo zrušiť alebo
              obmedziť konto, ktoré opakovane porušuje tieto podmienky.
            </p>
          </Section>

          <Section title="8. Zmeny podmienok">
            <p>
              Tieto podmienky môžeme priebežne aktualizovať. O podstatných zmenách ťa budeme informovať v appke.
            </p>
          </Section>

          <Section title="9. Kontakt">
            <p>
              Otázky k týmto podmienkam nám môžeš poslať na{" "}
              <a href="mailto:didka0105@gmail.com" className="underline hover:text-foreground">
                didka0105@gmail.com
              </a>
              .
            </p>
          </Section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
