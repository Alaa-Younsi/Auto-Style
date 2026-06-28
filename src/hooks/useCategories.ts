import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/types/db";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as Category[];
    },
  });
}
