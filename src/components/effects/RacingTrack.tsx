import { useEffect, useRef, useCallback, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─── Circuit builder ────────────────────────────────────────────────────────
   Figure-8 layout (single closed path):
   left-top  → [top arc]       → right-top
   right-top → down right      → [S-cross centre]  → left continuing down
   left-down → [bottom arc]    → right-bottom
   right-bot → up right        → [S-cross centre]  → left continuing up
   left-up   → back to start   → Z

   The two S-curves cross each other at (w/2, h/2) forming a visible X.
────────────────────────────────────────────────────────────────────────────── */
function buildCircuit(w: number, h: number): string {
  // Rail centres — stick close to the edges so they live in page margins
  const lx   = Math.max(14, w * 0.022);
  const rx   = w - lx;
  const cx   = w / 2;
  const topY = 68;
  const botY = h - 64;
  const midY = h / 2;
  // Vertical half-extent of the crossing S-curve
  const gap  = Math.min(210, h * 0.085);

  return [
    `M ${lx},${topY}`,
    `Q ${lx},${topY - 46} ${cx},${topY - 46}`,
    `Q ${rx},${topY - 46} ${rx},${topY}`,
    `L ${rx},${midY - gap}`,
    `C ${rx},${midY} ${lx},${midY} ${lx},${midY + gap}`,
    `L ${lx},${botY}`,
    `Q ${lx},${botY + 46} ${cx},${botY + 46}`,
    `Q ${rx},${botY + 46} ${rx},${botY}`,
    `L ${rx},${midY + gap}`,
    `C ${rx},${midY} ${lx},${midY} ${lx},${midY - gap}`,
    `L ${lx},${topY}`,
    "Z",
  ].join(" ");
}

/* ─── Cars (6 cars, all different speeds & liveries) ───────────────────── */
const CARS = [
  { color: "#E11D2A", cockpit: "#ffffff", speed: 6.0, offset: 0.00 }, // Ferrari red   — fastest
  { color: "#00D2BE", cockpit: "#111111", speed: 5.4, offset: 0.13 }, // Mercedes teal
  { color: "#1E41FF", cockpit: "#ffffff", speed: 4.9, offset: 0.27 }, // Red Bull blue
  { color: "#FF8700", cockpit: "#111111", speed: 4.4, offset: 0.44 }, // McLaren orange
  { color: "#F0F0F6", cockpit: "#E11D2A", speed: 3.9, offset: 0.61 }, // White (custom)
  { color: "#FFB800", cockpit: "#111111", speed: 3.4, offset: 0.78 }, // Yellow        — slowest
] as const;

/* Top-down F1 car, pointing in the +x direction, centred at (0,0).
   Rendered in a ≈27 × 14 SVG-unit bounding box then scaled by the caller. */
function F1Car({ color, cockpit }: { color: string; cockpit: string }) {
  return (
    <g>
      {/* Rear wing */}
      <rect x={-13} y={-5.4} width={3.2} height={10.8} rx={0.9} fill={color} />
      {/* Body */}
      <path
        d="M -9,0 C -9,-3.9 -2,-5.1 3,-4.8 L 9.5,-3 L 13,0 L 9.5,3 L 3,4.8 C -2,5.1 -9,3.9 -9,0 Z"
        fill={color}
      />
      {/* Cockpit */}
      <ellipse cx={1} cy={0} rx={3.5} ry={2.7} fill={cockpit} opacity={0.92} />
      {/* Front wing */}
      <rect x={12} y={-5.8} width={3.2} height={11.6} rx={0.9} fill={color} />
      {/* Front wheels */}
      <rect x={2.8} y={-7}  width={6.5} height={2.9} rx={1.4} fill="#080810" />
      <rect x={2.8} y={4.1} width={6.5} height={2.9} rx={1.4} fill="#080810" />
      {/* Rear wheels */}
      <rect x={-8.5} y={-7}  width={6.5} height={2.9} rx={1.4} fill="#080810" />
      <rect x={-8.5} y={4.1} width={6.5} height={2.9} rx={1.4} fill="#080810" />
      {/* Exhaust heat glow */}
      <ellipse cx={-11.5} cy={0} rx={2.6} ry={1.1} fill="rgba(255,145,0,0.68)" />
    </g>
  );
}

/* ─── Component ─────────────────────────────────────────────────────────── */
interface Props { containerRef: React.RefObject<HTMLDivElement> }

export function PageRacingTrack({ containerRef }: Props) {
  const pathRef  = useRef<SVGPathElement | null>(null);
  // Initialise the ref array to the exact CARS length so indices always exist
  const carRefs  = useRef<(SVGGElement | null)[]>(CARS.map(() => null));
  const distRef  = useRef<number[]>([]);
  const scaleRef = useRef(1);          // responsive car scale (updated on resize)
  const rafRef   = useRef(0);

  const [circuit, setCircuit] = useState("");
  const [dims,    setDims]    = useState({ w: 390, h: 3000 });

  /* ── Measure container and rebuild path on resize ───────────────────── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = (w: number, h: number) => {
      setDims({ w, h });
      setCircuit(buildCircuit(w, h));
      // Car scale: proportional to screen width, clamped so cars are visible at all sizes
      scaleRef.current = Math.max(0.38, Math.min(1.15, w / 1440));
    };

    const obs = new ResizeObserver(([entry]) => {
      update(entry.contentRect.width, entry.contentRect.height);
    });
    obs.observe(el);

    // Kick off immediately (ResizeObserver fires async)
    update(el.offsetWidth, el.offsetHeight);

    return () => obs.disconnect();
  }, [containerRef]);

  /* ── rAF racing loop — zero React re-renders per frame ─────────────── */
  useEffect(() => {
    if (!circuit || !pathRef.current) return;
    const total = pathRef.current.getTotalLength();
    if (total <= 0) return;

    // Spread cars evenly across the circuit based on their offset %
    distRef.current = CARS.map(({ offset }) => offset * total);

    const tick = () => {
      const path = pathRef.current;
      if (!path) return;
      const s = scaleRef.current;

      CARS.forEach(({ speed }, i) => {
        const car = carRefs.current[i];
        if (!car) return;

        distRef.current[i] = (distRef.current[i] + speed) % total;
        const d   = distRef.current[i];
        const pt  = path.getPointAtLength(d);
        const pt2 = path.getPointAtLength((d + 12) % total);
        const angle = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * (180 / Math.PI);

        car.setAttribute(
          "transform",
          `translate(${pt.x},${pt.y}) rotate(${angle}) scale(${s})`
        );
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [circuit]);

  const setPathRef = useCallback((el: SVGPathElement | null) => {
    pathRef.current = el;
  }, []);

  /* ── Scroll-driven track reveal ─────────────────────────────────────── */
  const { scrollYProgress } = useScroll();
  const drawLength = useTransform(scrollYProgress, [0, 0.9], [0, 1]);

  if (!circuit) return null;

  // Track stroke width: responsive, thinner on mobile, wider on desktop
  const sw = Math.max(8, dims.w * 0.016);
  // S/F mark x position
  const sfX = Math.max(14, dims.w * 0.022) - sw / 2;

  return (
    <svg
      aria-hidden
      /* Visible on ALL screen sizes — fully responsive */
      className="absolute inset-0 pointer-events-none"
      width={dims.w}
      height={dims.h}
      viewBox={`0 0 ${dims.w} ${dims.h}`}
      style={{ zIndex: -1 }}
    >
      {/* Hidden reference path — used only for getPointAtLength() */}
      <path ref={setPathRef} d={circuit} fill="none" stroke="none" />

      {/* ── Always-present ghost (shows circuit shape even before scrolling) ── */}
      <path
        d={circuit}
        fill="none"
        stroke="rgba(255,255,255,0.02)"
        strokeWidth={sw + 4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── Scroll-revealed track layers (draw in as you scroll) ── */}

      {/* Kerb / outer border */}
      <motion.path
        d={circuit} fill="none"
        stroke="rgba(255,255,255,0.11)"
        strokeWidth={sw + 6}
        strokeLinecap="round" strokeLinejoin="round"
        style={{ pathLength: drawLength }}
      />
      {/* Tarmac surface */}
      <motion.path
        d={circuit} fill="none"
        stroke="#191920"
        strokeWidth={sw}
        strokeLinecap="round" strokeLinejoin="round"
        style={{ pathLength: drawLength }}
      />
      {/* Red kerb blush */}
      <motion.path
        d={circuit} fill="none"
        stroke="rgba(225,29,42,0.08)"
        strokeWidth={sw + 6}
        strokeLinecap="round" strokeLinejoin="round"
        style={{ pathLength: drawLength }}
      />
      {/* Inner refinement (slightly darker centre) */}
      <motion.path
        d={circuit} fill="none"
        stroke="#0f0f14"
        strokeWidth={Math.max(4, sw - 6)}
        strokeLinecap="round" strokeLinejoin="round"
        style={{ pathLength: drawLength }}
      />
      {/* Centre dashed white line */}
      <motion.path
        d={circuit} fill="none"
        stroke="rgba(255,255,255,0.065)"
        strokeWidth={1.2}
        strokeDasharray="20 28"
        strokeLinecap="round"
        style={{ pathLength: drawLength }}
      />

      {/* ── Start / Finish chequered mark ── */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <rect
            key={i}
            x={sfX} y={108 + i * 8}
            width={Math.max(4, sw / 2)}
            height={8}
            fill={i % 2 === 0 ? "rgba(255,255,255,0.45)" : "rgba(225,29,42,0.55)"}
          />
        ))}
      </motion.g>

      {/* ── F1 Cars — 6 cars, each with its own speed and livery ── */}
      {CARS.map(({ color, cockpit }, i) => (
        <g
          key={i}
          ref={(el) => { carRefs.current[i] = el; }}
        >
          <F1Car color={color} cockpit={cockpit} />
        </g>
      ))}
    </svg>
  );
}
