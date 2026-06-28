import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/auto-style-logo.png";
import { useLang } from "@/i18n/LanguageProvider";

export function Footer() {
  const { t } = useLang();
  const location = useLocation();

  if (location.pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-line/50 bg-panel mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <img src={logo} alt="Auto Style" className="h-10 w-auto" />
          <p className="text-xs text-muted font-mono leading-relaxed max-w-xs">
            {t("hero_sub")}
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[10px] uppercase tracking-widest text-muted font-mono mb-1">Navigation</h3>
          <Link to="/" className="text-xs font-mono text-ink/70 hover:text-brand transition-colors">{t("nav_home")}</Link>
          <Link to="/shop" className="text-xs font-mono text-ink/70 hover:text-brand transition-colors">{t("nav_shop")}</Link>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[10px] uppercase tracking-widest text-muted font-mono mb-1">Info</h3>
          <span className="text-xs font-mono text-ink/70">{t("checkout_cod_notice")}</span>
        </div>
      </div>

      <div className="border-t border-line/30 py-4 text-center">
        <span className="text-[10px] text-muted/50 font-mono uppercase tracking-widest">
          © 2024 Auto Style Car Accessories
        </span>
      </div>
    </footer>
  );
}
