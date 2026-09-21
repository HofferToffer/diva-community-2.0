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

export function quoteForDate(date = new Date()): string {
  const dayOfMonth = date.getDate();
  return DAILY_QUOTES[(dayOfMonth - 1) % DAILY_QUOTES.length];
}
