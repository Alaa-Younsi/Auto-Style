import { useRef, useMemo, useState, useEffect } from "react";
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
      <circle cx={cx} cy={cy} r={rimR} fill="#1a1a20" />
      {/* Inner dish */}
      <circle cx={cx} cy={cy} r={innerR} fill="#131316" />
      {/* 7 straight spokes */}
      {Array.from({ length: n }, (_, i) => {
        const a = (i * Math.PI * 2) / n - Math.PI / 2;
        return (
          <line key={i}
            x1={cx + Math.cos(a) * hubR * 1.4} y1={cy + Math.sin(a) * hubR * 1.4}
            x2={cx + Math.cos(a) * innerR * 0.92} y2={cy + Math.sin(a) * innerR * 0.92}
            stroke="#222228" strokeWidth={r * 0.13} strokeLinecap="round"
          />
        );
      })}
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

function CarSVG() {
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
    <svg viewBox={`0 0 ${W} ${H}`} fill="none" className="w-full h-full"
      style={{ filter: "drop-shadow(0 20px 52px rgba(225,29,42,0.36))" }}>
      <defs>
        <linearGradient id="bdG" x1="4%" y1="0%" x2="4%" y2="100%">
          <stop offset="0%" stopColor="#38383e" />
          <stop offset="22%" stopColor="#202026" />
          <stop offset="60%" stopColor="#131316" />
          <stop offset="100%" stopColor="#0c0c0e" />
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
          <stop offset="0%" stopColor="#060608" />
          <stop offset="100%" stopColor="#18181e" />
        </linearGradient>
        <filter id="g1" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="g2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse cx={W / 2} cy={gY + 5} rx="405" ry="14" fill="url(#shdG)" />
      <line x1="40" y1={gY} x2={W - 40} y2={gY} stroke="rgba(225,29,42,0.12)" strokeWidth="0.8" />

      {/* Arch interiors */}
      {[fwX, rwX].map(x => (
        <path key={x} fill="url(#arG)"
          d={`M ${x - aHW},${sY} C ${x - aHW},${aY + 20} ${x - 44},${aY} ${x},${aY} C ${x + 44},${aY} ${x + aHW},${aY + 20} ${x + aHW},${sY} Z`} />
      ))}

      {/* ── MAIN BODY ── */}
      <path d={bodyPath} fillRule="evenodd" fill="url(#bdG)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      <path d={bodyPath} fillRule="evenodd" fill="url(#shG)" />

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
      <rect x="616" y="126" width="8" height="5" rx="1" fill="#1c1c24" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

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
        fill="#1a1a22" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

      {/* ── DOOR HANDLE ── */}
      <rect x="536" y="228" width="32" height="5" rx="2.5"
        fill="#1a1a1e" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />

      {/* ── EXHAUST ── */}
      <ellipse cx={758} cy={gY - 7} rx="11" ry="6.5" fill="#0c0c10" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <ellipse cx={758} cy={gY - 7} rx="6.5" ry="4" fill="#180808" />
      <ellipse cx={744} cy={gY - 6} rx="9" ry="5.5" fill="#0c0c10" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <ellipse cx={744} cy={gY - 6} rx="5" ry="3" fill="#180808" />

      {/* ── WHEELS ── */}
      <Wheel cx={fwX} cy={fwY} r={fwR} />
      <Wheel cx={rwX} cy={rwY} r={rwR} />

      {/* Arch top shadows */}
      <ellipse cx={fwX} cy={fwY - fwR + 5} rx={fwR - 2} ry="10" fill="rgba(0,0,0,0.55)" />
      <ellipse cx={rwX} cy={rwY - rwR + 5} rx={rwR - 2} ry="10" fill="rgba(0,0,0,0.55)" />

      <line x1="42" y1={gY + 1} x2={W - 42} y2={gY + 1} stroke="#E11D2A" strokeWidth="0.6" strokeOpacity="0.18" />
    </svg>
  );
}

/* ─── FLOATING PRODUCT BADGE ─────────────────────────────────────────────── */
function FloatingBadge({ label, price, delay, x, y }: { label: string; price: string; delay: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute hidden lg:block"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.82, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.6 + delay * 0.4, repeat: Infinity, ease: "easeInOut", delay: delay + 0.7 }}
        className="flex items-center gap-3 bg-panel border border-line/40 rounded-2xl px-4 py-3.5 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)]"
      >
        <div className="w-0.5 h-9 rounded-full bg-brand flex-shrink-0" />
        <div>
          <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-muted leading-none mb-1.5">{label}</p>
          <p className="text-base font-mono font-bold text-ink leading-none">{price}</p>
        </div>
        <div className="flex-shrink-0 ms-1 relative w-2 h-2">
          <span className="absolute inset-0 rounded-full bg-brand animate-ping opacity-60" />
          <span className="relative block w-2 h-2 rounded-full bg-brand" />
        </div>
      </motion.div>
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

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  // Parallax disabled on mobile — main-thread scroll listeners cause jank
  const bgY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, 120]);
  const textY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, 60]);
  const carY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, -40]);

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
        className="relative min-h-screen flex items-center overflow-hidden pt-20"
      >
        {/* ─ Background effects ─ */}
        <motion.div
          style={{ y: bgY, willChange: isMobile ? "auto" : "transform" }}
          className="absolute inset-0 pointer-events-none"
        >
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
          {/* Ambient glow orbs — hidden on mobile (very expensive GPU composite layers) */}
          <div className="hidden md:block absolute top-[-10%] right-[5%] w-[700px] h-[700px] rounded-full bg-brand/10 blur-[150px]" />
          <div className="hidden md:block absolute bottom-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-brand/8 blur-[120px]" />
          <div className="hidden md:block absolute top-[30%] left-[30%] w-[300px] h-[300px] rounded-full bg-brand/5 blur-[80px]" />
        </motion.div>

        {/* ─ Animated particles — desktop only ─ */}
        <div className="hidden md:block absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-brand particle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                animationTimingFunction: "ease-in-out",
              }}
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
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 items-center pt-4 pb-12 lg:py-16">

          {/* LEFT — text */}
          <motion.div style={{ y: textY, willChange: isMobile ? "auto" : "transform" }} className="flex flex-col gap-6">
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
            style={{ y: carY, willChange: isMobile ? "auto" : "transform" }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="relative"
          >
            {/* Glow under car — hidden on mobile */}
            <div className="hidden md:block absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[70%] h-24 bg-brand/20 blur-[60px] rounded-full" />

            {/* Car SVG — float animation desktop only */}
            <motion.div
              animate={isMobile ? {} : { y: [0, -12, 0] }}
              transition={isMobile ? {} : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
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
