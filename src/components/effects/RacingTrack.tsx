import { useEffect, useRef, useCallback, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─── Circuit builder ────────────────────────────────────────────────────────
   Desktop (compact=false): figure-8 layout (single closed path) — the two
   S-curves cross each other at (w/2, h/2) forming a visible X.

   Mobile (compact=true): the crossing S-curves are dropped entirely so the
   circuit never overlaps the content column. Instead each rail gets a single
   gentle inward chicane that stays within the page margins.
────────────────────────────────────────────────────────────────────────────── */
function buildCircuit(w: number, h: number, compact: boolean): string {
  const cx = w / 2;
  const topY = 68;
  const botY = h - 64;
  const midY = h / 2;

  if (compact) {
    const lx = 8;
    const rx = w - 8;
    const bulge = Math.min(rx - lx, w * 0.06);
    const gap = Math.min(180, h * 0.07);

    return [
      `M ${lx},${topY}`,
      `Q ${lx},${topY - 40} ${cx},${topY - 40}`,
      `Q ${rx},${topY - 40} ${rx},${topY}`,
      `L ${rx},${midY - gap}`,
      `C ${rx - bulge},${midY} ${rx - bulge},${midY} ${rx},${midY + gap}`,
      `L ${rx},${botY}`,
      `Q ${rx},${botY + 40} ${cx},${botY + 40}`,
      `Q ${lx},${botY + 40} ${lx},${botY}`,
      `L ${lx},${midY + gap}`,
      `C ${lx + bulge},${midY} ${lx + bulge},${midY} ${lx},${midY - gap}`,
      `L ${lx},${topY}`,
      "Z",
    ].join(" ");
  }

  // Rail centres — stick close to the edges so they live in page margins
  const lx = Math.max(14, w * 0.022);
  const rx = w - lx;
  // Vertical half-extent of the crossing S-curve
  const gap = Math.min(210, h * 0.085);

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
      <rect x={-13} y={-5.4} width={3.2} height={10.8} rx={0.9} fill={color} className="stroke-bg" strokeWidth={0.6} />
      {/* Body — thin bg-colored halo keeps it legible against a light track too */}
      <path
        d="M -9,0 C -9,-3.9 -2,-5.1 3,-4.8 L 9.5,-3 L 13,0 L 9.5,3 L 3,4.8 C -2,5.1 -9,3.9 -9,0 Z"
        fill={color}
        className="stroke-bg"
        strokeWidth={0.6}
      />
      {/* Cockpit */}
      <ellipse cx={1} cy={0} rx={3.5} ry={2.7} fill={cockpit} opacity={0.92} />
      {/* Front wing */}
      <rect x={12} y={-5.8} width={3.2} height={11.6} rx={0.9} fill={color} className="stroke-bg" strokeWidth={0.6} />
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
interface Props {
  containerRef: React.RefObject<HTMLDivElement>;
  reducedMotion?: boolean;
}

export function PageRacingTrack({ containerRef, reducedMotion = false }: Props) {
  const pathRef  = useRef<SVGPathElement | null>(null);
  // Initialise the ref array to the exact CARS length so indices always exist
  const carRefs   = useRef<(SVGGElement | null)[]>(CARS.map(() => null));
  const trailRefs = useRef<(SVGPathElement | null)[]>(CARS.map(() => null));
  const distRef   = useRef<number[]>([]);
  const scaleRef  = useRef(1);           // responsive car scale (updated on resize)
  const rafRef    = useRef(0);

  const [circuit, setCircuit] = useState("");
  const [dims,    setDims]    = useState({ w: 390, h: 3000 });

  const compact = dims.w < 768;
  const visibleCarCount = compact ? 3 : CARS.length;

  /* ── Measure container and rebuild path on resize ───────────────────── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = (w: number, h: number) => {
      setDims({ w, h });
      setCircuit(buildCircuit(w, h, w < 768));
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

  /* ── Racing loop — rAF with zero React re-renders per frame,
       or a single static placement when reduced motion is requested ─── */
  useEffect(() => {
    if (!circuit || !pathRef.current) return;
    const path = pathRef.current;
    const total = path.getTotalLength();
    if (total <= 0) return;

    // Spread cars evenly across the circuit based on their offset %
    distRef.current = CARS.map(({ offset }) => offset * total);

    const place = (i: number, d: number) => {
      const car = carRefs.current[i];
      if (!car) return;
      const pt  = path.getPointAtLength(d);
      const pt2 = path.getPointAtLength((d + 12) % total);
      const angle = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * (180 / Math.PI);
      car.setAttribute("transform", `translate(${pt.x},${pt.y}) rotate(${angle}) scale(${scaleRef.current})`);
    };

    if (reducedMotion) {
      CARS.forEach((_, i) => place(i, distRef.current[i]));
      return;
    }

    // Pause the whole rAF loop while the tab is backgrounded — no point
    // burning CPU animating cars nobody can see, and it frees up the main
    // thread exactly when other tabs/apps are competing for it.
    let paused = document.visibilityState === "hidden";

    const tick = () => {
      const s = scaleRef.current;

      CARS.forEach(({ speed }, i) => {
        if (i >= visibleCarCount) return;
        const car = carRefs.current[i];
        if (!car) return;

        distRef.current[i] = (distRef.current[i] + speed) % total;
        const d   = distRef.current[i];
        const pt  = path.getPointAtLength(d);
        const pt2 = path.getPointAtLength((d + 12) % total);
        const angle = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * (180 / Math.PI);

        car.setAttribute("transform", `translate(${pt.x},${pt.y}) rotate(${angle}) scale(${s})`);

        // Speed trail — a 48px dash that always ends exactly at the car
        const trail = trailRefs.current[i];
        if (trail) {
          const offset = ((total - d + 48) % total + total) % total;
          trail.style.strokeDashoffset = String(offset);
        }
      });

      // Only keep scheduling frames while the tab is actually visible
      if (!paused) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const handleVisibility = () => {
      paused = document.visibilityState === "hidden";
      if (!paused) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    if (!paused) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      cancelAnimationFrame(rafRef.current);
    };
  }, [circuit, reducedMotion, visibleCarCount]);

  const setPathRef = useCallback((el: SVGPathElement | null) => {
    pathRef.current = el;
  }, []);

  /* ── Scroll-driven track reveal (skipped entirely when reduced-motion) ── */
  const { scrollYProgress } = useScroll();
  const drawLength = useTransform(scrollYProgress, [0, 0.9], [0, 1]);
  const pathLengthStyle = reducedMotion ? 1 : drawLength;

  if (!circuit) return null;

  // Track stroke width: responsive, thinner on mobile, wider on desktop
  const sw = Math.max(8, dims.w * 0.016);
  const kerbOvershoot = compact ? 3 : 6;
  // S/F mark x position
  const sfX = Math.max(14, dims.w * 0.022) - sw / 2;
  const chW = Math.max(4, sw / 2);

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

      {/* Compact mode keeps every layer subdued so it never fights the text column */}
      <g opacity={compact ? 0.5 : 1}>
        {/* ── Always-present ghost (shows circuit shape even before scrolling) ── */}
        <path
          d={circuit}
          fill="none"
          className="stroke-ink/[0.02]"
          strokeWidth={sw + 4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ── Scroll-revealed track layers (draw in as you scroll) ── */}

        {/* Kerb / outer border */}
        <motion.path
          d={circuit} fill="none"
          className="stroke-ink/10"
          strokeWidth={sw + kerbOvershoot}
          strokeLinecap="round" strokeLinejoin="round"
          style={{ pathLength: pathLengthStyle }}
        />
        {/* Tarmac surface — theme-aware road color (dark asphalt / light concrete) */}
        <motion.path
          d={circuit} fill="none"
          className="stroke-track"
          strokeWidth={sw}
          strokeLinecap="round" strokeLinejoin="round"
          style={{ pathLength: pathLengthStyle }}
        />
        {/* Red kerb blush */}
        <motion.path
          d={circuit} fill="none"
          className="stroke-brand/[0.08]"
          strokeWidth={sw + kerbOvershoot}
          strokeLinecap="round" strokeLinejoin="round"
          style={{ pathLength: pathLengthStyle }}
        />
        {/* Inner refinement (slightly darker/lighter centre) */}
        <motion.path
          d={circuit} fill="none"
          className="stroke-track-2"
          strokeWidth={Math.max(4, sw - 6)}
          strokeLinecap="round" strokeLinejoin="round"
          style={{ pathLength: pathLengthStyle }}
        />
        {/* Centre dashed line */}
        <motion.path
          d={circuit} fill="none"
          className="stroke-ink/[0.09]"
          strokeWidth={1.2}
          strokeDasharray="20 28"
          strokeLinecap="round"
          style={{ pathLength: pathLengthStyle }}
        />

        {/* ── Alternating red/white kerb stripes — desktop signature detail ── */}
        {!compact && (
          <>
            <motion.path
              d={circuit} fill="none"
              className="stroke-brand/[0.35]"
              strokeWidth={Math.max(3, sw * 0.3)}
              strokeDasharray="14 14"
              strokeLinecap="butt"
              style={{ pathLength: pathLengthStyle }}
            />
            <motion.path
              d={circuit} fill="none"
              className="stroke-ink/[0.25]"
              strokeWidth={Math.max(3, sw * 0.3)}
              strokeDasharray="14 14"
              strokeDashoffset={14}
              strokeLinecap="butt"
              style={{ pathLength: pathLengthStyle }}
            />
          </>
        )}

        {/* ── Speed trails — one per visible car, desktop + motion only ── */}
        {!compact && !reducedMotion && CARS.slice(0, visibleCarCount).map(({ color }, i) => (
          <path
            key={`trail-${i}`}
            ref={(el) => { trailRefs.current[i] = el; }}
            d={circuit}
            fill="none"
            stroke={color}
            opacity={0.25}
            strokeWidth={Math.max(3, sw * 0.4)}
            strokeLinecap="round"
            strokeDasharray="48 100000"
          />
        ))}
      </g>

      {/* ── Start / Finish chequered mark ── */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={reducedMotion ? { opacity: 1 } : { opacity: [0.75, 1, 0.75] }}
        transition={reducedMotion ? { delay: 0.5 } : { duration: 2.6, repeat: Infinity, delay: 0.5 }}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <g key={i}>
            <rect
              x={sfX} y={108 + i * 8}
              width={chW}
              height={8}
              className={i % 2 === 0 ? "fill-ink/45" : "fill-brand/55"}
            />
            {!compact && (
              <rect
                x={sfX + chW} y={108 + i * 8}
                width={chW}
                height={8}
                className={i % 2 === 0 ? "fill-brand/55" : "fill-ink/45"}
              />
            )}
          </g>
        ))}
      </motion.g>

      {/* ── F1 Cars — up to 6 cars, each with its own speed and livery ── */}
      {CARS.slice(0, visibleCarCount).map(({ color, cockpit }, i) => (
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
