import { useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
} from "framer-motion";
import { ArrowRight, Star, ChevronRight, BadgeCheck, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/i18n/LanguageProvider";
import { useSeo } from "@/hooks/useSeo";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/Button";
import { BentoPanel } from "@/components/ui/BentoPanel";
import { Marquee } from "@/components/ui/Marquee";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ProductCard } from "@/components/product/ProductCard";
import logo from "@/assets/auto-style-logo.png";
import { cn } from "@/lib/utils";
import type { ClientReview } from "@/types/db";
import { PageRacingTrack } from "@/components/effects/RacingTrack";
import { HeroCar } from "@/components/effects/HeroCar";
import { HeroProductCards } from "@/components/effects/HeroProductCard";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaFlags";

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

/* ─── CAR EFFECT COMPONENTS ──────────────────────────────────────────────── */

/** Mini checkered flag SVG — used in section headers */
function CheckeredFlag({ className }: { className?: string }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12"
      aria-hidden
      className={cn("inline-block fill-current flex-shrink-0", className)}
    >
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 4 }, (_, c) =>
          (r + c) % 2 === 0 ? (
            <rect key={`${r}-${c}`} x={c * 3} y={r * 3} width={3} height={3} />
          ) : null
        )
      )}
    </svg>
  );
}

/** Animated half-circle speedometer gauge.
 *  cx=50, cy=52, r=40 → arc endpoints (10,52) and (90,52), top at (50,12).
 *  All tick marks stay at 25/50/75% — never outside the 100×56 viewBox.
 *  Needle animates via coordinate interpolation (no SVG transform-origin bugs).
 */
function SpeedometerArc({ progress, delay = 0 }: { progress: number; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const cx = 50, cy = 52, r = 40;
  const arc = `M ${cx - r},${cy} A ${r},${r} 0 0,0 ${cx + r},${cy}`;
  const circ = Math.PI * r;

  // Needle tip — computed directly so there are no SVG transform-origin issues
  const needleAngle = Math.PI * (1 - progress); // π (left) → 0 (right)
  const nx = cx + r * 0.72 * Math.cos(needleAngle);
  const ny = cy - r * 0.72 * Math.sin(needleAngle);

  return (
    <div ref={ref} className="flex justify-center mt-1" aria-hidden>
      <svg width={100} height={56} viewBox="0 0 100 56">
        {/* Track */}
        <path d={arc} fill="none" className="stroke-ink/[0.09]" strokeWidth={5} strokeLinecap="round" />
        {/* Fill arc */}
        <motion.path
          d={arc}
          fill="none"
          stroke="#E11D2A"
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={isInView ? { strokeDashoffset: circ * (1 - progress) } : {}}
          transition={{ duration: 1.8, ease: [0.23, 1, 0.32, 1], delay }}
        />
        {/* Tick marks only at 25%, 50%, 75% — guaranteed inside viewBox */}
        {[0.25, 0.5, 0.75].map((t) => {
          const a = Math.PI * (1 - t);
          const x1 = cx + r * Math.cos(a);
          const y1 = cy - r * Math.sin(a);
          const x2 = cx + (r - 10) * Math.cos(a);
          const y2 = cy - (r - 10) * Math.sin(a);
          return (
            <line key={t} x1={x1} y1={y1} x2={x2} y2={y2}
              className="stroke-ink/20" strokeWidth={1.5} strokeLinecap="round" />
          );
        })}
        {/* Needle — animates tip coordinates, no rotation transform needed */}
        <motion.line
          x1={cx} y1={cy}
          stroke="#E11D2A"
          strokeWidth={2.2}
          strokeLinecap="round"
          initial={{ x2: cx - r * 0.72, y2: cy }}
          animate={isInView ? { x2: nx, y2: ny } : { x2: cx - r * 0.72, y2: cy }}
          transition={{ duration: 1.8, ease: [0.23, 1, 0.32, 1], delay }}
        />
        {/* Hub */}
        <circle cx={cx} cy={cy} r={4.5} fill="#E11D2A" />
        <circle cx={cx} cy={cy} r={1.8} fill="rgb(var(--c-bg))" />
      </svg>
    </div>
  );
}

/* ─── SECTION HEADER ──────────────────────────────────────────────────────── */
function SectionHeader({ tag, title, subtitle }: { tag: string; title: string; subtitle?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ y: 30 }}
      animate={inView ? { y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="flex flex-col gap-2 mb-10"
    >
      <span className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.4em] text-brand">
        <CheckeredFlag />
        {tag}
        <CheckeredFlag />
      </span>
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

  useSeo({
    title: lang === "ar"
      ? "أوتو ستايل — إكسسوارات سيارات فاخرة في الجزائر"
      : "Auto Style — Accessoires Automobiles Premium en Algérie",
    description: lang === "ar"
      ? "أوتو ستايل — إكسسوارات سيارات فاخرة. توصيل لجميع ولايات الجزائر الـ69، الدفع عند الاستلام."
      : "Auto Style — Accessoires automobiles premium. Livraison dans les 69 wilayas d'Algérie, paiement à la livraison sous 24-48H.",
  });

  const { data: featuredProducts } = useProducts({ featured: true, limit: 4 });
  const { data: categoriesData } = useCategories();
  const heroRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const { data: activeProductCount = 0 } = useQuery({
    queryKey: ["active-product-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");
      return count ?? 0;
    },
  });

  const { data: dbReviews } = useQuery({
    queryKey: ["active-reviews"],
    queryFn: async () => {
      const { data } = await supabase
        .from("client_reviews")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
      return (data ?? []) as ClientReview[];
    },
  });

  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Mouse position over the hero car column, normalized to [-0.5, 0.5] — drives the 3D card tilt
  const heroMx = useMotionValue(0);
  const heroMy = useMotionValue(0);
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    heroMx.set((e.clientX - rect.left) / rect.width - 0.5);
    heroMy.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleHeroMouseLeave = () => {
    heroMx.set(0);
    heroMy.set(0);
  };

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
    { value: activeProductCount, suffix: "+", label_fr: "Produits", label_ar: "منتج", gauge: 0.75 },
    { value: 69, suffix: "", label_fr: "Wilayas", label_ar: "ولاية", gauge: 1.0 },
    { value: 24, suffix: "H", label_fr: "Livraison", label_ar: "توصيل", gauge: 0.88 },
    { value: 100, suffix: "%", label_fr: "Satisfaits", label_ar: "رضا", gauge: 1.0 },
  ];

  const howItWorks = [
    {
      icon: <IconSearch />,
      step: "01",
      title_fr: "Choisissez",
      title_ar: "اختر",
      desc_fr: `Parcourez notre catalogue de +${activeProductCount > 0 ? activeProductCount : "500"} accessoires auto et trouvez celui qui convient à votre véhicule.`,
      desc_ar: `تصفح كتالوجنا من أكثر من ${activeProductCount > 0 ? activeProductCount : "500"} إكسسوار وجد ما يناسب سيارتك.`,
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
      title_fr: "Livraison 69 Wilayas",
      title_ar: "توصيل 69 ولاية",
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
      desc_fr: `Plus de ${activeProductCount > 0 ? activeProductCount : "500"} références en stock permanent. Réapprovisionnement quotidien.`,
      desc_ar: `أكثر من ${activeProductCount > 0 ? activeProductCount : "500"} مرجع في المخزون الدائم. إعادة تموين يومي.`,
    },
  ];

  const testimonials = dbReviews ?? [];


  return (
    <div ref={pageRef} className="overflow-x-hidden relative isolate">

      {/* Full-page figure-8 racing track — rendered behind all sections */}
      <PageRacingTrack containerRef={pageRef} reducedMotion={prefersReducedMotion} />

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
              initial={{ x: -30 }}
              animate={{ x: 0 }}
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
                  initial={{ y: 60 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease: [0.23, 1, 0.32, 1] }}
                >
                  {text}
                </motion.span>
              ))}
            </div>

            {/* Description */}
            <motion.p
              className={cn("text-sm text-muted font-mono max-w-md leading-relaxed", lang === "ar" && "font-ar text-base")}
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.55 }}
            >
              {lang === "ar"
                ? "إكسسوارات السيارات الأفضل في الجزائر — إضاءة، صوتيات، حماية، وأكثر. توصيل سريع لـ69 ولاية مع الدفع عند الاستلام."
                : "Accessoires automobiles premium — éclairage, audio, protection intérieure et plus. Livraison rapide dans les 69 wilayas. Paiement à la livraison."}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap items-center gap-4"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <Link to="/shop">
                <motion.button
                  className={cn(
                    "group relative flex items-center gap-2.5 bg-brand hover:bg-brand-light text-ink font-mono text-xs uppercase tracking-widest px-7 py-4 rounded-lg transition-all duration-200 overflow-hidden",
                    !prefersReducedMotion && !isMobile && "animate-pulse-glow"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">{lang === "ar" ? "تسوق الآن" : "Explorer la boutique"}</span>
                  <ArrowRight size={13} className="relative z-10 transition-transform group-hover:translate-x-1" />
                  <span aria-hidden className="fx-sweep" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              className="flex items-center gap-3 flex-wrap"
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.75 }}
            >
              {[
                {
                  icon: <Star className="w-6 h-6" fill="currentColor" strokeWidth={1.5} />,
                  label: lang === "ar" ? "4.9 تقييم" : "4.9 Étoiles",
                  sub: lang === "ar" ? "تقييم العملاء" : "Avis clients",
                  accent: "text-yellow-400",
                },
                {
                  icon: <BadgeCheck className="w-6 h-6" strokeWidth={2} />,
                  label: lang === "ar" ? "+1 200 عميل" : "+1 200 Clients",
                  sub: lang === "ar" ? "عملاء راضون" : "Satisfaits",
                  accent: "text-brand",
                },
                {
                  icon: <ShieldCheck className="w-6 h-6" strokeWidth={2} />,
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
            style={{ y: carY, willChange: isMobile ? "auto" : "transform", perspective: 1000 }}
            initial={{ x: 40 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="relative"
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={handleHeroMouseLeave}
          >
            {/* Glow under car — hidden on mobile */}
            <div className="hidden md:block absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[70%] h-24 bg-brand/20 blur-[60px] rounded-full" />

            {/* Car SVG — float animation desktop only */}
            <motion.div
              animate={isMobile ? {} : { y: [0, -12, 0] }}
              transition={isMobile ? {} : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full"
            >
              <HeroCar reducedMotion={prefersReducedMotion || isMobile} compact={isMobile} />
            </motion.div>

            {/* Floating product cards — 3D tilt on desktop, chip row on mobile */}
            <HeroProductCards
              categories={categoriesData}
              lang={lang}
              reducedMotion={prefersReducedMotion}
              mx={heroMx}
              my={heroMy}
            />
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
          {stats.map(({ value, suffix, label_fr, label_ar, gauge }, i) => (
            <motion.div
              key={label_fr}
              className="bg-bg flex flex-col items-center justify-center py-6 px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="font-mono font-black text-4xl sm:text-5xl text-brand leading-none">
                <AnimatedCounter target={value} suffix={suffix} />
              </span>
              <SpeedometerArc progress={gauge} delay={i * 0.1 + 0.3} />
              <span className={cn("text-[10px] font-mono text-muted uppercase tracking-widest mt-1", lang === "ar" && "font-ar text-xs")}>
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
            {/* Road-style dashed center stripe */}
            <div
              className={cn(
                "hidden md:block absolute top-10 left-[calc(33%+24px)] right-[calc(33%+24px)] h-[2px] overflow-hidden",
                !prefersReducedMotion && "animate-road-dash"
              )}
              style={{ backgroundImage: "repeating-linear-gradient(to right, rgba(225,29,42,0.55) 0, rgba(225,29,42,0.55) 16px, transparent 16px, transparent 28px)" }}
            />

            {howItWorks.map(({ icon, step, title_fr, title_ar, desc_fr, desc_ar }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              >
                <BentoPanel interactive className="p-8 flex flex-col gap-5 h-full">
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
        <div className="grid grid-cols-2 sm:grid-cols-4 sm:grid-rows-2 gap-3 sm:h-[500px]">
          {(categoriesData ?? []).map((cat, i) => (
            <motion.div
              key={cat.id}
              className={cn(
                "relative group overflow-hidden rounded-bento cursor-pointer h-36 sm:h-auto col-span-1 row-span-1",
                i === 0 && "sm:col-span-2 sm:row-span-2"
              )}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ scale: 0.98 }}
            >
              <Link to={`/shop?category=${cat.slug}`} className="block h-full">
                <div className="absolute inset-0 bg-panel" />
                {cat.image_url && (
                  <img
                    src={cat.image_url}
                    alt={cat.name_fr}
                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-all duration-500 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between">
                  <p className={cn("font-mono text-sm uppercase tracking-wider text-ink group-hover:text-brand transition-colors font-bold", lang === "ar" && "font-ar text-base normal-case tracking-normal")}>
                    {lang === "ar" ? cat.name_ar : cat.name_fr}
                  </p>
                  <ChevronRight size={14} className="text-muted group-hover:text-brand transition-colors opacity-0 group-hover:opacity-100" />
                </div>
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
                <BentoPanel interactive className="p-6 flex gap-4 h-full">
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
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <SectionHeader
            tag={lang === "ar" ? "آراء عملائنا" : "Avis clients"}
            title={lang === "ar" ? "يثقون بنا" : "ILS NOUS\nFONT CONFIANCE"}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {testimonials.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <BentoPanel className="p-6 flex flex-col gap-4 h-full">
                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: review.stars }).map((_, j) => (
                      <Star key={j} size={12} className="text-brand fill-brand" />
                    ))}
                  </div>
                  {/* Text */}
                  <p className={cn("text-xs font-mono text-ink/80 leading-relaxed flex-1 italic", lang === "ar" && "font-ar text-sm not-italic")}>
                    "{review.review_text}"
                  </p>
                  {/* Author */}
                  <div className="border-t border-line/40 pt-4 flex items-center gap-3">
                    {review.image_url ? (
                      <img
                        src={review.image_url}
                        alt={review.client_name}
                        className="w-8 h-8 rounded-full object-cover border border-line"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center">
                        <span className="text-brand font-mono text-xs font-bold">
                          {review.client_name[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <p className="text-xs font-mono text-ink font-semibold">{review.client_name}</p>
                  </div>
                </BentoPanel>
              </motion.div>
            ))}
          </div>
        </section>
      )}

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
              ? `أكثر من ${activeProductCount > 0 ? activeProductCount : "500"} منتج متاح الآن. الدفع عند الاستلام في 69 ولاية.`
              : `Plus de ${activeProductCount > 0 ? activeProductCount : "500"} produits disponibles. Paiement à la livraison dans les 69 wilayas d'Algérie.`}
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
