/**
 * Book and affirmation recommendations shown throughout pregnancy — everything
 * is about calming and preparing the mind, not just the body. Books are real,
 * available Slovak titles (verified via web search); affirmation links point
 * to existing outside recordings rather than hosting audio in the app.
 */

export type PregnancyBook = { title: string; note: string };

export const PREGNANCY_BOOKS: PregnancyBook[] = [
  {
    title: "Návrat k materskej intuícii",
    note: "Jana Krpalová Mračková — sprievodkyňa tehotenstvom, pôrodom, šestonedelím aj začiatkami dojčenia z pohľadu materskej intuície.",
  },
  {
    title: "Sprievodca tehotenstvom",
    note: "Od slovenských lekárov-pôrodníkov — odborný a praktický pohľad na celé tehotenstvo, pôrod aj šestonedelie.",
  },
  {
    title: "Slovenská tehotenská biblia",
    note: "Praktická príručka od slovenského gynekológa s aktuálnymi poznatkami z pôrodníctva.",
  },
  {
    title: "Veľká kniha o matke a dieťati",
    note: "Nestarnúca klasika — sprevádza od počatia až po tri roky dieťaťa.",
  },
  {
    title: "Hypnopôrod",
    note: "Marie F. Mongan — relaxačné a dychové techniky, ktoré pomáhajú zvládnuť strach z pôrodu.",
  },
  {
    title: "Prečo sú dánske deti šťastné?",
    note: "Jessica Joelle Alexander, Iben Dissing Sandahl — dánsky prístup k výchove: autenticita, empatia, hra bez tlaku.",
  },
];

export type AffirmationLink = { label: string; url: string };

export const AFFIRMATION_LINKS: AffirmationLink[] = [
  {
    label: "Afirmácie na pôrod (odporúčané video)",
    url: "https://www.youtube.com/watch?v=EorZm40Xyh8",
  },
  {
    label: "Afirmácie a spojenie s bábätkom (odporúčané video)",
    url: "https://www.youtube.com/watch?v=kfL-kFDkIZo",
  },
  {
    label: "Pôrodné afirmácie — Čo dokáže mama",
    url: "https://www.codokazemama.sk/produkt/porodne-afirmacie",
  },
  {
    label: "Všeobecné afirmácie k pôrodu — Nicole Dula",
    url: "https://www.nicoledula.sk/vseobecne-afirmacie-k-porodu/",
  },
];
