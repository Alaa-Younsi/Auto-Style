export interface MockProduct {
  id: string;
  slug: string;
  name_fr: string;
  name_ar: string;
  price: number;
  compare_at_price: number | null;
  image: string;
  badge: string | null;
  category_fr: string;
  category_ar: string;
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "m1",
    slug: "tapis-sol-premium",
    name_fr: "Tapis de Sol Premium 3D",
    name_ar: "سجاد أرضية بريميوم 3D",
    price: 3500,
    compare_at_price: 4500,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    badge: "PROMO",
    category_fr: "Intérieur",
    category_ar: "داخلي",
  },
  {
    id: "m2",
    slug: "housse-volant-sport",
    name_fr: "Housse Volant Sport Carbon",
    name_ar: "غطاء مقود رياضي كربون",
    price: 1200,
    compare_at_price: null,
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&q=80",
    badge: "NOUVEAU",
    category_fr: "Intérieur",
    category_ar: "داخلي",
  },
  {
    id: "m3",
    slug: "dashcam-4k",
    name_fr: "Dashcam 4K Ultra HD",
    name_ar: "كاميرا داش 4K فائقة الدقة",
    price: 7500,
    compare_at_price: 9000,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80",
    badge: "TOP VENTE",
    category_fr: "Électronique",
    category_ar: "إلكترونيات",
  },
  {
    id: "m4",
    slug: "support-telephone-magnetique",
    name_fr: "Support Téléphone Magnétique",
    name_ar: "حامل هاتف مغناطيسي",
    price: 900,
    compare_at_price: null,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80",
    badge: null,
    category_fr: "Accessoires",
    category_ar: "ملحقات",
  },
  {
    id: "m5",
    slug: "autoradio-android-10",
    name_fr: "Autoradio Android 10\" Tactile",
    name_ar: "راديو أندرويد 10 بوصة باللمس",
    price: 18500,
    compare_at_price: 22000,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80",
    badge: "PROMO",
    category_fr: "Audio",
    category_ar: "صوتيات",
  },
  {
    id: "m6",
    slug: "housses-siege-premium",
    name_fr: "Housses Siège Premium Cuir",
    name_ar: "أغطية مقاعد جلد بريميوم",
    price: 8500,
    compare_at_price: 11000,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
    badge: "POPULAIRE",
    category_fr: "Intérieur",
    category_ar: "داخلي",
  },
  {
    id: "m7",
    slug: "barre-led-tout-terrain",
    name_fr: "Barre LED Tout-Terrain 50cm",
    name_ar: "بار LED للطرق الوعرة 50سم",
    price: 5500,
    compare_at_price: null,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80",
    badge: null,
    category_fr: "Éclairage",
    category_ar: "إضاءة",
  },
  {
    id: "m8",
    slug: "camera-recul-hd",
    name_fr: "Caméra de Recul HD 170°",
    name_ar: "كاميرا خلفية HD بزاوية 170°",
    price: 2800,
    compare_at_price: 3500,
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80",
    badge: "NOUVEAU",
    category_fr: "Électronique",
    category_ar: "إلكترونيات",
  },
];
