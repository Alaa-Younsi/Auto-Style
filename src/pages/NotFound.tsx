import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function NotFound() {
  const { t, lang } = useLang();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-[120px] sm:text-[180px] font-mono font-bold text-line leading-none select-none">
          404
        </p>
        <h1 className={cn(
          "font-mono font-bold uppercase tracking-tight text-ink -mt-4",
          lang === "ar" ? "font-ar text-2xl" : "text-2xl sm:text-3xl"
        )}>
          {t("not_found_title")}
        </h1>
        <p className={cn(
          "text-muted font-mono text-xs mt-3",
          lang === "ar" && "font-ar text-sm"
        )}>
          {t("not_found_sub")}
        </p>
      </motion.div>

      <Link to="/">
        <Button size="lg">{t("not_found_cta")}</Button>
      </Link>
    </div>
  );
}
