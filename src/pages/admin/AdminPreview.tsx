import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Package,
  ShoppingCart,
  Tag,
  TrendingUp,
  Eye,
  Edit3,
  Trash2,
  Check,
  X,
  ChevronDown,
  AlertTriangle,
  BarChart2,
  Users,
} from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
import { formatPrice } from "@/lib/format";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { cn } from "@/lib/utils";

/* ─── MOCK DATA ─────────────────────────────────────────────────────────── */

const MOCK_ORDERS = [
  { id: "AS-20240628-A4F2E", customer: "Karim Boudiaf", wilaya: "Alger", total: 7500, status: "pending", items: 2, date: "28 Jun 2026" },
  { id: "AS-20240627-B3C1D", customer: "Fatima Zahraa", wilaya: "Oran", total: 3500, status: "confirmed", items: 1, date: "27 Jun 2026" },
  { id: "AS-20240627-F8E5A", customer: "Mehdi Larbi", wilaya: "Constantine", total: 18500, status: "shipped", items: 3, date: "27 Jun 2026" },
  { id: "AS-20240626-D7C9B", customer: "Amira Benali", wilaya: "Sétif", total: 900, status: "delivered", items: 1, date: "26 Jun 2026" },
  { id: "AS-20240625-E2F3A", customer: "Youcef Meziane", wilaya: "Annaba", total: 5500, status: "cancelled", items: 1, date: "25 Jun 2026" },
];

const MOCK_STATS = [
  { label_fr: "Commandes ce mois", label_ar: "طلبات هذا الشهر", value: 128, suffix: "", icon: <ShoppingCart size={18} />, color: "text-brand" },
  { label_fr: "Revenu ce mois", label_ar: "إيرادات هذا الشهر", value: 485200, suffix: " DA", icon: <TrendingUp size={18} />, color: "text-emerald-400" },
  { label_fr: "Produits actifs", label_ar: "منتجات نشطة", value: 47, suffix: "", icon: <Package size={18} />, color: "text-sky-400" },
  { label_fr: "Clients total", label_ar: "إجمالي العملاء", value: 1247, suffix: "", icon: <Users size={18} />, color: "text-violet-400" },
];

const MOCK_PRODUCTS = [
  { id: 1, name: "Tapis de Sol Premium 3D", category: "Intérieur", price: 3500, stock: 42, status: "active", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=70" },
  { id: 2, name: "Dashcam 4K Ultra HD", category: "Électronique", price: 7500, stock: 3, status: "active", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=80&q=70" },
  { id: 3, name: "Autoradio Android 10\"", category: "Audio", price: 18500, stock: 18, status: "active", img: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=80&q=70" },
  { id: 4, name: "Housse Volant Carbon", category: "Intérieur", price: 1200, stock: 0, status: "draft", img: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=80&q=70" },
  { id: 5, name: "Barre LED Tout-Terrain", category: "Éclairage", price: 5500, stock: 15, status: "active", img: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=80&q=70" },
];

const WEEKLY_REVENUE = [
  { day: "Lun", val: 28000 },
  { day: "Mar", val: 52000 },
  { day: "Mer", val: 37000 },
  { day: "Jeu", val: 65000 },
  { day: "Ven", val: 89000 },
  { day: "Sam", val: 44000 },
  { day: "Dim", val: 21000 },
];

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "En attente", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  confirmed: { label: "Confirmée", color: "text-sky-400", bg: "bg-sky-400/10" },
  shipped: { label: "Expédiée", color: "text-violet-400", bg: "bg-violet-400/10" },
  delivered: { label: "Livrée", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  cancelled: { label: "Annulée", color: "text-muted", bg: "bg-muted/10" },
};

/* ─── SIDEBAR NAV ────────────────────────────────────────────────────────── */

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: <BarChart2 size={16} /> },
  { id: "orders", label: "Commandes", icon: <ShoppingCart size={16} /> },
  { id: "products", label: "Produits", icon: <Package size={16} /> },
  { id: "categories", label: "Catégories", icon: <Tag size={16} /> },
];

/* ─── MINI CHART ────────────────────────────────────────────────────────── */
function MiniChart() {
  const max = Math.max(...WEEKLY_REVENUE.map((d) => d.val));
  return (
    <div className="flex items-end gap-1.5 h-20">
      {WEEKLY_REVENUE.map(({ day, val }, i) => (
        <motion.div
          key={day}
          className="flex flex-col items-center gap-1 flex-1"
          initial={{ scaleY: 0, originY: 1 }}
          animate={{ scaleY: 1, originY: 1 }}
          transition={{ delay: i * 0.08, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <div
            className="w-full rounded-t bg-brand/30 hover:bg-brand/60 transition-colors cursor-default"
            style={{ height: `${(val / max) * 64}px` }}
          />
          <span className="text-[9px] font-mono text-muted/60">{day}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── DASHBOARD TAB ─────────────────────────────────────────────────────── */
function DashboardTab() {
  const { lang } = useLang();

  return (
    <div className="flex flex-col gap-5">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {MOCK_STATS.map(({ label_fr, label_ar, value, suffix, icon, color }, i) => (
          <motion.div
            key={label_fr}
            className="bg-panel-2 rounded-xl border border-line/40 p-4 flex flex-col gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", color, "bg-current/10")}
              style={{ backgroundColor: "transparent" }}>
              <span className={color}>{icon}</span>
            </div>
            <div>
              <p className={cn("text-xl font-mono font-black", color)}>
                <AnimatedCounter target={value} suffix={suffix} />
              </p>
              <p className={cn("text-[10px] font-mono text-muted uppercase tracking-wider mt-0.5", lang === "ar" && "font-ar text-xs")}>
                {lang === "ar" ? label_ar : label_fr}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-3">
        {/* Chart */}
        <motion.div
          className="bg-panel-2 rounded-xl border border-line/40 p-5"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-mono text-muted uppercase tracking-wider">{lang === "ar" ? "إيرادات الأسبوع" : "Revenu hebdomadaire"}</p>
            <span className="text-[10px] font-mono text-brand">+24.5%</span>
          </div>
          <MiniChart />
          <p className="text-xs font-mono text-muted mt-3">
            <span className="text-ink font-semibold">336 000 DA</span> {lang === "ar" ? "هذا الأسبوع" : "cette semaine"}
          </p>
        </motion.div>

        {/* Recent orders */}
        <motion.div
          className="bg-panel-2 rounded-xl border border-line/40 p-5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-[10px] font-mono text-muted uppercase tracking-wider mb-4">{lang === "ar" ? "آخر الطلبات" : "Dernières commandes"}</p>
          <div className="flex flex-col divide-y divide-line/30">
            {MOCK_ORDERS.slice(0, 4).map(({ id, customer, wilaya, total, status }) => {
              const cfg = STATUS_CONFIG[status as OrderStatus];
              return (
                <div key={id} className="py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-mono text-brand truncate">{id}</p>
                    <p className="text-xs font-mono text-ink truncate">{customer} · {wilaya}</p>
                  </div>
                  <span className={cn("text-[9px] font-mono px-2 py-1 rounded-md", cfg.color, cfg.bg)}>{cfg.label}</span>
                  <span className="text-xs font-mono text-ink font-semibold">{formatPrice(total)}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Low stock alert */}
      <motion.div
        className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4 flex items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0" />
        <p className="text-xs font-mono text-ink/80">
          <span className="text-yellow-400 font-semibold">3 produits</span> ont un stock faible (moins de 5 unités) — <span className="text-brand underline cursor-pointer">voir les produits</span>
        </p>
      </motion.div>
    </div>
  );
}

/* ─── ORDERS TAB ────────────────────────────────────────────────────────── */
function OrdersTab() {
  const { lang } = useLang();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = statusFilter === "all"
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter((o) => o.status === statusFilter);

  return (
    <div className="flex flex-col gap-4">
      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "confirmed", "shipped", "delivered", "cancelled"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "text-[9px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all",
              statusFilter === s
                ? "border-brand/50 text-brand bg-brand/10"
                : "border-line/40 text-muted hover:border-brand/30 hover:text-ink"
            )}
          >
            {s === "all" ? (lang === "ar" ? "الكل" : "Tous") : STATUS_CONFIG[s as OrderStatus].label}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-panel-2 rounded-xl border border-line/40 overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-4 px-5 py-2.5 border-b border-line/40 text-[9px] font-mono text-muted uppercase tracking-wider">
          <span>{lang === "ar" ? "الطلب" : "Commande"}</span>
          <span className="hidden sm:block">{lang === "ar" ? "الولاية" : "Wilaya"}</span>
          <span>{lang === "ar" ? "الحالة" : "Statut"}</span>
          <span className="hidden sm:block">{lang === "ar" ? "المبلغ" : "Total"}</span>
          <span>{lang === "ar" ? "إجراء" : "Action"}</span>
        </div>
        <AnimatePresence mode="popLayout">
          {filtered.map(({ id, customer, wilaya, total, status, date }, i) => {
            const cfg = STATUS_CONFIG[status as OrderStatus];
            return (
              <motion.div
                key={id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-4 items-center px-5 py-4 border-b border-line/20 last:border-0 hover:bg-panel transition-colors"
              >
                <div>
                  <p className="text-[10px] font-mono text-brand">{id}</p>
                  <p className="text-xs font-mono text-ink">{customer}</p>
                  <p className="text-[9px] font-mono text-muted">{date}</p>
                </div>
                <span className="hidden sm:block text-xs font-mono text-ink">{wilaya}</span>
                <span className={cn("text-[9px] font-mono px-2 py-1 rounded-md", cfg.color, cfg.bg)}>{cfg.label}</span>
                <span className="hidden sm:block text-xs font-mono text-ink font-semibold">{formatPrice(total)}</span>
                <button className="flex items-center gap-1 text-[9px] font-mono text-muted hover:text-brand transition-colors">
                  <Eye size={12} /> {lang === "ar" ? "عرض" : "Voir"}
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── PRODUCTS TAB ──────────────────────────────────────────────────────── */
function ProductsTab() {
  const { lang } = useLang();

  return (
    <div className="flex flex-col gap-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-mono text-muted uppercase tracking-wider">
          {MOCK_PRODUCTS.length} {lang === "ar" ? "منتج" : "produits"}
        </p>
        <button className="flex items-center gap-2 bg-brand hover:bg-brand-light text-ink font-mono text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors">
          <span>+</span> {lang === "ar" ? "إضافة منتج" : "Ajouter"}
        </button>
      </div>

      {/* Products list */}
      <div className="bg-panel-2 rounded-xl border border-line/40 overflow-hidden">
        {MOCK_PRODUCTS.map((p, i) => (
          <motion.div
            key={p.id}
            className="flex items-center gap-4 px-5 py-4 border-b border-line/20 last:border-0 hover:bg-panel transition-colors"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <img
              src={p.img}
              alt={p.name}
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-ink truncate">{p.name}</p>
              <p className="text-[9px] font-mono text-muted">{p.category}</p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <div className={cn("w-1.5 h-1.5 rounded-full", p.stock === 0 ? "bg-brand" : p.stock <= 5 ? "bg-yellow-400" : "bg-emerald-400")} />
              <span className="text-[10px] font-mono text-muted">{p.stock} unités</span>
            </div>
            <span className={cn(
              "hidden sm:block text-[9px] font-mono px-2 py-1 rounded-md",
              p.status === "active" ? "text-emerald-400 bg-emerald-400/10" : "text-muted bg-muted/10"
            )}>
              {p.status === "active" ? (lang === "ar" ? "نشط" : "Actif") : (lang === "ar" ? "مسودة" : "Brouillon")}
            </span>
            <span className="text-xs font-mono text-brand font-semibold">{formatPrice(p.price)}</span>
            <div className="flex gap-2">
              <button className="text-muted hover:text-ink transition-colors"><Edit3 size={13} /></button>
              <button className="text-muted hover:text-brand transition-colors"><Trash2 size={13} /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── CATEGORIES TAB ────────────────────────────────────────────────────── */
function CategoriesTab() {
  const { lang } = useLang();
  const categories = [
    { name_fr: "Intérieur", name_ar: "داخلي", products: 18, slug: "interieur" },
    { name_fr: "Électronique", name_ar: "إلكترونيات", products: 12, slug: "electronique" },
    { name_fr: "Audio", name_ar: "صوتيات", products: 7, slug: "audio" },
    { name_fr: "Éclairage", name_ar: "إضاءة", products: 9, slug: "eclairage" },
    { name_fr: "Extérieur", name_ar: "خارجي", products: 5, slug: "exterieur" },
    { name_fr: "Accessoires", name_ar: "ملحقات", products: 14, slug: "accessoires" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <p className="text-[10px] font-mono text-muted uppercase tracking-wider">
          {categories.length} {lang === "ar" ? "فئة" : "catégories"}
        </p>
        <button className="flex items-center gap-2 bg-brand hover:bg-brand-light text-ink font-mono text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors">
          <span>+</span> {lang === "ar" ? "إضافة فئة" : "Ajouter"}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.slug}
            className="bg-panel-2 border border-line/40 rounded-xl p-4 flex items-center justify-between hover:border-brand/30 transition-colors"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
          >
            <div>
              <p className="text-sm font-mono text-ink font-semibold">{lang === "ar" ? cat.name_ar : cat.name_fr}</p>
              <p className="text-[10px] font-mono text-muted mt-0.5">{cat.products} {lang === "ar" ? "منتج" : "produits"}</p>
            </div>
            <div className="flex gap-2">
              <button className="text-muted hover:text-ink transition-colors"><Edit3 size={13} /></button>
              <button className="text-muted hover:text-brand transition-colors"><Trash2 size={13} /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────────────────── */
export function AdminPreview() {
  const { lang } = useLang();
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "products" | "categories">("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabContent = {
    dashboard: <DashboardTab />,
    orders: <OrdersTab />,
    products: <ProductsTab />,
    categories: <CategoriesTab />,
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col" dir="ltr">
      {/* ─ DEMO BANNER ─ */}
      <motion.div
        className="relative z-50 bg-brand/90 backdrop-blur text-ink text-[10px] font-mono uppercase tracking-[0.3em] text-center py-2.5 px-4 flex items-center justify-center gap-3"
        initial={{ y: -40 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="flex items-center gap-2">
          <Eye size={11} />
          <span>{lang === "ar" ? "وضع العرض التوضيحي — لا توجد بيانات حقيقية" : "MODE DÉMO — aucune donnée réelle"}</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span className="flex items-center gap-1 opacity-70"><Check size={9} /> Lecture seule</span>
          <span className="flex items-center gap-1 opacity-70"><X size={9} /> Pas de login requis</span>
        </div>
      </motion.div>

      <div className="flex flex-1 overflow-hidden">
        {/* ─ SIDEBAR ─ */}
        <motion.aside
          className={cn(
            "fixed lg:static inset-y-0 start-0 z-40 w-56 bg-panel border-e border-line/40 flex flex-col pt-16 lg:pt-0 transition-transform duration-300",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          {/* Logo area */}
          <div className="p-5 border-b border-line/30">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
                <span className="text-[10px] font-mono font-black text-ink">AS</span>
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-ink uppercase tracking-wider">Auto Style</p>
                <p className="text-[9px] font-mono text-muted">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 flex flex-col gap-1">
            {NAV_ITEMS.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => { setActiveTab(id as typeof activeTab); setSidebarOpen(false); }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono transition-all",
                  activeTab === id
                    ? "bg-brand/10 text-brand border border-brand/20"
                    : "text-muted hover:text-ink hover:bg-panel-2"
                )}
              >
                {icon}
                <span>{label}</span>
                {id === "orders" && (
                  <span className="ms-auto bg-brand text-ink text-[8px] font-mono rounded-full w-4 h-4 flex items-center justify-center">3</span>
                )}
              </button>
            ))}
          </nav>

          {/* Store link */}
          <div className="p-3 border-t border-line/30">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-mono text-muted hover:text-ink hover:bg-panel-2 transition-colors"
            >
              <ArrowLeft size={13} />
              {lang === "ar" ? "العودة للمتجر" : "Retour à la boutique"}
            </Link>
          </div>
        </motion.aside>

        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="fixed inset-0 bg-bg/80 z-30 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* ─ MAIN CONTENT ─ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-auto">
          {/* Top bar */}
          <header className="sticky top-0 z-20 bg-panel/80 backdrop-blur-md border-b border-line/30 px-5 py-3.5 flex items-center gap-3">
            <button
              className="lg:hidden text-muted hover:text-ink"
              onClick={() => setSidebarOpen(true)}
            >
              <ChevronDown size={18} className="rotate-[-90deg]" />
            </button>
            <h1 className="font-mono text-sm font-bold text-ink uppercase tracking-wider capitalize flex-1">
              {activeTab === "dashboard" ? (lang === "ar" ? "لوحة التحكم" : "Dashboard")
                : activeTab === "orders" ? (lang === "ar" ? "الطلبات" : "Commandes")
                : activeTab === "products" ? (lang === "ar" ? "المنتجات" : "Produits")
                : (lang === "ar" ? "الفئات" : "Catégories")}
            </h1>

            {/* "Demo" user chip */}
            <div className="flex items-center gap-2 bg-panel-2 border border-line/40 rounded-lg px-3 py-1.5">
              <div className="w-5 h-5 rounded-full bg-brand/30 flex items-center justify-center">
                <span className="text-[8px] font-mono text-brand font-bold">O</span>
              </div>
              <span className="text-[10px] font-mono text-muted">owner@demo</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
          </header>

          {/* Page content */}
          <div className="flex-1 p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {tabContent[activeTab]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
