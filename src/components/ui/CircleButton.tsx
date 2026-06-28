import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

interface CircleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: number;
}

export function CircleButton({ label, size = 140, className, ...props }: CircleButtonProps) {
  const r = (size / 2) * 0.78;
  const circumference = 2 * Math.PI * r;
  const text = `${label} · ${label} · `;

  return (
    <button
      className={cn(
        "relative rounded-full bg-brand hover:bg-brand-light active:scale-95",
        "transition-all duration-200 flex items-center justify-center glow-brand",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        className
      )}
      style={{ width: size, height: size }}
      {...props}
    >
      {/* rotating ring text */}
      <svg
        className="absolute inset-0 animate-spin-slow pointer-events-none select-none"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <path
            id={`circle-path-${size}`}
            d={`M ${size / 2},${size / 2} m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`}
          />
        </defs>
        <text
          className="fill-ink/80 font-mono"
          style={{ fontSize: 9, letterSpacing: circumference / text.length - 9 }}
        >
          <textPath href={`#circle-path-${size}`}>{text}</textPath>
        </text>
      </svg>

      {/* center icon */}
      <Plus
        className="text-ink"
        style={{ width: size * 0.28, height: size * 0.28 }}
        strokeWidth={2.5}
      />
    </button>
  );
}
