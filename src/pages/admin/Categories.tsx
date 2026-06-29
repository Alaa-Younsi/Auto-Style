import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, X, Check, Upload, ImageIcon } from "lucide-react";
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
  sort_order: z.coerce.number().default(0),
});

type FormValues = z.infer<typeof schema>;

function useCategories() {
  return useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
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

  // Image upload state (managed outside react-hook-form)
  const [catImageFile, setCatImageFile] = useState<File | null>(null);
  const [catImagePreview, setCatImagePreview] = useState<string>("");
  const [currentCatImageUrl, setCurrentCatImageUrl] = useState<string>("");
  const [imageUploading, setImageUploading] = useState(false);

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
      setImageUploading(true);
      let finalImageUrl: string | null = currentCatImageUrl || null;

      if (catImageFile) {
        const ext = catImageFile.name.split(".").pop();
        const slug = vals.name_fr.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        const path = `categories/${slug}_${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("product-images").upload(path, catImageFile, { upsert: true });
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
        finalImageUrl = urlData.publicUrl;
      }

      const baseData = {
        name_fr: vals.name_fr,
        name_ar: vals.name_ar,
        description_fr: vals.description_fr || null,
        description_ar: vals.description_ar || null,
        image_url: finalImageUrl,
        sort_order: vals.sort_order,
      };

      if (editing) {
        const { error } = await supabase.from("categories").update(baseData).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert({
          ...baseData,
          slug: vals.name_fr.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        });
        if (error) throw error;
      }
      setImageUploading(false);
    },
    onSuccess: () => {
      invalidate();
      closeForm();
    },
    onError: () => setImageUploading(false),
  });

  const remove = useMutation({
    mutationFn: async (catId: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", catId);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); setDeleteId(null); },
  });

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    reset();
    if (catImagePreview) URL.revokeObjectURL(catImagePreview);
    setCatImageFile(null);
    setCatImagePreview("");
    setCurrentCatImageUrl("");
  };

  const startEdit = (cat: Category) => {
    setEditing(cat);
    reset({ name_fr: cat.name_fr, name_ar: cat.name_ar, description_fr: cat.description_fr ?? "", description_ar: cat.description_ar ?? "", sort_order: cat.sort_order });
    setCurrentCatImageUrl(cat.image_url ?? "");
    setCatImageFile(null);
    setCatImagePreview("");
    setShowForm(true);
  };

  const startNew = () => {
    setEditing(null);
    reset({});
    setCurrentCatImageUrl("");
    setCatImageFile(null);
    setCatImagePreview("");
    setShowForm(true);
  };

  const displayImageUrl = catImagePreview || currentCatImageUrl;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-mono text-xl font-bold uppercase tracking-tight text-ink">{t("admin_categories")}</h1>
        <Button size="sm" onClick={startNew}><Plus size={12} /> {t("admin_new_category")}</Button>
      </div>

      {/* Form */}
      {showForm && (
        <BentoPanel className="p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted">
              {editing ? t("admin_edit") : t("admin_new_category")}
            </h2>
            <button onClick={closeForm} className="text-muted hover:text-ink"><X size={14} /></button>
          </div>
          <form onSubmit={handleSubmit((v) => upsert.mutate(v))} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label={t("admin_name_fr")} error={errors.name_fr?.message} {...register("name_fr")} />
              <Input label={t("admin_name_ar")} error={errors.name_ar?.message} {...register("name_ar")} />
              <Input label={t("admin_desc_fr")} {...register("description_fr")} />
              <Input label={t("admin_desc_ar")} {...register("description_ar")} />
              <div className="col-span-1 sm:col-span-2">
                <Input label={t("admin_sort_order")} type="number" {...register("sort_order")} />
              </div>
            </div>

            {/* Image upload */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted font-mono mb-2">{t("admin_image_url")}</p>
              {displayImageUrl ? (
                <div className="relative w-full h-36 rounded-lg overflow-hidden bg-panel-2 group mb-2">
                  <img src={displayImageUrl} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      if (catImagePreview) { URL.revokeObjectURL(catImagePreview); setCatImagePreview(""); }
                      setCatImageFile(null);
                      setCurrentCatImageUrl("");
                    }}
                    className="absolute top-2 right-2 bg-black/60 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} className="text-white" />
                  </button>
                  <label className="absolute bottom-2 right-2 bg-black/60 rounded-lg px-2 py-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <Upload size={12} className="text-white" />
                    <span className="text-[9px] font-mono text-white uppercase">Changer</span>
                    <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (catImagePreview) URL.revokeObjectURL(catImagePreview);
                        setCatImageFile(file);
                        setCatImagePreview(URL.createObjectURL(file));
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-line rounded-lg p-5 cursor-pointer hover:border-muted transition-colors">
                  <ImageIcon size={20} className="text-muted" />
                  <span className="text-[10px] font-mono text-muted uppercase tracking-wider">Choisir une image</span>
                  <span className="text-[9px] font-mono text-muted/50">PNG, JPG, WebP</span>
                  <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setCatImageFile(file);
                      setCatImagePreview(URL.createObjectURL(file));
                      e.target.value = "";
                    }}
                  />
                </label>
              )}
            </div>

            {upsert.isError && (
              <p className="text-[10px] font-mono text-brand text-end">
                {(upsert.error as Error)?.message ?? "Erreur. Veuillez réessayer."}
              </p>
            )}
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="ghost" size="sm" onClick={closeForm}>{t("admin_cancel")}</Button>
              <Button type="submit" size="sm" disabled={isSubmitting || upsert.isPending || imageUploading}>
                <Check size={12} /> {imageUploading ? "Upload…" : t("admin_save")}
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="border-b border-line/50">
                  {["", "FR", "AR", "Ordre", ""].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-start text-[9px] font-mono uppercase tracking-widest text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line/30">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-line/10 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-panel-2 flex-shrink-0">
                        {cat.image_url ? (
                          <img src={cat.image_url} alt={cat.name_fr} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon size={14} className="text-line" />
                          </div>
                        )}
                      </div>
                    </td>
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
                            <button onClick={() => remove.mutate(cat.id)} className="text-brand text-[10px] font-mono hover:underline">Oui</button>
                            <button onClick={() => setDeleteId(null)} className="text-muted text-[10px] font-mono hover:underline">Non</button>
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
          </div>
        )}
      </BentoPanel>
    </div>
  );
}
