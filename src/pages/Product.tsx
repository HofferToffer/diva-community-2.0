import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useSeo } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "@/components/AddToCartButton";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { products } from "@/data/products";
import { useLang } from "@/lib/lang";

const Product = () => {
  const { l, pick } = useLang();
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  useSeo(
    product
      ? { title: pick(product.name), description: pick(product.description), image: product.images[0], path: `/shop/${product.slug}`, type: "product" }
      : { title: l("Produkt sa nenašiel", "Product not found"), noindex: true },
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-40 pb-24 text-center px-6">
          <h1 className="font-display text-3xl font-light text-foreground">
            {l("Produkt sa nenašiel", "Product not found")}
          </h1>
          <Link
            to="/shop"
            className="mt-8 inline-block border border-foreground px-8 py-3 font-body text-xs tracking-[0.2em] uppercase text-foreground hover:bg-foreground hover:text-background transition-all"
          >
            {l("Späť do shopu", "Back to the shop")}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const others = products.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PaymentTestModeBanner />

      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 pt-28">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors uppercase"
        >
          <ArrowLeft size={14} />
          {l("Späť do shopu", "Back to the shop")}
        </Link>
      </div>

      <section className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid gap-10 md:grid-cols-2 md:items-start"
        >
          <ProductGallery images={product.images} name={pick(product.name)} />

          <div className="md:pt-4">
            <h1 className="font-display text-3xl md:text-4xl font-light tracking-wide text-foreground">
              {pick(product.name)}
            </h1>
            <div className="mt-4 w-16 h-[1px] bg-accent" />
            <p className="mt-6 font-body text-sm leading-relaxed text-muted-foreground tracking-wide whitespace-pre-line">
              {pick(product.description)}
            </p>
            <p className="mt-6 font-display text-2xl text-foreground">
              {product.price}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <AddToCartButton product={product} />
            </div>

            <p className="mt-6 font-body text-[11px] text-muted-foreground">
              {l("Bezpečná platba kartou. Osobný odber zadarmo alebo Packeta za 5,00 €.", "Secure card payment. Free pickup in person, or Packeta delivery for €5.00.")}
            </p>
          </div>
        </motion.div>
      </section>

      {others.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 pb-20">
          <h2 className="font-display text-2xl font-light tracking-wide text-foreground mb-8">
            {l("Ďalšie produkty", "You might also like")}
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {others.map((p) => (
              <Link key={p.slug} to={`/shop/${p.slug}`} className="group block">
                <div className="overflow-hidden bg-muted">
                  <img
                    src={p.images[0]}
                    alt={pick(p.name)}
                    className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-4 font-display text-lg font-light tracking-wide text-foreground">
                  {pick(p.name)}
                </h3>
                <p className="font-body text-sm text-muted-foreground">
                  {p.price}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Product;
