import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X, Upload, ArrowLeft, Video } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { uploadVideoToCloudinary } from "@/lib/cloudinary";
import { compressImage } from "@/lib/image";
import { useCategories } from "@/hooks/useCategories";
import { useLang } from "@/i18n/LanguageProvider";
import { BentoPanel } from "@/components/ui/BentoPanel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { Product, ProductColor, ProductImage, ProductSize } from "@/types/db";
import { cn } from "@/lib/utils";

type ProductRow = Product & { product_images: ProductImage[] };

const schema = z.object({
  name_fr: z.string().min(1),
  name_ar: z.string().min(1),
  description_fr: z.string().optional(),
  description_ar: z.string().optional(),
  price: z.coerce.number().positive(),
  compare_at_price: z.coerce.number().positive().optional().or(z.literal("")),
  category_id: z.string().optional(),
  stock: z.coerce.number().int().min(0),
  style_code: z.string().optional(),
  featured: z.boolean().default(false),
  almost_sold_out: z.boolean().default(false),
  status: z.enum(["active", "draft"]).default("active"),
});

type FormValues = z.infer<typeof schema>;

export function AdminProductForm() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { t } = useLang();
  const qc = useQueryClient();
  const { data: categories } = useCategories();

  const [colors, setColors] = useState<ProductColor[]>([]);
  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [detailsFr, setDetailsFr] = useState<string[]>([""]);
  const [detailsAr, setDetailsAr] = useState<string[]>([""]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: string; url: string }[]>([]);
  const [existingVideoUrl, setExistingVideoUrl] = useState<string | null>(null);
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
  const [newVideoPreview, setNewVideoPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [videoUploadPct, setVideoUploadPct] = useState(0);
  const [compressingImages, setCompressingImages] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const { data: existingProduct } = useQuery({
    queryKey: ["product-edit", id],
    enabled: !isNew && !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_images(*)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as ProductRow;
    },
  });

  useEffect(() => {
    if (existingProduct) {
      reset({
        name_fr: existingProduct.name_fr,
        name_ar: existingProduct.name_ar,
        description_fr: existingProduct.description_fr ?? "",
        description_ar: existingProduct.description_ar ?? "",
        price: existingProduct.price,
        compare_at_price: existingProduct.compare_at_price ?? "",
        category_id: existingProduct.category_id ?? "",
        stock: existingProduct.stock,
        style_code: existingProduct.style_code ?? "",
        featured: existingProduct.featured,
        almost_sold_out: existingProduct.almost_sold_out,
        status: existingProduct.status,
      });
      setColors(existingProduct.colors ?? []);
      setSizes(existingProduct.sizes ?? []);
      setDetailsFr(existingProduct.details_fr?.length ? existingProduct.details_fr : [""]);
      setDetailsAr(existingProduct.details_ar?.length ? existingProduct.details_ar : [""]);
      setExistingImages(
        (existingProduct.product_images ?? []).map((i: { id: string; url: string }) => ({ id: i.id, url: i.url }))
      );
      setExistingVideoUrl(existingProduct.video_url ?? null);
    }
  }, [existingProduct, reset]);

  const save = useMutation({
    mutationFn: async (vals: FormValues) => {
      setUploading(true);
      const slug = vals.name_fr.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

      const payload = {
        name_fr: vals.name_fr,
        name_ar: vals.name_ar,
        description_fr: vals.description_fr || null,
        description_ar: vals.description_ar || null,
        price: vals.price,
        compare_at_price: vals.compare_at_price ? Number(vals.compare_at_price) : null,
        category_id: vals.category_id || null,
        stock: vals.stock,
        style_code: vals.style_code || null,
        featured: vals.featured,
        almost_sold_out: vals.almost_sold_out,
        status: vals.status,
        colors,
        sizes,
        details_fr: detailsFr.filter(Boolean),
        details_ar: detailsAr.filter(Boolean),
        slug,
        video_url: existingVideoUrl,
        updated_at: new Date().toISOString(),
      };

      let productId = id;

      if (isNew) {
        const { data, error } = await supabase.from("products").insert(payload).select("id").single();
        if (error) throw error;
        productId = (data as { id: string }).id;
      } else {
        const { error } = await supabase.from("products").update(payload).eq("id", id!);
        if (error) throw error;
      }

      // Upload new images
      for (const file of imageFiles) {
        const ext = file.name.split(".").pop();
        const path = `${productId}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("product-images").upload(path, file);
        if (upErr) {
          if (upErr.message?.includes("Bucket not found") || upErr.message?.toLowerCase().includes("bucket")) {
            throw new Error('Bucket "product-images" introuvable. Créez-le dans Supabase Dashboard → Storage → New bucket → nom: "product-images" → Public.');
          }
          if (upErr.message?.includes("row-level security") || upErr.message?.includes("security policy") || (upErr as { statusCode?: string }).statusCode === "403") {
            throw new Error('Permission refusée (storage RLS). Exécutez supabase/migrations/0006_storage_policies.sql dans Supabase Dashboard → SQL Editor.');
          }
          throw upErr;
        }
        const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
        const { error: imgErr } = await supabase.from("product_images").insert({
          product_id: productId!,
          url: urlData.publicUrl,
          alt: vals.name_fr,
          sort_order: existingImages.length,
        });
        if (imgErr) throw imgErr;
      }

      // Upload new video to Cloudinary
      if (newVideoFile) {
        setVideoUploadPct(0);
        const cloudinaryUrl = await uploadVideoToCloudinary(newVideoFile, (pct) => setVideoUploadPct(pct));
        const { error: vidUpdateErr } = await supabase.from("products").update({ video_url: cloudinaryUrl }).eq("id", productId!);
        if (vidUpdateErr) throw vidUpdateErr;
      }

      setUploading(false);
      return productId;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      navigate("/admin/products");
    },
    onError: () => setUploading(false),
  });

  const removeExistingImage = async (imgId: string) => {
    await supabase.from("product_images").delete().eq("id", imgId);
    setExistingImages((prev) => prev.filter((i) => i.id !== imgId));
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  const categoryOptions = (categories ?? []).map((c) => ({ value: c.id, label: c.name_fr }));

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate("/admin/products")}
        className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted hover:text-brand transition-colors mb-6"
      >
        <ArrowLeft size={12} /> {t("admin_products")}
      </button>

      <h1 className="font-mono text-xl font-bold uppercase tracking-tight text-ink mb-8">
        {isNew ? t("admin_new_product") : t("admin_edit")}
      </h1>

      <form onSubmit={handleSubmit((v) => save.mutate(v))} className="flex flex-col gap-5">
        {/* Basic info */}
        <BentoPanel className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label={t("admin_name_fr")} error={errors.name_fr?.message} {...register("name_fr")} />
          <Input label={t("admin_name_ar")} error={errors.name_ar?.message} {...register("name_ar")} />
          <div className="col-span-1 sm:col-span-2">
            <label className="text-[10px] uppercase tracking-widest text-muted font-mono block mb-1.5">{t("admin_desc_fr")}</label>
            <textarea rows={2} className="w-full bg-panel-2 border border-line rounded-lg px-4 py-3 text-sm font-mono text-ink placeholder:text-muted/50 focus:outline-none focus:border-muted transition-colors resize-none" {...register("description_fr")} />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label className="text-[10px] uppercase tracking-widest text-muted font-mono block mb-1.5">{t("admin_desc_ar")}</label>
            <textarea rows={2} className="w-full bg-panel-2 border border-line rounded-lg px-4 py-3 text-sm font-ar text-ink placeholder:text-muted/50 focus:outline-none focus:border-muted transition-colors resize-none" {...register("description_ar")} />
          </div>
        </BentoPanel>

        {/* Pricing & inventory */}
        <BentoPanel className="p-4 sm:p-6 grid grid-cols-2 gap-4">
          <Input label={t("admin_price")} type="number" step="1" error={errors.price?.message} {...register("price")} />
          <Input label={t("admin_compare_price")} type="number" step="1" {...register("compare_at_price")} />
          <Input label={t("admin_stock")} type="number" min="0" {...register("stock")} />
          <Input label={t("admin_style_code")} placeholder="RC-001" {...register("style_code")} />
          <Select label={t("admin_category")} options={categoryOptions} placeholder="Aucune catégorie" {...register("category_id")} />
          <Select label={t("admin_status")} options={[{ value: "active", label: "Active" }, { value: "draft", label: "Draft" }]} {...register("status")} />
          <label className="col-span-2 flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="accent-brand w-4 h-4" {...register("featured")} />
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted">{t("admin_featured")}</span>
          </label>
          <label className="col-span-2 flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="accent-brand w-4 h-4" {...register("almost_sold_out")} />
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted">{t("admin_almost_sold_out")}</span>
          </label>
        </BentoPanel>

        {/* Details FR */}
        <BentoPanel className="p-4 sm:p-6">
          <h3 className="text-[10px] uppercase tracking-widest font-mono text-muted mb-4">{t("admin_details_fr")}</h3>
          <div className="flex flex-col gap-2">
            {detailsFr.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={d} onChange={(e) => setDetailsFr((prev) => prev.map((x, j) => j === i ? e.target.value : x))} className="flex-1 bg-panel-2 border border-line rounded-lg px-3 py-2 text-xs font-mono text-ink focus:outline-none focus:border-muted" placeholder={`Détail ${i + 1}…`} />
                <button type="button" onClick={() => setDetailsFr((p) => p.filter((_, j) => j !== i))} className="text-muted hover:text-brand flex-shrink-0"><X size={12} /></button>
              </div>
            ))}
            <button type="button" onClick={() => setDetailsFr((p) => [...p, ""])} className="text-[10px] font-mono text-muted hover:text-brand flex items-center gap-1">
              <Plus size={10} /> Ajouter
            </button>
          </div>
        </BentoPanel>

        {/* Details AR */}
        <BentoPanel className="p-4 sm:p-6">
          <h3 className="text-[10px] uppercase tracking-widest font-mono text-muted mb-4">{t("admin_details_ar")}</h3>
          <div className="flex flex-col gap-2">
            {detailsAr.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={d} onChange={(e) => setDetailsAr((prev) => prev.map((x, j) => j === i ? e.target.value : x))} className="flex-1 bg-panel-2 border border-line rounded-lg px-3 py-2 text-xs font-ar text-ink focus:outline-none focus:border-muted" placeholder={`تفصيل ${i + 1}…`} />
                <button type="button" onClick={() => setDetailsAr((p) => p.filter((_, j) => j !== i))} className="text-muted hover:text-brand flex-shrink-0"><X size={12} /></button>
              </div>
            ))}
            <button type="button" onClick={() => setDetailsAr((p) => [...p, ""])} className="text-[10px] font-mono text-muted hover:text-brand flex items-center gap-1">
              <Plus size={10} /> أضف
            </button>
          </div>
        </BentoPanel>

        {/* Colors */}
        <BentoPanel className="p-4 sm:p-6">
          <h3 className="text-[10px] uppercase tracking-widest font-mono text-muted mb-4">{t("admin_colors")}</h3>
          <div className="flex flex-col gap-2">
            {colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="color" value={c.hex} onChange={(e) => setColors((p) => p.map((x, j) => j === i ? { ...x, hex: e.target.value } : x))} className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent flex-shrink-0" />
                <input value={c.label_fr} onChange={(e) => setColors((p) => p.map((x, j) => j === i ? { ...x, label_fr: e.target.value } : x))} className="flex-1 bg-panel-2 border border-line rounded-lg px-3 py-2 text-xs font-mono text-ink focus:outline-none focus:border-muted" placeholder="Label FR" />
                <input value={c.label_ar} onChange={(e) => setColors((p) => p.map((x, j) => j === i ? { ...x, label_ar: e.target.value } : x))} className="flex-1 bg-panel-2 border border-line rounded-lg px-3 py-2 text-xs font-ar text-ink focus:outline-none focus:border-muted" placeholder="تسمية AR" />
                <button type="button" onClick={() => setColors((p) => p.filter((_, j) => j !== i))} className="text-muted hover:text-brand flex-shrink-0"><X size={12} /></button>
              </div>
            ))}
            <button type="button" onClick={() => setColors((p) => [...p, { hex: "#000000", label_fr: "", label_ar: "" }])} className="text-[10px] font-mono text-muted hover:text-brand flex items-center gap-1">
              <Plus size={10} /> {t("admin_add_color")}
            </button>
          </div>
        </BentoPanel>

        {/* Sizes */}
        <BentoPanel className="p-4 sm:p-6">
          <h3 className="text-[10px] uppercase tracking-widest font-mono text-muted mb-4">{t("admin_sizes")}</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s, i) => (
              <div key={i} className="flex items-center gap-1 bg-panel-2 border border-line rounded-lg px-2 py-1">
                <input value={s.label} onChange={(e) => setSizes((p) => p.map((x, j) => j === i ? { label: e.target.value } : x))} className="w-16 bg-transparent text-xs font-mono text-ink focus:outline-none" />
                <button type="button" onClick={() => setSizes((p) => p.filter((_, j) => j !== i))} className="text-muted hover:text-brand"><X size={10} /></button>
              </div>
            ))}
            <button type="button" onClick={() => setSizes((p) => [...p, { label: "" }])} className="text-[10px] font-mono text-muted hover:text-brand flex items-center gap-1 px-2 py-1 border border-dashed border-line rounded-lg">
              <Plus size={10} /> {t("admin_add_size")}
            </button>
          </div>
        </BentoPanel>

        {/* Images */}
        <BentoPanel className="p-4 sm:p-6">
          <h3 className="text-[10px] uppercase tracking-widest font-mono text-muted mb-4">{t("admin_images")}</h3>
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {existingImages.map((img) => (
                <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeExistingImage(img.id)} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={16} className="text-brand" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <label className={cn(
            "flex flex-col items-center justify-center gap-2 border-2 border-dashed border-line rounded-lg p-6 transition-colors",
            compressingImages ? "opacity-60 cursor-wait" : "cursor-pointer hover:border-muted"
          )}>
            <Upload size={20} className="text-muted" />
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider">
              {compressingImages ? "…" : t("admin_upload_images")}
            </span>
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple className="sr-only"
              disabled={compressingImages}
              onChange={async (e) => {
                const selected = Array.from(e.target.files ?? []);
                if (!selected.length) return;
                e.target.value = "";
                setCompressingImages(true);
                try {
                  const files = await Promise.all(selected.map((f) => compressImage(f)));
                  const urls = files.map((f) => URL.createObjectURL(f));
                  setImageFiles((p) => [...p, ...files]);
                  setImagePreviews((p) => [...p, ...urls]);
                } finally {
                  setCompressingImages(false);
                }
              }}
            />
          </label>
          {imageFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {imageFiles.map((f, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                  <img src={imagePreviews[i]} alt={f.name} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => { URL.revokeObjectURL(imagePreviews[i]); setImageFiles((p) => p.filter((_, j) => j !== i)); setImagePreviews((p) => p.filter((_, j) => j !== i)); }} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </BentoPanel>

        {/* Video */}
        <BentoPanel className="p-4 sm:p-6">
          <h3 className="text-[10px] uppercase tracking-widest font-mono text-muted mb-4">Vidéo du produit</h3>

          {/* Existing video */}
          {existingVideoUrl && !newVideoFile && (
            <div className="relative mb-4 rounded-lg overflow-hidden bg-black">
              <video src={existingVideoUrl} className="w-full max-h-48 object-contain" muted playsInline controls />
              <button
                type="button"
                onClick={() => setExistingVideoUrl(null)}
                className="absolute top-2 right-2 bg-black/70 rounded-full p-1.5 text-white hover:text-brand transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* New video preview */}
          {newVideoFile && (
            <div className="relative mb-4 rounded-lg overflow-hidden bg-black">
              <video src={newVideoPreview} className="w-full max-h-48 object-contain" muted playsInline controls />
              <button
                type="button"
                onClick={() => { URL.revokeObjectURL(newVideoPreview); setNewVideoFile(null); setNewVideoPreview(""); }}
                className="absolute top-2 right-2 bg-black/70 rounded-full p-1.5 text-white hover:text-brand transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Upload button (shown when no video selected) */}
          {!newVideoFile && (
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-line rounded-lg p-6 cursor-pointer hover:border-muted transition-colors">
              <Video size={20} className="text-muted" />
              <span className="text-[10px] font-mono text-muted uppercase tracking-wider">
                {existingVideoUrl ? "Remplacer la vidéo" : "Ajouter une vidéo"}
              </span>
              <span className="text-[9px] font-mono text-muted/50">MP4, WebM, MOV · Hébergé sur Cloudinary</span>
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setNewVideoFile(file);
                  setNewVideoPreview(URL.createObjectURL(file));
                  e.target.value = "";
                }}
              />
            </label>
          )}

          {/* Upload progress bar */}
          {uploading && newVideoFile && videoUploadPct > 0 && videoUploadPct < 100 && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-mono text-muted uppercase tracking-wider">Upload Cloudinary…</span>
                <span className="text-[9px] font-mono text-brand">{videoUploadPct}%</span>
              </div>
              <div className="w-full h-1 bg-line rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand transition-all duration-200 rounded-full"
                  style={{ width: `${videoUploadPct}%` }}
                />
              </div>
            </div>
          )}
        </BentoPanel>

        {/* Submit */}
        {save.isError && (
          <p className="text-[10px] font-mono text-brand text-end px-1">
            {(save.error as Error)?.message ?? "Erreur lors de la sauvegarde. Veuillez réessayer."}
          </p>
        )}
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="ghost" onClick={() => navigate("/admin/products")}>
            {t("admin_cancel")}
          </Button>
          <Button type="submit" size="lg" disabled={isSubmitting || save.isPending || uploading}>
            {(isSubmitting || save.isPending || uploading) ? "…" : t("admin_save")}
          </Button>
        </div>
      </form>
    </div>
  );
}
