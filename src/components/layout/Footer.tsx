import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/auto-style-logo.png";
import { useLang } from "@/i18n/LanguageProvider";

export function Footer() {
  const { t, lang } = useLang();
  const location = useLocation();

  if (location.pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-line/60 bg-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Auto Style"
              className="h-16 w-auto"
            />
          </div>
          <p className="text-xs text-muted font-mono leading-relaxed max-w-xs">
            {t("hero_sub")}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-brand" />
            <span className="text-[10px] font-mono text-muted uppercase tracking-widest">
              {lang === "ar" ? "الجزائر — الدفع عند الاستلام" : "Algérie — Paiement à la livraison"}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[10px] uppercase tracking-widest text-brand font-mono mb-2">
            {lang === "ar" ? "التنقل" : "Navigation"}
          </h3>
          <Link
            to="/"
            className="text-xs font-mono text-muted hover:text-ink transition-colors flex items-center gap-2 group"
          >
            <span className="w-1 h-px bg-line group-hover:bg-brand group-hover:w-3 transition-all" />
            {t("nav_home")}
          </Link>
          <Link
            to="/shop"
            className="text-xs font-mono text-muted hover:text-ink transition-colors flex items-center gap-2 group"
          >
            <span className="w-1 h-px bg-line group-hover:bg-brand group-hover:w-3 transition-all" />
            {t("nav_shop")}
          </Link>
          <Link
            to="/admin"
            className="text-xs font-mono text-muted hover:text-ink transition-colors flex items-center gap-2 group"
          >
            <span className="w-1 h-px bg-line group-hover:bg-brand group-hover:w-3 transition-all" />
            {lang === "ar" ? "لوحة التحكم" : "Admin"}
          </Link>
        </div>

        {/* Livraison */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[10px] uppercase tracking-widest text-brand font-mono mb-2">
            {lang === "ar" ? "التوصيل" : "Livraison"}
          </h3>
          <p className="text-xs font-mono text-muted leading-relaxed">
            {lang === "ar"
              ? "توصيل لجميع ولايات الجزائر الـ58 في غضون 24-48 ساعة."
              : "Livraison dans les 58 wilayas d'Algérie sous 24-48H."}
          </p>
          <p className="text-xs font-mono text-muted leading-relaxed">
            {t("checkout_cod_notice")}
          </p>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[10px] uppercase tracking-widest text-brand font-mono mb-2">
            {lang === "ar" ? "التواصل" : "Contact"}
          </h3>
          <p className="text-xs font-mono text-muted">
            {lang === "ar" ? "8 صباحاً — 10 مساءً، 7 أيام في الأسبوع" : "8H — 22H, 7 jours / 7"}
          </p>
          <div className="mt-2 flex flex-col gap-2">
            {[
              { label: lang === "ar" ? "+500 منتج" : "+500 Produits", color: "text-ink" },
              { label: lang === "ar" ? "58 ولاية" : "58 Wilayas", color: "text-ink" },
              { label: lang === "ar" ? "دفع عند الاستلام" : "Cash à la livraison", color: "text-brand" },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-line" />
                <span className={`text-[11px] font-mono ${color}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line/40 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[10px] text-muted/60 font-mono uppercase tracking-widest">
            © 2024 Auto Style · Algérie
          </span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-[10px] font-mono text-muted/50 uppercase tracking-widest">
              {lang === "ar" ? "دفع آمن 100%" : "Paiement 100% sécurisé"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
