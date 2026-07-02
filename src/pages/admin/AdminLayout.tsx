import { useState } from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Tag, ShoppingBag, LogOut, ChevronLeft, Menu, X, Truck, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/i18n/LanguageProvider";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import logo from "@/assets/auto-style-logo.png";
import { cn } from "@/lib/utils";

export function AdminLayout() {
  const { session, loading, signOut } = useAuth();
  const { t, dir } = useLang();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-6 h-6 rounded-full border-2 border-brand border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session) return <Navigate to="/admin/login" replace />;

  const navItems = [
    { to: "/admin", icon: LayoutDashboard, label: t("admin_dashboard"), exact: true },
    { to: "/admin/products", icon: Package, label: t("admin_products") },
    { to: "/admin/categories", icon: Tag, label: t("admin_categories") },
    { to: "/admin/orders", icon: ShoppingBag, label: t("admin_orders") },
    { to: "/admin/delivery-prices", icon: Truck, label: t("admin_delivery_prices") },
    { to: "/admin/reviews", icon: Star, label: t("admin_reviews") },
  ];

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-line/40 flex items-center justify-between">
        <img src={logo} alt="Auto Style" className="h-10 w-auto" />
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden text-muted hover:text-ink transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label, exact }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors",
              isActive(to, exact)
                ? "bg-brand/10 text-brand"
                : "text-muted hover:text-ink hover:bg-line/40"
            )}
          >
            <Icon size={14} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-line/40 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[10px] font-mono uppercase tracking-wider text-muted hover:text-brand hover:bg-brand/5 transition-colors w-full"
        >
          <LogOut size={14} />
          {t("admin_logout")}
        </button>
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[10px] font-mono uppercase tracking-wider text-muted hover:text-ink hover:bg-line/40 transition-colors"
        >
          <ChevronLeft size={14} />
          Voir le site
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-bg">
      {/* Desktop sidebar */}
      <aside className="w-56 flex-shrink-0 border-e border-line/50 bg-panel flex-col hidden md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: dir === "rtl" ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: dir === "rtl" ? "100%" : "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 start-0 w-56 bg-panel border-e border-line/50 z-50 flex flex-col md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-line/40 bg-panel">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted hover:text-ink transition-colors"
          >
            <Menu size={18} />
          </button>
          <img src={logo} alt="Auto Style" className="h-9 w-auto" />
          <div className="flex-1" />
          <ThemeToggle />
        </div>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
