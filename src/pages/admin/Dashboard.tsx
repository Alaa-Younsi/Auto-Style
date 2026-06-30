import { Link } from "react-router-dom";
import { ShoppingBag, Package, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/i18n/LanguageProvider";
import { formatPrice, formatDate } from "@/lib/format";
import { BentoPanel } from "@/components/ui/BentoPanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/db";

type OrderStat = { total: number | null; status: OrderStatus };
type ProductStat = { status: string; stock: number; featured: boolean };

function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [ordersRes, productsRes, recentRes] = await Promise.all([
        supabase.from("orders").select("total, status"),
        supabase.from("products").select("status, stock, featured"),
        supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      const orders = (ordersRes.data ?? []) as OrderStat[];
      const products = (productsRes.data ?? []) as ProductStat[];
      const recent = (recentRes.data ?? []) as Order[];

      const revenue = orders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + (o.total ?? 0), 0);

      const lowStock = products.filter(
        (p) => p.status === "active" && p.stock <= 3
      ).length;

      return {
        totalOrders: orders.length,
        revenue,
        activeProducts: products.filter((p) => p.status === "active").length,
        lowStock,
        recentOrders: recent,
      };
    },
  });
}

const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-400",
  confirmed: "text-blue-400",
  shipped: "text-purple-400",
  delivered: "text-brand",
  cancelled: "text-muted",
};

export function AdminDashboard() {
  const { t, lang } = useLang();
  const { data, isLoading } = useAdminStats();

  const statCards = [
    {
      label: t("admin_total_orders"),
      value: data?.totalOrders ?? 0,
      icon: ShoppingBag,
      format: (v: number) => v.toString(),
    },
    {
      label: t("admin_revenue"),
      value: data?.revenue ?? 0,
      icon: TrendingUp,
      format: (v: number) => formatPrice(v),
    },
    {
      label: t("admin_active_products"),
      value: data?.activeProducts ?? 0,
      icon: Package,
      format: (v: number) => v.toString(),
    },
    {
      label: t("admin_low_stock"),
      value: data?.lowStock ?? 0,
      icon: AlertTriangle,
      format: (v: number) => v.toString(),
      alert: (data?.lowStock ?? 0) > 0,
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="font-mono text-xl font-bold uppercase tracking-tight text-ink mb-8">
        {t("admin_dashboard")}
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {statCards.map(({ label, value, icon: Icon, format, alert }) => (
          <BentoPanel
            key={label}
            className={cn("p-5", alert && "border-brand/40")}
          >
            {isLoading ? (
              <Skeleton className="h-12" />
            ) : (
              <>
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center mb-3",
                  alert ? "bg-brand/20" : "bg-panel-2"
                )}>
                  <Icon size={14} className={alert ? "text-brand" : "text-muted"} />
                </div>
                <p className={cn(
                  "text-xl font-mono font-bold",
                  alert ? "text-brand" : "text-ink"
                )}>
                  {format(value)}
                </p>
                <p className="text-[10px] font-mono text-muted uppercase tracking-wider mt-1">
                  {label}
                </p>
              </>
            )}
          </BentoPanel>
        ))}
      </div>

      {/* Recent orders */}
      <BentoPanel className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted">
            {t("admin_recent_orders")}
          </h2>
          <Link
            to="/admin/orders"
            className="flex items-center gap-1 text-[10px] font-mono text-muted hover:text-brand transition-colors"
          >
            {t("admin_view")} <ArrowRight size={10} />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        ) : (data?.recentOrders ?? []).length === 0 ? (
          <p className="text-muted font-mono text-xs">{t("admin_no_orders")}</p>
        ) : (
          <div className="flex flex-col divide-y divide-line/40">
            {(data?.recentOrders ?? []).map((order) => (
              <Link
                key={order.id}
                to={`/admin/orders/${order.id}`}
                className="flex items-center gap-4 py-3 hover:bg-line/20 -mx-2 px-2 rounded-lg transition-colors"
              >
                <span className="text-[10px] font-mono font-bold text-brand">{order.order_number}</span>
                <span className={cn(
                  "text-[10px] font-mono font-bold text-ink",
                  lang === "ar" && "font-ar"
                )}>
                  {order.customer_name}
                </span>
                <span className="text-[10px] font-mono text-muted ms-auto">
                  {formatDate(order.created_at, lang)}
                </span>
                <span className={cn("text-[10px] font-mono", STATUS_COLORS[order.status])}>
                  {t(`admin_order_status_${order.status}` as Parameters<typeof t>[0])}
                </span>
                <span className="text-xs font-mono font-bold text-ink">{formatPrice(order.total)}</span>
              </Link>
            ))}
          </div>
        )}
      </BentoPanel>
    </div>
  );
}
