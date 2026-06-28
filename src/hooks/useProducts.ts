import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { ProductWithImages } from "@/types/db";

export function useProducts(opts?: {
  categoryId?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ["products", opts],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*, product_images(*), categories(*)")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (opts?.categoryId) query = query.eq("category_id", opts.categoryId);
      if (opts?.featured) query = query.eq("featured", true);
      if (opts?.limit) query = query.limit(opts.limit);
      if (opts?.search) {
        query = query.or(
          `name_fr.ilike.%${opts.search}%,name_ar.ilike.%${opts.search}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as ProductWithImages[];
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_images(*), categories(*)")
        .eq("slug", slug)
        .eq("status", "active")
        .single();
      if (error) throw error;
      return data as ProductWithImages;
    },
    enabled: !!slug,
  });
}

export function useAllProductsAdmin() {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_images(*), categories(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ProductWithImages[];
    },
  });
}
