import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[10px] uppercase tracking-widest text-muted font-mono">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full bg-panel-2 border rounded-lg px-4 py-3 text-sm font-mono text-ink placeholder:text-muted/50",
          "transition-colors duration-150 focus:outline-none",
          error
            ? "border-brand focus:border-brand"
            : "border-line focus:border-muted",
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-[10px] text-brand font-mono">{error}</span>
      )}
    </div>
  )
);
Input.displayName = "Input";
