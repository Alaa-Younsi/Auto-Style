import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";
import { forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[10px] uppercase tracking-widest text-muted font-mono">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          "w-full bg-panel-2 border rounded-lg px-4 py-3 text-sm font-mono text-ink",
          "transition-colors duration-150 focus:outline-none appearance-none cursor-pointer",
          error
            ? "border-brand focus:border-brand"
            : "border-line focus:border-muted",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-[10px] text-brand font-mono">{error}</span>
      )}
    </div>
  )
);
Select.displayName = "Select";
