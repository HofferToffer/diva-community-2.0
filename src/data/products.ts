import type { Bilingual } from "@/lib/lang";
import shopCapPink from "@/assets/shop-cap-pink.jpg";
import shopCapPink3 from "@/assets/shop-cap-pink-3.jpg";
import shopCapPink4 from "@/assets/shop-cap-pink-4.jpg";
import shopCapPink6 from "@/assets/shop-cap-pink-6.jpg";
import shopCapPink7 from "@/assets/shop-cap-pink-7.jpg";
import shopCapPink8 from "@/assets/shop-cap-pink-8.jpg";
import shopCapPink9 from "@/assets/shop-cap-pink-9.jpg";
import shopCapPink10 from "@/assets/shop-cap-pink-10.jpg";
import shopCapPink11 from "@/assets/shop-cap-pink-11.jpg";
import shopCapGrey8 from "@/assets/shop-cap-grey-8.jpg";
import shopCapGrey9 from "@/assets/shop-cap-grey-9.jpg";
import shopCapGrey10 from "@/assets/shop-cap-grey-10.jpg";
import shopCapGrey11 from "@/assets/shop-cap-grey-11.jpg";
import shopCapGrey12 from "@/assets/shop-cap-grey-12.jpg";
import shopCapGrey14 from "@/assets/shop-cap-grey-14.jpg";
import shopCapGrey15 from "@/assets/shop-cap-grey-15.jpg";
import shopCapGrey16 from "@/assets/shop-cap-grey-16.jpg";
import shopHatBlack from "@/assets/shop-hat-black.jpg";
import shopHatBlack2 from "@/assets/shop-hat-black-2.jpg";
import shopHatBlack3 from "@/assets/shop-hat-black-3.jpg";
import shopHatBlack4 from "@/assets/shop-hat-black-4.jpg";
import shopHatBlack5 from "@/assets/shop-hat-black-5.jpg";
import shopHatBlack6 from "@/assets/shop-hat-black-6.jpg";
import shopHatBlack7 from "@/assets/shop-hat-black-7.jpg";
import shopHatBeige from "@/assets/shop-hat-beige.jpg";
import shopHatBeige4 from "@/assets/shop-hat-beige-4.jpg";
import shopHatBeige5 from "@/assets/shop-hat-beige-5.jpg";
import shopHatBeige7 from "@/assets/shop-hat-beige-7.jpg";
import shopHatBeige8 from "@/assets/shop-hat-beige-8.jpg";
import shopHatBeige9 from "@/assets/shop-hat-beige-9.jpg";
import shopHatBeige10 from "@/assets/shop-hat-beige-10.jpg";
import shopBag1 from "@/assets/shop-bag-1.jpg";
import shopBag2 from "@/assets/shop-bag-2.jpg";
import shopBag3 from "@/assets/shop-bag-3.jpg";
import shopBag4 from "@/assets/shop-bag-4.jpg";
import shopBag5 from "@/assets/shop-bag-5.jpg";
import shopBag6 from "@/assets/shop-bag-6.jpg";
import shopBag7 from "@/assets/shop-bag-7.jpg";
import shopBag8 from "@/assets/shop-bag-8.jpg";

export interface Product {
  slug: string;
  /** Stripe price lookup key / internal product identifier */
  priceId: string;
  name: Bilingual;
  description: Bilingual;
  price: string;
  priceCents: number;
  images: string[];
}

export function formatPriceCents(cents: number): string {
  return `${(cents / 100).toFixed(2).replace(".", ",")} €`;
}

export const products: Product[] = [
  {
    slug: "siltovka-ruzova",
    priceId: "siltovka_ruzova",
    name: { sk: "DIVA Šiltovka – Ružová", en: "DIVA Cap – Pink" },
    description: { sk: "Ružová vintage šiltovka s vyšívaným logom DIVA", en: "Pink vintage cap with the embroidered DIVA logo" },
    price: "14,90 €",
    priceCents: 1490,
    images: [shopCapPink10, shopCapPink7, shopCapPink9, shopCapPink3, shopCapPink11, shopCapPink8, shopCapPink6, shopCapPink4, shopCapPink],
  },
  {
    slug: "siltovka-seda",
    priceId: "siltovka_seda",
    name: { sk: "DIVA Šiltovka – Šedá", en: "DIVA Cap – Grey" },
    description: { sk: "Šedá vintage šiltovka s vyšívaným logom DIVA", en: "Grey vintage cap with the embroidered DIVA logo" },
    price: "14,90 €",
    priceCents: 1490,
    images: [shopCapGrey8, shopCapGrey9, shopCapGrey10, shopCapGrey11, shopCapGrey12, shopCapGrey14, shopCapGrey15, shopCapGrey16],
  },
  {
    slug: "klobuk-cierny",
    priceId: "klobuk_cierny",
    name: { sk: "DIVA Klobúk – Čierny", en: "DIVA Hat – Black" },
    description: { sk: "Elegantný čierny klobúk s logom DIVA", en: "An elegant black hat with the DIVA logo" },
    price: "24,90 €",
    priceCents: 2490,
    images: [shopHatBlack6, shopHatBlack, shopHatBlack4, shopHatBlack7, shopHatBlack2, shopHatBlack5, shopHatBlack3],
  },
  {
    slug: "klobuk-bezovy",
    priceId: "klobuk_bezovy",
    name: { sk: "DIVA Klobúk – Béžový", en: "DIVA Hat – Beige" },
    description: { sk: "Klobúk v béžovej farbe s logom DIVA", en: "A beige hat with the DIVA logo" },
    price: "24,90 €",
    priceCents: 2490,
    images: [shopHatBeige8, shopHatBeige5, shopHatBeige9, shopHatBeige10, shopHatBeige4, shopHatBeige, shopHatBeige7],
  },
  {
    slug: "taska",
    priceId: "taska",
    name: { sk: "DIVA Taška", en: "DIVA Tote Bag" },
    description: { sk: "Bavlnená taška s logom DIVA Community", en: "Cotton tote bag with the DIVA Community logo" },
    price: "29,90 €",
    priceCents: 2990,
    images: [shopBag7, shopBag5, shopBag1, shopBag8, shopBag3, shopBag6, shopBag2, shopBag4],
  },
];
