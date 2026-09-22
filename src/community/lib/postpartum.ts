function daysBetween(a: Date, b: Date): number {
  const start = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const end = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export type PostpartumInfo = {
  week: number;
  message: string;
  symptoms: string[];
};

type WeekBand = { maxWeek: number; message: string; symptoms: string[] };

/**
 * Week-by-week postpartum content, grounded in Cleveland Clinic / ACOG / Merck
 * Manual guidance on lochia staging, uterine involution, engorgement, baby
 * blues vs. PPD timing, and pelvic floor recovery — but written warm, not
 * clinical. Šestonedelie ("the sixth week") is the common name, but recovery
 * — and often breastfeeding — runs well past six weeks.
 */
const WEEK_BANDS: WeekBand[] = [
  {
    maxWeek: 1,
    message:
      "Prvý týždeň je o prežití a spoznávaní sa navzájom. Krvácanie je teraz najsilnejšie a tmavočervené, sťahy maternice (najviac cítiť pri dojčení) sú najintenzívnejšie — takto sa maternica vracia k svojej veľkosti. Okolo 3.–5. dňa príde mnohým ženám vlna plaču či precitlivenosti — hovorí sa tomu baby blues a do dvoch týždňov to zvyčajne samo odznie.",
    symptoms: [
      "silné krvácanie (tmavočervené)",
      "kŕče/sťahy maternice, najmä pri dojčení",
      "napäté, citlivé prsia okolo 3.–5. dňa",
      "extrémna únava a nočné potenie",
      "citlivosť hrádze alebo jazvy po cisárskom reze",
      "možný baby blues (plač, precitlivenosť)",
    ],
  },
  {
    maxWeek: 2,
    message:
      "Krvácanie sa mení na svetlejšie, ružovkasté až hnedasté. Kŕče aj napätie v prsiach by mali postupne slabnúť. Baby blues by mal do konca tohto týždňa doznievať — ak smútok alebo úzkosť naopak silnejú, je čas povedať si o pomoc, nie to len vydržať.",
    symptoms: ["svetlejšie, ružovkasté krvácanie", "slabnúce kŕče", "pretrvávajúca únava", "možné nočné potenie"],
  },
  {
    maxWeek: 3,
    message:
      "Krvácanie je už len slabé, žltkasté až biele, a môže sa objavovať už len občas. Toto obdobie je aj najčastejším začiatkom popôrodnej depresie — nie preto, že by si niečo robila zle, ale preto, že telo aj hormóny prechádzajú veľkou zmenou. Ak smútok, úzkosť alebo pocit odpojenia od bábätka trvajú dlhšie než pár dní, ozvi sa gynekológovi alebo pediatrovi — pomoc funguje a nemusíš na ňu čakať do šestotýždňovej prehliadky.",
    symptoms: ["slabé, svetlé krvácanie", "pretrvávajúca únava", "citlivejšia nálada — sleduj, ako sa cítiš"],
  },
  {
    maxWeek: 4,
    message:
      "Maternica sa blíži k pôvodnej veľkosti a jazva — po pôrode aj po cisárskom reze — by mala byť citeľne pokojnejšia. Niektorým ženám okolo tohto obdobia začnú viac vypadávať vlasy. Je to normálna reakcia tela na pokles hormónov, nie niečo, čo si spravila zle.",
    symptoms: ["vypadávanie vlasov (môže začať)", "ustupujúca citlivosť jazvy", "stále prítomná únava"],
  },
  {
    maxWeek: 6,
    message:
      "Krvácanie by malo v tomto období ustať. Blíži sa (alebo už bola) šestotýždňová prehliadka — dobrá príležitosť prebrať s lekárom všetko, čo cítiš, aj fyzicky, aj psychicky. Svaly panvového dna sú stále citeľne slabšie než pred tehotenstvom — cvičenia na ich posilnenie majú teraz naozaj zmysel, nie je to len formalita.",
    symptoms: ["krvácanie by malo končiť", "slabšie panvové dno", "pri cisárskom reze: väčšinou povolenie na bežné aktivity"],
  },
  {
    maxWeek: 8,
    message:
      "Väčšina žien je už bez krvácania a kŕče sú preč. Ak nedojčíš, môže sa vrátiť menštruácia; ak dojčíš výlučne, môže vynechávať aj mesiace. Pozor — plodnosť sa vie vrátiť ešte predtým, než príde prvá menštruácia.",
    symptoms: ["možný návrat menštruácie (ak nedojčíš)", "citeľnejší nárast energie", "únava zo spánkového deficitu pretrváva"],
  },
  {
    maxWeek: 12,
    message:
      "Fyzické hojenie je u väčšiny žien už hotové. Vypadávanie vlasov môže byť teraz na vrchole — vydrž, do roka sa to upraví. Sila jadra a panvového dna sa stále postupne vracia, najmä ak sa im venuješ pravidelne.",
    symptoms: ["vypadávanie vlasov môže vrcholiť", "postupne sa vracajúca sila brucha a panvového dna"],
  },
];

const FALLBACK: WeekBand = {
  maxWeek: Infinity,
  message:
    "Si už niekoľko mesiacov na tejto novej ceste. Vlasy sa do roka upravia, jazva dozrieva mesiace, panvové dno aj jadro sa posilňujú ďalej pri pravidelnom cvičení. Hojenie, hormóny aj puto s dieťaťom si idú vlastným tempom — dôveruj mu, nie je to preteky.",
  symptoms: ["vlasy sa postupne upravujú", "energia a libido sa vracajú individuálnym tempom"],
};

/** A gentle, non-alarmist reminder of when to actually call a doctor — shown alongside the weekly message for roughly the first 12 weeks, when it's most relevant. */
export const POSTPARTUM_SAFETY_NOTE =
  "Hneď po pôrode je silnejšie krvácanie bežné. Ozvi sa ale lekárovi hneď, ak premáčaš vložku do hodiny niekoľko hodín po sebe, idú väčšie zrazeniny (väčšie ako vajce), krvácanie sa znova zosilní po tom, čo už slablo, dostaneš horúčku nad 38 °C, alebo krvácanie nepríjemne zapácha — nečakaj na plánovanú prehliadku.";

export function getPostpartumInfo(sinceDate: string, today = new Date()): PostpartumInfo {
  const since = new Date(sinceDate);
  const days = Math.max(daysBetween(since, today), 0);
  const week = Math.floor(days / 7) + 1;

  const band = WEEK_BANDS.find((b) => week <= b.maxWeek) ?? FALLBACK;
  return { week, message: band.message, symptoms: band.symptoms };
}
