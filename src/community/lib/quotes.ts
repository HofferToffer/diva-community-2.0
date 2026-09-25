export type LifePhase = "cycle" | "trying" | "pregnant" | "postpartum" | "menopause";

/** 🌸 Ženskosť, cyklickosť, telo, energia, oddych, sila */
const CYCLE_QUOTES: string[] = [
  "Nemusíš byť dokonalá, stačí byť sama sebou.",
  "Tvoje telo si zaslúži láskavosť, nie kritiku.",
  "Malé kroky každý deň ťa vedú ďaleko.",
  "Oddych je súčasť cesty, nie jej prekážka.",
  "Si silnejšia, než si myslíš.",
  "Dnes stačí urobiť to, čo môžeš.",
  "Počúvaj svoje telo, vie viac, než si myslíš.",
  "Robíš to hlavne pre seba.",
  "Každý cyklus ťa niečo naučí, ak mu dáš priestor.",
  "Nie si sama — Divy sú s tebou.",
  "Tvoj pokrok sa nemeria porovnávaním s inými.",
  "Dovoľ si cítiť to, čo cítiš.",
  "Sila nie je vždy hlasná, niekedy je tichá a vytrvalá.",
  "Starostlivosť o seba nie je sebectvo.",
  "Každý deň je nová šanca začať odznova.",
  "Tvoje hranice si zaslúžia rešpekt — aj ten tvoj vlastný.",
  "Pohyb je oslava toho, čo tvoje telo dokáže.",
  "Nemusíš zvládať všetko sama.",
  "Buď na seba trpezlivá, rovnako ako by si bola na kamošku.",
  "Vďačnosť mení pohľad na deň.",
  "Tvoja hodnota nezávisí od výkonu.",
  "V jemnosti je naša sila.",
  "Zastav sa, nadýchni sa, pokračuj.",
  "Si presne tam, kde máš byť.",
  "Nie každý deň musí byť produktívny, aby mal zmysel.",
  "Tvoje srdce vie, aj keď hlava pochybuje.",
  "Aj pomalý krok je krok vpred.",
  "Dovoľ si byť hrdá na to, čo si dnes zvládla.",
  "Ticho vie liečiť rovnako ako pohyb.",
  "Si viac, než si myslíš v ťažký deň.",
  "Každý nový mesiac je čistý list.",
];

/** 🌱 Dôvera, túžba, trpezlivosť, cesta, telo */
const TRYING_QUOTES: string[] = [
  "Tvoje telo si pamätá, ako na to, aj keď to práve nevidíš.",
  "Trpezlivosť nie je pasivita — je to iný druh sily.",
  "Túžba mať dieťa je posvätná, nie slabosť.",
  "Každý mesiac je súčasť cesty, nie zlyhanie.",
  "Dôveruj svojmu telu aj vtedy, keď je ťažké čakať.",
  "Nie si len svoje telo — si aj nádej, ktorú v sebe nosíš.",
  "Cesta k dieťaťu nie je rovná čiara a to je v poriadku.",
  "Dovoľ si cítiť aj smútok, aj nádej naraz.",
  "Tvoje telo robí veci, o ktorých ani nevieš — ver mu.",
  "Nie si sama v tomto čakaní.",
  "Starostlivosť o seba je súčasť tejto cesty, nie odbočka z nej.",
  "Každý cyklus ťa niečo naučí o tvojom tele.",
  "Túžba a trpezlivosť môžu existovať vedľa seba.",
  "Dnes stačí byť k sebe láskavá, nie dokonalá.",
];

/** 🤍 Spojenie s bábätkom, dôvera v telo, spomalenie, premena */
const PREGNANT_QUOTES: string[] = [
  "Tvoje telo vie, ako stvoriť život — dôveruj mu.",
  "Spomaliť teraz nie je slabosť, je to múdrosť.",
  "Každý deň rastie spojenie medzi tebou a tvojím bábätkom.",
  "Premena, ktorou prechádzaš, je väčšia, než sa zdá.",
  "Nemusíš stíhať všetko — stačí niesť nový život.",
  "Tvoje telo si zaslúži láskavosť, nie kritiku ani teraz.",
  "Počúvaj, čo ti telo hovorí — vie viac, než si myslíš.",
  "Spojenie s dieťaťom začína dávno pred jeho prvým nádychom.",
  "Odpočinok je teraz súčasť starostlivosti o vás oboch.",
  "Dôveruj procesu, aj keď nevidíš, čo sa deje vo vnútri.",
  "Si presne tam, kde máš byť — s bábätkom, ktoré rastie.",
  "Nie si len nositeľka — si už mama.",
  "Táto premena patrí len tebe, nikto ju nemusí chápať.",
  "Dýchaj pomaly. Vy dvaja máte čas.",
];

/** 🫶 Jemnosť, regenerácia, materstvo, hranice, prijímanie pomoci */
const POSTPARTUM_QUOTES: string[] = [
  "Prijať pomoc nie je slabosť — je to súčasť materstva.",
  "Tvoje telo potrebuje čas na hojenie, nie výkon.",
  "Hranice, ktoré si teraz staviaš, chránia aj teba, aj dieťa.",
  "Materstvo sa neučíš za deň — dovoľ si učiť sa pomaly.",
  "Buď k sebe jemná, rovnako ako si k svojmu bábätku.",
  "Nie si menej, ak dnes zvládneš len málo.",
  "Regenerácia nie je lenivosť, je to nevyhnutná práca tela.",
  "Povedať „potrebujem pomoc“ je akt sily, nie zlyhania.",
  "Tvoje telo urobilo niečo obrovské — dopraj mu odpočinok.",
  "Nikto to nezvláda sám a ty to nemusíš zvládať sama.",
  "Každý deň s dieťaťom je aj deň, v ktorom sa učíš byť matkou.",
  "Je v poriadku smútiť za sebou pred materstvom aj milovať to, čím si teraz.",
  "Jemnosť k sebe je teraz rovnako dôležitá ako starostlivosť o bábätko.",
  "Nemusíš to zvládať dokonale, stačí to zvládať po svojom.",
];

/** 🌙 Nová etapa, sloboda, múdrosť, sila, vlastné tempo */
const MENOPAUSE_QUOTES: string[] = [
  "Táto etapa nie je koniec, je to nová sloboda.",
  "Múdrosť, ktorú máš teraz, si vybojovala rokmi.",
  "Vlastné tempo je teraz tvoje najväčšie právo.",
  "Sila sa v tomto období neznižuje — len mení podobu.",
  "Nemusíš sa nikomu ospravedlňovať za to, čím teraz si.",
  "Táto kapitola patrí len tebe.",
  "Slobodu, ktorú cítiš, si si zaslúžila.",
  "Telo sa mení, ale to, kým si, zostáva.",
  "Počúvaj sa teraz viac než kedykoľvek predtým.",
  "Nie si neviditeľná — si skúsenejšia a slobodnejšia.",
  "Táto fáza ťa učí povedať áno sebe a nie iba iným.",
  "Múdrosť je sila, ktorú nikto nevidí, ale každý cíti.",
  "Vlastné tempo neznamená pomalé — znamená správne pre teba.",
  "Si presne tam, kde má byť žena tvojej skúsenosti.",
];

const PHASE_QUOTES: Record<LifePhase, string[]> = {
  cycle: CYCLE_QUOTES,
  trying: TRYING_QUOTES,
  pregnant: PREGNANT_QUOTES,
  postpartum: POSTPARTUM_QUOTES,
  menopause: MENOPAUSE_QUOTES,
};

export function quoteForDate(phase: LifePhase = "cycle", date = new Date()): string {
  const pool = PHASE_QUOTES[phase];
  const dayOfMonth = date.getDate();
  return pool[(dayOfMonth - 1) % pool.length];
}

type ProfileLifeFlags = {
  is_pregnant?: boolean;
  is_postpartum?: boolean;
  is_menopause?: boolean;
  is_trying_to_conceive?: boolean;
};

/** Which quote pool a woman's current profile state maps to. */
export function getLifePhase(profile: ProfileLifeFlags | null | undefined): LifePhase {
  if (!profile) return "cycle";
  if (profile.is_pregnant) return "pregnant";
  if (profile.is_postpartum) return "postpartum";
  if (profile.is_menopause) return "menopause";
  if (profile.is_trying_to_conceive) return "trying";
  return "cycle";
}

/** How each life phase's chapter is named across the app (nav, page titles). */
export const PHASE_LABEL: Record<LifePhase, string> = {
  cycle: "Môj cyklus",
  trying: "Cesta k bábätku",
  pregnant: "Moje tehotenstvo",
  postpartum: "600 nedieľ / Obnova",
  menopause: "Moja menopauza",
};
