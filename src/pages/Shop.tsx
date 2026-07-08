import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useLang } from "@/i18n/LanguageProvider";
import { useSeo } from "@/hooks/useSeo";
import { ProductCard } from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

type SortOption = "newest" | "price_asc" | "price_desc" | "featured";

export function Shop() {
  const { t, lang, tf } = useLang();

  useSeo({
    title: lang === "ar" ? "المتجر — أوتو ستايل" : "Boutique — Auto Style",
    description: lang === "ar"
      ? "تصفح جميع إكسسوارات السيارات في أوتو ستايل. توصيل لجميع ولايات الجزائر الـ69."
      : "Découvrez tous les accessoires automobiles Auto Style. Livraison dans les 69 wilayas d'Algérie.",
  });

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);

  const { data: products, isLoading } = useProducts({ search: search || undefined });
  const { data: categories } = useCategories();

  const filtered = useMemo(() => {
    let list = products ?? [];
    if (categoryId) list = list.filter((p) => p.category_id === categoryId);
    switch (sort) {
      case "price_asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price_desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "featured": list = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
      default: break;
    }
    return list;
  }, [products, categoryId, sort]);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: t("shop_sort_newest") },
    { value: "featured", label: t("shop_sort_featured") },
    { value: "price_asc", label: t("shop_sort_price_asc") },
    { value: "price_desc", label: t("shop_sort_price_desc") },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Page title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-4xl sm:text-6xl font-bold uppercase tracking-tight text-ink"
        >
          {t("shop_title")}
        </motion.h1>
      </div>

      {/* Search + controls bar */}
      <div className="sticky top-20 z-20 bg-bg/90 backdrop-blur-md border-b border-line/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input
              type="search"
              placeholder={t("shop_search_placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-panel border border-line rounded-lg ps-9 pe-4 py-2.5 text-xs font-mono text-ink placeholder:text-muted/50 focus:outline-none focus:border-muted transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-panel border border-line rounded-lg px-3 py-2.5 text-[10px] font-mono text-muted focus:outline-none cursor-pointer hidden sm:block"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={cn(
              "p-2.5 rounded-lg border transition-colors flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider",
              showFilters ? "border-brand text-brand bg-brand/10" : "border-line text-muted hover:border-muted hover:text-ink"
            )}
          >
            <SlidersHorizontal size={13} />
            <span className="hidden sm:inline">Filtres</span>
          </button>

          {/* Count */}
          <span className="text-[10px] font-mono text-muted/60 ms-auto hidden sm:block">
            {isLoading ? t("shop_loading") : tf("shop_results", filtered.length)}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 flex gap-6">
        {/* Sidebar filter (categories) */}
        {showFilters && (
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-48 flex-shrink-0 hidden sm:flex flex-col gap-1"
          >
            <button
              onClick={() => setCategoryId(null)}
              className={cn(
                "text-start text-xs font-mono py-2 px-3 rounded-lg transition-colors",
                !categoryId ? "bg-brand/10 text-brand" : "text-muted hover:text-ink hover:bg-line/40"
              )}
            >
              {t("shop_all_categories")}
            </button>
            {(categories ?? []).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryId(cat.id)}
                className={cn(
                  "text-start text-xs font-mono py-2 px-3 rounded-lg transition-colors",
                  categoryId === cat.id ? "bg-brand/10 text-brand" : "text-muted hover:text-ink hover:bg-line/40",
                  lang === "ar" && "font-ar text-right"
                )}
              >
                {lang === "ar" ? cat.name_ar : cat.name_fr}
              </button>
            ))}
          </motion.aside>
        )}

        {/* Mobile category pills */}
        {showFilters && (
          <div className="sm:hidden w-full flex gap-2 overflow-x-auto scrollbar-none pb-1 mb-2">
            <button
              onClick={() => setCategoryId(null)}
              className={cn(
                "flex-shrink-0 text-[10px] font-mono px-3 py-1.5 rounded-full border transition-colors",
                !categoryId ? "border-brand bg-brand/10 text-brand" : "border-line text-muted"
              )}
            >
              {t("shop_all_categories")}
            </button>
            {(categories ?? []).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryId(cat.id)}
                className={cn(
                  "flex-shrink-0 text-[10px] font-mono px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap",
                  categoryId === cat.id ? "border-brand bg-brand/10 text-brand" : "border-line text-muted",
                  lang === "ar" && "font-ar"
                )}
              >
                {lang === "ar" ? cat.name_ar : cat.name_fr}
              </button>
            ))}
          </div>
        )}

        {/* Products grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4]" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <p className="text-muted font-mono text-xs uppercase tracking-wider">
                {t("shop_no_results")}
              </p>
              {(search || categoryId) && (
                <button
                  onClick={() => { setSearch(""); setCategoryId(null); }}
                  className="text-brand text-xs font-mono hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.05 } },
              }}
            >
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <ProductCard product={product} priority={i < 4} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
