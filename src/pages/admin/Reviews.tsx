import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Star, X, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/i18n/LanguageProvider";
import { BentoPanel } from "@/components/ui/BentoPanel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import type { ClientReview } from "@/types/db";

function useReviews() {
  return useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ClientReview[];
    },
  });
}

const EMPTY_FORM = {
  client_name: "",
  stars: 5,
  review_text: "",
  image_url: "",
  active: true,
};
type FormState = typeof EMPTY_FORM & { id?: string };

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={20}
            className={n <= value ? "text-brand fill-brand" : "text-line"}
          />
        </button>
      ))}
    </div>
  );
}

export function AdminReviews() {
  const { t } = useLang();
  const qc = useQueryClient();
  const { data, isLoading } = useReviews();

  const [form, setForm] = useState<FormState | null>(null);
  const [uploading, setUploading] = useState(false);

  const upsertMutation = useMutation({
    mutationFn: async (f: FormState) => {
      const payload = {
        client_name: f.client_name,
        stars: f.stars,
        review_text: f.review_text,
        image_url: f.image_url || null,
        active: f.active,
      };
      if (f.id) {
        const { error } = await supabase
          .from("client_reviews")
          .update(payload)
          .eq("id", f.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("client_reviews").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      setForm(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("client_reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from("client_reviews")
        .update({ active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !form) return;
    setUploading(true);
    const path = `reviews/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setForm((prev) => prev ? { ...prev, image_url: data.publicUrl } : prev);
    }
    setUploading(false);
  };

  const openAdd = () => setForm({ ...EMPTY_FORM });
  const openEdit = (r: ClientReview) =>
    setForm({ id: r.id, client_name: r.client_name, stars: r.stars, review_text: r.review_text, image_url: r.image_url ?? "", active: r.active });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-mono text-xl font-bold uppercase tracking-tight text-ink">
          {t("admin_reviews")}
        </h1>
        <Button onClick={openAdd} size="sm">
          <Plus size={13} />
          {t("admin_add_review")}
        </Button>
      </div>

      {/* Form modal / panel */}
      {form && (
        <BentoPanel className="p-6 mb-6 border-brand/30">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-mono font-bold text-ink uppercase tracking-wider">
              {form.id ? t("admin_edit") : t("admin_add_review")}
            </h2>
            <button onClick={() => setForm(null)} className="text-muted hover:text-ink transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <Input
              label={t("admin_review_name")}
              value={form.client_name}
              onChange={(e) => setForm((p) => p ? { ...p, client_name: e.target.value } : p)}
              placeholder="Ahmed B."
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted font-mono">
                {t("admin_review_stars")}
              </label>
              <StarPicker value={form.stars} onChange={(n) => setForm((p) => p ? { ...p, stars: n } : p)} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted font-mono">
                {t("admin_review_text")}
              </label>
              <textarea
                rows={4}
                value={form.review_text}
                onChange={(e) => setForm((p) => p ? { ...p, review_text: e.target.value } : p)}
                className="w-full bg-panel-2 border border-line rounded-lg px-4 py-3 text-sm font-mono text-ink placeholder:text-muted/50 focus:outline-none focus:border-muted transition-colors resize-none"
                placeholder="Produit excellent, livraison rapide…"
              />
            </div>

            {/* Image upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted font-mono">
                {t("admin_review_image")}
              </label>
              <div className="flex items-center gap-3">
                {form.image_url && (
                  <img
                    src={form.image_url}
                    alt=""
                    className="w-14 h-14 object-cover rounded-lg border border-line"
                  />
                )}
                <label className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg border border-line text-xs font-mono text-muted hover:text-ink hover:border-muted transition-colors cursor-pointer",
                  uploading && "opacity-50 pointer-events-none"
                )}>
                  <Upload size={13} />
                  {uploading ? "Upload…" : "Choisir une image"}
                  <input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} />
                </label>
                {form.image_url && (
                  <button
                    type="button"
                    onClick={() => setForm((p) => p ? { ...p, image_url: "" } : p)}
                    className="text-muted hover:text-brand transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((p) => p ? { ...p, active: e.target.checked } : p)}
                className="w-4 h-4 rounded border-line bg-panel-2 accent-brand"
              />
              <span className="text-xs font-mono text-muted">{t("admin_review_active")}</span>
            </label>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => upsertMutation.mutate(form)}
                disabled={upsertMutation.isPending || !form.client_name || !form.review_text}
              >
                {upsertMutation.isPending ? "…" : t("admin_save")}
              </Button>
              <Button variant="outline" onClick={() => setForm(null)}>
                {t("admin_cancel")}
              </Button>
            </div>
          </div>
        </BentoPanel>
      )}

      {/* Reviews list */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : !data?.length ? (
        <BentoPanel className="p-8 text-center">
          <p className="text-muted font-mono text-xs">{t("admin_no_reviews")}</p>
        </BentoPanel>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((review) => (
            <BentoPanel
              key={review.id}
              className={cn("p-5 flex items-start gap-4", !review.active && "opacity-50")}
            >
              {/* Avatar or image */}
              {review.image_url ? (
                <img
                  src={review.image_url}
                  alt={review.client_name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-line"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand font-mono text-lg font-bold">
                    {review.client_name[0]?.toUpperCase()}
                  </span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-mono font-bold text-ink">{review.client_name}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: review.stars }).map((_, i) => (
                      <Star key={i} size={11} className="text-brand fill-brand" />
                    ))}
                  </div>
                  <span className={cn(
                    "text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded",
                    review.active ? "bg-brand/10 text-brand" : "bg-line/40 text-muted"
                  )}>
                    {review.active ? "Actif" : "Inactif"}
                  </span>
                </div>
                <p className="text-xs font-mono text-ink/70 leading-relaxed line-clamp-2">
                  {review.review_text}
                </p>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => toggleActive.mutate({ id: review.id, active: !review.active })}
                  className="p-1.5 rounded text-muted hover:text-ink transition-colors text-[10px] font-mono"
                  title={review.active ? "Désactiver" : "Activer"}
                >
                  {review.active ? "OFF" : "ON"}
                </button>
                <button
                  onClick={() => openEdit(review)}
                  className="p-1.5 rounded text-muted hover:text-ink transition-colors"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => {
                    if (confirm(t("admin_confirm_delete"))) deleteMutation.mutate(review.id);
                  }}
                  className="p-1.5 rounded text-muted hover:text-brand transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </BentoPanel>
          ))}
        </div>
      )}
    </div>
  );
}
