import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCartStore } from "@/stores/cartStore";
import { supabase } from "@/integrations/supabase/client";
import { getStripeEnvironment } from "@/lib/stripe";
import { useLang } from "@/lib/lang";

const CheckoutReturn = () => {
  const { l } = useLang();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (sessionId) {
      // Record the paid order server-side (idempotent) and notify the shop owner
      supabase.functions
        .invoke("confirm-order", {
          body: { sessionId, environment: getStripeEnvironment() },
        })
        .catch((err) => console.error("confirm-order failed", err));
      // Small delay so a still-open embedded checkout doesn't restore the cart
      const t = setTimeout(() => clearCart(), 500);
      return () => clearTimeout(t);
    }
  }, [sessionId, clearCart]);


  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-40 pb-32 px-6 text-center">
        {sessionId ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-md"
          >
            <CheckCircle2 className="h-12 w-12 mx-auto mb-6 text-foreground" strokeWidth={1.5} />
            <h1 className="font-display text-4xl font-light tracking-wide text-foreground">
              {l("Ďakujeme za objednávku", "Thank you for your order")}
            </h1>
            <div className="mx-auto mt-4 w-16 h-[1px] bg-accent" />
            <p className="mt-6 font-body text-sm leading-relaxed text-muted-foreground tracking-wide">
              {l("Vaša platba prebehla úspešne. Potvrdenie objednávky vám príde e-mailom.", "Your payment went through. We'll email you the order confirmation.")}
            </p>
            <Link
              to="/shop"
              className="mt-10 inline-block border border-foreground px-8 py-3 font-body text-xs tracking-[0.2em] uppercase text-foreground hover:bg-foreground hover:text-background transition-all"
            >
              {l("Späť do shopu", "Back to the shop")}
            </Link>
          </motion.div>
        ) : (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default CheckoutReturn;
