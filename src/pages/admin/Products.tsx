import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAllProductsAdmin } from "@/hooks/useProducts";
import { useLang } from "@/i18n/LanguageProvider";
import { formatPrice } from "@/lib/format";
import { BentoPanel } from "@/components/ui/BentoPanel";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export function AdminProducts() {
  const { t, lang } = useLang();
  const qc = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: products, isLoading } = useAllProductsAdmin();

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      setDeleteId(null);
    },
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-mono text-xl font-bold uppercase tracking-tight text-ink">
          {t("admin_products")}
        </h1>
        <Link to="/admin/products/new">
          <Button size="sm">
            <Plus size={12} /> {t("admin_new_product")}
          </Button>
        </Link>
      </div>

      <BentoPanel className="overflow-hidden">
        {isLoading ? (
          <div className="p-4 flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
          </div>
        ) : !products || products.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted font-mono text-xs">{t("admin_no_products")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-line/50">
                {["", "Nom FR", "Prix", "Stock", t("admin_status"), ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-start text-[9px] font-mono uppercase tracking-widest text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line/30">
              {products.map((product) => {
                const img = product.product_images?.[0]?.url;
                return (
                  <tr key={product.id} className="hover:bg-line/10 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-panel-2 flex-shrink-0">
                        {img ? (
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className={cn("text-xs font-mono font-bold text-ink", lang === "ar" && "font-ar")}>
                        {product.name_fr}
                      </p>
                      {product.style_code && (
                        <p className="text-[9px] font-mono text-muted mt-0.5">{product.style_code}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono font-bold text-brand">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "text-[10px] font-mono",
                        product.stock <= 3 ? "text-brand" : "text-muted"
                      )}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "text-[9px] font-mono uppercase tracking-wider px-2 py-1 rounded-md border",
                        product.status === "active"
                          ? "bg-brand/10 text-brand border-brand/30"
                          : "bg-line/30 text-muted border-line"
                      )}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          to={`/admin/products/${product.id}`}
                          className="text-muted hover:text-brand transition-colors"
                        >
                          <Pencil size={13} />
                        </Link>
                        {deleteId === product.id ? (
                          <>
                            <button onClick={() => remove.mutate(product.id)} className="text-brand text-[10px] font-mono hover:underline">
                              Oui
                            </button>
                            <button onClick={() => setDeleteId(null)} className="text-muted text-[10px] font-mono hover:underline">
                              Non
                            </button>
                          </>
                        ) : (
                          <button onClick={() => setDeleteId(product.id)} className="text-muted hover:text-brand transition-colors">
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
      </BentoPanel>
    </div>
  );
}
