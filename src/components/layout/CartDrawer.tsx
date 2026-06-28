import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cart";
import { useLang } from "@/i18n/LanguageProvider";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const SHIPPING_FEE = 500;
const FREE_SHIP_THRESHOLD = 5000;

export function CartDrawer() {
  const { t, tf, lang, dir } = useLang();
  const { isOpen, closeCart, items, removeItem, updateQty, subtotal, clearCart } = useCartStore();

  const sub = subtotal();
  const shipping = sub >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = sub + shipping;
  const gap = FREE_SHIP_THRESHOLD - sub;

  return (
    <Drawer
      open={isOpen}
      onClose={closeCart}
      title={t("cart_title")}
      side={dir === "rtl" ? "left" : "right"}
    >
      <div className="flex flex-col h-full">
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 py-12">
            <p className="text-muted font-mono text-xs uppercase tracking-wider">
              {t("cart_empty")}
            </p>
            <Link to="/shop" onClick={closeCart}>
              <Button variant="outline" size="sm">
                {t("cart_empty_cta")}
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Items list */}
            <ul className="flex-1 overflow-y-auto scrollbar-none divide-y divide-line/40">
              {items.map((item) => {
                const name = lang === "ar" ? item.name_ar : item.name_fr;
                return (
                  <li
                    key={`${item.productId}|${item.color}|${item.size}`}
                    className="flex gap-4 px-5 py-4"
                  >
                    {/* Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-panel-2 flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-panel-2" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-xs font-mono text-ink leading-tight truncate",
                        lang === "ar" && "font-ar"
                      )}>
                        {name}
                      </p>
                      {(item.color || item.size) && (
                        <p className="text-[10px] text-muted mt-0.5 font-mono">
                          {[item.color, item.size].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      <p className="text-brand text-xs font-mono mt-1">
                        {formatPrice(item.price)}
                      </p>

                      {/* Qty + remove */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQty(item.productId, item.color, item.size, item.qty - 1)}
                          className="w-6 h-6 rounded-md border border-line flex items-center justify-center text-muted hover:text-ink hover:border-muted transition-colors"
                          aria-label="Diminuer"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="text-xs font-mono w-5 text-center text-ink">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.productId, item.color, item.size, item.qty + 1)}
                          className="w-6 h-6 rounded-md border border-line flex items-center justify-center text-muted hover:text-ink hover:border-muted transition-colors"
                          aria-label="Augmenter"
                        >
                          <Plus size={10} />
                        </button>
                        <button
                          onClick={() => removeItem(item.productId, item.color, item.size)}
                          className="ms-auto text-muted hover:text-brand transition-colors"
                          aria-label={t("cart_remove")}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Footer totals */}
            <div className="border-t border-line/40 px-5 py-5 flex flex-col gap-3">
              {/* Free shipping progress */}
              {gap > 0 && (
                <p className="text-[10px] font-mono text-muted text-center">
                  {tf("cart_free_threshold", formatPrice(gap))}
                </p>
              )}

              <div className="flex justify-between text-xs font-mono text-muted">
                <span>{t("cart_subtotal")}</span>
                <span className="text-ink">{formatPrice(sub)}</span>
              </div>
              <div className="flex justify-between text-xs font-mono text-muted">
                <span>{t("cart_shipping")}</span>
                <span className={shipping === 0 ? "text-brand" : "text-ink"}>
                  {shipping === 0 ? t("cart_shipping_free") : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-mono text-ink border-t border-line/40 pt-3 mt-1">
                <span className="uppercase tracking-widest text-[10px] self-end text-muted">
                  {t("cart_total")}
                </span>
                <span className="text-base text-brand">{formatPrice(total)}</span>
              </div>

              <Link to="/checkout" onClick={closeCart}>
                <Button size="lg" className="w-full mt-1">
                  {t("cart_checkout")}
                </Button>
              </Link>

              <button
                onClick={clearCart}
                className="text-[10px] font-mono text-muted/50 hover:text-brand text-center transition-colors"
              >
                Vider le panier
              </button>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}
