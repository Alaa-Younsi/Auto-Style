import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useLang } from "@/i18n/LanguageProvider";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { Gallery } from "@/components/product/Gallery";
import { ColorSwatches } from "@/components/product/ColorSwatches";
import { SizeSelector } from "@/components/product/SizeSelector";
import { CircleButton } from "@/components/ui/CircleButton";
import { ProductCard } from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export function Product() {
  const { slug = "" } = useParams();
  const { data: product, isLoading, error } = useProduct(slug);
  const { lang, t, tf } = useLang();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedColorLabel, setSelectedColorLabel] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const { data: related } = useProducts({
    categoryId: product?.category_id ?? undefined,
    limit: 4,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="aspect-square" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-20 w-3/4" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
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

  const name = lang === "ar" ? product.name_ar : product.name_fr;
  const description = lang === "ar" ? product.description_ar : product.description_fr;
  const details = lang === "ar" ? product.details_ar : product.details_fr;
  const primaryImage = product.product_images?.[0]?.url ?? "";
  const isOnSale = product.compare_at_price !== null && product.compare_at_price > product.price;
  const needsColor = product.colors.length > 0;
  const needsSize = product.sizes.length > 0;
  const canAdd =
    product.stock > 0 &&
    (!needsColor || selectedColor !== null) &&
    (!needsSize || selectedSize !== null);

  const handleAddToCart = () => {
    if (!canAdd) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name_fr: product.name_fr,
      name_ar: product.name_ar,
      price: product.price,
      image: primaryImage,
      color: selectedColorLabel,
      size: selectedSize,
    });
    openCart();
  };

  const relatedProducts = (related ?? []).filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted hover:text-brand transition-colors"
        >
          <ArrowLeft size={12} />
          {t("nav_shop")}
        </Link>
      </div>

      {/* Main product layout — matches reference */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 items-start">

          {/* LEFT — product image / gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="rounded-bento-lg bg-panel border border-line/30 overflow-hidden shadow-panel p-2">
              <Gallery images={product.product_images ?? []} productName={name} />

              {/* Bottom caption */}
              {description && (
                <p className={cn(
                  "px-4 pb-4 pt-2 text-[10px] font-mono text-muted/70 leading-relaxed",
                  lang === "ar" && "font-ar text-right text-xs"
                )}>
                  {description}
                </p>
              )}
            </div>

            {/* Vertical style code */}
            {product.style_code && (
              <div className="absolute top-1/2 -translate-y-1/2 -start-6 hidden lg:flex">
                <span
                  className="text-[9px] font-mono text-muted/50 uppercase tracking-[0.3em] whitespace-nowrap"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  {t("product_style")}: {product.style_code}
                </span>
              </div>
            )}
          </motion.div>

          {/* RIGHT — info panels */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="flex flex-col gap-4"
          >
            {/* Title panel */}
            <div className="rounded-bento-lg bg-panel border border-line/30 shadow-panel p-6 lg:p-8">
              <h1
                className={cn(
                  "text-3xl sm:text-4xl lg:text-5xl font-mono font-bold uppercase leading-none tracking-tight text-ink",
                  lang === "ar" && "font-ar text-right leading-tight tracking-normal text-3xl sm:text-4xl"
                )}
              >
                {name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4 mt-6">
                <span className="text-2xl font-mono text-ink">{formatPrice(product.price)}</span>
                {isOnSale && product.compare_at_price && (
                  <>
                    <span className="text-muted font-mono text-sm line-through">
                      {formatPrice(product.compare_at_price)}
                    </span>
                    <span className="bg-brand text-ink text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded-md">
                      {t("product_final_sale")}
                    </span>
                  </>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-line/50 my-5" />

              {/* Color swatches */}
              <ColorSwatches
                colors={product.colors}
                selected={selectedColor}
                onSelect={(hex, label) => {
                  setSelectedColor(hex);
                  setSelectedColorLabel(label);
                }}
              />

              {/* Size selector */}
              {product.sizes.length > 0 && (
                <div className="mt-4">
                  <SizeSelector
                    sizes={product.sizes}
                    selected={selectedSize}
                    onSelect={setSelectedSize}
                  />
                </div>
              )}

              {/* Stock */}
              <p className={cn(
                "text-[10px] font-mono mt-4",
                product.stock > 0 ? "text-muted" : "text-brand"
              )}>
                {product.stock > 0
                  ? tf("product_in_stock", product.stock)
                  : t("product_out_of_stock")}
              </p>

              {/* Validation hint */}
              {!canAdd && product.stock > 0 && (
                <p className="text-[10px] font-mono text-muted/60 mt-1">
                  {needsColor && !selectedColor && t("product_select_colour")}
                  {needsSize && !selectedSize && t("product_select_size")}
                </p>
              )}
            </div>

            {/* Details panel */}
            {details && details.length > 0 && (
              <div className="rounded-bento bg-panel border border-line/30 shadow-panel p-6">
                <h3 className="text-[10px] uppercase tracking-widest font-mono text-muted mb-4">
                  {t("product_details")}
                </h3>
                <ul className="flex flex-col gap-2">
                  {details.map((d, i) => (
                    <li
                      key={i}
                      className={cn(
                        "text-xs font-mono text-ink/80 leading-relaxed flex items-start gap-2",
                        lang === "ar" && "font-ar text-sm flex-row-reverse"
                      )}
                    >
                      <span className="text-brand mt-0.5 flex-shrink-0">—</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ADD TO CART circle button + style code (mobile) */}
            <div className="flex items-center justify-between gap-4 px-2">
              {product.style_code && (
                <span className="text-[10px] font-mono text-muted/50 uppercase tracking-[0.3em] lg:hidden">
                  {t("product_style")}: {product.style_code}
                </span>
              )}
              <div className={cn("flex", !product.style_code && "w-full justify-center")}>
                <CircleButton
                  label={t("product_add_to_cart")}
                  size={148}
                  disabled={!canAdd}
                  onClick={handleAddToCart}
                  aria-label={t("product_add_to_cart")}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 mb-4">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted mb-6">
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
