import { useLang } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center gap-0.5 bg-panel-2 border border-line rounded-lg p-0.5">
      <button
        onClick={() => setLang("fr")}
        className={cn(
          "px-3 py-1.5 rounded-md text-[10px] font-mono uppercase tracking-widest transition-all",
          lang === "fr"
            ? "bg-brand text-ink"
            : "text-muted hover:text-ink"
        )}
      >
        FR
      </button>
      <button
        onClick={() => setLang("ar")}
        className={cn(
          "px-3 py-1.5 rounded-md text-sm font-ar transition-all leading-none",
          lang === "ar"
            ? "bg-brand text-ink"
            : "text-muted hover:text-ink"
        )}
      >
        ع
      </button>
    </div>
  );
}
