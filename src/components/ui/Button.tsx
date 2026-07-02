import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
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
  onClick,
  disabled,
  ...props
}: ButtonProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && variant === "primary") {
      const rect = e.currentTarget.getBoundingClientRect();
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 620);
    }
    onClick?.(e);
  };

  const hasShimmer = variant === "primary" || variant === "outline";

  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 font-mono uppercase tracking-widest overflow-hidden",
        "transition-all duration-150 active:scale-[0.94]",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        {
          primary: "bg-brand text-ink hover:bg-brand-light rounded-lg hover:shadow-glow-sm",
          ghost: "text-muted hover:text-ink bg-transparent hover:bg-line/40 rounded-lg",
          outline: "border border-line text-ink hover:border-brand hover:text-brand bg-transparent rounded-lg",
          danger: "bg-brand/10 text-brand border border-brand/30 hover:bg-brand hover:text-ink rounded-lg",
        }[variant],
        {
          sm: "px-3 py-1.5 text-[10px]",
          md: "px-5 py-2.5 text-xs",
          lg: "px-7 py-3.5 text-sm",
        }[size],
        className
      )}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {/* Ignition tick — brand bar on the inline-start edge, grows on hover */}
      <span
        aria-hidden
        className="absolute inset-y-0 start-0 w-[3px] bg-ink/25 scale-y-[0.4] group-hover:scale-y-100 group-hover:bg-ink/50 origin-center transition-all duration-200 pointer-events-none"
      />

      {/* Headlight sweep — shared racing hover effect */}
      {hasShimmer && <span aria-hidden className="fx-sweep" />}

      {/* Click ripple — expands from the exact click point */}
      {ripples.map(({ id, x, y }) => (
        <motion.span
          key={id}
          aria-hidden
          className="absolute rounded-full pointer-events-none"
          style={{
            left: x,
            top: y,
            background: "rgba(255,255,255,0.25)",
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: 130, height: 130, opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        />
      ))}

      {children}
    </button>
  );
}
