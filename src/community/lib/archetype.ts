export type Archetype = {
  name: string;
  keywords: string;
  description: string;
  energyNote: string;
};

export const DIEVCA: Archetype = {
  name: "Dievča",
  keywords: "hravosť • sloboda • objavovanie",
  description: "Objavuješ svet a tvoríš si vzťah k sebe.",
  energyNote: "Tvoja energia je zvedavá a hravá. Dovoľ si objavovať, kto si, bez tlaku mať už všetko vyriešené.",
};

export const ZENA: Archetype = {
  name: "Žena",
  keywords: "telo • sila • sexualita • tvorivosť",
  description: "Poznávaš svoje telo a učíš sa byť sama sebou.",
  energyNote: "Toto obdobie patrí spoznávaniu seba — svojho tela, túžob aj hraníc. Dovoľ si skúšať, mýliť sa a nachádzať, čo je naozaj tvoje.",
};

export const MATKA: Archetype = {
  name: "Matka",
  keywords: "tvorím • rodím • vyživujem",
  description: "Nemusí ísť len o biologické materstvo — patrí sem aj tehotenstvo.",
  energyNote: "Tvoja energia teraz dáva život niečomu — dieťaťu, vzťahu, projektu. Nezabúdaj dopĺňať aj to, čo z teba odchádza von.",
};

export const MUDRA_ZENA: Archetype = {
  name: "Múdra žena",
  keywords: "odovzdávam • viem • cítim",
  description: "Menej dokazovania, viac pravdy a vnútorného vedenia — patrí sem aj menopauza.",
  energyNote: "Vieš viac, než si niekedy tušila, a už to nemusíš nikomu dokazovať. Toto obdobie je o dôvere vlastnému vnútornému hlasu.",
};

type ArchetypeProfile = {
  date_of_birth?: string | null;
  is_pregnant?: boolean;
  is_postpartum?: boolean;
  is_menopause?: boolean;
};

export function getArchetype(profile: ArchetypeProfile | null | undefined, today = new Date()): Archetype | null {
  if (!profile) return null;
  if (profile.is_pregnant || profile.is_postpartum) return MATKA;
  if (profile.is_menopause) return MUDRA_ZENA;
  if (!profile.date_of_birth) return null;

  const dob = new Date(profile.date_of_birth);
  let age = today.getFullYear() - dob.getFullYear();
  const hadBirthdayThisYear =
    today.getMonth() > dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
  if (!hadBirthdayThisYear) age -= 1;

  if (age < 20) return DIEVCA;
  if (age < 35) return ZENA;
  if (age < 55) return MATKA;
  return MUDRA_ZENA;
}
