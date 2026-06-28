import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-mono uppercase tracking-widest transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed",
        {
          primary:
            "bg-brand text-ink hover:bg-brand-light active:scale-95 rounded-lg",
          ghost:
            "text-muted hover:text-ink bg-transparent hover:bg-line/40 rounded-lg",
          outline:
            "border border-line text-ink hover:border-brand hover:text-brand bg-transparent rounded-lg",
          danger:
            "bg-brand/10 text-brand border border-brand/30 hover:bg-brand hover:text-ink rounded-lg",
        }[variant],
        {
          sm: "px-3 py-1.5 text-[10px]",
          md: "px-5 py-2.5 text-xs",
          lg: "px-7 py-3.5 text-sm",
        }[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
