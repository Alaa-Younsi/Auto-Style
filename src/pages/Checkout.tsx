import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Truck } from "lucide-react";
import { motion } from "framer-motion";
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
import { Link } from "react-router-dom";
import type { TranslationKey } from "@/i18n/translations";

const SHIPPING_FEE = 500;
const FREE_SHIP_THRESHOLD = 5000;

function buildSchema(t: (k: TranslationKey) => string) {
  return z.object({
    customer_name: z.string().min(3, t("val_name_min")),
    customer_phone: z
      .string()
      .regex(/^(0|\+213)[5-7]\d{8}$/, t("val_phone")),
    wilaya: z.string().min(1, t("val_required")),
    city: z.string().min(2, t("val_required")),
    address: z.string().min(10, t("val_address_min")),
    notes: z.string().optional(),
  });
}

type FormValues = {
  customer_name: string;
  customer_phone: string;
  wilaya: string;
  city: string;
  address: string;
  notes?: string;
};

export function Checkout() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCartStore();

  const sub = subtotal();
  const shipping = sub >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = sub + shipping;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(buildSchema(t)),
  });

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
      city: values.city,
      address: values.address,
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
                options={WILAYAS.map((w) => ({ value: w, label: w }))}
                error={errors.wilaya?.message}
                {...register("wilaya")}
              />
              <Input
                label={t("checkout_city")}
                placeholder="Votre ville"
                error={errors.city?.message}
                {...register("city")}
              />
              <Input
                label={t("checkout_address")}
                placeholder="Adresse complète"
                error={errors.address?.message}
                {...register("address")}
              />
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

            {/* COD notice */}
            <BentoPanel className="p-4 flex items-center gap-3 border-brand/30 bg-brand/5">
              <Truck size={16} className="text-brand flex-shrink-0" />
              <p className={cn(
                "text-xs font-mono text-ink/80",
                lang === "ar" && "font-ar text-sm"
              )}>
                {t("checkout_cod_notice")}
              </p>
            </BentoPanel>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full"
            >
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
                      <p className={cn(
                        "text-[10px] font-mono text-ink truncate",
                        lang === "ar" && "font-ar text-xs"
                      )}>
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
                  <span className={shipping === 0 ? "text-brand" : "text-ink"}>
                    {shipping === 0 ? t("cart_shipping_free") : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-mono border-t border-line/50 pt-2 mt-1">
                  <span className="text-muted text-[10px] self-end uppercase tracking-widest">
                    {t("cart_total")}
                  </span>
                  <span className="text-brand">{formatPrice(total)}</span>
                </div>
              </div>
            </BentoPanel>
          </div>
        </div>
      </div>
    </div>
  );
}
