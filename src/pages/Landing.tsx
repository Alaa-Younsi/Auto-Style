import { useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import { ArrowRight, Star, ChevronRight } from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/Button";
import { BentoPanel } from "@/components/ui/BentoPanel";
import { Marquee } from "@/components/ui/Marquee";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ProductCard } from "@/components/product/ProductCard";
import logo from "@/assets/auto-style-logo.png";
import { cn } from "@/lib/utils";

/* ─── SVG ICONS ─────────────────────────────────────────────────────────── */

function IconTruck() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="3" y="13" width="28" height="22" rx="2"/>
      <path d="M31 19h8l4 8v8h-12V19z"/>
      <circle cx="11" cy="37" r="4"/>
      <circle cx="37" cy="37" r="4"/>
      <path d="M15 37h18M7 25h12M3 20h20"/>
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M24 4L6 12v12c0 10 8 17.5 18 20 10-2.5 18-10 18-20V12L24 4z"/>
      <path d="M16 24l5 5 11-11"/>
    </svg>
  );
}

function IconZap() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M26 3L6 27h18l-2 18 20-24H24L26 3z"/>
    </svg>
  );
}

function IconStar() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M24 4l5.5 11.2L43 17l-9.5 9.3 2.2 13.2L24 33l-11.7 6.5L14.5 26.3 5 17l13.5-1.8L24 4z"/>
    </svg>
  );
}

function IconSearch() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="22" cy="22" r="14"/>
      <path d="M32 32l10 10"/>
      <path d="M16 22h12M22 16v12"/>
    </svg>
  );
}

function IconCart() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M6 6h6l4 20h22l4-14H14"/>
      <circle cx="20" cy="40" r="3"/>
      <circle cx="36" cy="40" r="3"/>
    </svg>
  );
}

function IconBox() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M24 4L4 14v20l20 10 20-10V14L24 4z"/>
      <path d="M4 14l20 10 20-10M24 24v20"/>
      <path d="M14 9l20 10"/>
    </svg>
  );
}

function IconPhone() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M10 6h10l4 12-6 4a28 28 0 0012 12l4-6 12 4v10C32 44 4 20 10 6z"/>
    </svg>
  );
}

/* ─── HERO CAR SVG ─────────────────────────────────────────────────────── */
function Wheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const spokes = 5;
  const innerR = r * 0.62;
  const hubR = r * 0.22;
  return (
    <g>
      {/* Tyre */}
      <circle cx={cx} cy={cy} r={r} fill="#0f0f10" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
      {/* Tyre sidewall highlight */}
      <circle cx={cx} cy={cy} r={r - 5} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
      {/* Alloy rim */}
      <circle cx={cx} cy={cy} r={innerR} fill="#1c1c1e" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />
      {/* 5-spoke alloy */}
      {Array.from({ length: spokes }).map((_, i) => {
        const a = (i * 360) / spokes;
        const ra = (a * Math.PI) / 180;
        const ra2 = ((a + 22) * Math.PI) / 180;
        const x1 = cx + hubR * Math.cos(ra);
        const y1 = cy + hubR * Math.sin(ra);
        const x2 = cx + (innerR - 4) * Math.cos(ra);
        const y2 = cy + (innerR - 4) * Math.sin(ra);
        const x3 = cx + (innerR - 4) * Math.cos(ra2);
        const y3 = cy + (innerR - 4) * Math.sin(ra2);
        const xh2 = cx + hubR * Math.cos(ra2);
        const yh2 = cy + hubR * Math.sin(ra2);
        return (
          <g key={i}>
            <path d={`M${x1},${y1} L${x2},${y2} L${x3},${y3} L${xh2},${yh2} Z`}
              fill="#2a2a2e" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
            {/* Spoke highlight */}
            <line x1={cx + (hubR+4) * Math.cos(ra+0.1)} y1={cy + (hubR+4) * Math.sin(ra+0.1)}
              x2={cx + (innerR-8) * Math.cos(ra+0.1)} y2={cy + (innerR-8) * Math.sin(ra+0.1)}
              stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
          </g>
        );
      })}
      {/* Hub cap */}
      <circle cx={cx} cy={cy} r={hubR} fill="#141416" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={hubR * 0.55} fill="#E11D2A" />
      <circle cx={cx} cy={cy} r={hubR * 0.28} fill="#8B0F18" />
      {/* Brake disc visible between spokes */}
      <circle cx={cx} cy={cy} r={innerR * 0.85} fill="none" stroke="rgba(180,50,50,0.15)" strokeWidth="4" />
    </g>
  );
}

function CarSVG() {
  const W = 960, H = 420;
  const groundY = 360;
  const wx1 = 238, wx2 = 700, wy = groundY - 72, wr = 72;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} fill="none" className="w-full h-full"
      style={{ filter: "drop-shadow(0 24px 60px rgba(225,29,42,0.4))" }}>
      <defs>
        {/* Body main — dark metallic charcoal */}
        <linearGradient id="bodyTop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a3a3e" stopOpacity="1" />
          <stop offset="40%" stopColor="#28282c" stopOpacity="1" />
          <stop offset="100%" stopColor="#111114" stopOpacity="1" />
        </linearGradient>
        {/* Body reflection band */}
        <linearGradient id="bodyReflect" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="35%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0.03)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        {/* Hood highlight */}
        <linearGradient id="hoodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a4a50" />
          <stop offset="50%" stopColor="#2e2e32" />
          <stop offset="100%" stopColor="#1a1a1e" />
        </linearGradient>
        {/* Window glass */}
        <linearGradient id="glassGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#0d1a2e" />
          <stop offset="40%" stopColor="#0a1220" />
          <stop offset="100%" stopColor="#060c18" />
        </linearGradient>
        {/* Headlight */}
        <radialGradient id="headlightGrad" cx="30%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#ffe8cc" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#E11D2A" stopOpacity="0" />
        </radialGradient>
        {/* Shadow */}
        <radialGradient id="shadowGrad" cx="50%" cy="0%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        {/* Reflection on ground */}
        <linearGradient id="reflGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(50,50,55,0.35)" />
          <stop offset="100%" stopColor="rgba(50,50,55,0)" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Clip for reflection */}
        <clipPath id="reflClip">
          <rect x="60" y={groundY} width={W - 80} height="70" />
        </clipPath>
      </defs>

      {/* ── Ground shadow ── */}
      <ellipse cx={W / 2} cy={groundY + 8} rx="420" ry="22" fill="url(#shadowGrad)" />

      {/* ── Ground line ── */}
      <line x1="50" y1={groundY} x2={W - 50} y2={groundY} stroke="rgba(225,29,42,0.18)" strokeWidth="1" />

      {/* ── Reflection (mirrored car ghost) ── */}
      <g clipPath="url(#reflClip)" opacity="0.18" transform={`scale(1,-1) translate(0,${-(groundY * 2)})`}>
        {/* simplified body reflection */}
        <path
          d="M95,288 L118,268 C135,252 165,238 200,228 L258,210 C295,195 340,178 385,162 L440,118 C465,102 510,90 560,88 L630,90 C680,92 720,104 750,124 L800,155 C830,175 850,200 860,228 L875,255 C882,265 888,278 888,288 Z"
          fill="url(#bodyTop)"
        />
      </g>

      {/* ── Main car body ── */}
      {/* Lower body sill */}
      <path
        d="M148,{wy} C170,{wy+8} 200,{wy+12} 238,{wy+14} L700,{wy+14} C740,{wy+12} 775,{wy+8} 800,{wy} L820,288 L840,{groundY} L100,{groundY} L105,288 Z"
        fill="#111114"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
      />

      {/* Body side panel — main dark metallic */}
      <path
        d="M95,288 L118,268 C135,252 165,238 200,228 L258,210 C295,195 340,178 385,162 L440,118 C465,102 510,90 560,88 L630,90 C680,92 720,104 750,124 L800,155 C830,175 850,200 860,228 L875,255 C882,265 888,278 888,288 Z"
        fill="url(#bodyTop)"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
      />

      {/* Body side — upper reflection band */}
      <path
        d="M95,288 L118,268 C135,252 165,238 200,228 L258,210 C295,195 340,178 385,162 L440,118 C465,102 510,90 560,88 L630,90 C680,92 720,104 750,124 L800,155 C830,175 850,200 860,228 L875,255 C882,265 888,278 888,288 Z"
        fill="url(#bodyReflect)"
      />

      {/* ── Hood ── */}
      <path
        d="M385,162 C400,145 430,120 470,108 L560,88 C600,87 640,92 680,104 L750,124 C720,104 680,92 630,90 L560,88 L510,90 C475,92 448,105 430,118 Z"
        fill="url(#hoodGrad)"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />
      {/* Hood center ridge */}
      <path
        d="M490,90 C510,88 545,88 570,90 L740,124"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Hood highlight streak */}
      <path
        d="M430,118 C455,100 495,89 545,88 L605,89 C645,90 680,98 720,114"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── Roof ── */}
      <path
        d="M385,162 L440,118 C465,102 510,90 560,88 L630,90 C680,92 720,104 750,124"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />

      {/* ── Windows ── */}
      {/* Windshield */}
      <path
        d="M385,162 C400,145 430,120 470,108 L560,88 L440,118 C415,130 395,148 383,162 Z"
        fill="url(#glassGrad)"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.2"
      />
      {/* Windshield inner reflection streaks */}
      <path d="M415,155 C430,135 455,116 478,108" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeLinecap="round" />
      <path d="M435,160 C452,140 475,120 500,110" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Side window (main door) */}
      <path
        d="M265,206 C300,185 345,168 385,162 L440,118 L560,88 L630,90 C660,91 690,96 710,106 L750,124 L740,148 C720,138 695,128 665,126 L590,124 C548,122 510,122 480,126 L420,138 C395,148 370,162 350,180 L320,200 Z"
        fill="url(#glassGrad)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />
      {/* Window highlights */}
      <path d="M300,192 C330,172 365,158 400,152" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M480,130 C520,124 560,122 605,124 L650,128" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Quarter window rear */}
      <path
        d="M725,132 C745,142 760,155 770,170 L760,176 C748,162 730,150 712,140 Z"
        fill="url(#glassGrad)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />

      {/* B-pillar */}
      <line x1="488" y1="127" x2="470" y2="210" stroke="rgba(30,30,34,0.9)" strokeWidth="7" />
      <line x1="488" y1="127" x2="470" y2="210" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

      {/* ── Body character lines ── */}
      {/* Main shoulder line — brand red */}
      <path
        d="M148,255 C185,248 230,240 278,234 L480,225 L680,228 C730,232 775,242 820,258"
        stroke="#E11D2A"
        strokeWidth="1.8"
        fill="none"
        filter="url(#glow)"
      />
      {/* Upper belt line */}
      <path
        d="M148,235 C190,228 240,220 295,214 L490,205 L680,208 C725,211 768,220 810,234"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1"
        fill="none"
      />
      {/* Lower sill line */}
      <path
        d="M148,280 C200,276 250,273 310,272 L650,272 C715,273 770,276 830,280"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="1"
        fill="none"
      />

      {/* ── Front fascia & bumper ── */}
      <path
        d="M95,288 L118,268 C125,256 135,248 148,242 L158,230 L148,255 L130,278 L110,{groundY} Z"
        fill="#0e0e11"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
      {/* Front grille opening */}
      <path
        d="M100,270 C108,260 118,252 130,248 L148,242 L140,258 C128,264 115,272 105,282 Z"
        fill="#0a0a0c"
        stroke="rgba(225,29,42,0.3)"
        strokeWidth="1"
      />
      {/* Grille mesh hint */}
      {[0,1,2].map(i => (
        <line key={i}
          x1={105 + i * 10} y1={268 - i * 5}
          x2={105 + i * 10} y2={282 - i * 4}
          stroke="rgba(225,29,42,0.2)" strokeWidth="1" />
      ))}

      {/* ── Front headlight assembly ── */}
      <path
        d="M118,248 L148,228 L155,235 L130,258 Z"
        fill="#0e0e12"
        stroke="#E11D2A"
        strokeWidth="1.5"
        filter="url(#glow)"
      />
      {/* DRL strip */}
      <path d="M120,248 L148,230" stroke="#E11D2A" strokeWidth="3" strokeLinecap="round" filter="url(#glow)" />
      <path d="M125,253 L150,236" stroke="#E11D2A" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      {/* Headlight lens */}
      <path
        d="M120,248 L148,230 L153,235 L128,255 Z"
        fill="url(#headlightGrad)"
        opacity="0.6"
      />
      {/* Light beam */}
      <path d="M100,252 L60,248 M98,258 L52,258 M100,264 L58,268"
        stroke="#E11D2A" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" />

      {/* ── Rear fascia ── */}
      <path
        d="M888,288 L875,255 L870,242 L878,260 L895,288 L880,{groundY} Z"
        fill="#0e0e11"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
      />
      {/* Rear diffuser */}
      <path
        d="M855,298 L898,298 L895,{groundY} L845,{groundY} Z"
        fill="#090909"
        stroke="rgba(225,29,42,0.2)"
        strokeWidth="1"
      />
      {[0,1,2,3].map(i => (
        <line key={i}
          x1={855 + i * 12} y1={300}
          x2={855 + i * 12} y2={groundY - 1}
          stroke="rgba(225,29,42,0.15)" strokeWidth="1" />
      ))}

      {/* ── Rear LED taillight ── */}
      <path
        d="M855,200 L878,210 L880,245 L858,240 Z"
        fill="#0e0e12"
        stroke="#E11D2A"
        strokeWidth="1"
      />
      {/* LED strip */}
      <path d="M858,242 L880,248" stroke="#E11D2A" strokeWidth="5" strokeLinecap="round" filter="url(#softGlow)" opacity="0.9" />
      <path d="M857,232 L878,238" stroke="#E11D2A" strokeWidth="2.5" strokeLinecap="round" filter="url(#glow)" opacity="0.7" />
      <path d="M858,222 L876,227" stroke="#E11D2A" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      {/* Taillight inner glow */}
      <path
        d="M858,240 L880,246 L880,255 L857,248 Z"
        fill="rgba(225,29,42,0.15)"
      />

      {/* ── Side mirror ── */}
      <path
        d="M268,210 L282,206 L285,218 L270,222 Z"
        fill="#1e1e22"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
      />

      {/* ── Door handle (subtle) ── */}
      <rect x="560" y="224" width="28" height="5" rx="2.5"
        fill="#1a1a1e" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />

      {/* ── Exhaust tips ── */}
      <ellipse cx="840" cy={groundY - 4} rx="9" ry="5" fill="#111" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <ellipse cx="858" cy={groundY - 4} rx="9" ry="5" fill="#111" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <ellipse cx="840" cy={groundY - 4} rx="5" ry="3" fill="#1a0a0a" />
      <ellipse cx="858" cy={groundY - 4} rx="5" ry="3" fill="#1a0a0a" />

      {/* ── Front wheel arch ── */}
      <path
        d={`M${wx1 - wr - 12},${wy + 14} C${wx1 - wr - 8},${wy - 10} ${wx1 - wr + 20},${wy - wr - 20} ${wx1},${wy - wr - 5} C${wx1 + wr - 10},${wy - wr - 20} ${wx1 + wr + 5},${wy - 5} ${wx1 + wr + 10},${wy + 14}`}
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"
      />
      {/* ── Rear wheel arch ── */}
      <path
        d={`M${wx2 - wr - 10},${wy + 14} C${wx2 - wr - 5},${wy - 5} ${wx2 - wr + 10},${wy - wr - 20} ${wx2},${wy - wr - 5} C${wx2 + wr - 10},${wy - wr - 20} ${wx2 + wr + 5},${wy - 10} ${wx2 + wr + 8},${wy + 14}`}
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"
      />

      {/* ── Wheels ── */}
      <Wheel cx={wx1} cy={wy} r={wr} />
      <Wheel cx={wx2} cy={wy} r={wr} />

      {/* Wheel arch shadow (over wheel top) */}
      <ellipse cx={wx1} cy={wy - wr + 10} rx={wr + 4} ry="16" fill="rgba(0,0,0,0.45)" />
      <ellipse cx={wx2} cy={wy - wr + 10} rx={wr + 4} ry="16" fill="rgba(0,0,0,0.45)" />

      {/* ── Brand line accent behind car ── */}
      <line x1="50" y1={groundY + 2} x2={W - 30} y2={groundY + 2}
        stroke="#E11D2A" strokeWidth="0.5" strokeOpacity="0.3" />

    </svg>
  );
}

/* ─── FLOATING PRODUCT BADGE ─────────────────────────────────────────────── */
function FloatingBadge({ label, price, delay, x, y }: { label: string; price: string; delay: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute hidden lg:flex items-center gap-2 bg-panel/90 backdrop-blur-md border border-line/60 rounded-xl px-3 py-2 shadow-panel"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
      transition={{ delay, duration: 3, y: { repeat: Infinity, repeatType: "loop", duration: 4 + delay } }}
    >
      <div className="w-2 h-2 rounded-full bg-brand" />
      <div>
        <p className="text-[9px] font-mono text-muted uppercase tracking-wider leading-none">{label}</p>
        <p className="text-[11px] font-mono text-ink font-semibold leading-none mt-0.5">{price}</p>
      </div>
    </motion.div>
  );
}


/* ─── SECTION HEADER ──────────────────────────────────────────────────────── */
function SectionHeader({ tag, title, subtitle }: { tag: string; title: string; subtitle?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="flex flex-col gap-2 mb-10"
    >
      <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-brand">{tag}</span>
      <h2 className="font-mono font-bold text-3xl sm:text-5xl uppercase tracking-tight text-ink leading-none whitespace-pre-line">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-muted font-mono mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
}

/* ─── MAIN PAGE ───────────────────────────────────────────────────────────── */
export function Landing() {
  const { t, lang } = useLang();
  const { data: featuredProducts } = useProducts({ featured: true, limit: 8 });
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const carY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // Deterministic particles
  const particles = useMemo(() =>
    Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      x: ((i * 37) % 93) + 2,
      y: ((i * 53) % 88) + 4,
      size: (i % 3) + 1,
      duration: 4 + (i % 4),
      delay: (i * 0.35) % 3,
    })), []);

  const stats = [
    { value: 500, suffix: "+", label_fr: "Produits", label_ar: "منتج" },
    { value: 58, suffix: "", label_fr: "Wilayas", label_ar: "ولاية" },
    { value: 24, suffix: "H", label_fr: "Livraison", label_ar: "توصيل" },
    { value: 100, suffix: "%", label_fr: "Satisfaits", label_ar: "رضا" },
  ];

  const howItWorks = [
    {
      icon: <IconSearch />,
      step: "01",
      title_fr: "Choisissez",
      title_ar: "اختر",
      desc_fr: "Parcourez notre catalogue de +500 accessoires auto et trouvez celui qui convient à votre véhicule.",
      desc_ar: "تصفح كتالوجنا من أكثر من 500 إكسسوار وجد ما يناسب سيارتك.",
    },
    {
      icon: <IconCart />,
      step: "02",
      title_fr: "Commandez",
      title_ar: "اطلب",
      desc_fr: "Ajoutez au panier, renseignez votre adresse et confirmez. Aucun paiement en ligne requis.",
      desc_ar: "أضف إلى السلة، أدخل عنوانك وأكد الطلب. لا يلزم دفع إلكتروني.",
    },
    {
      icon: <IconBox />,
      step: "03",
      title_fr: "Recevez",
      title_ar: "استلم",
      desc_fr: "Livraison dans les 24-48H partout en Algérie. Payez uniquement à la réception.",
      desc_ar: "توصيل خلال 24-48 ساعة في كل أنحاء الجزائر. ادفع عند الاستلام فقط.",
    },
  ];

  const features = [
    {
      icon: <IconTruck />,
      title_fr: "Livraison 58 Wilayas",
      title_ar: "توصيل 58 ولاية",
      desc_fr: "Réseau logistique couvrant toutes les wilayas d'Algérie. Expédition sous 24H.",
      desc_ar: "شبكة لوجستية تغطي جميع ولايات الجزائر. شحن خلال 24 ساعة.",
    },
    {
      icon: <IconShield />,
      title_fr: "Qualité Garantie",
      title_ar: "جودة مضمونة",
      desc_fr: "Chaque produit est sélectionné et testé pour garantir durabilité et performance.",
      desc_ar: "كل منتج يُختار ويُختبر لضمان المتانة والأداء العالي.",
    },
    {
      icon: <IconZap />,
      title_fr: "Paiement à la Livraison",
      title_ar: "الدفع عند الاستلام",
      desc_fr: "Zéro risque — vous ne payez qu'après avoir reçu et vérifié votre commande.",
      desc_ar: "صفر مخاطرة — تدفع فقط بعد استلام طلبك والتحقق منه.",
    },
    {
      icon: <IconStar />,
      title_fr: "Accessoires Premium",
      title_ar: "إكسسوارات مميزة",
      desc_fr: "Références haut de gamme: intérieur, éclairage, électronique, audio et bien plus.",
      desc_ar: "مراجع راقية: داخلي، إضاءة، إلكترونيات، صوتيات والمزيد.",
    },
    {
      icon: <IconPhone />,
      title_fr: "Support Client 7j/7",
      title_ar: "دعم العملاء 7 أيام",
      desc_fr: "Notre équipe répond à toutes vos questions de 8H à 22H, 7 jours sur 7.",
      desc_ar: "فريقنا يرد على جميع استفساراتك من 8 صباحاً إلى 10 مساءً، 7 أيام في الأسبوع.",
    },
    {
      icon: <IconBox />,
      title_fr: "Stock Permanent",
      title_ar: "مخزون دائم",
      desc_fr: "Plus de 500 références en stock permanent. Réapprovisionnement quotidien.",
      desc_ar: "أكثر من 500 مرجع في المخزون الدائم. إعادة تموين يومي.",
    },
  ];

  const testimonials = [
    {
      name: "Karim B.",
      location: "Alger",
      rating: 5,
      text_fr: "Tapis de sol excellent, parfaitement adaptés à ma Clio 4. Livraison en 2 jours à Alger. Je recommande vivement Auto Style !",
      text_ar: "سجاد رائع يناسب سيارتي تماماً. التوصيل خلال يومين. أنصح بـ Auto Style بشدة!",
    },
    {
      name: "Fatima Z.",
      location: "Oran",
      rating: 5,
      text_fr: "Support téléphone magnétique de très bonne qualité. Prix abordable et emballage soigné. Commande confirmée très rapidement.",
      text_ar: "حامل الهاتف المغناطيسي بجودة ممتازة. سعر معقول وتغليف أنيق. الطلب تأكد بسرعة.",
    },
    {
      name: "Mehdi L.",
      location: "Constantine",
      rating: 5,
      text_fr: "Ma dashcam 4K est arrivée en parfait état. L'image de nuit est bluffante. Paiement à la livraison — aucun risque !",
      text_ar: "كاميرا الداش 4K وصلت بحالة ممتازة. الصورة الليلية مذهلة. الدفع عند الاستلام — بلا مخاطرة!",
    },
  ];

  const categories = [
    { name_fr: "Intérieur", name_ar: "داخلي", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80", span: "col-span-2 row-span-2" },
    { name_fr: "Électronique", name_ar: "إلكترونيات", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80", span: "" },
    { name_fr: "Audio", name_ar: "صوتيات", img: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&q=80", span: "" },
    { name_fr: "Éclairage", name_ar: "إضاءة", img: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80", span: "" },
    { name_fr: "Extérieur", name_ar: "خارجي", img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&q=80", span: "" },
  ];

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════ HERO */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden pt-16"
      >
        {/* ─ Background effects ─ */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
          {/* Perspective grid */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(225,29,42,1) 1px, transparent 1px), linear-gradient(90deg, rgba(225,29,42,1) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              transform: "perspective(600px) rotateX(40deg) scaleY(1.5)",
              transformOrigin: "center 80%",
            }}
          />
          {/* Ambient glow orbs */}
          <div className="absolute top-[-10%] right-[5%] w-[700px] h-[700px] rounded-full bg-brand/10 blur-[150px]" />
          <div className="absolute bottom-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-brand/8 blur-[120px]" />
          <div className="absolute top-[30%] left-[30%] w-[300px] h-[300px] rounded-full bg-brand/5 blur-[80px]" />
        </motion.div>

        {/* ─ Animated particles ─ */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-brand"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
              animate={{ y: [0, -24, 0], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        {/* ─ Speed lines on left ─ */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block">
          {[0, 14, 28, 40, 52, 64].map((offset, i) => (
            <motion.div
              key={i}
              className="h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent mb-3"
              style={{ width: `${60 + offset}px`, marginLeft: `${20 - i * 4}px` }}
              animate={{ opacity: [0.4, 0.8, 0.4], scaleX: [0.8, 1, 0.8] }}
              transition={{ duration: 2 + i * 0.3, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </div>

        {/* ─ Content grid ─ */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 items-center py-16">

          {/* LEFT — text */}
          <motion.div style={{ y: textY }} className="flex flex-col gap-6">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="h-px w-8 bg-brand" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-mono text-muted">
                {lang === "ar" ? "متجر رقم 1 في الجزائر" : "Algeria's #1 Auto Accessories"}
              </span>
            </motion.div>

            {/* Headline */}
            <div className="flex flex-col gap-0 overflow-hidden">
              {[
                { text: lang === "ar" ? "جهِّز" : "ÉQUIPEZ", style: "text-ink", size: "text-[clamp(2.2rem,5vw,4rem)]" },
                { text: lang === "ar" ? "سيارتك" : "VOTRE", style: "text-ink", size: "text-[clamp(2.8rem,6.5vw,5.5rem)]" },
                { text: lang === "ar" ? "الآن" : "VOITURE", style: "text-brand", size: "text-[clamp(2.8rem,6.5vw,5.5rem)]" },
              ].map(({ text, style, size }, i) => (
                <motion.span
                  key={text}
                  className={cn("font-mono font-bold uppercase leading-[0.95] tracking-tight block", style, size, lang === "ar" && "font-ar")}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease: [0.23, 1, 0.32, 1] }}
                >
                  {text}
                </motion.span>
              ))}
            </div>

            {/* Description */}
            <motion.p
              className={cn("text-sm text-muted font-mono max-w-md leading-relaxed", lang === "ar" && "font-ar text-base")}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              {lang === "ar"
                ? "إكسسوارات السيارات الأفضل في الجزائر — إضاءة، صوتيات، حماية، وأكثر. توصيل سريع لـ58 ولاية مع الدفع عند الاستلام."
                : "Accessoires automobiles premium — éclairage, audio, protection intérieure et plus. Livraison rapide dans les 58 wilayas. Paiement à la livraison."}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <Link to="/shop">
                <motion.button
                  className="group relative flex items-center gap-2.5 bg-brand hover:bg-brand-light text-ink font-mono text-xs uppercase tracking-widest px-7 py-4 rounded-lg transition-all duration-200 overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">{lang === "ar" ? "تسوق الآن" : "Explorer la boutique"}</span>
                  <ArrowRight size={13} className="relative z-10 transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              className="flex items-center gap-3 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
            >
              {[
                {
                  icon: (
                    <svg viewBox="0 0 32 32" className="w-7 h-7 text-yellow-400" fill="currentColor">
                      <path d="M16 2l3.6 7.4 8.1 1.2-5.9 5.7 1.4 8.1L16 20.8l-7.2 3.6 1.4-8.1L4.3 10.6l8.1-1.2L16 2z"/>
                    </svg>
                  ),
                  label: lang === "ar" ? "4.9 تقييم" : "4.9 Étoiles",
                  sub: lang === "ar" ? "تقييم العملاء" : "Avis clients",
                  accent: "text-yellow-400",
                },
                {
                  icon: (
                    <svg viewBox="0 0 32 32" className="w-7 h-7 text-brand" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="16" cy="16" r="13"/>
                      <path d="M10 16.5l4 4 8-8"/>
                    </svg>
                  ),
                  label: lang === "ar" ? "+1 200 عميل" : "+1 200 Clients",
                  sub: lang === "ar" ? "عملاء راضون" : "Satisfaits",
                  accent: "text-brand",
                },
                {
                  icon: (
                    <svg viewBox="0 0 32 32" className="w-7 h-7 text-ink/60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="6" y="14" width="20" height="14" rx="3"/>
                      <path d="M10 14v-3a6 6 0 0 1 12 0v3"/>
                      <circle cx="16" cy="21" r="2" fill="currentColor" stroke="none"/>
                    </svg>
                  ),
                  label: lang === "ar" ? "دفع آمن" : "100% Sécurisé",
                  sub: lang === "ar" ? "الدفع عند الاستلام" : "Paiement livraison",
                  accent: "text-ink/60",
                },
              ].map(({ icon, label, sub, accent }) => (
                <div key={label} className="flex items-center gap-2.5 bg-panel/50 border border-line/40 rounded-xl px-3 py-2">
                  <span className={accent}>{icon}</span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold font-mono text-ink uppercase tracking-wide leading-none">{label}</span>
                    <span className="text-[9px] font-mono text-muted/60 mt-0.5 leading-none">{sub}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT — car visual */}
          <motion.div
            style={{ y: carY }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="relative"
          >
            {/* Glow under car */}
            <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[70%] h-24 bg-brand/20 blur-[60px] rounded-full" />

            {/* Car SVG */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full"
            >
              <CarSVG />
            </motion.div>

            {/* Floating product badges */}
            <FloatingBadge label="Tapis Premium 3D" price="3 500 DA" delay={0.8} x="2%" y="15%" />
            <FloatingBadge label="Dashcam 4K Ultra" price="7 500 DA" delay={1.2} x="70%" y="5%" />
            <FloatingBadge label="Housse Sport" price="1 200 DA" delay={1.6} x="60%" y="75%" />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="w-5 h-8 rounded-full border border-line/50 flex items-start justify-center p-1">
            <motion.div
              className="w-1 h-2 rounded-full bg-brand"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════ MARQUEE */}
      <Marquee text={t("marquee_text")} />

      {/* ══════════════════════════════════════════════════════ STATS */}
      <section className="border-b border-line/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-2 sm:grid-cols-4 gap-px bg-line/20">
          {stats.map(({ value, suffix, label_fr, label_ar }, i) => (
            <motion.div
              key={label_fr}
              className="bg-bg flex flex-col items-center justify-center gap-1 py-8 px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="font-mono font-black text-4xl sm:text-5xl text-brand leading-none">
                <AnimatedCounter target={value} suffix={suffix} />
              </span>
              <span className={cn("text-[10px] font-mono text-muted uppercase tracking-widest", lang === "ar" && "font-ar text-xs")}>
                {lang === "ar" ? label_ar : label_fr}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <SectionHeader
            tag={lang === "ar" ? "اختيار الأسبوع" : "Sélection de la semaine"}
            title={lang === "ar" ? "منتجات مميزة" : "PRODUITS\nPHARES"}
          />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden sm:block mb-10"
          >
            <Link to="/shop" className="flex items-center gap-2 text-[10px] font-mono text-muted hover:text-brand transition-colors uppercase tracking-widest group">
              {lang === "ar" ? "عرض الكل" : "Tout voir"}
              <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(featuredProducts ?? []).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="flex justify-center mt-8 sm:hidden">
          <Link to="/shop"><Button variant="outline">{lang === "ar" ? "عرض الكل" : "Voir tous les produits"} <ArrowRight size={12} /></Button></Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ HOW IT WORKS */}
      <section className="border-t border-line/30 bg-panel/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <SectionHeader
            tag={lang === "ar" ? "كيف يعمل" : "Comment ça marche"}
            title={lang === "ar" ? "سهل جداً" : "SIMPLE\nET RAPIDE"}
            subtitle={lang === "ar" ? "ثلاث خطوات بسيطة للحصول على ما تحتاجه" : "3 étapes simples pour recevoir vos accessoires auto chez vous."}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[calc(33%+24px)] right-[calc(33%+24px)] h-px bg-gradient-to-r from-brand/30 via-brand/60 to-brand/30" />

            {howItWorks.map(({ icon, step, title_fr, title_ar, desc_fr, desc_ar }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              >
                <BentoPanel className="p-8 flex flex-col gap-5 group hover:border-brand/40 transition-colors duration-300 h-full">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-brand/10 group-hover:bg-brand/20 transition-colors flex items-center justify-center text-brand flex-shrink-0 p-3.5">
                      {icon}
                    </div>
                    <span className="font-mono text-5xl font-black text-line group-hover:text-brand/20 transition-colors">{step}</span>
                  </div>
                  <div>
                    <h3 className={cn("font-mono text-xl font-bold uppercase tracking-tight text-ink mb-2", lang === "ar" && "font-ar text-2xl normal-case tracking-normal")}>
                      {lang === "ar" ? title_ar : title_fr}
                    </h3>
                    <p className={cn("text-xs text-muted font-mono leading-relaxed", lang === "ar" && "font-ar text-sm")}>
                      {lang === "ar" ? desc_ar : desc_fr}
                    </p>
                  </div>
                </BentoPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <SectionHeader
          tag={lang === "ar" ? "تصفح حسب الفئة" : "Parcourir par catégorie"}
          title={lang === "ar" ? "الفئات" : "NOS\nCATÉGORIES"}
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 grid-rows-2 gap-3 h-[420px] sm:h-[500px]">
          {categories.map(({ name_fr, name_ar, img, span }, i) => (
            <motion.div
              key={name_fr}
              className={cn("relative group overflow-hidden rounded-bento cursor-pointer", span || "col-span-1 row-span-1")}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ scale: 0.98 }}
            >
              <Link to="/shop" className="block h-full">
                <div className="absolute inset-0 bg-panel" />
                <img
                  src={img}
                  alt={name_fr}
                  className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between">
                  <p className={cn("font-mono text-sm uppercase tracking-wider text-ink group-hover:text-brand transition-colors font-bold", lang === "ar" && "font-ar text-base normal-case tracking-normal")}>
                    {lang === "ar" ? name_ar : name_fr}
                  </p>
                  <ChevronRight size={14} className="text-muted group-hover:text-brand transition-colors opacity-0 group-hover:opacity-100" />
                </div>
                {/* Hover glow border */}
                <div className="absolute inset-0 rounded-bento border border-brand/0 group-hover:border-brand/40 transition-colors duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ FEATURES */}
      <section className="border-t border-line/30 bg-panel/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <SectionHeader
            tag={lang === "ar" ? "لماذا Auto Style" : "Pourquoi Auto Style"}
            title={lang === "ar" ? "مميزاتنا" : "POURQUOI\nNOUS CHOISIR"}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon, title_fr, title_ar, desc_fr, desc_ar }, i) => (
              <motion.div
                key={title_fr}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <BentoPanel className="p-6 flex gap-4 group hover:border-brand/30 transition-colors duration-300 h-full">
                  <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-brand/10 group-hover:bg-brand/20 transition-colors text-brand p-3">
                    {icon}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className={cn("font-mono text-xs font-bold uppercase tracking-wider text-ink", lang === "ar" && "font-ar text-sm normal-case tracking-normal")}>
                      {lang === "ar" ? title_ar : title_fr}
                    </h3>
                    <p className={cn("text-[11px] text-muted font-mono leading-relaxed", lang === "ar" && "font-ar text-xs")}>
                      {lang === "ar" ? desc_ar : desc_fr}
                    </p>
                  </div>
                </BentoPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <SectionHeader
          tag={lang === "ar" ? "آراء عملائنا" : "Avis clients"}
          title={lang === "ar" ? "يثقون بنا" : "ILS NOUS\nFONT CONFIANCE"}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {testimonials.map(({ name, location, rating, text_fr, text_ar }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <BentoPanel className="p-6 flex flex-col gap-4 h-full">
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: rating }).map((_, j) => (
                    <Star key={j} size={12} className="text-brand fill-brand" />
                  ))}
                </div>
                {/* Text */}
                <p className={cn("text-xs font-mono text-ink/80 leading-relaxed flex-1 italic", lang === "ar" && "font-ar text-sm not-italic")}>
                  "{lang === "ar" ? text_ar : text_fr}"
                </p>
                {/* Author */}
                <div className="border-t border-line/40 pt-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center">
                    <span className="text-brand font-mono text-xs font-bold">{name[0]}</span>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-ink font-semibold">{name}</p>
                    <p className="text-[10px] font-mono text-muted">{location}</p>
                  </div>
                </div>
              </BentoPanel>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ FINAL CTA */}
      <section className="relative overflow-hidden border-t border-line/30">
        {/* Background */}
        <div className="absolute inset-0 bg-brand/5" />
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(225,29,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(225,29,42,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand/10 blur-[100px] rounded-full" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center flex flex-col items-center gap-8">
          <img src={logo} alt="Auto Style" className="h-20 w-auto" style={{ filter: "drop-shadow(0 0 20px rgba(225,29,42,0.4))" }} />
          <h2 className={cn("font-mono font-black text-4xl sm:text-6xl uppercase tracking-tight leading-none", lang === "ar" && "font-ar text-4xl normal-case tracking-normal")}>
            {lang === "ar"
              ? <><span className="text-ink">سيارتك</span><br /><span className="text-brand">تستحق الأفضل</span></>
              : <><span className="text-ink">VOTRE VOITURE</span><br /><span className="text-brand">MÉRITE LE MEILLEUR</span></>
            }
          </h2>
          <p className={cn("text-sm text-muted font-mono max-w-md", lang === "ar" && "font-ar text-base")}>
            {lang === "ar"
              ? "أكثر من 500 منتج متاح الآن. الدفع عند الاستلام في جميع ولايات الجزائر."
              : "Plus de 500 produits disponibles maintenant. Paiement à la livraison dans toutes les wilayas d'Algérie."}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/shop">
              <Button size="lg" className="group">
                {lang === "ar" ? "ابدأ التسوق" : "Commencer vos achats"}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
