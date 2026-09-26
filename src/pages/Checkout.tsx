import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { ArrowLeft, Banknote, CheckCircle2, CreditCard, Loader2, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore } from "@/stores/cartStore";
import { products, formatPriceCents } from "@/data/products";
import { useLang } from "@/lib/lang";

type PaymentMethod = "card" | "cash";

const Checkout = () => {
  const { l, pick, lang } = useLang();
  const { items, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cartLines = items
    .map((i) => {
      const product = products.find((p) => p.priceId === i.priceId);
      return product ? { product, quantity: i.quantity } : null;
    })
    .filter((l): l is { product: (typeof products)[number]; quantity: number } => l !== null);

  const subtotalCents = cartLines.reduce((sum, line) => sum + line.product.priceCents * line.quantity, 0);

  const fetchClientSecret = async (): Promise<string> => {
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        items: items.map((i) => ({ priceId: i.priceId, quantity: i.quantity })),
        returnUrl: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
        environment: getStripeEnvironment(),
        language: lang,
      },
    });
    if (error || !data?.clientSecret) {
      throw new Error(error?.message || l("Nepodarilo sa vytvoriť platbu", "We couldn't start the payment"));
    }
    return data.clientSecret;
  };

  const submitCashOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setOrderError(null);
    try {
      const { data, error } = await supabase.functions.invoke("create-order", {
        body: {
          items: items.map((i) => ({ priceId: i.priceId, quantity: i.quantity })),
          customerName: name,
          email,
          phone,
          environment: getStripeEnvironment(),
        },
      });
      if (error || !data?.orderId) {
        throw new Error(data?.error || error?.message || l("Objednávku sa nepodarilo odoslať", "We couldn't send your order"));
      }
      setOrderPlaced(true);
      clearCart();
      window.scrollTo(0, 0);
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : l("Objednávku sa nepodarilo odoslať", "We couldn't send your order"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PaymentTestModeBanner />

      <section className="pt-28 pb-10 px-6 md:px-12 lg:px-24 bg-foreground">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl md:text-5xl font-light tracking-wide text-primary-foreground">
            {l("Pokladňa", "Checkout")}
          </h1>
          <div className="mx-auto mt-4 w-16 h-[1px] bg-accent" />
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 md:px-12 pt-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors uppercase"
        >
          <ArrowLeft size={14} />
          {l("Späť do shopu", "Back to the shop")}
        </Link>
      </div>

      <section className="mx-auto max-w-3xl px-6 md:px-12 py-10">
        {orderPlaced ? (
          <div className="py-16 text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-6 text-foreground" strokeWidth={1.5} />
            <h2 className="font-display text-3xl font-light tracking-wide text-foreground">
              {l("Ďakujeme za objednávku", "Thank you for your order")}
            </h2>
            <div className="mx-auto mt-4 w-16 h-[1px] bg-accent" />
            <p className="mt-6 font-body text-sm leading-relaxed text-muted-foreground tracking-wide">
              {l(
                "Vašu objednávku sme prijali. Čoskoro vás budeme kontaktovať e-mailom a dohodneme si osobný odber. Platba prebehne v hotovosti pri prevzatí.",
                "We've got your order! We'll email you soon to arrange pickup, and you'll pay in cash when you collect it.",
              )}
            </p>
            <Link
              to="/shop"
              className="mt-10 inline-block border border-foreground px-8 py-3 font-body text-xs tracking-[0.2em] uppercase text-foreground hover:bg-foreground hover:text-background transition-all"
            >
              {l("Späť do shopu", "Back to the shop")}
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="font-body text-sm text-muted-foreground mb-6">
              {l("Váš košík je prázdny.", "Your bag is empty.")}
            </p>
            <Link
              to="/shop"
              className="inline-block border border-foreground px-8 py-3 font-body text-xs tracking-[0.2em] uppercase text-foreground hover:bg-foreground hover:text-background transition-all"
            >
              {l("Pokračovať v nákupe", "Keep shopping")}
            </Link>
          </div>
        ) : (
          <div>
            {/* Payment method selection */}
            <h2 className="font-display text-2xl font-light tracking-wide text-foreground mb-6">
              {l("Spôsob platby", "Payment method")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`border p-5 text-left transition-all ${
                  paymentMethod === "card"
                    ? "border-foreground bg-foreground/5"
                    : "border-border hover:border-foreground/50"
                }`}
              >
                <CreditCard className="h-5 w-5 mb-3 text-foreground" strokeWidth={1.5} />
                <p className="font-body text-sm tracking-wide text-foreground uppercase">
                  {l("Kartou online", "Card online")}
                </p>
                <p className="mt-1 font-body text-xs text-muted-foreground">
                  {l("Osobný odber (0 €) alebo Packeta (5 €)", "Pickup in person (€0) or Packeta (€5)")}
                </p>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("cash")}
                className={`border p-5 text-left transition-all ${
                  paymentMethod === "cash"
                    ? "border-foreground bg-foreground/5"
                    : "border-border hover:border-foreground/50"
                }`}
              >
                <Banknote className="h-5 w-5 mb-3 text-foreground" strokeWidth={1.5} />
                <p className="font-body text-sm tracking-wide text-foreground uppercase">
                  {l("Hotovosť", "Cash")}
                </p>
                <p className="mt-1 font-body text-xs text-muted-foreground">
                  {l("Iba pri osobnom odbere (0 €)", "Pickup in person only (€0)")}
                </p>
              </button>
            </div>

            {paymentMethod === "card" ? (
              <div id="checkout" className="min-h-[400px]">
                <EmbeddedCheckoutProvider
                  stripe={getStripe()}
                  options={{ fetchClientSecret }}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </div>
            ) : (
              <div>
                {/* Order summary */}
                <div className="border border-border p-6 mb-8">
                  <h3 className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                    {l("Vaša objednávka", "Your order")}
                  </h3>
                  <ul className="space-y-3">
                    {cartLines.map((line) => (
                      <li key={line.product.priceId} className="flex justify-between font-body text-sm text-foreground">
                        <span>
                          {pick(line.product.name)} × {line.quantity}
                        </span>
                        <span>{formatPriceCents(line.product.priceCents * line.quantity)}</span>
                      </li>
                    ))}
                    <li className="flex justify-between font-body text-sm text-muted-foreground">
                      <span>{l("Osobný odber", "Pickup in person")}</span>
                      <span>{l("zadarmo", "free")}</span>
                    </li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-border flex justify-between font-body text-sm tracking-wide text-foreground uppercase">
                    <span>{l("Spolu", "Total")}</span>
                    <span>{formatPriceCents(subtotalCents)}</span>
                  </div>
                </div>

                <form onSubmit={submitCashOrder} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                      {l("Meno a priezvisko", "Full name")} *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-border bg-background px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                      E-mail *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-border bg-background px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                      {l("Telefón", "Phone")}
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-border bg-background px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>

                  {orderError && (
                    <p className="font-body text-sm text-destructive">{orderError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full border border-foreground bg-foreground px-8 py-4 font-body text-xs tracking-[0.2em] uppercase text-background hover:bg-background hover:text-foreground transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {l("Odoslať objednávku", "Place order")}
                  </button>
                  <p className="font-body text-xs text-muted-foreground text-center">
                    {l("Objednávkou súhlasíte s platbou v hotovosti pri osobnom odbere.", "By placing your order, you agree to pay in cash at pickup.")}
                  </p>
                </form>
              </div>
            )}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Checkout;
