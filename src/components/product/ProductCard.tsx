import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { BentoPanel } from "@/components/ui/BentoPanel";
import { useLang } from "@/i18n/LanguageProvider";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart";
import type { ProductWithImages } from "@/types/db";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: ProductWithImages;
}

export function ProductCard({ product }: ProductCardProps) {
  const { lang, t } = useLang();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const name = lang === "ar" ? product.name_ar : product.name_fr;
  const primaryImage = product.product_images?.[0]?.url ?? "";
  const isOnSale = product.compare_at_price !== null && product.compare_at_price > product.price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      slug: product.slug,
      name_fr: product.name_fr,
      name_ar: product.name_ar,
      price: product.price,
      image: primaryImage,
      color: null,
      size: null,
    });
    openCart();
  };

  return (
    <Link to={`/product/${product.slug}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <BentoPanel className="group overflow-hidden cursor-pointer h-full flex flex-col">
          {/* Image */}
          <div className="relative aspect-square bg-panel-2 overflow-hidden">
            {primaryImage ? (
              <img
                src={primaryImage}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag size={32} className="text-line" />
              </div>
            )}

            {/* Sale badge */}
            {isOnSale && (
              <span className="absolute top-3 start-3 bg-brand text-ink text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded-md">
                {t("product_final_sale")}
              </span>
            )}

            {/* Quick add overlay */}
            <div className="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleQuickAdd}
                className="w-9 h-9 rounded-full bg-brand hover:bg-brand-light text-ink flex items-center justify-center transition-colors shadow-lg"
                aria-label={t("product_add_to_cart")}
              >
                <ShoppingBag size={14} />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 flex flex-col gap-2 flex-1">
            <p className={cn(
              "text-xs font-mono text-ink uppercase tracking-wide leading-snug line-clamp-2",
              lang === "ar" && "font-ar text-sm normal-case tracking-normal"
            )}>
              {name}
            </p>
            <div className="flex items-center gap-2 mt-auto">
              <span className="text-brand font-mono text-sm">{formatPrice(product.price)}</span>
              {isOnSale && product.compare_at_price && (
                <span className="text-muted font-mono text-xs line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>
          </div>
        </BentoPanel>
      </motion.div>
    </Link>
  );
}
