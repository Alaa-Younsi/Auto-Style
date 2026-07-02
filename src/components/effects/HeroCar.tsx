import { motion } from "framer-motion";

/* ─── HERO CAR SVG ─────────────────────────────────────────────────────────
   Theme-aware: body/arch gradients and wheel fills read from the --c-car-*
   tokens (graphite in light mode, near-black in dark mode) so the car never
   turns into a flat black silhouette on a light background. Specular
   highlights stay literal white — gloss reads the same in both themes.
────────────────────────────────────────────────────────────────────────── */

function Wheel({ cx, cy, r, spin }: { cx: number; cy: number; r: number; spin: boolean }) {
  const rimR = r * 0.85;
  const innerR = r * 0.60;
  const hubR = r * 0.18;
  const n = 7;
  return (
    <g>
      {/* Tire */}
      <circle cx={cx} cy={cy} r={r} fill="#0d0d10" />
      <circle cx={cx} cy={cy} r={r - 2} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
      {/* Rim outer */}
      <circle cx={cx} cy={cy} r={rimR} className="fill-car-mid" />
      {/* Inner dish */}
      <circle cx={cx} cy={cy} r={innerR} className="fill-car-lo" />
      {/* 7 straight spokes — very slow idle rotation on desktop, non-reduced only */}
      <g
        style={{ transformOrigin: `${cx}px ${cy}px` }}
        className={spin ? "animate-spin-slow" : undefined}
      >
        {Array.from({ length: n }, (_, i) => {
          const a = (i * Math.PI * 2) / n - Math.PI / 2;
          return (
            <line key={i}
              x1={cx + Math.cos(a) * hubR * 1.4} y1={cy + Math.sin(a) * hubR * 1.4}
              x2={cx + Math.cos(a) * innerR * 0.92} y2={cy + Math.sin(a) * innerR * 0.92}
              className="stroke-car-mid" strokeWidth={r * 0.13} strokeLinecap="round"
            />
          );
        })}
      </g>
      {/* Brake disc */}
      <circle cx={cx} cy={cy} r={innerR * 0.85} fill="none" stroke="rgba(120,35,35,0.32)" strokeWidth="9" />
      {/* Rim highlight rings */}
      <circle cx={cx} cy={cy} r={rimR} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      {/* Hub */}
      <circle cx={cx} cy={cy} r={hubR} fill="#E11D2A" />
      <circle cx={cx} cy={cy} r={hubR * 0.44} fill="#8B0F18" />
    </g>
  );
}

interface HeroCarProps {
  /** Disables the reflection sweep, headlight flicker and wheel spin — desktop + motion-ok only */
  reducedMotion?: boolean;
}

export function HeroCar({ reducedMotion = false }: HeroCarProps) {
  const W = 960, H = 420;
  const gY = 374;
  const fwR = 64, fwX = 222, fwY = gY - fwR;   // front wheel cy=310
  const rwR = 64, rwX = 682, rwY = gY - rwR;   // rear wheel cy=310
  const sY = 342;
  const aHW = 80;
  const aY = 240;

  const archHole = (x: number) =>
    `M ${x - aHW},${sY} C ${x - aHW},${aY + 20} ${x - 44},${aY} ${x},${aY} C ${x + 44},${aY} ${x + aHW},${aY + 20} ${x + aHW},${sY} Z`;

  /*
   * Fastback / hatchback silhouette: smooth curved front bumper, long flat hood,
   * steep windshield, flat roof, gradual rear slope down to a high trunk line.
   * Bezier curves at the front nose give a realistic rounded bumper shape.
   */
  const bodyPath = `
    M 84,${sY}
    C 78,320 80,294 90,272
    C 98,254 118,242 144,234
    L 360,218
    L 394,220 L 422,138 L 442,130
    L 558,127 L 620,130
    L 752,224
    L 760,250 L 766,274 L 770,312 L 770,${sY}
    L 84,${sY} Z
    ${archHole(fwX)}
    ${archHole(rwX)}
  `;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} fill="none" className="w-full h-full hero-car-shadow">
      <defs>
        <linearGradient id="bdG" x1="4%" y1="0%" x2="4%" y2="100%">
          <stop offset="0%" className="text-car-hi" style={{ stopColor: "currentColor" }} />
          <stop offset="22%" className="text-car-mid" style={{ stopColor: "currentColor" }} />
          <stop offset="60%" className="text-car-mid" style={{ stopColor: "currentColor" }} stopOpacity="0.85" />
          <stop offset="100%" className="text-car-lo" style={{ stopColor: "currentColor" }} />
        </linearGradient>
        <linearGradient id="shG" x1="0%" y1="0%" x2="8%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="12%" stopColor="rgba(255,255,255,0.09)" />
          <stop offset="32%" stopColor="rgba(255,255,255,0.03)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id="glG" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#0c1828" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#071020" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#04080f" stopOpacity="0.97" />
        </linearGradient>
        <radialGradient id="shdG" cx="50%" cy="0%" r="55%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.65)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <radialGradient id="hlG" cx="0%" cy="50%" r="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="38%" stopColor="#ffeecc" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E11D2A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="arG" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" className="text-car-lo" style={{ stopColor: "currentColor" }} />
          <stop offset="100%" className="text-car-mid" style={{ stopColor: "currentColor" }} />
        </linearGradient>
        <linearGradient id="beamG" x1="100%" y1="50%" x2="0%" y2="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id="g1" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="g2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id="bodyClip">
          <path d={bodyPath} fillRule="evenodd" />
        </clipPath>
      </defs>

      {/* Brand underglow — neon glow pooling beneath the sill */}
      <ellipse cx={W / 2} cy={gY - 4} rx="330" ry="16" fill="#E11D2A" opacity="0.16" filter="url(#g2)" />
      {/* Ground shadow */}
      <ellipse cx={W / 2} cy={gY + 5} rx="405" ry="14" fill="url(#shdG)" />
      <line x1="40" y1={gY} x2={W - 40} y2={gY} stroke="rgba(225,29,42,0.12)" strokeWidth="0.8" />

      {/* Front headlight beam cone */}
      <motion.polygon
        points={`104,254 146,234 20,196 20,268`}
        fill="url(#beamG)"
        animate={reducedMotion ? undefined : { opacity: [0.35, 0.6, 0.35] }}
        transition={reducedMotion ? undefined : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Arch interiors */}
      {[fwX, rwX].map(x => (
        <path key={x} fill="url(#arG)"
          d={`M ${x - aHW},${sY} C ${x - aHW},${aY + 20} ${x - 44},${aY} ${x},${aY} C ${x + 44},${aY} ${x + aHW},${aY + 20} ${x + aHW},${sY} Z`} />
      ))}

      {/* ── MAIN BODY ── */}
      <path d={bodyPath} fillRule="evenodd" fill="url(#bdG)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      <path d={bodyPath} fillRule="evenodd" fill="url(#shG)" />

      {/* Body light-pass — a soft reflection sweeping across the paint, desktop + motion only */}
      {!reducedMotion && (
        <g clipPath="url(#bodyClip)">
          <motion.rect
            x={-260} y={130} width={220} height={260}
            fill="rgba(255,255,255,0.10)"
            style={{ transform: "skewX(-18deg)" }}
            animate={{ x: [-260, 1050] }}
            transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 4.5, ease: "easeInOut" }}
          />
        </g>
      )}

      {/* Arch lips */}
      {[fwX, rwX].map(x => (
        <path key={`lp-${x}`} fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5"
          d={`M ${x - aHW + 2},${sY} C ${x - aHW + 2},${aY + 22} ${x - 42},${aY + 2} ${x},${aY + 2} C ${x + 42},${aY + 2} ${x + aHW - 2},${aY + 22} ${x + aHW - 2},${sY}`} />
      ))}

      {/* ── GREENHOUSE GLASS ── */}
      {/* Full greenhouse from A-pillar to rear window */}
      <path
        d="M 396,222 L 422,138 L 442,130 L 558,127 L 620,130 L 752,222 L 396,222 Z"
        fill="url(#glG)" stroke="rgba(255,255,255,0.17)" strokeWidth="1"
      />
      {/* Windshield reflections */}
      <path d="M 416,210 C 442,176 468,154 498,142" stroke="rgba(255,255,255,0.32)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 444,218 C 470,186 500,162 532,149" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Side window reflection */}
      <path d="M 542,218 C 564,202 590,191 618,185" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" />

      {/* A-pillar */}
      <line x1="396" y1="224" x2="422" y2="138" stroke="#0c0c10" strokeWidth="9" />
      {/* B-pillar */}
      <line x1="466" y1="224" x2="463" y2="130" stroke="#0c0c10" strokeWidth="8" />
      {/* C-pillar (thin — rear window is mostly glass on a fastback) */}
      <line x1="620" y1="130" x2="752" y2="222" stroke="#0c0c10" strokeWidth="5" />

      {/* ── ROOF DRIP RAIL ── */}
      <path d="M 422,136 L 558,126 L 618,129" fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5" strokeLinecap="round" />

      {/* ── SMALL LIP SPOILER at roof-rear edge ── */}
      <rect x="616" y="126" width="8" height="5" rx="1" className="fill-car-mid" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

      {/* ── HOOD HIGHLIGHTS ── */}
      <path d="M 144,234 C 220,228 292,222 362,218"
        stroke="rgba(255,255,255,0.22)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 124,242 C 208,236 298,229 366,222"
        stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" fill="none" />

      {/* ── BODY CHARACTER LINES ── */}
      {/* Red accent shoulder line */}
      <path d="M 96,280 C 170,274 262,270 382,266 L 568,264 C 666,264 738,268 764,275"
        stroke="#E11D2A" strokeWidth="1.8" fill="none" filter="url(#g1)" strokeLinecap="round" />
      {/* Upper highlight */}
      <path d="M 122,256 C 212,250 314,246 406,244 L 574,242 C 666,242 734,246 764,252"
        stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
      {/* Lower sill strip between arches */}
      <path d={`M ${fwX + aHW},${sY} L ${rwX - aHW},${sY}`}
        stroke="rgba(225,29,42,0.2)" strokeWidth="1.2" />

      {/* ── PANEL SEAMS — door cut lines + fuel cap ── */}
      <path d="M 466,224 L 462,342" stroke="rgba(0,0,0,0.28)" strokeWidth="1" fill="none" />
      <path d="M 396,224 L 392,342" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" fill="none" />
      <circle cx={650} cy={252} r={6} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />

      {/* ── FRONT GRILLE & BUMPER ── */}
      {/* Grille opening shape */}
      <path d="M 82,316 C 84,298 90,282 102,270 L 112,278 C 102,289 96,303 94,320 Z"
        fill="#07070a" stroke="rgba(225,29,42,0.3)" strokeWidth="1" />
      {/* Grille slats */}
      {[0, 1, 2, 3].map(i => (
        <line key={i}
          x1={83 + i * 3} y1={318 - i * 11}
          x2={108 + i * 4} y2={278 - i * 5}
          stroke="rgba(225,29,42,0.18)" strokeWidth="0.8" strokeLinecap="round" />
      ))}
      {/* Front splitter */}
      <path d={`M 84,${sY} L 172,${sY - 3} L 174,${sY} Z`}
        fill="#0a0a0d" stroke="rgba(225,29,42,0.2)" strokeWidth="0.8" />

      {/* ── FRONT HEADLIGHT — slim DRL slash ── */}
      <path d="M 104,254 L 146,234 L 152,244 L 112,263 Z"
        fill="#0c0c12" stroke="#E11D2A" strokeWidth="1.6" filter="url(#g1)" />
      <path d="M 106,254 L 145,235" stroke="#E11D2A" strokeWidth="4" strokeLinecap="round" filter="url(#g1)" />
      <path d="M 110,261 L 148,242" stroke="#E11D2A" strokeWidth="1.4" strokeLinecap="round" opacity="0.46" />
      <path d="M 106,254 L 145,235 L 150,244 L 112,262 Z" fill="url(#hlG)" opacity="0.38" />
      {/* DRL beam rays */}
      <path d="M 84,258 L 44,254 M 82,266 L 38,266 M 84,274 L 42,276"
        stroke="#E11D2A" strokeWidth="1" strokeOpacity="0.24" strokeLinecap="round" />

      {/* ── REAR TAILLIGHTS — horizontal hatchback-style LED strips ── */}
      <path d="M 752,224 L 770,226 L 770,252 L 752,248 Z"
        fill="#0c0c12" stroke="#E11D2A" strokeWidth="1.4" />
      <path d="M 752,224 L 770,226" stroke="#E11D2A" strokeWidth="4.5" strokeLinecap="round" filter="url(#g2)" opacity="0.92" />
      <path d="M 752,234 L 770,236" stroke="#E11D2A" strokeWidth="1.8" strokeLinecap="round" filter="url(#g1)" opacity="0.6" />
      <path d="M 752,243 L 770,245" stroke="#E11D2A" strokeWidth="1" strokeLinecap="round" opacity="0.32" />
      {/* Lower strip */}
      <path d="M 752,267 L 770,269 L 770,282 L 752,280 Z"
        fill="#0c0c12" stroke="#E11D2A" strokeWidth="1" />
      <path d="M 752,267 L 770,269" stroke="#E11D2A" strokeWidth="3.5" strokeLinecap="round" filter="url(#g1)" opacity="0.75" />

      {/* ── REAR BUMPER / DIFFUSER ── */}
      <path d={`M 718,${sY} L 770,${sY} L 770,${sY - 8} C 752,${sY - 14} 728,${sY - 12} 718,${sY - 9} Z`}
        fill="#07070a" stroke="rgba(225,29,42,0.2)" strokeWidth="1" />
      {[0, 1, 2, 3].map(i => (
        <line key={i}
          x1={724 + i * 12} y1={sY}
          x2={724 + i * 12} y2={sY - 10}
          stroke="rgba(225,29,42,0.18)" strokeWidth="0.9" />
      ))}

      {/* ── SIDE MIRROR ── */}
      <path d="M 298,236 L 320,230 L 324,244 L 302,250 Z"
        className="fill-car-mid" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

      {/* ── DOOR HANDLE ── */}
      <rect x="536" y="228" width="32" height="5" rx="2.5"
        className="fill-car-mid" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />

      {/* ── EXHAUST ── */}
      <ellipse cx={758} cy={gY - 7} rx="11" ry="6.5" fill="#0c0c10" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <ellipse cx={758} cy={gY - 7} rx="6.5" ry="4" fill="#180808" />
      <ellipse cx={744} cy={gY - 6} rx="9" ry="5.5" fill="#0c0c10" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <ellipse cx={744} cy={gY - 6} rx="5" ry="3" fill="#180808" />

      {/* ── WHEELS ── */}
      <Wheel cx={fwX} cy={fwY} r={fwR} spin={!reducedMotion} />
      <Wheel cx={rwX} cy={rwY} r={rwR} spin={!reducedMotion} />

      {/* Arch top shadows */}
      <ellipse cx={fwX} cy={fwY - fwR + 5} rx={fwR - 2} ry="10" fill="rgba(0,0,0,0.55)" />
      <ellipse cx={rwX} cy={rwY - rwR + 5} rx={rwR - 2} ry="10" fill="rgba(0,0,0,0.55)" />

      <line x1="42" y1={gY + 1} x2={W - 42} y2={gY + 1} stroke="#E11D2A" strokeWidth="0.6" strokeOpacity="0.18" />
    </svg>
  );
}
