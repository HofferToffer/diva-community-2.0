import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import divyNosia1 from "@/assets/divy-nosia-divu-1.jpg.asset.json";
import divyNosia2 from "@/assets/divy-nosia-divu-2.jpg.asset.json";
import divyNosia3 from "@/assets/divy-nosia-divu-3.jpg.asset.json";
import divyNosia4 from "@/assets/divy-nosia-divu-4.jpg.asset.json";
import divyNosia5 from "@/assets/divy-nosia-divu-5.jpg.asset.json";
import divyNosia6 from "@/assets/divy-nosia-divu-6.jpg.asset.json";
import divyNosia7 from "@/assets/divy-nosia-divu-7.jpg.asset.json";
import divyNosia8 from "@/assets/divy-nosia-divu-8.jpg.asset.json";
import divyNosia9 from "@/assets/divy-nosia-divu-9.jpg.asset.json";
import divyNosia10 from "@/assets/divy-nosia-divu-10.jpg.asset.json";
import divyNosia11 from "@/assets/divy-nosia-divu-11.jpg.asset.json";
import divyNosia12 from "@/assets/divy-nosia-divu-12.jpg.asset.json";
import divyNosia15 from "@/assets/divy-nosia-divu-15.jpg.asset.json";
import divyNosia16 from "@/assets/divy-nosia-divu-16.jpg.asset.json";
import divyNosia17 from "@/assets/divy-nosia-divu-17.jpg.asset.json";
import divyNosia18 from "@/assets/divy-nosia-divu-18.jpg.asset.json";
import divyNosia20 from "@/assets/divy-nosia-divu-20.jpeg.asset.json";
import divyNosia21 from "@/assets/divy-nosia-divu-21.jpeg.asset.json";
import divyNosia22 from "@/assets/divy-nosia-divu-22.jpeg.asset.json";
import divyNosia23 from "@/assets/divy-nosia-divu-23.jpeg.asset.json";
import divyNosia24 from "@/assets/divy-nosia-divu-24.jpeg.asset.json";
import divyNosia25 from "@/assets/divy-nosia-divu-25.jpg.asset.json";
import divyNosia26 from "@/assets/divy-nosia-divu-26.jpg.asset.json";
import divyNosia27 from "@/assets/divy-nosia-divu-27.jpg.asset.json";
import divyNosia28 from "@/assets/divy-nosia-divu-28.jpg.asset.json";
import divyNosia29 from "@/assets/divy-nosia-divu-29.jpg.asset.json";
import divyNosia30 from "@/assets/divy-nosia-divu-30.jpg.asset.json";
import divyNosia31 from "@/assets/divy-nosia-divu-31.jpg.asset.json";
import divyNosia33 from "@/assets/divy-nosia-divu-33.jpg.asset.json";
import divyNosia34 from "@/assets/divy-nosia-divu-34.jpg.asset.json";
import divyNosia35 from "@/assets/divy-nosia-divu-35.jpg.asset.json";
import divyNosia36 from "@/assets/divy-nosia-divu-36.jpg.asset.json";
import divyNosia37 from "@/assets/divy-nosia-divu-37.jpg.asset.json";
import divyNosia38 from "@/assets/divy-nosia-divu-38.jpg.asset.json";
import divyNosia39 from "@/assets/divy-nosia-divu-39.jpg.asset.json";
import divyNosia40 from "@/assets/divy-nosia-divu-40.jpg.asset.json";
import divyNosia41 from "@/assets/divy-nosia-divu-41.jpg";
import { useLang, type Bilingual } from "@/lib/lang";


interface CommunityImage {
  src: string;
  alt: Bilingual;
}

const sourceImages: CommunityImage[] = [
  { src: divyNosia1.url, alt: { sk: "Diva v šedej šiltovke a taške", en: "A Diva in the grey cap with the tote bag" } },
  { src: divyNosia2.url, alt: { sk: "Diva v čiernom klobúku", en: "A Diva in the black hat" } },
  { src: divyNosia3.url, alt: { sk: "Diva s taškou pred Bojnickým zámkom", en: "A Diva with the tote bag in front of Bojnice Castle" } },
  { src: divyNosia4.url, alt: { sk: "Divy v šiltovke na Tajovskom behu", en: "Divas in DIVA caps at the Tajov run" } },
  { src: divyNosia5.url, alt: { sk: "Diva v klobúku na rafte", en: "A Diva in the hat, rafting" } },
  { src: divyNosia6.url, alt: { sk: "Diva v šiltovke pri vodopáde v Tatrách", en: "A Diva in the cap by a waterfall in the Tatras" } },
  { src: divyNosia7.url, alt: { sk: "Diva v klobúku so psíkom", en: "A Diva in the hat with her dog" } },
  { src: divyNosia8.url, alt: { sk: "Divy v šiltovke pred behom", en: "Divas in DIVA caps before a run" } },
  { src: divyNosia9.url, alt: { sk: "Malá diva v klobúku na psích hrách", en: "A little Diva in the hat at a dog show" } },
  { src: divyNosia10.url, alt: { sk: "Diva v šiltovke pri mori", en: "A Diva in the cap by the sea" } },
  { src: divyNosia11.url, alt: { sk: "Diva v klobúku pri bazéne", en: "A Diva in the hat by the pool" } },
  { src: divyNosia12.url, alt: { sk: "Diva s taškou vo výťahu", en: "A Diva with the tote bag in a lift" } },
  { src: divyNosia15.url, alt: { sk: "Diva v čiernom klobúku na slnku", en: "A Diva in the black hat, soaking up the sun" } },
  { src: divyNosia16.url, alt: { sk: "Diva v čiernom klobúku v meste", en: "A Diva in the black hat in the city" } },
  { src: divyNosia17.url, alt: { sk: "Diva s taškou Diva Community na ulici", en: "A Diva with the Diva Community tote on the street" } },
  { src: divyNosia18.url, alt: { sk: "Diva v ružovej šiltovke s taškou vo výťahu", en: "A Diva in the pink cap with the tote bag in a lift" } },
  { src: divyNosia20.url, alt: { sk: "Diva s taškou kráča po pláži", en: "A Diva walking along the beach with the tote bag" } },
  { src: divyNosia21.url, alt: { sk: "Diva v čiernom klobúku pri mori", en: "A Diva in the black hat by the sea" } },
  { src: divyNosia22.url, alt: { sk: "Tehotná diva v klobúku v tropickej záhrade", en: "A pregnant Diva in the hat in a tropical garden" } },
  { src: divyNosia23.url, alt: { sk: "Diva s taškou Diva Community na pláži", en: "A Diva with the Diva Community tote on the beach" } },
  { src: divyNosia24.url, alt: { sk: "Diva v klobúku oddychuje v hojdacej sieti", en: "A Diva in the hat relaxing in a hammock" } },
  { src: divyNosia25.url, alt: { sk: "Diva v klobúku s taškou pri mori", en: "A Diva in the hat with the tote bag by the sea" } },
  { src: divyNosia26.url, alt: { sk: "Diva v klobúku a červenej sukni s taškou", en: "A Diva in the hat and a red skirt with the tote bag" } },
  { src: divyNosia27.url, alt: { sk: "Divy s balíčkami Diva Community pri bazéne", en: "Divas with Diva Community parcels by the pool" } },
  { src: divyNosia28.url, alt: { sk: "Diva s dieťaťom v klobúku na pláži pri západe slnka", en: "A Diva with her little one in the hat on the beach at sunset" } },
  { src: divyNosia29.url, alt: { sk: "Diva vo fialovej šiltovke pri cvičení", en: "A Diva in a purple cap, working out" } },
  { src: divyNosia30.url, alt: { sk: "Diva s deťmi v klobúkoch na lodi", en: "A Diva with her kids in hats on a boat" } },
  { src: divyNosia31.url, alt: { sk: "Diva v bielych šatách s veľkou taškou Diva Community", en: "A Diva in a white dress with the big Diva Community tote" } },
  { src: divyNosia33.url, alt: { sk: "Diva v klobúku s taškou na motorke", en: "A Diva in the hat with the tote bag on a motorbike" } },
  { src: divyNosia34.url, alt: { sk: "Diva s taškou Diva Community v slnečnom svetle", en: "A Diva with the Diva Community tote in the sunshine" } },
  { src: divyNosia35.url, alt: { sk: "Diva v leopardích šatách s taškou Diva Community", en: "A Diva in a leopard-print dress with the Diva Community tote" } },
  { src: divyNosia36.url, alt: { sk: "Diva so zrkadlovým selfie a taškou Diva Community", en: "A Diva's mirror selfie with the Diva Community tote" } },
  { src: divyNosia37.url, alt: { sk: "Diva v klobúku s taškou Diva Community v záhrade s hortenziami", en: "A Diva in the hat with the Diva Community tote among the hydrangeas" } },
  { src: divyNosia38.url, alt: { sk: "Diva v ružovej šiltovke Diva Community v kúpeľni", en: "A Diva in the pink Diva Community cap in the bathroom" } },
  { src: divyNosia39.url, alt: { sk: "Diva v ružovej šiltovke Diva Community", en: "A Diva in the pink Diva Community cap" } },
  { src: divyNosia40.url, alt: { sk: "Diva v čiernom klobúku Diva Community v zrkadle", en: "A Diva in the black Diva Community hat in the mirror" } },
  { src: divyNosia41, alt: { sk: "Diva v klobúku a slnečných okuliaroch na lesnej ceste pri jazere", en: "A Diva in the hat and sunglasses on a forest path by the lake" } },
];


const shuffle = <T,>(array: T[]) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const DivyNosiaDivuSection = () => {
  const { l, pick } = useLang();
  const baseImages = useMemo(() => shuffle(sourceImages), []);
  const extendedImages = useMemo(
    () => [...baseImages, ...baseImages, ...baseImages],
    [baseImages]
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemStep, setItemStep] = useState(0);
  const [isShifting, setIsShifting] = useState(false);
  const count = baseImages.length;

  // Measure slide width + gap on mount and resize.
  const measure = useMemo(() => () => {
    const el = containerRef.current;
    if (!el) return;
    const first = el.querySelector("[data-slide]") as HTMLElement | null;
    if (!first) return;
    const style = getComputedStyle(el);
    const gap = parseFloat(style.columnGap || style.gap) || 0;
    setItemStep(first.offsetWidth + gap);
  }, []);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Start in the middle copy so we can scroll infinitely both ways.
  useLayoutEffect(() => {
    if (!containerRef.current || itemStep === 0) return;
    containerRef.current.scrollLeft = itemStep * count;
  }, [itemStep, count]);

  // When we hit either end, jump to the matching position in the middle copy.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || itemStep === 0 || count === 0) return;

    const copyWidth = itemStep * count;
    const maxScroll = el.scrollWidth - el.clientWidth;

    const onScroll = () => {
      if (isShifting) return;
      if (el.scrollLeft < copyWidth - itemStep / 2) {
        setIsShifting(true);
        el.scrollLeft += copyWidth;
        window.setTimeout(() => setIsShifting(false), 50);
      } else if (el.scrollLeft > copyWidth * 2 - itemStep / 2) {
        setIsShifting(true);
        el.scrollLeft -= copyWidth;
        window.setTimeout(() => setIsShifting(false), 50);
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [itemStep, count, isShifting]);

  const scroll = (direction: "left" | "right") => {
    const el = containerRef.current;
    if (!el || itemStep === 0 || count === 0) return;

    const copyWidth = itemStep * count;
    let current = el.scrollLeft;

    // Keep the viewport inside the middle copy so we never hit the hard edges.
    while (current < copyWidth) current += copyWidth;
    while (current >= copyWidth * 2) current -= copyWidth;
    if (current !== el.scrollLeft) {
      el.scrollLeft = current;
    }

    // Move exactly one photo and let CSS snap align it flush to the edge.
    el.scrollBy({
      left: direction === "left" ? -itemStep : itemStep,
      behavior: "smooth",
    });
  };

  return (
    <section id="divy-nosia-divu" className="section-padding bg-muted/30 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl tracking-wide text-foreground">
            {l("Divy nosia Divu", "Divas wear DIVA")}
          </h2>
          <div className="mx-auto mt-4 w-16 h-[1px] bg-accent" />
          <p className="mt-6 font-body text-sm leading-relaxed text-muted-foreground tracking-wide max-w-md mx-auto">
            {l("Fotky žien, ktoré nosia DIVA. Inšpirácia priamo od našej komunity.", "Photos of women wearing DIVA. Inspiration straight from our community.")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <button
            type="button"
            aria-label={l("Predchádzajúca fotka", "Previous photo")}
            onClick={() => scroll("left")}
            className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 z-10 rounded-full p-2.5 bg-background/80 backdrop-blur-sm text-foreground shadow-md transition hover:bg-background hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <div
            ref={containerRef}
            className="flex gap-4 overflow-x-hidden select-none snap-x snap-mandatory"
          >
            {extendedImages.map((image, i) => (
              <div
                key={`${image.src}-${i}`}
                data-slide
                className="relative aspect-[3/4] h-72 sm:h-80 md:h-96 flex-shrink-0 overflow-hidden bg-muted snap-start"
              >
                <img
                  src={image.src}
                  alt={pick(image.alt)}
                  className="h-full w-full object-cover"
                  loading={i < 6 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label={l("Nasledujúca fotka", "Next photo")}
            onClick={() => scroll("right")}
            className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 z-10 rounded-full p-2.5 bg-background/80 backdrop-blur-sm text-foreground shadow-md transition hover:bg-background hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default DivyNosiaDivuSection;
