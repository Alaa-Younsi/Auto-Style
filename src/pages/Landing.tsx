import { useRef, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, Star, ChevronRight } from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { BentoPanel } from "@/components/ui/BentoPanel";
import { Marquee } from "@/components/ui/Marquee";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import logo from "@/assets/auto-style-logo.png";
import { MOCK_PRODUCTS } from "@/data/mockProducts";
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
function CarSVG() {
  return (
    <svg
      viewBox="0 0 900 380"
      fill="none"
      className="w-full h-full"
      style={{ filter: "drop-shadow(0 0 30px rgba(225,29,42,0.5))" }}
    >
      <defs>
        <linearGradient id="carGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E11D2A" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#F4F4F5" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#E11D2A" stopOpacity="0.3" />
        </linearGradient>
        <filter id="carGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Ground reflection line */}
      <line x1="60" y1="320" x2="840" y2="320" stroke="#E11D2A" strokeWidth="1" strokeOpacity="0.25" />
      <line x1="100" y1="325" x2="800" y2="325" stroke="#E11D2A" strokeWidth="0.5" strokeOpacity="0.12" />

      {/* Car body */}
      <path
        d="M100,295 L100,278 C100,278 115,268 130,260 L165,248 C185,238 215,225 255,210 L320,158 C345,138 385,118 430,110 L500,108 C545,108 590,118 625,138 L680,168 C715,188 745,215 765,248 L790,268 C800,275 810,285 810,295 Z"
        fill="url(#carGrad)"
        stroke="rgba(244,244,245,0.2)"
        strokeWidth="1"
        filter="url(#carGlow)"
      />

      {/* Roof / cabin */}
      <path
        d="M280,208 C310,178 365,138 430,120 L500,118 C545,118 588,132 618,152 L665,185 L620,205 L480,205 L345,205 Z"
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(244,244,245,0.5)"
        strokeWidth="1.5"
        filter="url(#carGlow)"
      />

      {/* Windshield highlight */}
      <path
        d="M315,205 C340,175 385,148 430,136 L490,134 C525,134 560,148 585,168 L620,200 L480,202 L345,202 Z"
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(244,244,245,0.7)"
        strokeWidth="1"
      />

      {/* A-pillar & roof line detail */}
      <path
        d="M280,208 L310,162 C330,138 375,116 430,110"
        stroke="rgba(244,244,245,0.6)"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M620,205 L655,185 C675,165 695,148 715,140"
        stroke="rgba(244,244,245,0.5)"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Door line */}
      <line x1="460" y1="130" x2="455" y2="295" stroke="rgba(244,244,245,0.25)" strokeWidth="1" strokeDasharray="6,4" />

      {/* Side skirt / body line */}
      <path
        d="M165,248 C230,240 360,235 455,235 L545,235 C650,235 740,248 790,268"
        stroke="rgba(225,29,42,0.6)"
        strokeWidth="1.5"
        fill="none"
        filter="url(#carGlow)"
      />

      {/* Front headlight */}
      <path
        d="M108,260 L125,248 L145,252 L130,268 Z"
        fill="rgba(225,29,42,0.3)"
        stroke="#E11D2A"
        strokeWidth="1"
      />
      <line x1="118" y1="258" x2="80" y2="255" stroke="#E11D2A" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="118" y1="262" x2="70" y2="262" stroke="#E11D2A" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="118" y1="265" x2="75" y2="268" stroke="#E11D2A" strokeWidth="0.6" strokeOpacity="0.3" />

      {/* Rear light */}
      <path
        d="M795,258 L808,268 L805,280 L792,275 Z"
        fill="rgba(225,29,42,0.4)"
        stroke="#E11D2A"
        strokeWidth="1"
      />

      {/* Front wheel */}
      <circle cx="245" cy="295" r="65" fill="#111113" stroke="rgba(244,244,245,0.3)" strokeWidth="1.5" />
      <circle cx="245" cy="295" r="48" fill="none" stroke="rgba(244,244,245,0.15)" strokeWidth="1" />
      <circle cx="245" cy="295" r="28" fill="#161618" stroke="rgba(225,29,42,0.4)" strokeWidth="1.5" />
      <circle cx="245" cy="295" r="10" fill="#E11D2A" strokeWidth="0" fillOpacity="0.7" />
      {[0,60,120,180,240,300].map((angle) => (
        <line
          key={angle}
          x1={245 + 28 * Math.cos((angle * Math.PI) / 180)}
          y1={295 + 28 * Math.sin((angle * Math.PI) / 180)}
          x2={245 + 48 * Math.cos((angle * Math.PI) / 180)}
          y2={295 + 48 * Math.sin((angle * Math.PI) / 180)}
          stroke="rgba(244,244,245,0.3)"
          strokeWidth="1.5"
        />
      ))}

      {/* Rear wheel */}
      <circle cx="665" cy="295" r="65" fill="#111113" stroke="rgba(244,244,245,0.3)" strokeWidth="1.5" />
      <circle cx="665" cy="295" r="48" fill="none" stroke="rgba(244,244,245,0.15)" strokeWidth="1" />
      <circle cx="665" cy="295" r="28" fill="#161618" stroke="rgba(225,29,42,0.4)" strokeWidth="1.5" />
      <circle cx="665" cy="295" r="10" fill="#E11D2A" strokeWidth="0" fillOpacity="0.7" />
      {[0,60,120,180,240,300].map((angle) => (
        <line
          key={angle}
          x1={665 + 28 * Math.cos((angle * Math.PI) / 180)}
          y1={295 + 28 * Math.sin((angle * Math.PI) / 180)}
          x2={665 + 48 * Math.cos((angle * Math.PI) / 180)}
          y2={295 + 48 * Math.sin((angle * Math.PI) / 180)}
          stroke="rgba(244,244,245,0.3)"
          strokeWidth="1.5"
        />
      ))}
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

/* ─── MOCK PRODUCT CARD (Landing) ─────────────────────────────────────────── */
function MockProductCard({ product, index }: { product: typeof MOCK_PRODUCTS[0]; index: number }) {
  const { lang } = useLang();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  const name = lang === "ar" ? product.name_ar : product.name_fr;
  const isOnSale = product.compare_at_price !== null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * -10, y: (x - 0.5) * 10 });
    setGlowPos({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlowPos({ x: 50, y: 50 });
    setHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      style={{ transformStyle: "preserve-3d", perspective: "800px" }}
    >
      <Link to={`/product/${product.slug}`}>
        <div
          className={cn(
            "relative bg-panel border rounded-bento overflow-hidden transition-all duration-300 h-full flex flex-col",
            hovered ? "border-brand/50 shadow-glow" : "border-line/40"
          )}
        >
          {/* Glow overlay */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none z-10"
            style={{
              opacity: hovered ? 0.25 : 0,
              background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(225,29,42,0.7), transparent 60%)`,
            }}
          />

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-3 left-3 z-20 bg-brand text-ink text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded-md">
              {product.badge}
            </span>
          )}

          {/* Image */}
          <div className="aspect-square overflow-hidden bg-panel-2 relative">
            <motion.img
              src={product.image}
              alt={name}
              className="w-full h-full object-cover"
              animate={{ scale: hovered ? 1.08 : 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            {/* Add to cart overlay */}
            <AnimatePresence>
              {hovered && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  onClick={(e) => {
                    e.preventDefault();
                    addItem({ productId: product.id, slug: product.slug, name_fr: product.name_fr, name_ar: product.name_ar, price: product.price, image: product.image, color: null, size: null });
                    openCart();
                  }}
                  className="absolute bottom-3 right-3 w-9 h-9 bg-brand hover:bg-brand-light rounded-full flex items-center justify-center shadow-glow transition-colors"
                >
                  <svg viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
                    <path d="M4 4h2l1 8h8l1-5H6"/>
                    <circle cx="9" cy="17" r="1.5" fill="white" stroke="none"/>
                    <circle cx="15" cy="17" r="1.5" fill="white" stroke="none"/>
                    <path d="M10 8v4M8 10h4" strokeWidth="1.5"/>
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Info */}
          <div className="p-4 flex flex-col gap-1.5 flex-1">
            <span className={cn(
              "text-[9px] font-mono text-muted/60 uppercase tracking-widest",
              lang === "ar" && "font-ar text-[10px]"
            )}>
              {lang === "ar" ? product.category_ar : product.category_fr}
            </span>
            <p className={cn(
              "text-xs font-mono text-ink uppercase tracking-wide leading-snug line-clamp-2",
              lang === "ar" && "font-ar text-sm normal-case tracking-normal"
            )}>
              {name}
            </p>
            <div className="flex items-center gap-2 mt-auto pt-2">
              <span className="text-brand font-mono text-sm font-semibold">{formatPrice(product.price)}</span>
              {isOnSale && product.compare_at_price && (
                <span className="text-muted font-mono text-[10px] line-through">{formatPrice(product.compare_at_price)}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
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
                { text: lang === "ar" ? "جهِّز" : "ÉQUIPEZ", style: "text-ink", size: "text-[clamp(3rem,8vw,6.5rem)]" },
                { text: lang === "ar" ? "سيارتك" : "VOTRE", style: "text-ink", size: "text-[clamp(4rem,10vw,8.5rem)]" },
                { text: lang === "ar" ? "الآن" : "VOITURE", style: "text-brand", size: "text-[clamp(4rem,10vw,8.5rem)]" },
              ].map(({ text, style, size }, i) => (
                <motion.span
                  key={text}
                  className={cn("font-mono font-black uppercase leading-[0.9] tracking-tighter block", style, size, lang === "ar" && "font-ar")}
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
              <Link to="/admin/preview">
                <motion.button
                  className="flex items-center gap-2 border border-line/60 hover:border-brand/50 text-muted hover:text-ink font-mono text-xs uppercase tracking-widest px-6 py-4 rounded-lg transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                >
                  {lang === "ar" ? "لوحة التحكم" : "Voir le dashboard"}
                  <ChevronRight size={12} />
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              className="flex items-center gap-5 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
            >
              {[
                { icon: "⭐", text: lang === "ar" ? "4.9 تقييم" : "4.9 Étoiles" },
                { icon: "✓", text: lang === "ar" ? "+1 200 عميل" : "+1 200 Clients" },
                { icon: "🔒", text: lang === "ar" ? "دفع آمن" : "100% Sécurisé" },
              ].map(({ icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-[10px] font-mono text-muted/70">
                  <span className="text-xs">{icon}</span>
                  {text}
                </span>
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
          {MOCK_PRODUCTS.slice(0, 8).map((p, i) => (
            <MockProductCard key={p.id} product={p} index={i} />
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

      {/* ══════════════════════════════════════════════════════ ADMIN PREVIEW TEASER */}
      <section className="border-t border-line/30 bg-panel/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-5"
            >
              <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-brand">
                {lang === "ar" ? "لوحة التحكم" : "Dashboard propriétaire"}
              </span>
              <h2 className={cn("font-mono font-black text-3xl sm:text-5xl uppercase tracking-tight text-ink leading-none", lang === "ar" && "font-ar text-3xl normal-case tracking-normal")}>
                {lang === "ar" ? "تحكم كامل\nفي متجرك" : "GÉREZ VOTRE\nBOUTIQUE"}
              </h2>
              <p className={cn("text-sm text-muted font-mono leading-relaxed max-w-sm", lang === "ar" && "font-ar text-base")}>
                {lang === "ar"
                  ? "لوحة تحكم متكاملة لإدارة المنتجات، الطلبات، الفئات والإحصائيات — كل شيء في مكان واحد."
                  : "Tableau de bord complet pour gérer vos produits, commandes, catégories et statistiques — tout en un seul endroit."}
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  lang === "ar" ? "إدارة المنتجات والصور" : "Gestion produits & images",
                  lang === "ar" ? "تتبع الطلبات في الوقت الحقيقي" : "Suivi commandes en temps réel",
                  lang === "ar" ? "إحصائيات المبيعات" : "Statistiques de ventes",
                  lang === "ar" ? "إدارة الفئات" : "Gestion des catégories",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-xs font-mono text-muted">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/admin/preview">
                <Button size="lg" variant="outline" className="mt-2 w-fit">
                  {lang === "ar" ? "عرض توضيحي" : "Voir la démo"} <ArrowRight size={13} />
                </Button>
              </Link>
            </motion.div>

            {/* Admin dashboard mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="rounded-bento-lg border border-line/40 overflow-hidden bg-panel shadow-panel">
                {/* Mockup header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-line/40 bg-bg/50">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                  </div>
                  <div className="mx-auto flex-1 max-w-[160px] h-5 bg-panel-2 rounded border border-line/30 flex items-center justify-center">
                    <span className="text-[9px] font-mono text-muted/50">admin.autostyle.dz</span>
                  </div>
                </div>
                {/* Mockup content */}
                <div className="flex">
                  {/* Sidebar */}
                  <div className="w-28 border-r border-line/30 p-3 flex flex-col gap-1.5 bg-panel">
                    {["Dashboard", "Produits", "Catégories", "Commandes"].map((item, i) => (
                      <div key={item} className={cn("px-2.5 py-2 rounded-lg text-[9px] font-mono", i === 0 ? "bg-brand/10 text-brand" : "text-muted/50")}>
                        {item}
                      </div>
                    ))}
                  </div>
                  {/* Main */}
                  <div className="flex-1 p-4 flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-2">
                      {[{ label: "Commandes", val: "128", color: "text-ink" }, { label: "Revenu", val: "485 200 DA", color: "text-brand" }, { label: "Produits", val: "47", color: "text-ink" }, { label: "Stock faible", val: "3", color: "text-brand" }].map(({ label, val, color }) => (
                        <div key={label} className="bg-panel-2 rounded-lg p-2.5 border border-line/30">
                          <p className={cn("text-xs font-mono font-bold", color)}>{val}</p>
                          <p className="text-[8px] font-mono text-muted/60 uppercase">{label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-panel-2 rounded-lg border border-line/30 p-2.5">
                      <p className="text-[8px] font-mono text-muted/60 uppercase mb-2">Dernières commandes</p>
                      {["AS-20240628-A4F2E", "AS-20240628-B3C1D", "AS-20240627-F8E5A"].map((num, i) => (
                        <div key={num} className="flex justify-between py-1 border-b border-line/20 last:border-0">
                          <span className="text-[9px] font-mono text-brand">{num}</span>
                          <span className={cn("text-[9px] font-mono", i === 0 ? "text-yellow-400" : "text-brand")}>
                            {["En attente", "Confirmée", "Livrée"][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Glow behind mockup */}
              <div className="absolute -inset-4 bg-brand/5 blur-[60px] -z-10 rounded-bento-lg" />
            </motion.div>
          </div>
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
          <img src={logo} alt="Auto Style" className="h-16 w-auto opacity-90" />
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
