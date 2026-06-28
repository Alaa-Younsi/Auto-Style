import type { ProductSize } from "@/types/db";
import { useLang } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes: ProductSize[];
  selected: string | null;
  onSelect: (label: string) => void;
}

export function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  const { t } = useLang();

  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-widest font-mono text-muted">
          {t("product_size")}
        </span>
        {selected && (
          <span className="text-[10px] font-mono text-ink uppercase tracking-wider">
            {selected}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => (
          <button
            key={s.label}
            onClick={() => onSelect(s.label)}
            className={cn(
              "min-w-[42px] h-9 px-3 rounded-lg border text-[10px] font-mono uppercase tracking-wider transition-all",
              selected === s.label
                ? "border-brand text-brand bg-brand/10"
                : "border-line text-muted hover:border-muted hover:text-ink"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
