import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useLang } from "@/i18n/LanguageProvider";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { CircleButton } from "@/components/ui/CircleButton";
import { ProductCard } from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ProductColor, ProductSize } from "@/types/db";
import { cn } from "@/lib/utils";

export function Product() {
  const { slug = "" } = useParams();
  const { data: product, isLoading } = useProduct(slug);
  const { lang, t, tf } = useLang();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const [selectedColorIdx, setSelectedColorIdx] = useState<number | null>(null);
  const [selectedColorLabel, setSelectedColorLabel] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);

  const displayProduct = product;

  const { data: relatedFromDB } = useProducts({
    categoryId: displayProduct?.category_id ?? undefined,
    limit: 5,
  });

  const relatedProducts = useMemo(() => {
    return (relatedFromDB ?? []).filter((p) => p.id !== (displayProduct?.id ?? "")).slice(0, 4);
  }, [relatedFromDB, displayProduct]);

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4 mt-6">
          <Skeleton className="min-h-[70vh] rounded-bento-lg" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-48 rounded-bento-lg" />
            <Skeleton className="h-56 rounded-bento-lg" />
            <Skeleton className="h-40 rounded-bento-lg" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Not found ── */
  if (!displayProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted font-mono text-sm">{t("not_found_sub")}</p>
          <Link to="/shop" className="text-brand font-mono text-xs mt-4 inline-block hover:underline">
            ← {t("nav_shop")}
          </Link>
        </div>
      </div>
    );
  }

  /* ── Derived values ── */
  const name        = lang === "ar" ? displayProduct.name_ar        : displayProduct.name_fr;
  const description = lang === "ar" ? displayProduct.description_ar : displayProduct.description_fr;
  const details     = lang === "ar" ? displayProduct.details_ar     : displayProduct.details_fr;
  const images      = displayProduct.product_images ?? [];
  const primaryImg  = images[activeImg]?.url ?? images[0]?.url ?? "";
  const isOnSale    = !!displayProduct.compare_at_price && displayProduct.compare_at_price > displayProduct.price;
  const colors: ProductColor[] = displayProduct.colors ?? [];
  const sizes: ProductSize[]   = displayProduct.sizes ?? [];
  const needsColor  = colors.length > 0;
  const needsSize   = sizes.length > 0;
  const canAdd      = displayProduct.stock > 0 && (!needsColor || selectedColorIdx !== null) && (!needsSize || !!selectedSize);

  const handleAddToCart = () => {
    if (!canAdd) return;
    addItem({
      productId: displayProduct.id,
      slug: displayProduct.slug,
      name_fr: displayProduct.name_fr,
      name_ar: displayProduct.name_ar,
      price: displayProduct.price,
      image: primaryImg,
      color: selectedColorLabel,
      size: selectedSize,
    });
    openCart();
  };

  /* ── Page ── */
  return (
    <div className="min-h-screen pt-20 pb-16 flex flex-col">

      {/* Back link */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-4">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted hover:text-brand transition-colors"
        >
          <ArrowLeft size={12} />
          {t("nav_shop")}
        </Link>
      </div>

      {/* ── Main grid ── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4 items-start">

          {/* ══ LEFT — image panel ══ */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative flex flex-col rounded-bento-lg bg-panel border border-line/30 overflow-hidden min-h-[60vh] lg:min-h-[80vh]"
          >
            {/* Main image area */}
            <div
              className="flex-1 relative flex items-center justify-center p-8 lg:p-12"
              style={{ background: "radial-gradient(ellipse at 60% 40%, rgb(var(--c-panel-2)) 0%, rgb(var(--c-bg)) 70%)" }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={primaryImg}
                  src={primaryImg}
                  alt={name}
                  className="max-h-[50vh] lg:max-h-[55vh] w-full object-contain drop-shadow-2xl"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                />
              </AnimatePresence>

              {/* PROMO badge floating */}
              {isOnSale && (
                <span className="absolute top-4 left-4 bg-brand text-ink text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-md">
                  {t("product_final_sale")}
                </span>
              )}

              {/* Style code — vertical on right edge */}
              {displayProduct.style_code && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex">
                  <span
                    className="text-[9px] font-mono text-muted/40 uppercase tracking-[0.3em] whitespace-nowrap select-none"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    {t("product_style")}: {displayProduct.style_code}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail strip (only if multiple images) */}
            {images.length > 1 && (
              <div className="flex gap-2 p-4 border-t border-line/30 overflow-x-auto scrollbar-none">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImg(i)}
                    className={cn(
                      "flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all",
                      i === activeImg ? "border-brand" : "border-line/40 hover:border-muted/60"
                    )}
                  >
                    <img src={img.url} alt={img.alt ?? name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description caption */}
            {description && (
              <div className={cn(
                "px-6 py-4 border-t border-line/30",
                images.length <= 1 && "mt-auto"
              )}>
                <p className={cn(
                  "text-[10px] font-mono text-muted/60 leading-relaxed",
                  lang === "ar" && "font-ar text-right text-xs"
                )}>
                  {description}
                </p>
              </div>
            )}
          </motion.div>

          {/* ══ RIGHT — info column ══ */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="flex flex-col gap-3"
          >
            {/* ── Title panel ── */}
            <div className="rounded-bento-lg bg-panel border border-line/30 p-6 lg:p-8">
              <h1
                className={cn(
                  "font-bold uppercase leading-[0.9] tracking-tight text-ink",
                  "text-4xl sm:text-5xl lg:text-5xl xl:text-6xl",
                  lang === "ar" && "font-ar text-right leading-tight tracking-normal text-3xl sm:text-4xl lg:text-4xl"
                )}
              >
                {name}
              </h1>
            </div>

            {/* ── Price + colour + size panel ── */}
            <div className="rounded-bento-lg bg-panel border border-line/30 p-6">

              {/* Price row */}
              <div className={cn("flex items-baseline gap-3 flex-wrap", lang === "ar" && "flex-row-reverse")}>
                <span className="text-3xl font-mono font-bold text-ink">
                  {formatPrice(displayProduct.price)}
                </span>
                {isOnSale && displayProduct.compare_at_price && (
                  <span className="text-sm font-mono text-muted/60 line-through">
                    {formatPrice(displayProduct.compare_at_price)}
                  </span>
                )}
              </div>
              {isOnSale && (
                <p className="text-[10px] font-mono text-brand uppercase tracking-widest mt-1">
                  {t("product_final_sale")}
                </p>
              )}

              <div className="border-t border-line/50 my-5" />

              {/* Colour */}
              {colors.length > 0 && (
                <div className="mb-5">
                  <p className={cn(
                    "text-[10px] font-mono uppercase tracking-widest text-muted mb-3",
                    lang === "ar" && "text-right"
                  )}>
                    {t("product_colour")}
                    {selectedColorLabel && (
                      <span className="text-ink font-bold ms-1">: {selectedColorLabel}</span>
                    )}
                  </p>
                  <div className={cn("flex flex-wrap gap-2.5", lang === "ar" && "flex-row-reverse")}>
                    {colors.map((c, idx) => (
                      <button
                        key={idx}
                        title={lang === "ar" ? c.label_ar : c.label_fr}
                        onClick={() => {
                          setSelectedColorIdx(idx);
                          setSelectedColorLabel(lang === "ar" ? c.label_ar : c.label_fr);
                        }}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all duration-150 relative flex items-center justify-center",
                          selectedColorIdx === idx
                            ? "border-brand scale-110 shadow-[0_0_0_2px_rgba(225,29,42,0.3)]"
                            : "border-line hover:border-muted hover:scale-105"
                        )}
                        style={{ backgroundColor: c.hex }}
                      >
                        {selectedColorIdx === idx && (
                          <Check
                            size={13}
                            className="text-ink drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                            strokeWidth={3}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-line/50 mt-5" />
                </div>
              )}

              {/* Size */}
              {sizes.length > 0 && (
                <div className="mb-5">
                  <p className={cn(
                    "text-[10px] font-mono uppercase tracking-widest text-muted mb-3",
                    lang === "ar" && "text-right"
                  )}>
                    {t("product_size")}
                    {selectedSize && (
                      <span className="text-ink font-bold ms-1">: {selectedSize}</span>
                    )}
                  </p>
                  <div className={cn("flex flex-wrap gap-2", lang === "ar" && "flex-row-reverse")}>
                    {sizes.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => setSelectedSize(s.label)}
                        className={cn(
                          "min-w-[48px] h-10 px-3 rounded-lg border text-[10px] font-mono uppercase tracking-wider transition-all",
                          selectedSize === s.label
                            ? "border-brand text-brand bg-brand/10 shadow-[0_0_0_1px_rgba(225,29,42,0.3)]"
                            : "border-line text-muted hover:border-muted hover:text-ink"
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-line/50 mt-5" />
                </div>
              )}

              {/* Stock */}
              <p className={cn(
                "text-[10px] font-mono uppercase tracking-widest",
                displayProduct.stock > 0 ? "text-muted/70" : "text-brand"
              )}>
                {displayProduct.stock > 0
                  ? tf("product_in_stock", displayProduct.stock)
                  : t("product_out_of_stock")}
              </p>

              {/* Selection hint */}
              {!canAdd && displayProduct.stock > 0 && (needsColor || needsSize) && (
                <p className="text-[10px] font-mono text-brand/70 mt-2">
                  {needsColor && selectedColorIdx === null && t("product_select_colour")}
                  {needsColor && selectedColorIdx === null && needsSize && !selectedSize && " · "}
                  {needsSize && !selectedSize && t("product_select_size")}
                </p>
              )}
            </div>

            {/* ── Details + Add to cart row ── */}
            <div className={cn(
              "flex flex-col sm:flex-row gap-3 items-start",
              (!details || details.length === 0) && "sm:justify-end"
            )}>
              {/* Details panel */}
              {details && details.length > 0 && (
                <div className="w-full sm:flex-1 rounded-bento bg-panel border border-line/30 p-5 min-w-0">
                  <h3 className="text-[10px] uppercase tracking-widest font-mono text-muted mb-4">
                    {t("product_details")}
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {details.map((d, i) => (
                      <li
                        key={i}
                        className={cn(
                          "text-[11px] font-mono text-ink/75 leading-relaxed flex items-start gap-2",
                          lang === "ar" && "font-ar text-sm flex-row-reverse"
                        )}
                      >
                        <span className="text-brand mt-0.5 flex-shrink-0 text-base leading-none">—</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Circle add-to-cart */}
              <div className="flex items-center justify-center w-full sm:w-auto sm:flex-shrink-0 py-2">
                <CircleButton
                  label={t("product_add_to_cart")}
                  size={140}
                  disabled={!canAdd}
                  onClick={handleAddToCart}
                  aria-label={t("product_add_to_cart")}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Related products ── */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 mb-4">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted mb-6">
              {t("product_related")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
