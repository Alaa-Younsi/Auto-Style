import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/auto-style-logo.png";
import { useLang } from "@/i18n/LanguageProvider";
import { useCartStore } from "@/store/cart";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

export function Header() {
  const { t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const openCart = useCartStore((s) => s.openCart);
  const itemCount = useCartStore((s) => s.itemCount());
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");
  if (isAdmin) return null;

  const navLinks = [
    { to: "/", label: t("nav_home") },
    { to: "/shop", label: t("nav_shop") },
  ];
  const adminLink = { to: "/admin", label: t("nav_admin") };

  return (
    <header className="fixed top-0 inset-x-0 z-30 bg-bg/80 backdrop-blur-md border-b border-line/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-6">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 flex items-center gap-2.5">
          <img
            src={logo}
            alt="Auto Style"
            className="h-14 w-auto"
          />
        </Link>

        {/* Nav — desktop */}
        <nav className="hidden md:flex items-center gap-6 ms-4">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "text-[10px] uppercase tracking-widest font-mono transition-colors",
                location.pathname === l.to ? "text-brand" : "text-muted hover:text-ink"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to={adminLink.to}
            className="hidden md:flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono text-muted hover:text-ink transition-colors"
          >
            <LayoutDashboard size={13} />
            {adminLink.label}
          </Link>
          <ThemeToggle />
          <LanguageToggle />

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative p-2 rounded-lg text-muted hover:text-ink hover:bg-line/40 transition-colors"
            aria-label={t("nav_cart")}
          >
            <ShoppingBag size={18} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand rounded-full text-[9px] font-mono text-ink flex items-center justify-center leading-none">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-muted hover:text-ink hover:bg-line/40 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-line/50 bg-bg"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {[...navLinks, adminLink].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "text-xs uppercase tracking-widest font-mono py-2 transition-colors",
                    location.pathname === l.to ? "text-brand" : "text-muted"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
