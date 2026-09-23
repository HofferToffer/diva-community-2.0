import { ShieldCheck } from "lucide-react";

type Props = {
  /** Extra sentence specific to the section (e.g. postpartum check-up). */
  extra?: string;
  className?: string;
};

/**
 * Shared safety disclaimer shown in every health-related section.
 */
export default function MedicalNote({ extra, className }: Props) {
  return (
    <div
      className={
        "flex items-start gap-2 rounded-xl bg-secondary/30 px-4 py-3 text-xs leading-relaxed text-muted-foreground " +
        (className ?? "")
      }
    >
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" aria-hidden="true" />
      <p>
        {extra ? `${extra} ` : ""}
        Obsah v DIVA COMMUNITY má podporný a informačný charakter — nenahrádza vyšetrenie, diagnózu ani liečbu. Pri
        akýchkoľvek ťažkostiach, pochybnostiach alebo zmenách, ktoré ťa znepokojujú, sa vždy obráť na svojho lekára či
        lekárku.
      </p>
    </div>
  );
}
