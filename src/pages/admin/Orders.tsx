import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { useLang } from "@/i18n/LanguageProvider";
import { formatPrice, formatDate } from "@/lib/format";
import { BentoPanel } from "@/components/ui/BentoPanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/db";

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
  confirmed: "bg-blue-400/10 text-blue-400 border-blue-400/30",
  shipped: "bg-purple-400/10 text-purple-400 border-purple-400/30",
  delivered: "bg-brand/10 text-brand border-brand/30",
  cancelled: "bg-line/30 text-muted border-line",
};

export function AdminOrders() {
  const { t, lang } = useLang();
  const { data: orders, isLoading } = useOrders();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="font-mono text-xl font-bold uppercase tracking-tight text-ink mb-8">
        {t("admin_orders")}
      </h1>

      <BentoPanel className="overflow-hidden">
        {isLoading ? (
          <div className="p-6 flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted font-mono text-xs">{t("admin_no_orders")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left">
            <thead>
              <tr className="border-b border-line/50">
                {[t("admin_orders"), t("admin_customer"), t("admin_wilaya"), t("admin_date"), t("admin_total"), t("admin_status"), ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-[9px] font-mono uppercase tracking-widest text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line/30">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-line/10 transition-colors">
                  <td className="px-4 py-3 text-[10px] font-mono text-brand">{order.order_number}</td>
                  <td className={cn("px-4 py-3 text-[10px] font-mono text-ink", lang === "ar" && "font-ar")}>
                    {order.customer_name}
                  </td>
                  <td className="px-4 py-3 text-[10px] font-mono text-muted">{order.wilaya.split(" - ")[1] ?? order.wilaya}</td>
                  <td className="px-4 py-3 text-[10px] font-mono text-muted">{formatDate(order.created_at, lang)}</td>
                  <td className="px-4 py-3 text-[10px] font-mono text-ink">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-[9px] font-mono uppercase tracking-wider px-2 py-1 rounded-md border",
                      STATUS_COLORS[order.status]
                    )}>
                      {t(`admin_order_status_${order.status}` as Parameters<typeof t>[0])}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="text-muted hover:text-brand transition-colors"
                    >
                      <Eye size={14} />
                    </Link>
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
