import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "@/components/AddToCartButton";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { products } from "@/data/products";
import shopHero from "@/assets/shop-hero.jpg.asset.json";
import { useLang } from "@/lib/lang";

const Shop = () => {
  const { l, pick } = useLang();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PaymentTestModeBanner />

      {/* Hero */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-[center_30%]"
          style={{ backgroundImage: `url(${shopHero.url})` }}
        />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="relative z-10 flex h-full items-center justify-center px-6 md:px-12 lg:px-24">
          <div className="mx-auto max-w-7xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-display text-5xl md:text-7xl font-light tracking-wide text-primary-foreground"
            >
              Shop
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="mx-auto mt-4 w-16 h-[1px] bg-accent" />
              <p className="mt-6 font-body text-sm tracking-wide text-primary-foreground/80 max-w-md mx-auto">
                {l("Oblečenie a merch pre DIVA Community. Objednávka a platba online.", "Clothing and merch for the DIVA Community. Order and pay online.")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Back link */}
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors uppercase"
        >
          <ArrowLeft size={14} />
          {l("Späť na hlavnú", "Back to home")}
        </Link>
      </div>

      {/* Products Grid */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <ProductGallery
                images={product.images}
                name={pick(product.name)}
                to={`/shop/${product.slug}`}
              />
              <div className="mt-4 space-y-1">
                <h3 className="font-display text-xl font-light tracking-wide text-foreground">
                  <Link
                    to={`/shop/${product.slug}`}
                    className="hover:text-accent transition-colors"
                  >
                    {pick(product.name)}
                  </Link>
                </h3>
                <p className="font-body text-sm text-muted-foreground line-clamp-2">
                  {pick(product.description)}
                </p>
                <div className="pt-2 flex items-center justify-between gap-4">
                  <span className="font-display text-lg text-foreground">
                    {product.price}
                  </span>
                  <Link
                    to={`/shop/${product.slug}`}
                    className="font-body text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors border-b border-transparent hover:border-foreground"
                  >
                    {l("Detail produktu", "View product")}
                  </Link>
                </div>
                <div className="pt-3">
                  <AddToCartButton
                    product={product}
                    className="w-full inline-flex items-center justify-center gap-2 border border-foreground px-6 py-3 font-body text-[11px] tracking-[0.2em] uppercase text-foreground hover:bg-foreground hover:text-background transition-all disabled:opacity-50"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;
