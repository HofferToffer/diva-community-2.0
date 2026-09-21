export type Archetype = {
  name: string;
  season: string;
  ageRange: string;
  description: string;
  energyNote: string;
};

const ARCHETYPES: Archetype[] = [
  {
    name: "Panna",
    season: "Jar",
    ageRange: "do 20 rokov",
    description: "Obdobie objavovania a budovania seba — telo aj identita sa ešte len formujú.",
    energyNote: "Tvoja energia je objavujúca a hravá. Telo sa ešte len učí svoj rytmus — skús počúvať, čo ti robí radosť, bez tlaku na výkon.",
  },
  {
    name: "Matka",
    season: "Leto",
    ageRange: "20 – 44 rokov",
    description: "Plodné roky — dávanie, budovanie, starostlivosť o seba aj o iných.",
    energyNote: "Energia často smeruje von — k práci, vzťahom, starostlivosti o iných. Nezabúdaj dopĺňať aj to, čo dávaš von.",
  },
  {
    name: "Čarodejnica",
    season: "Jeseň",
    ageRange: "45 – 54 rokov",
    description: "Perimenopauza — sila, premena, návrat k sebe.",
    energyNote: "Energia sa mení a presúva viac dovnútra — čo si predtým tolerovala, teraz už nie. Toto obdobie je o návrate k sebe, nie o úbytku sily.",
  },
  {
    name: "Múdra žena",
    season: "Zima",
    ageRange: "55+ rokov",
    description: "Po menopauze — múdrosť, sloboda, vlastné tempo.",
    energyNote: "Energia je pokojnejšia, ale hlbšia — menej rozptýlená, viac sústredená na to, na čom naozaj záleží. Sloboda robiť veci vo svojom tempe.",
  },
];

export function getArchetype(dateOfBirth: string, today = new Date()): Archetype {
  const dob = new Date(dateOfBirth);
  let age = today.getFullYear() - dob.getFullYear();
  const hadBirthdayThisYear =
    today.getMonth() > dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
  if (!hadBirthdayThisYear) age -= 1;

  if (age < 20) return ARCHETYPES[0];
  if (age < 45) return ARCHETYPES[1];
  if (age < 55) return ARCHETYPES[2];
  return ARCHETYPES[3];
}
