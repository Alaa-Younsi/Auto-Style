import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { ProductWithImages } from "@/types/db";

/**
 * Sanitizes a search term before interpolating it into a PostgREST `.or()` filter string.
 * Strips `,()` (reserved in PostgREST filter grammar) and backslash-escapes `\%_`
 * (ILIKE wildcards) so user input can't inject extra filter clauses or unanchored patterns.
 */
function sanitizeSearchTerm(term: string) {
  return term
    .replace(/[,()]/g, "")
    .replace(/[\\%_]/g, "\\$&")
    .slice(0, 100);
}

export function useProducts(opts?: {
  categoryId?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ["products", opts],
    retry: 0,
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
        const term = sanitizeSearchTerm(opts.search);
        if (term) {
          query = query.or(`name_fr.ilike.%${term}%,name_ar.ilike.%${term}%`);
        }
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
    retry: 0,
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
