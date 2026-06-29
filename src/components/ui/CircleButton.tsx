import { cn } from "@/lib/utils";
import { useLang } from "@/i18n/LanguageProvider";
import type { ButtonHTMLAttributes } from "react";

interface CircleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: number;
}

export function CircleButton({ label, size = 140, className, disabled, onClick, ...props }: CircleButtonProps) {
  const { lang } = useLang();

  const cx = size / 2;
  const rimW = size * 0.10;
  const outerR = cx - 4;
  const innerR = outerR - rimW;
  const hubR = size * 0.13;
  const spokeW = size * 0.05;
  const spokes = [90, 210, 330];

  /* Ring text on a path just inside the rim */
  const textR = innerR + rimW * 0.45;
  const textCircumference = 2 * Math.PI * textR;
  const ringText = `${label} · ${label} · ${label} · `;
  const letterSpacing = textCircumference / ringText.length - 7.5;
  const ringPathId = `rp-${size}`;
  const glowId = `glow-${size}`;

  const floatLabel = lang === "ar" ? "أضف إلى السلة" : "Ajouter au panier";
  const floatFont = lang === "ar" ? "font-ar text-sm" : "font-mono text-[10px] uppercase tracking-widest";

  return (
    <div className={cn(
      "relative flex items-center",
      lang === "ar" ? "flex-row-reverse gap-5" : "gap-5"
    )}>
      {/* Floating label badge */}
      <div className={cn(
        "flex flex-col gap-2 pointer-events-none select-none",
        lang === "ar" && "items-end"
      )}>
        <div className={cn(
          "flex items-center gap-2 bg-brand text-white rounded-xl px-4 py-2.5",
          "shadow-[0_4px_20px_-4px_rgba(225,29,42,0.6)]",
          "ring-1 ring-brand/40",
          lang === "ar" && "flex-row-reverse"
        )}>
          {/* Cart icon */}
          <svg viewBox="0 0 20 20" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 1h3l1.5 8.5h9L17 5H5.5" />
            <circle cx="8" cy="17" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="15" cy="17" r="1.2" fill="currentColor" stroke="none" />
          </svg>
          <span className={cn("text-white font-bold leading-none whitespace-nowrap", floatFont)}>
            {floatLabel}
          </span>
        </div>
        {/* Arrow line pointing at wheel */}
        <div className={cn(
          "h-px bg-gradient-to-r from-brand to-transparent w-12",
          lang === "ar" && "bg-gradient-to-l ms-auto"
        )} />
      </div>

      {/* Steering wheel */}
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
          className="absolute inset-0"
          overflow="visible"
        >
          <defs>
            <path
              id={ringPathId}
              d={`M ${cx},${cx} m -${textR},0 a ${textR},${textR} 0 1,1 ${textR * 2},0 a ${textR},${textR} 0 1,1 -${textR * 2},0`}
            />
            <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id={`hubGrad-${size}`} cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#F2434F" />
              <stop offset="100%" stopColor="#8B0F18" />
            </radialGradient>
          </defs>

          {/* Outer glow ring */}
          <circle
            cx={cx} cy={cx} r={outerR}
            fill="none"
            stroke="#E11D2A"
            strokeWidth={rimW}
            opacity="0.25"
            style={{ filter: `url(#${glowId})` }}
          />

          {/* Main rim */}
          <circle
            cx={cx} cy={cx} r={outerR}
            fill="none"
            stroke="#E11D2A"
            strokeWidth={rimW * 0.55}
            className="transition-colors duration-300 group-hover:stroke-[#F2434F]"
          />

          {/* Rim inner edge highlight */}
          <circle
            cx={cx} cy={cx} r={innerR + 1}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1.5"
          />

          {/* Inner fill */}
          <circle cx={cx} cy={cx} r={innerR} fill="rgb(var(--c-panel))" />

          {/* Spokes */}
          {spokes.map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = cx + hubR * Math.cos(rad);
            const y1 = cx + hubR * Math.sin(rad);
            const x2 = cx + (innerR - 2) * Math.cos(rad);
            const y2 = cx + (innerR - 2) * Math.sin(rad);
            return (
              <line
                key={angle}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#E11D2A"
                strokeWidth={spokeW}
                strokeLinecap="round"
                className="transition-colors duration-300 group-hover:stroke-[#F2434F]"
              />
            );
          })}

          {/* Spoke edge highlights */}
          {spokes.map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const offsetRad = rad + 0.12;
            const x1 = cx + hubR * Math.cos(offsetRad);
            const y1 = cx + hubR * Math.sin(offsetRad);
            const x2 = cx + (innerR - 4) * Math.cos(offsetRad);
            const y2 = cx + (innerR - 4) * Math.sin(offsetRad);
            return (
              <line
                key={`hi-${angle}`}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={spokeW * 0.5}
                strokeLinecap="round"
              />
            );
          })}

          {/* Hub */}
          <circle
            cx={cx} cy={cx} r={hubR}
            fill={`url(#hubGrad-${size})`}
            className="transition-all duration-300"
          />
          <circle
            cx={cx} cy={cx} r={hubR * 0.42}
            fill="rgb(var(--c-panel))"
          />
          {/* "+" icon in hub center */}
          <line
            x1={cx - hubR * 0.22} y1={cx}
            x2={cx + hubR * 0.22} y2={cx}
            stroke="white" strokeWidth={hubR * 0.14} strokeLinecap="round"
            opacity="0.9"
          />
          <line
            x1={cx} y1={cx - hubR * 0.22}
            x2={cx} y2={cx + hubR * 0.22}
            stroke="white" strokeWidth={hubR * 0.14} strokeLinecap="round"
            opacity="0.9"
          />

          {/* Rotating ring text — animateTransform rotates around the wheel center */}
          <g>
            <text
              fill="rgba(244,244,245,0.45)"
              fontFamily="Rajdhani, sans-serif"
              fontSize="7.5"
              letterSpacing={letterSpacing}
            >
              <textPath href={`#${ringPathId}`}>{ringText}</textPath>
            </text>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${cx} ${cx}`}
              to={`360 ${cx} ${cx}`}
              dur="14s"
              repeatCount="indefinite"
            />
          </g>
        </svg>
      </button>
    </div>
  );
}
