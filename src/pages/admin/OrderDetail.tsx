import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useOrder, useUpdateOrderStatus } from "@/hooks/useOrders";
import { useLang } from "@/i18n/LanguageProvider";
import { formatPrice, formatDate } from "@/lib/format";
import { BentoPanel } from "@/components/ui/BentoPanel";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import type { OrderStatus } from "@/types/db";
import { cn } from "@/lib/utils";

const ORDER_STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export function AdminOrderDetail() {
  const { id = "" } = useParams();
  const { t, lang } = useLang();
  const { data: order, isLoading } = useOrder(id);
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto flex flex-col gap-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center text-muted font-mono text-xs">
        Commande introuvable.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted hover:text-brand transition-colors mb-6"
      >
        <ArrowLeft size={12} /> {t("admin_orders")}
      </Link>

      <h1 className="font-mono text-xl font-bold uppercase tracking-tight text-ink mb-6">
        {order.order_number}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Customer info */}
        <BentoPanel className="p-5">
          <h2 className="text-[10px] uppercase tracking-widest font-mono text-muted mb-3">
            {t("admin_customer")}
          </h2>
          <div className="flex flex-col gap-1.5">
            {[
              { label: "Nom", value: order.customer_name },
              { label: "Téléphone", value: order.customer_phone },
              { label: t("admin_wilaya"), value: order.wilaya },
              { label: t("checkout_city"), value: order.city },
              { label: t("checkout_address"), value: order.address },
              ...(order.notes ? [{ label: t("checkout_notes"), value: order.notes }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-2">
                <span className="text-[10px] font-mono text-muted min-w-[80px]">{label}:</span>
                <span className={cn("text-[10px] font-mono text-ink", lang === "ar" && "font-ar")}>{value}</span>
              </div>
            ))}
          </div>
        </BentoPanel>

        {/* Status + summary */}
        <BentoPanel className="p-5 flex flex-col gap-4">
          <div>
            <h2 className="text-[10px] uppercase tracking-widest font-mono text-muted mb-3">
              {t("admin_status")}
            </h2>
            <Select
              options={ORDER_STATUSES.map((s) => ({
                value: s,
                label: t(`admin_order_status_${s}` as Parameters<typeof t>[0]),
              }))}
              value={order.status}
              onChange={(e) =>
                updateStatus({ id: order.id, status: e.target.value as OrderStatus })
              }
              disabled={isPending}
            />
          </div>
          <div className="border-t border-line/40 pt-4 flex flex-col gap-1.5">
            <div className="flex justify-between text-[10px] font-mono text-muted">
              <span>{t("cart_subtotal")}</span>
              <span className="text-ink">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-muted">
              <span>{t("cart_shipping")}</span>
              <span className="text-ink">{formatPrice(order.shipping)}</span>
            </div>
            <div className="flex justify-between text-xs font-mono border-t border-line/40 pt-2 mt-1">
              <span className="text-muted text-[10px] self-end">{t("admin_total")}</span>
              <span className="text-brand">{formatPrice(order.total)}</span>
            </div>
          </div>
          <p className="text-[10px] font-mono text-muted/50">
            {formatDate(order.created_at, lang)}
          </p>
        </BentoPanel>
      </div>

      {/* Items */}
      <BentoPanel className="p-5">
        <h2 className="text-[10px] uppercase tracking-widest font-mono text-muted mb-4">
          Articles
        </h2>
        <div className="flex flex-col divide-y divide-line/30">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-3">
              {item.image_url && (
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-panel-2 flex-shrink-0">
                  <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className={cn("text-xs font-mono text-ink truncate", lang === "ar" && "font-ar")}>
                  {lang === "ar" ? item.name_ar : item.name_fr}
                </p>
                {(item.color || item.size) && (
                  <p className="text-[10px] font-mono text-muted mt-0.5">
                    {[item.color, item.size].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <span className="text-[10px] font-mono text-muted">×{item.quantity}</span>
              <span className="text-xs font-mono text-brand">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </BentoPanel>
    </div>
  );
}
