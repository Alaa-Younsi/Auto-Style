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
  const floatFont = lang === "ar" ? "font-ar text-sm" : "font-mono text-[11px] uppercase tracking-widest";

  return (
    <div className={cn(
      "relative flex items-center",
      lang === "ar" ? "flex-row-reverse gap-4" : "gap-4"
    )}>
      {/* Floating label — one language only */}
      <div className="flex flex-col gap-1 pointer-events-none select-none">
        <span className={cn("text-ink/85 leading-none whitespace-nowrap font-semibold", floatFont)}>
          {floatLabel}
        </span>
        <div className={cn("h-px w-8 bg-brand/60", lang === "ar" && "ms-auto")} />
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
          <circle
            cx={cx} cy={cx} r={hubR * 0.18}
            fill="#E11D2A"
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
