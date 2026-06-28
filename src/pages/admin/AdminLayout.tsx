import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Tag, ShoppingBag, LogOut, ChevronLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/i18n/LanguageProvider";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import logo from "@/assets/auto-style-logo.png";
import { cn } from "@/lib/utils";

export function AdminLayout() {
  const { session, loading, signOut } = useAuth();
  const { t } = useLang();
  const location = useLocation();

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
  ];

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen flex bg-bg">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 border-e border-line/50 bg-panel flex flex-col">
        <div className="p-4 border-b border-line/40">
          <img src={logo} alt="Auto Style" className="h-8 w-auto" />
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label, exact }) => (
            <Link
              key={to}
              to={to}
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
          <LanguageToggle />
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
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
