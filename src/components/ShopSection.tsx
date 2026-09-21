import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { products } from "@/data/products";

const ShopSection = () => {
  return (
    <section id="shop" className="section-padding bg-background">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-light tracking-wide text-foreground">
            Shop
          </h2>
          <div className="mx-auto mt-4 w-16 h-[1px] bg-accent" />
          <p className="mt-6 font-body text-sm leading-relaxed text-muted-foreground tracking-wide max-w-md mx-auto">
            Oblečenie a merch pre DIVA Community.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product, index) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link to={`/shop/${product.slug}`} className="group block">
                <div className="overflow-hidden bg-muted">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="mt-4 space-y-1">
                  <h3 className="font-display text-lg font-light tracking-wide text-foreground">
                    {product.name}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground">
                    {product.price}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/shop"
            className="inline-block border border-foreground px-8 py-3 font-body text-xs tracking-[0.2em] text-foreground hover:bg-foreground hover:text-background transition-all duration-300 uppercase"
          >
            Pozrieť všetky produkty
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
