import blog1Cover from "@/assets/blog-1-cover.jpg";
import blog2Cover from "@/assets/blog-2-cover.jpg";
import blog3Cover from "@/assets/blog-3-cover.jpg";
import blog4Cover from "@/assets/blog-4-cover.jpg";
import blog5Cover from "@/assets/blog-5-cover.jpg";
import blog6Cover from "@/assets/blog-6-cover.jpg";
import blog7Cover from "@/assets/blog-7-cover.jpg";
import blog8Cover from "@/assets/blog-8-cover.jpg";
import blog9Cover from "@/assets/blog-9-cover.jpg";
import blog9Run from "@/assets/blog-9-3.jpg";
import blog10Asset from "@/assets/blog-10-1.jpeg.asset.json";
import blog11Asset from "@/assets/blog-11-1.jpeg.asset.json";

const blog10Cover = blog10Asset.url;
const blog11Cover = blog11Asset.url;

export type BlogPost = {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  href: string;
  imagePosition?: string;
};

const SK_MONTHS: Record<string, number> = {
  "január": 0, "februar": 1, "február": 1, "marec": 2, "april": 3, "apríl": 3,
  "maj": 4, "máj": 4, "jun": 5, "jún": 5, "jul": 6, "júl": 6, "august": 7,
  "september": 8, "oktober": 9, "október": 9, "november": 10, "december": 11,
};

export const parseSkDate = (date: string): number => {
  const m = date.trim().toLowerCase().match(/^(\d{1,2})\.\s*([^\s]+)\s+(\d{4})$/);
  if (!m) return 0;
  const day = parseInt(m[1], 10);
  const month = SK_MONTHS[m[2]] ?? 0;
  const year = parseInt(m[3], 10);
  return new Date(year, month, day).getTime();
};

const rawPosts: BlogPost[] = [
  {
    title: "Moja cesta hlbšie k sebe",
    excerpt:
      "O pozvaní do programu pre ženy, o cykle, nutrícii a Human Designe. A o tom, aké je učiť sa prijímať.",
    date: "17. September 2026",
    category: "",
    image: blog11Cover,
    href: "/blog/moja-cesta-hlbsie-k-sebe",
  },
  {
    title: "Múdrosť lona",
    excerpt:
      "Báseň, ktorá mi ostala v srdci. O žene, ktorá si váži samu seba, svoje telo, svoje roky aj ženy okolo seba.",
    date: "14. September 2026",
    category: "",
    image: blog10Cover,
    href: "/blog/predstavte-si-zenu",
  },
  {
    title: "15 ročný sen",
    excerpt:
      "O preteku Od Tatier k Dunaju, o úraze, ktorý znamenal koniec — a o roku práce, vďaka ktorej som sa vrátil a splnila sen.",
    date: "16. August 2026",
    category: "",
    image: blog9Run,
    href: "/blog/15-rocny-sen",
  },
  {
    title: "Cyklus",
    excerpt:
      "O vďačnosti za Krétu, o počúvaní svojho cyklu a o odvahe dovoliť si oddychovať.",
    date: "13. Máj 2026",
    category: "",
    image: blog8Cover,
    href: "/blog/cyklus",
  },
  {
    title: "Dovoliť si",
    excerpt:
      "O tlaku materstva, povinností a o odvahe odísť. O zminimalizovaní vecí, ktoré už nie sú funkčné.",
    date: "30. Apríl 2026",
    category: "",
    image: blog7Cover,
    href: "/blog/dovolit-si",
  },
  {
    title: "Prijatie",
    excerpt:
      "Keď sa chránime tak silno, až prestaneme cítiť. O návrate k sebe, o jemnosti a o dôvere v ženskú intuíciu.",
    date: "20. August 2025",
    category: "",
    image: blog6Cover,
    href: "/blog/prijatie",
  },
  {
    title: "Kréta",
    excerpt:
      "Sťahujeme sa rodina na Krétu. Diva Community nekončí — možno tichšie, možno inak, ale o to hlbšie.",
    date: "30. Apríl 2026",
    category: "",
    image: blog4Cover,
    href: "/blog/kreta",
  },
  {
    title: "Odvaha",
    excerpt:
      "Keď ideš mimo systém, búraš generačné traumy, dáš seba na prvé miesto… a vieš byť slabá.",
    date: "29. Október 2025",
    category: "",
    image: blog2Cover,
    href: "/blog/odvaha",
    imagePosition: "center 20%",
  },
  {
    title: "GIRL",
    excerpt:
      "O hanbe, mlčaní a o tom, ako sa zo zdieľaného príbehu stáva liečenie. Pre všetky ženy.",
    date: "3. September 2025",
    category: "",
    image: blog3Cover,
    href: "/blog/girl",
  },
  {
    title: "Múdrosť ženského tela",
    excerpt:
      "Telo je múdre. Niekedy nás zastaví práve vtedy, keď ideme proti svojej energii. Sila v tichu, v pokoji, v prijatí.",
    date: "3. September 2025",
    category: "",
    image: blog5Cover,
    href: "/blog/mudrost-zenskeho-tela",
  },
  {
    title: "V jemnosti je naša sila",
    excerpt:
      "Dlho som tomu neverila. Myslela som si, že byť silná znamená zvládať všetko. Až kým neprišla ona — moja dcéra.",
    date: "30. Jún 2025",
    category: "",
    image: blog1Cover,
    href: "/blog/v-jemnosti-je-nasa-sila",
  },
];

export const blogPosts: BlogPost[] = [...rawPosts].sort(
  (a, b) => parseSkDate(b.date) - parseSkDate(a.date)
);
