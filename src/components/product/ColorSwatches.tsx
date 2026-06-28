import { Check } from "lucide-react";
import type { ProductColor } from "@/types/db";
import { useLang } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

interface ColorSwatchesProps {
  colors: ProductColor[];
  selected: string | null;
  onSelect: (hex: string, label: string) => void;
}

export function ColorSwatches({ colors, selected, onSelect }: ColorSwatchesProps) {
  const { lang, t } = useLang();

  if (!colors || colors.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-widest font-mono text-muted">
          {t("product_colour")}
        </span>
        {selected && (
          <span className="text-[10px] font-mono text-ink uppercase tracking-wider">
            {colors.find((c) => c.hex === selected)?.[lang === "ar" ? "label_ar" : "label_fr"] ?? ""}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.hex}
            onClick={() => onSelect(color.hex, lang === "ar" ? color.label_ar : color.label_fr)}
            title={lang === "ar" ? color.label_ar : color.label_fr}
            className={cn(
              "w-7 h-7 rounded-full border-2 transition-all duration-150 relative flex items-center justify-center",
              selected === color.hex
                ? "border-brand scale-110"
                : "border-line hover:border-muted"
            )}
            style={{ backgroundColor: color.hex }}
          >
            {selected === color.hex && (
              <Check
                size={12}
                className="text-ink drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
                strokeWidth={3}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
