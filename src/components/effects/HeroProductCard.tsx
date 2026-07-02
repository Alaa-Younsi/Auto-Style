import { Link } from "react-router-dom";
import { motion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { LayoutGrid, Camera, Armchair, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import type { Category } from "@/types/db";
import { formatPrice } from "@/lib/format";

interface HeroCardDef {
  labelFr: string;
  labelAr: string;
  price: number;
  x: string;
  y: string;
  depth: number;
  delay: number;
  icon: ReactNode;
  categoryKeywords: string[];
  searchTerm: string;
}

const CARD_DEFS: HeroCardDef[] = [
  {
    labelFr: "Tapis Premium 3D",
    labelAr: "دواسة أرضية 3D",
    price: 3500,
    x: "2%", y: "15%", depth: 0.6, delay: 0.8,
    icon: <LayoutGrid size={15} />,
    categoryKeywords: ["tapis", "interieur", "intérieur", "interior", "mat"],
    searchTerm: "tapis",
  },
  {
    labelFr: "Dashcam 4K Ultra",
    labelAr: "كاميرا داشكام 4K",
    price: 7500,
    x: "70%", y: "5%", depth: 1, delay: 1.2,
    icon: <Camera size={15} />,
    categoryKeywords: ["dashcam", "camera", "caméra", "electronique", "électronique", "electronic"],
    searchTerm: "dashcam",
  },
  {
    labelFr: "Housse Sport",
    labelAr: "غطاء مقعد رياضي",
    price: 1200,
    x: "60%", y: "75%", depth: 1.4, delay: 1.6,
    icon: <Armchair size={15} />,
    categoryKeywords: ["housse", "siege", "siège", "seat", "protection"],
    searchTerm: "housse",
  },
];

function resolveHref(categories: Category[] | undefined, def: HeroCardDef): string {
  const match = categories?.find((c) =>
    def.categoryKeywords.some(
      (k) =>
        c.slug.toLowerCase().includes(k) ||
        c.name_fr.toLowerCase().includes(k) ||
        c.name_ar.includes(k)
    )
  );
  return match ? `/shop?category=${match.slug}` : `/shop?search=${encodeURIComponent(def.searchTerm)}`;
}

interface TiltCardProps {
  def: HeroCardDef;
  href: string;
  lang: string;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  reducedMotion: boolean;
}

function TiltCard({ def, href, lang, mx, my, reducedMotion }: TiltCardProps) {
  const sx = useSpring(mx, { stiffness: 120, damping: 18 });
  const sy = useSpring(my, { stiffness: 120, damping: 18 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-9 * def.depth, 9 * def.depth]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [7 * def.depth, -7 * def.depth]);
  const tx = useTransform(sx, [-0.5, 0.5], [-10 * def.depth, 10 * def.depth]);

  return (
    <motion.div
      className="absolute hidden lg:block"
      style={{ left: def.x, top: def.y }}
      initial={{ scale: 0.82, y: 10 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ delay: def.delay, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
    >
      <motion.div
        style={
          reducedMotion
            ? undefined
            : { rotateX, rotateY, x: tx, transformStyle: "preserve-3d" }
        }
        animate={reducedMotion ? undefined : { y: [0, -8, 0] }}
        transition={
          reducedMotion
            ? undefined
            : { duration: 3.6 + def.delay * 0.4, repeat: Infinity, ease: "easeInOut", delay: def.delay + 0.7 }
        }
      >
        <Link to={href} className="group/card block" style={{ transform: "translateZ(20px)" }}>
          <div
            className="relative flex items-center gap-3 bg-panel/55 backdrop-blur-md border border-line/50 rounded-2xl px-4 py-3.5 overflow-hidden transition-all duration-300 hover:scale-105 hover:border-brand/50 hover:shadow-glow-sm shadow-[0_8px_32px_-4px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)]"
          >
            <span aria-hidden className="fx-sweep" />
            {/* Corner bracket detail */}
            <span aria-hidden className="absolute top-1.5 start-1.5 w-2.5 h-2.5 border-t border-s border-brand/70 rounded-tl-sm pointer-events-none" />

            <div className="w-8 h-8 rounded-lg bg-brand/15 text-brand flex items-center justify-center flex-shrink-0">
              {def.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-muted leading-none mb-1.5 truncate">
                {lang === "ar" ? def.labelAr : def.labelFr}
              </p>
              <p className="text-base font-mono font-bold text-ink leading-none">{formatPrice(def.price)}</p>
            </div>
            <ChevronRight size={14} className="text-muted group-hover/card:text-brand transition-colors flex-shrink-0 rtl:rotate-180" />
            <div className="flex-shrink-0 ms-1 relative w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-brand animate-ping opacity-60" />
              <span className="relative block w-2 h-2 rounded-full bg-brand" />
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

function ChipCard({ def, href, lang }: { def: HeroCardDef; href: string; lang: string }) {
  return (
    <motion.div
      initial={{ y: 12 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: def.delay * 0.25, duration: 0.4 }}
    >
      <Link
        to={href}
        className="flex flex-col items-center gap-1.5 bg-panel border border-line/40 rounded-xl px-2 py-3 text-center hover:border-brand/40 transition-colors"
      >
        <div className="w-7 h-7 rounded-lg bg-brand/15 text-brand flex items-center justify-center">
          {def.icon}
        </div>
        <p className="text-[8px] font-mono uppercase tracking-wide text-muted leading-tight line-clamp-1">
          {lang === "ar" ? def.labelAr : def.labelFr}
        </p>
        <p className="text-[11px] font-mono font-bold text-ink leading-none">{formatPrice(def.price)}</p>
      </Link>
    </motion.div>
  );
}

interface HeroProductCardsProps {
  categories: Category[] | undefined;
  lang: string;
  reducedMotion: boolean;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}

export function HeroProductCards({ categories, lang, reducedMotion, mx, my }: HeroProductCardsProps) {
  return (
    <>
      {CARD_DEFS.map((def) => (
        <TiltCard
          key={def.labelFr}
          def={def}
          href={resolveHref(categories, def)}
          lang={lang}
          mx={mx}
          my={my}
          reducedMotion={reducedMotion}
        />
      ))}

      <div className="lg:hidden grid grid-cols-3 gap-2 mt-5">
        {CARD_DEFS.map((def) => (
          <ChipCard key={def.labelFr} def={def} href={resolveHref(categories, def)} lang={lang} />
        ))}
      </div>
    </>
  );
}
