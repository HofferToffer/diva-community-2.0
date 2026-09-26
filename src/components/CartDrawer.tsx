import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPriceCents, products } from "@/data/products";
import { useLang } from "@/lib/lang";

const CartDrawer = () => {
  const { l, pick } = useLang();
  // The cart stores the Slovak name; show the product's name in her language when we still sell it.
  const itemName = (item: { priceId: string; name: string }) => {
    const product = products.find((p) => p.priceId === item.priceId);
    return product ? pick(product.name) : item.name;
  };
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem } = useCartStore();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalCents = items.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0
  );

  const handleCheckout = () => {
    setIsOpen(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          className="relative text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          aria-label={l("Košík", "Bag")}
        >
          <ShoppingBag size={19} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[hsl(var(--shop))] text-[10px] font-body text-[hsl(var(--shop-foreground))]">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="flex-shrink-0 text-left">
          <SheetTitle className="font-display text-2xl font-light tracking-wide">
            {l("Košík", "Your bag")}
          </SheetTitle>
          <SheetDescription className="font-body text-xs tracking-wide">
            {totalItems === 0
              ? l("Váš košík je prázdny", "Your bag is empty")
              : l(
                  `${totalItems} ${totalItems === 1 ? "produkt" : totalItems < 5 ? "produkty" : "produktov"} v košíku`,
                  `${totalItems} ${totalItems === 1 ? "item" : "items"} in your bag`,
                )}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="font-body text-sm text-muted-foreground">{l("Váš košík je prázdny", "Your bag is empty")}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-5">
                  {items.map((item) => (
                    <div key={item.priceId} className="flex gap-4">
                      <div className="w-16 h-20 bg-muted overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={itemName(item)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-base font-light tracking-wide truncate">
                          {itemName(item)}
                        </h4>
                        <p className="mt-1 font-body text-sm text-foreground">
                          {formatPriceCents(item.priceCents)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <button
                          onClick={() => removeItem(item.priceId)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={l("Odstrániť", "Remove")}
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.priceId, item.quantity - 1)}
                            className="h-6 w-6 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                            aria-label={l("Menej", "Fewer")}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-7 text-center font-body text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.priceId, item.quantity + 1)}
                            className="h-6 w-6 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                            aria-label={l("Viac", "More")}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-shrink-0 space-y-4 pt-6 mt-4 border-t border-border bg-background">
                <div className="flex justify-between items-center">
                  <span className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    {l("Celkom", "Total")}
                  </span>
                  <span className="font-display text-xl text-foreground">
                    {formatPriceCents(totalCents)}
                  </span>
                </div>
                <p className="font-body text-[11px] text-muted-foreground">
                  {l("Doprava sa vypočíta pri platbe.", "Shipping is calculated at checkout.")}
                </p>
                <button
                  onClick={handleCheckout}
                  disabled={items.length === 0}
                  className="w-full inline-flex items-center justify-center gap-2 bg-foreground px-8 py-3 font-body text-xs tracking-[0.2em] uppercase text-background hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <ArrowRight size={14} />
                  {l("Prejsť k platbe", "Go to checkout")}
                </button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
