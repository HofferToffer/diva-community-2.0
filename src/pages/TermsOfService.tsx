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
    </>
  );
}

function EnContent() {
  return (
    <>
      <Section title="1. About the app">
        <p>
          DIVA Community (the "app") is a community app for women run by Tomáš Hofbauer, Company ID (IČO) 50976869,
          A. Nográdyho 716/31, 960 01 Zvolen, Slovakia. By using the app, you agree to these terms.
        </p>
      </Section>

      <Section title="2. Signing up and your account">
        <p>
          To use the community part of the app, you need to create an account with a valid email address. You're
          responsible for the information you put in your profile. Your account is personal and can't be
          transferred.
        </p>
      </Section>

      <Section title="3. How we treat each other in the community">
        <p>DIVA Community is a safe space for women. In the app, it's not allowed to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>harass, belittle or otherwise hurt other Divas;</li>
          <li>share false, offensive or hateful content;</li>
          <li>misuse other people's personal data or pretend to be someone else;</li>
          <li>promote goods, services or content unrelated to the community's mission without our consent.</li>
        </ul>
        <p>If these rules are broken, we reserve the right to remove the post, or to restrict or close the account.</p>
      </Section>

      <Section title="4. What you share">
        <p>
          You're responsible for the content (texts, photos, comments) you share in the app. Please don't share
          anything you don't have the rights to, or that violates the rights of others.
        </p>
      </Section>

      <Section title="5. Health information in the app">
        <p>
          The app's content (tips and information about the cycle, pregnancy, the postpartum period or menopause)
          is there to inform and support you. It doesn't replace professional medical care. For anything health
          related, always talk to your doctor.
        </p>
      </Section>

      <Section title="6. Shop">
        <p>
          Purchases from the shop are governed by the consumer protection laws of the Slovak Republic, including the
          right to withdraw from the contract within 14 days of receiving the goods, unless the law provides
          otherwise.
        </p>
      </Section>

      <Section title="7. Closing your account">
        <p>
          You can close your account any time in your profile Settings. We reserve the right to close or restrict
          an account that repeatedly breaks these terms.
        </p>
      </Section>

      <Section title="8. Changes to these terms">
        <p>We may update these terms from time to time. We'll let you know about any significant changes in the app.</p>
      </Section>

      <Section title="9. Contact">
        <p>
          Questions about these terms? Write to us at{" "}
          <a href="mailto:didka0105@gmail.com" className="underline hover:text-foreground">
          didka0105@gmail.com
        </a>
          .
        </p>
      </Section>
    </>
  );
}

export default function TermsOfService() {
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

        <h1 className="mt-8 font-display text-4xl md:text-5xl">{l("Podmienky používania", "Terms of Use")}</h1>
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
