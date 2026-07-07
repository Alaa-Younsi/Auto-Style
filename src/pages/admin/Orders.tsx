import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Download, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useOrders } from "@/hooks/useOrders";
import { useLang } from "@/i18n/LanguageProvider";
import { formatPrice, formatDate } from "@/lib/format";
import { BentoPanel } from "@/components/ui/BentoPanel";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/db";

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
  confirmed: "bg-blue-400/10 text-blue-400 border-blue-400/30",
  shipped: "bg-purple-400/10 text-purple-400 border-purple-400/30",
  delivered: "bg-brand/10 text-brand border-brand/30",
  cancelled: "bg-line/30 text-muted border-line",
};

function exportOrders(orders: Order[]) {
  const headers = ["N° Commande", "Client", "Téléphone", "Wilaya", "Mairie", "Adresse", "Notes", "Sous-total", "Livraison", "Total", "Type livraison", "Statut", "Date"];
  const rows = orders.map((o) => [
    o.order_number,
    o.customer_name,
    o.customer_phone,
    o.wilaya,
    o.city,
    o.address ?? "",
    o.notes ?? "",
    o.subtotal,
    o.shipping,
    o.total,
    o.delivery_type ?? "home",
    o.status,
    new Date(o.created_at).toLocaleDateString("fr-DZ"),
  ]);
  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `commandes_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function AdminOrders() {
  const { t, lang } = useLang();
  const qc = useQueryClient();
  const { data: orders, isLoading } = useOrders();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const resetOrders = useMutation({
    mutationFn: async () => {
      const ids = (orders ?? []).map((o) => o.id);
      if (ids.length === 0) return;
      const { error } = await supabase.from("orders").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      setShowResetConfirm(false);
    },
  });

  const hasOrders = (orders?.length ?? 0) > 0;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <h1 className="font-mono text-xl font-bold uppercase tracking-tight text-ink">{t("admin_orders")}</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="ghost"
            disabled={!hasOrders}
            onClick={() => exportOrders(orders ?? [])}
          >
            <Download size={12} /> Exporter CSV
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={!hasOrders}
            onClick={() => setShowResetConfirm(true)}
            className="text-brand hover:bg-brand/10 border border-brand/20"
          >
            <Trash2 size={12} /> Réinitialiser
          </Button>
        </div>
      </div>

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
                  {[t("admin_orders"), t("admin_customer"), t("admin_wilaya"), t("admin_date"), t("admin_total"), t("admin_status"), ""].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-[9px] font-mono uppercase tracking-widest text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line/30">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-line/10 transition-colors">
                    <td className="px-4 py-3 text-[10px] font-mono font-bold text-brand">{order.order_number}</td>
                    <td className={cn("px-4 py-3 text-[10px] font-mono font-bold text-ink", lang === "ar" && "font-ar")}>{order.customer_name}</td>
                    <td className="px-4 py-3 text-[10px] font-mono text-muted">{order.wilaya.split(" - ")[1] ?? order.wilaya}</td>
                    <td className="px-4 py-3 text-[10px] font-mono text-muted">{formatDate(order.created_at, lang)}</td>
                    <td className="px-4 py-3 text-[10px] font-mono font-bold text-ink">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-[9px] font-mono uppercase tracking-wider px-2 py-1 rounded-md border", STATUS_COLORS[order.status])}>
                        {t(`admin_order_status_${order.status}` as Parameters<typeof t>[0])}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/orders/${order.id}`} className="text-muted hover:text-brand transition-colors">
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

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-panel border border-line rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Trash2 size={16} className="text-brand" />
              </div>
              <div>
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-ink">
                  Réinitialiser les commandes
                </h3>
                <p className="text-[10px] font-mono text-muted mt-1">
                  {orders?.length ?? 0} commande(s) seront supprimées définitivement.
                </p>
              </div>
            </div>

            <p className="text-xs font-mono text-muted/80 leading-relaxed mb-5 ps-[52px]">
              Cette action est irréversible. Exportez vos données avant de supprimer.
            </p>

            {resetOrders.isError && (
              <p className="text-[10px] font-mono text-brand mb-3 ps-[52px]">
                {(resetOrders.error as Error)?.message ?? "Erreur lors de la suppression."}
              </p>
            )}

            <div className="flex flex-col gap-2">
              <button
                onClick={() => exportOrders(orders ?? [])}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border border-line text-[10px] font-mono uppercase tracking-wider text-ink hover:border-muted transition-colors"
              >
                <Download size={12} /> Exporter en CSV d'abord
              </button>
              <button
                onClick={() => resetOrders.mutate()}
                disabled={resetOrders.isPending}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-brand/10 border border-brand/30 text-[10px] font-mono uppercase tracking-wider text-brand hover:bg-brand/20 transition-colors disabled:opacity-50"
              >
                <Trash2 size={12} />
                {resetOrders.isPending ? "Suppression en cours…" : "Supprimer quand même"}
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                disabled={resetOrders.isPending}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-[10px] font-mono uppercase tracking-wider text-muted hover:text-ink transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
