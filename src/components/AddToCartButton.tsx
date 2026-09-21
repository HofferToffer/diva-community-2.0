import { Loader2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import type { Product } from "@/data/products";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  label?: string;
}

const AddToCartButton = ({ product, className, label }: AddToCartButtonProps) => {
  const addItem = useCartStore((s) => s.addItem);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = () => {
    setIsLoading(true);
    addItem(product, 1);
    toast.success("Pridané do košíka", {
      description: product.name,
      position: "top-center",
    });
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={isLoading}
      className={
        className ??
        "inline-flex items-center justify-center gap-2 bg-foreground px-8 py-3 font-body text-xs tracking-[0.2em] uppercase text-background hover:opacity-90 transition-opacity disabled:opacity-50"
      }
    >
      {isLoading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <>
          <ShoppingBag size={14} />
          {label ?? "Pridať do košíka"}
        </>
      )}
    </button>
  );
};

export default AddToCartButton;
