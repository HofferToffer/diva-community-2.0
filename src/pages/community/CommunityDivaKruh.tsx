import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Circle, Heart, MessageCircle, Users } from "lucide-react";
import { fadeUp } from "@/community/lib/motion";

export default function CommunityDivaKruh() {
  return (
    <div className="space-y-8">
      <motion.section {...fadeUp(0)} className="relative overflow-hidden rounded-2xl border border-border/50 bg-card px-6 py-10 text-center shadow-sm">
        <div className="pointer-events-none absolute -right-10 -top-10 opacity-10">
          <Circle className="h-56 w-56 stroke-1" />
        </div>
        <div className="pointer-events-none absolute -bottom-12 -left-12 opacity-10">
          <Circle className="h-48 w-48 stroke-1" />
        </div>

        <div className="relative z-10 mx-auto">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent/40">
            <Circle className="h-8 w-8 text-accent" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl tracking-wide">DIVA KRUH</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Online priestor, kde sa ženy stretávajú, zdieľajú a navzájom podporujú.
            Bez hodnotenia, v úplnej úprimnosti, v kruhu, ktorý drží.
          </p>
        </div>
      </motion.section>

      <motion.section {...fadeUp(1)} className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border-border/50">
          <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
            <Users className="h-6 w-6 text-accent" />
            <h2 className="font-heading text-xs uppercase tracking-[0.2em]">Pre koho</h2>
            <p className="text-sm text-muted-foreground">
              Pre každú ženu, ktorá túži po bezpečnom priestore na rozhovor, smiech aj ticho.
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/50">
          <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
            <MessageCircle className="h-6 w-6 text-accent" />
            <h2 className="font-heading text-xs uppercase tracking-[0.2em]">Ako</h2>
            <p className="text-sm text-muted-foreground">
              Online stretnutie cez video alebo audio — tak, ako ti to práve vyhovuje.
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/50">
          <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
            <Heart className="h-6 w-6 text-accent" />
            <h2 className="font-heading text-xs uppercase tracking-[0.2em]">Čo prinesie</h2>
            <p className="text-sm text-muted-foreground">
              Pocit, že nie si sama. Inšpiráciu, pochopenie a nové priateľstvá.
            </p>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section {...fadeUp(2)} className="rounded-2xl border border-border/50 bg-secondary/40 px-6 py-8 text-center">
        <h2 className="font-display text-2xl">Chceš sa pripojiť?</h2>
        <p className="mx-auto mt-2 text-sm text-muted-foreground">
          Napíš nám a my ti pošleme termín najbližšieho DIVA KRUHu a odkaz na pripojenie.
        </p>
        <Button asChild className="mt-5" size="lg">
          <a
            href="https://wa.me/421907350088?text=Ahoj%2C%20m%C3%A1m%20z%C3%A1ujem%20o%20DIVA%20KRUH.%20"
            target="_blank"
            rel="noopener noreferrer"
          >
            Napísať na WhatsApp
          </a>
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">
          Alebo nám napíš na{" "}
          <a
            href="mailto:didka0105@gmail.com?subject=Chcem%20sa%20pripoji%C5%A5%20do%20DIVA%20KRUHU"
            className="underline underline-offset-2 hover:text-accent"
          >
            didka0105@gmail.com
          </a>
        </p>
      </motion.section>

      <motion.section {...fadeUp(3)} className="rounded-2xl border border-dashed border-border/60 px-6 py-8 text-center">
        <p className="text-sm italic text-muted-foreground">
          „V kruhu žien sa netreba pretvarovať. Stačí prísť taká, aká si."
        </p>
      </motion.section>
    </div>
  );
}
