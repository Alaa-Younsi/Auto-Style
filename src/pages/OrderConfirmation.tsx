import { Link, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useOrderByNumber } from "@/hooks/useOrders";
import { useLang } from "@/i18n/LanguageProvider";
import { formatPrice } from "@/lib/format";
import { BentoPanel } from "@/components/ui/BentoPanel";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function OrderConfirmation() {
  const { orderNumber = "" } = useParams();
  const { t, lang } = useLang();
  const { data: order } = useOrderByNumber(orderNumber);

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <BentoPanel className="p-8 flex flex-col items-center text-center gap-6">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
          >
            <CheckCircle2 size={56} className="text-brand" />
          </motion.div>

          <div>
            <h1 className={cn(
              "font-mono font-bold uppercase tracking-tight text-ink",
              lang === "ar" ? "font-ar text-2xl" : "text-2xl sm:text-3xl"
            )}>
              {t("order_confirmed_title")}
            </h1>
            <p className={cn(
              "text-muted text-xs font-mono mt-2",
              lang === "ar" && "font-ar text-sm"
            )}>
              {t("order_confirmed_subtitle")}
            </p>
          </div>

          {/* Order number */}
          <div className="bg-panel-2 border border-line/50 rounded-lg px-6 py-4 w-full">
            <p className="text-[10px] uppercase tracking-widest font-mono text-muted">
              {t("order_number_label")}
            </p>
            <p className="text-brand font-mono text-lg mt-1 tracking-wide">{orderNumber}</p>
          </div>

          {/* Order details if loaded */}
          {order && (
            <div className="w-full text-start flex flex-col gap-2 border-t border-line/40 pt-4">
              <p className="text-[10px] font-mono text-muted uppercase tracking-widest">
                {t("checkout_customer_name")}: <span className="text-ink">{order.customer_name}</span>
              </p>
              <p className="text-[10px] font-mono text-muted uppercase tracking-widest">
                {t("checkout_wilaya")}: <span className="text-ink">{order.wilaya}</span>
              </p>
              <p className="text-[10px] font-mono text-muted uppercase tracking-widest">
                {t("cart_total")}: <span className="text-brand">{formatPrice(order.total)}</span>
              </p>
            </div>
          )}

          <p className={cn(
            "text-[10px] font-mono text-muted/70 leading-relaxed",
            lang === "ar" && "font-ar text-xs"
          )}>
            {t("order_confirmed_info")}
          </p>

          <Link to="/shop">
            <Button variant="outline" size="md">
              {t("order_continue")}
            </Button>
          </Link>
        </BentoPanel>
      </motion.div>
    </div>
  );
}
