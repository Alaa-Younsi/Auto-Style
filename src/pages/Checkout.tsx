import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Truck, Home, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/store/cart";
import { useLang } from "@/i18n/LanguageProvider";
import { formatPrice } from "@/lib/format";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { BentoPanel } from "@/components/ui/BentoPanel";
import { WILAYAS } from "@/i18n/wilayas";
import { cn } from "@/lib/utils";
import type { TranslationKey } from "@/i18n/translations";

function buildSchema(t: (k: TranslationKey) => string) {
  return z.object({
    customer_name: z.string().min(3, t("val_name_min")),
    customer_phone: z
      .string()
      .regex(/^(0|\+213)[5-7]\d{8}$/, t("val_phone")),
    wilaya: z.string().min(1, t("val_required")),
    mairie: z.string().min(2, t("val_required")),
    address: z.string().min(10, t("val_address_min")),
    delivery_type: z.enum(["home", "office"]),
    notes: z.string().optional(),
  });
}

type FormValues = {
  customer_name: string;
  customer_phone: string;
  wilaya: string;
  mairie: string;
  address: string;
  delivery_type: "home" | "office";
  notes?: string;
};

export function Checkout() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCartStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(buildSchema(t)),
    defaultValues: { delivery_type: "home" },
  });

  const selectedWilaya = watch("wilaya");
  const deliveryType = watch("delivery_type");

  const { data: activeWilayas } = useQuery({
    queryKey: ["active-wilayas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("delivery_prices")
        .select("wilaya")
        .eq("active", true);
      if (error) throw error;
      return new Set((data ?? []).map((r) => r.wilaya));
    },
  });

  const wilayaOptions = (activeWilayas ? WILAYAS.filter((w) => activeWilayas.has(w)) : WILAYAS)
    .map((w) => ({ value: w, label: w }));

  const { data: deliveryPrice } = useQuery({
    queryKey: ["delivery-price", selectedWilaya],
    queryFn: async () => {
      const { data } = await supabase
        .from("delivery_prices")
        .select("home_price, office_price")
        .eq("wilaya", selectedWilaya)
        .single();
      return data;
    },
    enabled: !!selectedWilaya,
  });

  const sub = subtotal();
  const shipping = deliveryPrice
    ? (deliveryType === "home" ? deliveryPrice.home_price : deliveryPrice.office_price)
    : null;
  const total = sub + (shipping ?? 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-20">
        <p className="font-mono text-sm text-muted">{t("cart_empty")}</p>
        <Link to="/shop">
          <Button variant="outline">{t("cart_empty_cta")}</Button>
        </Link>
      </div>
    );
  }

  const onSubmit = async (values: FormValues) => {
    const orderItems = items.map((item) => ({
      product_id: item.productId,
      name_fr: item.name_fr,
      name_ar: item.name_ar,
      price: item.price,
      quantity: item.qty,
      color: item.color,
      size: item.size,
      image_url: item.image,
    }));

    const customer = {
      customer_name: values.customer_name,
      customer_phone: values.customer_phone,
      wilaya: values.wilaya,
      city: values.mairie,
      address: values.address,
      delivery_type: values.delivery_type,
      notes: values.notes ?? null,
      language: lang,
    };

    const { data, error } = await supabase.rpc("place_order", {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: orderItems as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      customer: customer as any,
    });

    if (error || !data) {
      alert("Une erreur est survenue. Veuillez réessayer.");
      return;
    }

    clearCart();
    navigate(`/order/${data as string}`);
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "font-mono font-bold uppercase tracking-tight text-ink mb-8",
            lang === "ar" ? "font-ar text-3xl" : "text-3xl sm:text-4xl"
          )}
        >
          {t("checkout_title")}
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <BentoPanel className="p-6 flex flex-col gap-5">
              <Input
                label={t("checkout_customer_name")}
                placeholder="Nom Prénom"
                error={errors.customer_name?.message}
                {...register("customer_name")}
              />
              <Input
                label={t("checkout_phone")}
                placeholder="05xxxxxxxx"
                type="tel"
                error={errors.customer_phone?.message}
                {...register("customer_phone")}
              />
              <Select
                label={t("checkout_wilaya")}
                placeholder={t("checkout_wilaya_placeholder")}
                options={wilayaOptions}
                error={errors.wilaya?.message}
                {...register("wilaya")}
              />
              <Input
                label={t("checkout_mairie")}
                placeholder={t("checkout_mairie_placeholder")}
                error={errors.mairie?.message}
                {...register("mairie")}
              />
              <Input
                label={t("checkout_address")}
                placeholder="Adresse complète"
                error={errors.address?.message}
                {...register("address")}
              />

              {/* Delivery type */}
              <div className="flex flex-col gap-2.5">
                <p className="text-[10px] uppercase tracking-widest text-muted font-mono">
                  {t("checkout_delivery_type")}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(["home", "office"] as const).map((type) => {
                    const isSelected = deliveryType === type;
                    const Icon = type === "home" ? Home : Building2;
                    const label = type === "home" ? t("checkout_delivery_home") : t("checkout_delivery_office");
                    const price_label =
                      !selectedWilaya
                        ? t("checkout_shipping_select_wilaya")
                        : !deliveryPrice
                        ? "…"
                        : formatPrice(type === "home" ? deliveryPrice.home_price : deliveryPrice.office_price);

                    return (
                      <label
                        key={type}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          isSelected
                            ? "border-brand bg-brand/5"
                            : "border-line hover:border-muted/60 bg-panel-2"
                        )}
                      >
                        <input
                          type="radio"
                          value={type}
                          className="sr-only"
                          {...register("delivery_type")}
                        />
                        <Icon size={16} className={isSelected ? "text-brand" : "text-muted"} />
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                          <span
                            className={cn(
                              "text-[11px] font-mono font-semibold uppercase tracking-wide",
                              isSelected ? "text-ink" : "text-muted",
                              lang === "ar" && "font-ar text-xs normal-case tracking-normal"
                            )}
                          >
                            {label}
                          </span>
                          <span className={cn("text-xs font-mono font-bold", isSelected ? "text-brand" : "text-muted/50")}>
                            {price_label}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center",
                            isSelected ? "border-brand" : "border-line"
                          )}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-brand" />}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-muted font-mono">
                  {t("checkout_notes")}
                </label>
                <textarea
                  rows={3}
                  className="w-full bg-panel-2 border border-line rounded-lg px-4 py-3 text-sm font-mono text-ink placeholder:text-muted/50 focus:outline-none focus:border-muted transition-colors resize-none"
                  placeholder="Instructions particulières…"
                  {...register("notes")}
                />
              </div>
            </BentoPanel>

            <BentoPanel className="p-4 flex items-center gap-3 border-brand/30 bg-brand/5">
              <Truck size={16} className="text-brand flex-shrink-0" />
              <p className={cn("text-xs font-mono text-ink/80", lang === "ar" && "font-ar text-sm")}>
                {t("checkout_cod_notice")}
              </p>
            </BentoPanel>

            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
              {isSubmitting ? t("checkout_submitting") : t("checkout_submit")}
            </Button>
          </form>

          {/* Order summary */}
          <div className="flex flex-col gap-3">
            <BentoPanel className="p-6">
              <h2 className="text-[10px] uppercase tracking-widest font-mono text-muted mb-4">
                {t("checkout_summary")}
              </h2>

              <ul className="flex flex-col gap-3 mb-4">
                {items.map((item) => (
                  <li
                    key={`${item.productId}|${item.color}|${item.size}`}
                    className="flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-panel-2 flex-shrink-0">
                      {item.image && (
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-[10px] font-mono text-ink truncate", lang === "ar" && "font-ar text-xs")}>
                        {lang === "ar" ? item.name_ar : item.name_fr}
                      </p>
                      <p className="text-[10px] text-muted font-mono">×{item.qty}</p>
                    </div>
                    <span className="text-xs font-mono text-brand flex-shrink-0">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-line/50 pt-4 flex flex-col gap-2">
                <div className="flex justify-between text-[10px] font-mono text-muted">
                  <span>{t("cart_subtotal")}</span>
                  <span className="text-ink">{formatPrice(sub)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-muted">
                  <span>{t("cart_shipping")}</span>
                  <span className="text-ink">
                    {!selectedWilaya
                      ? <span className="text-muted/40">—</span>
                      : !deliveryPrice
                      ? "…"
                      : formatPrice(shipping ?? 0)}
                  </span>
                </div>
                {selectedWilaya && deliveryPrice && (
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted/60">
                    {deliveryType === "home" ? <Home size={9} /> : <Building2 size={9} />}
                    <span>
                      {deliveryType === "home" ? t("checkout_delivery_home") : t("checkout_delivery_office")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-mono border-t border-line/50 pt-2 mt-1">
                  <span className="text-muted text-[10px] self-end uppercase tracking-widest">
                    {t("cart_total")}
                  </span>
                  <span className="text-brand font-bold">
                    {shipping !== null ? formatPrice(total) : "—"}
                  </span>
                </div>
              </div>
            </BentoPanel>
          </div>
        </div>
      </div>
    </div>
  );
}
