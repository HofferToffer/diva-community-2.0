export const DAILY_QUOTES: string[] = [
  "Nemusíš byť dokonalá, stačí byť sama sebou.",
  "Tvoje telo si zaslúži láskavosť, nie kritiku.",
  "Malé kroky každý deň ťa vedú ďaleko.",
  "Oddych je súčasť cesty, nie jej prekážka.",
  "Si silnejšia, než si myslíš.",
  "Dnes stačí urobiť to, čo môžeš.",
  "Počúvaj svoje telo, vie viac, než si myslíš.",
  "Robíš to hlavne pre seba.",
  "Každý cyklus ťa niečo naučí, ak mu dáš priestor.",
  "Nie si sama — divy sú s tebou.",
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
  "Ženská sila je aj v jemnosti.",
  "Zastav sa, nadýchni sa, pokračuj.",
  "Si presne tam, kde máš byť.",
];

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function quoteForDate(date = new Date()): string {
  return DAILY_QUOTES[dayOfYear(date) % DAILY_QUOTES.length];
}
