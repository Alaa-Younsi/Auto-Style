import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BentoPanelProps {
  children: ReactNode;
  className?: string;
  notch?: "tl" | "tr" | "both" | "none";
  variant?: "default" | "dark" | "lighter";
  /** Opt-in racing hover treatment: brand border glow + headlight strip along the top edge */
  interactive?: boolean;
}

export function BentoPanel({
  children,
  className,
  notch = "none",
  variant = "default",
  interactive = false,
}: BentoPanelProps) {
  const bg =
    variant === "dark"
      ? "bg-bg"
      : variant === "lighter"
        ? "bg-panel-2"
        : "bg-panel";

  return (
    <div
      className={cn(
        "relative rounded-bento overflow-hidden",
        "shadow-panel border border-line/40",
        bg,
        interactive && "group transition-all duration-300 hover:border-brand/40 hover:shadow-glow-sm",
        className
      )}
    >
      {interactive && (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[2px] pointer-events-none overflow-hidden z-10"
        >
          <span className="fx-sweep" />
        </span>
      )}
      {(notch === "tl" || notch === "both") && (
        <span
          className="absolute top-0 left-0 w-7 h-7 bg-bg rounded-br-full pointer-events-none z-10"
          aria-hidden
        />
      )}
      {(notch === "tr" || notch === "both") && (
        <span
          className="absolute top-0 right-0 w-7 h-7 bg-bg rounded-bl-full pointer-events-none z-10"
          aria-hidden
        />
      )}
      {children}
    </div>
  );
}
