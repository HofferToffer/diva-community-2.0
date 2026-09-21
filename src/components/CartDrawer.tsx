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
import { formatPriceCents } from "@/data/products";

const CartDrawer = () => {
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
          aria-label="Košík"
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
            Košík
          </SheetTitle>
          <SheetDescription className="font-body text-xs tracking-wide">
            {totalItems === 0
              ? "Váš košík je prázdny"
              : `${totalItems} ${totalItems === 1 ? "produkt" : totalItems < 5 ? "produkty" : "produktov"} v košíku`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="font-body text-sm text-muted-foreground">Váš košík je prázdny</p>
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
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-base font-light tracking-wide truncate">
                          {item.name}
                        </h4>
                        <p className="mt-1 font-body text-sm text-foreground">
                          {formatPriceCents(item.priceCents)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <button
                          onClick={() => removeItem(item.priceId)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Odstrániť"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.priceId, item.quantity - 1)}
                            className="h-6 w-6 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                            aria-label="Menej"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-7 text-center font-body text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.priceId, item.quantity + 1)}
                            className="h-6 w-6 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                            aria-label="Viac"
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
                    Celkom
                  </span>
                  <span className="font-display text-xl text-foreground">
                    {formatPriceCents(totalCents)}
                  </span>
                </div>
                <p className="font-body text-[11px] text-muted-foreground">
                  Doprava sa vypočíta pri platbe.
                </p>
                <button
                  onClick={handleCheckout}
                  disabled={items.length === 0}
                  className="w-full inline-flex items-center justify-center gap-2 bg-foreground px-8 py-3 font-body text-xs tracking-[0.2em] uppercase text-background hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <ArrowRight size={14} />
                  Prejsť k platbe
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
