import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/i18n/LanguageProvider";
import { BentoPanel } from "@/components/ui/BentoPanel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Category } from "@/types/db";

const schema = z.object({
  name_fr: z.string().min(1),
  name_ar: z.string().min(1),
  description_fr: z.string().optional(),
  description_ar: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal("")),
  sort_order: z.coerce.number().default(0),
});

type FormValues = z.infer<typeof schema>;

function useCategories() {
  return useQuery({
    queryKey: ["admin-categories"],
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

export function AdminCategories() {
  const { t } = useLang();
  const qc = useQueryClient();
  const { data: categories, isLoading } = useCategories();
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-categories"] });
    qc.invalidateQueries({ queryKey: ["categories"] });
  };

  const upsert = useMutation({
    mutationFn: async (vals: FormValues) => {
      if (editing) {
        const { error } = await supabase
          .from("categories")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .update({ ...vals, image_url: vals.image_url || null } as any)
          .eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("categories")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .insert({ ...vals, image_url: vals.image_url || null, slug: vals.name_fr.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidate();
      setShowForm(false);
      setEditing(null);
      reset();
    },
  });

  const remove = useMutation({
    mutationFn: async (catId: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", catId);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      setDeleteId(null);
    },
  });

  const startEdit = (cat: Category) => {
    setEditing(cat);
    reset({
      name_fr: cat.name_fr,
      name_ar: cat.name_ar,
      description_fr: cat.description_fr ?? "",
      description_ar: cat.description_ar ?? "",
      image_url: cat.image_url ?? "",
      sort_order: cat.sort_order,
    });
    setShowForm(true);
  };

  const startNew = () => {
    setEditing(null);
    reset({});
    setShowForm(true);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-mono text-xl font-bold uppercase tracking-tight text-ink">
          {t("admin_categories")}
        </h1>
        <Button size="sm" onClick={startNew}>
          <Plus size={12} /> {t("admin_new_category")}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <BentoPanel className="p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted">
              {editing ? t("admin_edit") : t("admin_new_category")}
            </h2>
            <button onClick={() => { setShowForm(false); setEditing(null); reset(); }} className="text-muted hover:text-ink">
              <X size={14} />
            </button>
          </div>
          <form onSubmit={handleSubmit((v) => upsert.mutate(v))} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label={t("admin_name_fr")} error={errors.name_fr?.message} {...register("name_fr")} />
              <Input label={t("admin_name_ar")} error={errors.name_ar?.message} {...register("name_ar")} />
              <Input label={t("admin_desc_fr")} {...register("description_fr")} />
              <Input label={t("admin_desc_ar")} {...register("description_ar")} />
              <Input label={t("admin_image_url")} placeholder="https://…" {...register("image_url")} />
              <Input label={t("admin_sort_order")} type="number" {...register("sort_order")} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="ghost" size="sm" onClick={() => { setShowForm(false); setEditing(null); reset(); }}>
                {t("admin_cancel")}
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting || upsert.isPending}>
                <Check size={12} /> {t("admin_save")}
              </Button>
            </div>
          </form>
        </BentoPanel>
      )}

      {/* List */}
      <BentoPanel className="overflow-hidden">
        {isLoading ? (
          <div className="p-4 flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
          </div>
        ) : !categories || categories.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted font-mono text-xs">{t("admin_no_categories")}</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-line/50">
                {["FR", "AR", "Ordre", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-start text-[9px] font-mono uppercase tracking-widest text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line/30">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-line/10 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-ink">{cat.name_fr}</td>
                  <td className="px-4 py-3 text-xs font-ar text-ink">{cat.name_ar}</td>
                  <td className="px-4 py-3 text-[10px] font-mono text-muted">{cat.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => startEdit(cat)} className="text-muted hover:text-brand transition-colors">
                        <Pencil size={13} />
                      </button>
                      {deleteId === cat.id ? (
                        <>
                          <button onClick={() => remove.mutate(cat.id)} className="text-brand text-[10px] font-mono hover:underline">
                            Oui
                          </button>
                          <button onClick={() => setDeleteId(null)} className="text-muted text-[10px] font-mono hover:underline">
                            Non
                          </button>
                        </>
                      ) : (
                        <button onClick={() => setDeleteId(cat.id)} className="text-muted hover:text-brand transition-colors">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </BentoPanel>
    </div>
  );
}
