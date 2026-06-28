import { cn } from "@/lib/utils";
import { useLang } from "@/i18n/LanguageProvider";
import type { ButtonHTMLAttributes } from "react";

interface CircleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: number;
}

export function CircleButton({ label, size = 140, className, disabled, onClick, ...props }: CircleButtonProps) {
  const { lang } = useLang();
  const r = (size / 2) * 0.78;
  const circumference = 2 * Math.PI * r;
  const ringText = `${label} · ${label} · `;

  const rimWidth = size * 0.095;
  const outerR = size / 2 - 4;
  const innerR = outerR - rimWidth;
  const hubR = size * 0.12;
  const spokeW = size * 0.045;

  const spokes = [90, 210, 330];

  return (
    <div className={cn("relative flex items-center", lang === "ar" ? "flex-row-reverse gap-3" : "gap-3")}>
      {/* Floating bilingual label */}
      <div className="flex flex-col gap-0.5 pointer-events-none select-none">
        <span className="text-[10px] font-mono uppercase tracking-widest text-ink/80 leading-none whitespace-nowrap">
          Ajouter au panier
        </span>
        <span className="text-[10px] font-ar text-ink/60 leading-none whitespace-nowrap">
          أضف إلى السلة
        </span>
        {/* connecting dash */}
        <div className={cn(
          "h-px w-6 bg-brand/50 mt-1",
          lang === "ar" ? "ms-auto" : ""
        )} />
      </div>

      {/* Steering wheel button */}
      <button
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "relative flex-shrink-0 rounded-full transition-all duration-300 group",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "hover:scale-105 active:scale-95",
          className
        )}
        style={{ width: size, height: size }}
        aria-label={label}
        {...props}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0 overflow-visible"
        >
          <defs>
            <path
              id={`ring-text-${size}`}
              d={`M ${size / 2},${size / 2} m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`}
            />
            {/* Red glow filter */}
            <filter id={`glow-${size}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer rim */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={outerR}
            fill="none"
            stroke="#E11D2A"
            strokeWidth={rimWidth}
            className="transition-all duration-300 group-hover:stroke-[#F2434F]"
            style={{ filter: `url(#glow-${size})` }}
          />

          {/* Inner rim edge (dark fill) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={innerR}
            fill="rgb(var(--c-panel))"
          />

          {/* Spokes */}
          {spokes.map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = size / 2 + hubR * Math.cos(rad);
            const y1 = size / 2 + hubR * Math.sin(rad);
            const x2 = size / 2 + innerR * Math.cos(rad);
            const y2 = size / 2 + innerR * Math.sin(rad);
            return (
              <line
                key={angle}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#E11D2A"
                strokeWidth={spokeW}
                strokeLinecap="round"
                className="transition-all duration-300 group-hover:stroke-[#F2434F]"
              />
            );
          })}

          {/* Center hub */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={hubR}
            fill="#E11D2A"
            className="transition-all duration-300 group-hover:fill-[#F2434F]"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={hubR * 0.5}
            fill="rgb(var(--c-panel))"
          />

          {/* Rotating ring text */}
          <g className="animate-spin-slow">
            <text
              fill="rgba(244,244,245,0.5)"
              fontFamily="Rajdhani, sans-serif"
              style={{ fontSize: 8, letterSpacing: circumference / ringText.length - 8 }}
            >
              <textPath href={`#ring-text-${size}`}>{ringText}</textPath>
            </text>
          </g>
        </svg>
      </button>
    </div>
  );
}
