-- 0005_real_products.sql
-- Replace demo seed data with 8 real car-accessory products (3-4 images each)
-- Run in Supabase SQL editor after migrations 0001-0004

-- ── 1. Clear old demo data ────────────────────────────────────────────────────
DELETE FROM product_images;
DELETE FROM products;

-- ── 2. Insert 8 real products ────────────────────────────────────────────────

-- Product 1: Tapis de sol 3D Premium
WITH cat AS (SELECT id FROM categories WHERE slug = 'interieur' LIMIT 1)
INSERT INTO products (
  name_fr, name_ar, slug, description_fr, description_ar,
  details_fr, details_ar,
  price, compare_at_price, category_id, stock,
  status, featured, style_code,
  colors, sizes
)
SELECT
  'Tapis de Sol 3D Premium',
  'حصائر أرضية ثلاثية الأبعاد فاخرة',
  'tapis-sol-3d-premium',
  'Tapis de sol sur mesure en caoutchouc TPE haute densité, conçus pour une protection maximale de l''habitacle.',
  'حصائر أرضية مخصصة من مطاط TPE عالي الكثافة مصممة لأقصى حماية للمقصورة.',
  ARRAY[
    'Matière TPE haute résistance, imperméable et antidérapante',
    'Découpe précise adaptée à chaque modèle de véhicule',
    'Bords surélevés de 5 cm pour retenir eau, boue et graviers',
    'Nettoyage facile à l''eau et savon — séchage rapide',
    'Compatible: Clio 4/5, Dacia Logan/Sandero, Toyota Corolla et +50 modèles'
  ],
  ARRAY[
    'مادة TPE عالية المقاومة، مقاومة للماء ومانعة للانزلاق',
    'قص دقيق يناسب كل طراز سيارة',
    'حواف مرتفعة 5 سم لحجز الماء والطين والحجارة',
    'سهل التنظيف بالماء والصابون — جفاف سريع',
    'متوافق مع: كليو 4/5، داسيا لوغان/سانديرو، تويوتا كورولا و+50 طرازاً'
  ],
  3500, 4500, (SELECT id FROM cat), 45,
  'active', true, 'TPS-3D-001',
  '[{"hex":"#1a1a1a","label_fr":"Noir","label_ar":"أسود"},{"hex":"#8B7355","label_fr":"Beige","label_ar":"بيج"},{"hex":"#4a4a4a","label_fr":"Gris","label_ar":"رمادي"}]'::jsonb,
  '[]'::jsonb
ON CONFLICT (slug) DO NOTHING;

-- Product 2: Dashcam 4K Ultra HD
WITH cat AS (SELECT id FROM categories WHERE slug = 'electronique' LIMIT 1)
INSERT INTO products (
  name_fr, name_ar, slug, description_fr, description_ar,
  details_fr, details_ar,
  price, compare_at_price, category_id, stock,
  status, featured, style_code,
  colors, sizes
)
SELECT
  'Dashcam 4K Ultra HD WiFi',
  'كاميرا داش 4K فائقة الوضوح مع واي فاي',
  'dashcam-4k-ultra-hd',
  'Caméra de tableau de bord 4K avec vision nocturne avancée, WiFi intégré et angle de 170°.',
  'كاميرا لوحة القيادة 4K مع رؤية ليلية متقدمة، واي فاي مدمج وزاوية 170 درجة.',
  ARRAY[
    'Résolution 4K Ultra HD (3840×2160) à 30 fps',
    'Vision nocturne Sony IMX415 — images claires de nuit',
    'Angle de vue 170° grand angle avec correction de distorsion',
    'WiFi intégré — accès vidéos depuis smartphone (iOS/Android)',
    'Mode parking avec détection de mouvement G-sensor',
    'Écran tactile IPS 3 pouces, interface simple'
  ],
  ARRAY[
    'دقة 4K فائقة الوضوح (3840×2160) بـ 30 إطار/ث',
    'رؤية ليلية Sony IMX415 — صور واضحة ليلاً',
    'زاوية رؤية 170° عريضة مع تصحيح التشويه',
    'واي فاي مدمج — الوصول للفيديوهات عبر الهاتف (iOS/Android)',
    'وضع الوقوف مع كاشف حركة G-sensor',
    'شاشة لمس IPS 3 بوصة، واجهة بسيطة'
  ],
  7500, 9900, (SELECT id FROM cat), 28,
  'active', true, 'CAM-4K-W01',
  '[{"hex":"#1a1a1a","label_fr":"Noir","label_ar":"أسود"}]'::jsonb,
  '[]'::jsonb
ON CONFLICT (slug) DO NOTHING;

-- Product 3: Housse de siège sport
WITH cat AS (SELECT id FROM categories WHERE slug = 'interieur' LIMIT 1)
INSERT INTO products (
  name_fr, name_ar, slug, description_fr, description_ar,
  details_fr, details_ar,
  price, compare_at_price, category_id, stock,
  status, featured, style_code,
  colors, sizes
)
SELECT
  'Housse de Siège Sport Cuir PU',
  'غطاء مقعد رياضي جلد PU',
  'housse-siege-sport-pu',
  'Housses de sièges sportives en cuir PU premium, respirantes et résistantes, pour un habitacle élégant.',
  'أغطية مقاعد رياضية من الجلد PU الفاخر، قابلة للتنفس ومتينة لمقصورة أنيقة.',
  ARRAY[
    'Cuir PU haute qualité — toucher doux et résistant à l''usure',
    'Doublure en tissu respirant évite la transpiration',
    'Installation facile sans outils — attaches universelles',
    'Compatible avec accoudoir central et airbag latéral',
    'Lot de 5 pièces: 2 sièges avant + banquette arrière 3 places',
    'Lavable — entretien simple avec chiffon humide'
  ],
  ARRAY[
    'جلد PU عالي الجودة — ملمس ناعم ومقاوم للتآكل',
    'بطانة قماشية قابلة للتنفس تمنع التعرق',
    'تركيب سهل بدون أدوات — مشابك عالمية',
    'متوافق مع مسند ذراع مركزي ووسادة هوائية جانبية',
    'طقم 5 قطع: مقعدان أماميان + مقعد خلفي 3 مقاعد',
    'قابل للغسيل — صيانة سهلة بقطعة قماش مبللة'
  ],
  4200, NULL, (SELECT id FROM cat), 30,
  'active', true, 'HSS-PU-001',
  '[{"hex":"#1a1a1a","label_fr":"Noir","label_ar":"أسود"},{"hex":"#1a1a1a","label_fr":"Noir/Rouge","label_ar":"أسود/أحمر"},{"hex":"#2c2c4a","label_fr":"Noir/Bleu","label_ar":"أسود/أزرق"}]'::jsonb,
  '[]'::jsonb
ON CONFLICT (slug) DO NOTHING;

-- Product 4: Support téléphone magnétique
WITH cat AS (SELECT id FROM categories WHERE slug = 'electronique' LIMIT 1)
INSERT INTO products (
  name_fr, name_ar, slug, description_fr, description_ar,
  details_fr, details_ar,
  price, compare_at_price, category_id, stock,
  status, featured, style_code,
  colors, sizes
)
SELECT
  'Support Téléphone Magnétique 360°',
  'حامل الهاتف المغناطيسي 360°',
  'support-telephone-magnetique',
  'Support téléphone magnétique puissant pour tableau de bord ou grille d''aération, rotation 360°.',
  'حامل هاتف مغناطيسي قوي للوحة القيادة أو شبكة التهوية، دوران 360 درجة.',
  ARRAY[
    '6 aimants N52 ultra-puissants — maintien sécurisé même sur routes cahoteuses',
    'Rotation 360° — portrait ou paysage instantanément',
    'Compatible tous smartphones (iPhone, Samsung, Huawei...) jusqu''à 7 pouces',
    'Fixation grille d''aération + ventouse tableau de bord incluses',
    'Aucune gêne à la charge sans fil (Qi compatible)',
    'Matière aluminium premium — design épuré'
  ],
  ARRAY[
    '6 مغناطيسات N52 فائقة القوة — ثبات آمن حتى على الطرق الوعرة',
    'دوران 360° — عمودي أو أفقي على الفور',
    'متوافق مع جميع الهواتف (iPhone، Samsung، Huawei...) حتى 7 بوصات',
    'تثبيت على شبكة تهوية + شفاط لوحة قيادة مدرج',
    'لا يعيق الشحن اللاسلكي (متوافق مع Qi)',
    'مادة ألومنيوم فاخرة — تصميم نظيف'
  ],
  890, 1200, (SELECT id FROM cat), 120,
  'active', false, 'SPT-MAG-360',
  '[{"hex":"#C0C0C0","label_fr":"Argent","label_ar":"فضي"},{"hex":"#1a1a1a","label_fr":"Noir","label_ar":"أسود"}]'::jsonb,
  '[]'::jsonb
ON CONFLICT (slug) DO NOTHING;

-- Product 5: Kit LED intérieur ambiance
WITH cat AS (SELECT id FROM categories WHERE slug = 'eclairage' LIMIT 1)
INSERT INTO products (
  name_fr, name_ar, slug, description_fr, description_ar,
  details_fr, details_ar,
  price, compare_at_price, category_id, stock,
  status, featured, style_code,
  colors, sizes
)
SELECT
  'Kit LED Ambiance Intérieur RGB',
  'طقم إضاءة LED داخلية RGB للأجواء',
  'kit-led-ambiance-rgb',
  'Kit d''éclairage LED RGB pour habitacle avec télécommande et synchronisation musicale.',
  'طقم إضاءة LED RGB للمقصورة مع جهاز تحكم عن بعد ومزامنة موسيقية.',
  ARRAY[
    '16 millions de couleurs RGB programmables via télécommande ou application',
    'Mode synchronisation musicale — réagit au rythme de la musique',
    '4 bandes LED flexibles (2×90cm + 2×45cm) — couvrent tout l''habitacle',
    'Installation sans perçage — adhésif 3M ultra-résistant',
    'Connectivité Bluetooth 5.0 — contrôle via smartphone',
    '5 modes préprogrammés: flash, fade, strobe, smooth, music'
  ],
  ARRAY[
    '16 مليون لون RGB قابل للبرمجة عبر جهاز تحكم أو تطبيق',
    'وضع مزامنة موسيقية — يتفاعل مع إيقاع الموسيقى',
    '4 شرائط LED مرنة (2×90سم + 2×45سم) — تغطي كامل المقصورة',
    'تركيب بدون حفر — لاصق 3M فائق المقاومة',
    'اتصال بلوتوث 5.0 — تحكم عبر الهاتف',
    '5 أوضاع مبرمجة: وميض، تلاشي، ستروب، سلس، موسيقي'
  ],
  1800, 2500, (SELECT id FROM cat), 65,
  'active', true, 'LED-RGB-INT',
  '[{"hex":"#E11D2A","label_fr":"Rouge","label_ar":"أحمر"},{"hex":"#1a4aff","label_fr":"Bleu","label_ar":"أزرق"},{"hex":"#00cc44","label_fr":"Vert","label_ar":"أخضر"},{"hex":"#ffffff","label_fr":"Blanc","label_ar":"أبيض"}]'::jsonb,
  '[]'::jsonb
ON CONFLICT (slug) DO NOTHING;

-- Product 6: Volant housse cuir naturel
WITH cat AS (SELECT id FROM categories WHERE slug = 'interieur' LIMIT 1)
INSERT INTO products (
  name_fr, name_ar, slug, description_fr, description_ar,
  details_fr, details_ar,
  price, compare_at_price, category_id, stock,
  status, featured, style_code,
  colors, sizes
)
SELECT
  'Housse de Volant Cuir Naturel',
  'غطاء مقود جلد طبيعي',
  'housse-volant-cuir-naturel',
  'Housse de volant en cuir naturel véritable, couture main, antidérapante et confortable.',
  'غطاء مقود من الجلد الطبيعي الحقيقي، خياطة يدوية، مانع للانزلاق ومريح.',
  ARRAY[
    'Cuir naturel véritable — durable, respirant et anti-transpiration',
    'Couture main en fil double — résistance maximale',
    'Diamètre universel 37-38 cm — compatible 95% des véhicules',
    'Antidérapant intégré — meilleure tenue en main',
    'Isolation thermique — confort été comme hiver',
    'Kit d''aiguille et fil fourni pour fixation parfaite'
  ],
  ARRAY[
    'جلد طبيعي حقيقي — متين، قابل للتنفس ومقاوم للعرق',
    'خياطة يدوية بخيط مزدوج — أقصى قدر من المقاومة',
    'قطر عالمي 37-38 سم — متوافق مع 95% من السيارات',
    'مانع انزلاق مدمج — قبضة أفضل',
    'عازل حراري — مريح صيفاً وشتاءً',
    'طقم إبرة وخيط مرفق للتثبيت المثالي'
  ],
  1400, NULL, (SELECT id FROM cat), 50,
  'active', false, 'HVC-CUR-001',
  '[{"hex":"#1a1a1a","label_fr":"Noir","label_ar":"أسود"},{"hex":"#8B4513","label_fr":"Marron","label_ar":"بني"},{"hex":"#C0A882","label_fr":"Beige","label_ar":"بيج"}]'::jsonb,
  '[{"label":"S (37cm)"},{"label":"M (38cm)"},{"label":"L (39cm)"}]'::jsonb
ON CONFLICT (slug) DO NOTHING;

-- Product 7: Organisateur de coffre pliable
WITH cat AS (SELECT id FROM categories WHERE slug = 'interieur' LIMIT 1)
INSERT INTO products (
  name_fr, name_ar, slug, description_fr, description_ar,
  details_fr, details_ar,
  price, compare_at_price, category_id, stock,
  status, featured, style_code,
  colors, sizes
)
SELECT
  'Organisateur de Coffre Pliable XL',
  'منظم صندوق السيارة القابل للطي XL',
  'organisateur-coffre-pliable-xl',
  'Organisateur de coffre pliable grande capacité en polyester Oxford 600D, compartiments multiples.',
  'منظم صندوق سيارة قابل للطي بسعة كبيرة من بوليستر أكسفورد 600D، حجرات متعددة.',
  ARRAY[
    'Capacité 40L — idéal épicerie, matériel de sport, voyages',
    'Polyester Oxford 600D résistant à l''eau et aux déchirures',
    'Base rigide antiglisse — reste en place même en virage',
    '8 compartiments dont 2 latéraux thermos + 1 poche extérieure zipée',
    'Pliable à plat en 3 secondes — ne prend pas de place à vide',
    'Poignées renforcées pour port facile hors véhicule'
  ],
  ARRAY[
    'سعة 40 لتر — مثالي للبقالة، معدات الرياضة، الرحلات',
    'بوليستر أكسفورد 600D مقاوم للماء والتمزق',
    'قاعدة صلبة مانعة للانزلاق — تبقى في مكانها حتى في المنعطفات',
    '8 حجرات منها 2 جانبية للترمس + جيب خارجي بسحاب',
    'قابل للطي بشكل مسطح في 3 ثوانٍ — لا يأخذ مساحة عند الإخلاء',
    'مقابض معززة لسهولة الحمل خارج السيارة'
  ],
  1950, 2800, (SELECT id FROM cat), 40,
  'active', false, 'ORG-XL-PLI',
  '[{"hex":"#1a1a1a","label_fr":"Noir","label_ar":"أسود"},{"hex":"#2d4a2d","label_fr":"Vert militaire","label_ar":"أخضر عسكري"}]'::jsonb,
  '[]'::jsonb
ON CONFLICT (slug) DO NOTHING;

-- Product 8: Parfum voiture premium oud
WITH cat AS (SELECT id FROM categories WHERE slug = 'interieur' LIMIT 1)
INSERT INTO products (
  name_fr, name_ar, slug, description_fr, description_ar,
  details_fr, details_ar,
  price, compare_at_price, category_id, stock,
  status, featured, style_code,
  colors, sizes
)
SELECT
  'Parfum Voiture Premium Oud',
  'عطر سيارة فاخر بالعود',
  'parfum-voiture-premium-oud',
  'Parfum de voiture longue durée aux notes d''oud et de bois précieux, recharge incluse.',
  'عطر سيارة طويل الأمد بنوتات العود والخشب الثمين، يشمل إعادة تعبئة.',
  ARRAY[
    'Fragrance oud premium — notes boisées chaudes et musquées',
    'Durée de parfumage: 60 jours — recharge 30ml offerte',
    'Diffusion progressive — intensité constante sans pic',
    'Design luxe clip grille d''aération — discret et élégant',
    'Flacon en verre taillé avec bouchon métal doré',
    '3 fragrances au choix: Oud Royal, Oud Rose, Oud Ambre'
  ],
  ARRAY[
    'عطر عود فاخر — نوتات خشبية دافئة ومسكية',
    'مدة العطر: 60 يوماً — إعادة تعبئة 30 مل مهداة',
    'انتشار تدريجي — شدة ثابتة بدون ذروة',
    'تصميم فاخر بمشبك شبكة تهوية — أنيق وغير مزعج',
    'زجاجة زجاج مقطوع مع غطاء معدني ذهبي',
    '3 عطور للاختيار: عود ملكي، عود وردي، عود عنبري'
  ],
  1200, NULL, (SELECT id FROM cat), 75,
  'active', true, 'PAR-OUD-LUX',
  '[{"hex":"#C5A028","label_fr":"Oud Royal","label_ar":"عود ملكي"},{"hex":"#C06080","label_fr":"Oud Rose","label_ar":"عود وردي"},{"hex":"#8B6914","label_fr":"Oud Ambre","label_ar":"عود عنبري"}]'::jsonb,
  '[]'::jsonb
ON CONFLICT (slug) DO NOTHING;

-- ── 3. Product images (3-4 per product) ──────────────────────────────────────

-- Tapis de sol
INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, img.url, img.alt, img.sort_order
FROM products p
CROSS JOIN (VALUES
  ('https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80', 'Tapis de sol 3D vue ensemble', 1),
  ('https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80', 'Tapis de sol détail bords', 2),
  ('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80', 'Tapis de sol en position', 3)
) AS img(url, alt, sort_order)
WHERE p.slug = 'tapis-sol-3d-premium'
ON CONFLICT DO NOTHING;

-- Dashcam
INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, img.url, img.alt, img.sort_order
FROM products p
CROSS JOIN (VALUES
  ('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80', 'Dashcam 4K face avant', 1),
  ('https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80', 'Dashcam sur pare-brise', 2),
  ('https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&q=80', 'Interface dashcam', 3),
  ('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80', 'Dashcam vision nocturne', 4)
) AS img(url, alt, sort_order)
WHERE p.slug = 'dashcam-4k-ultra-hd'
ON CONFLICT DO NOTHING;

-- Housse de siège
INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, img.url, img.alt, img.sort_order
FROM products p
CROSS JOIN (VALUES
  ('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', 'Housse siège sport intérieur', 1),
  ('https://images.unsplash.com/photo-1517026575980-3e1e2dedeab4?w=800&q=80', 'Housse siège détail couture', 2),
  ('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', 'Housse siège vue ensemble', 3)
) AS img(url, alt, sort_order)
WHERE p.slug = 'housse-siege-sport-pu'
ON CONFLICT DO NOTHING;

-- Support téléphone
INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, img.url, img.alt, img.sort_order
FROM products p
CROSS JOIN (VALUES
  ('https://images.unsplash.com/photo-1609252925595-bb5ddc47c7ab?w=800&q=80', 'Support magnétique en usage', 1),
  ('https://images.unsplash.com/photo-1588702547923-7408028e64fd?w=800&q=80', 'Support sur grille aération', 2),
  ('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', 'Support détail aimants', 3)
) AS img(url, alt, sort_order)
WHERE p.slug = 'support-telephone-magnetique'
ON CONFLICT DO NOTHING;

-- Kit LED
INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, img.url, img.alt, img.sort_order
FROM products p
CROSS JOIN (VALUES
  ('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 'LED ambiance intérieur rouge', 1),
  ('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', 'LED bande flexible', 2),
  ('https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80', 'LED multicolore RGB', 3),
  ('https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80', 'LED télécommande', 4)
) AS img(url, alt, sort_order)
WHERE p.slug = 'kit-led-ambiance-rgb'
ON CONFLICT DO NOTHING;

-- Housse volant
INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, img.url, img.alt, img.sort_order
FROM products p
CROSS JOIN (VALUES
  ('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80', 'Housse volant cuir noir', 1),
  ('https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80', 'Housse volant détail couture', 2),
  ('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', 'Housse volant en position', 3)
) AS img(url, alt, sort_order)
WHERE p.slug = 'housse-volant-cuir-naturel'
ON CONFLICT DO NOTHING;

-- Organisateur coffre
INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, img.url, img.alt, img.sort_order
FROM products p
CROSS JOIN (VALUES
  ('https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80', 'Organisateur coffre plié', 1),
  ('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', 'Organisateur coffre ouvert', 2),
  ('https://images.unsplash.com/photo-1517026575980-3e1e2dedeab4?w=800&q=80', 'Organisateur détail compartiments', 3)
) AS img(url, alt, sort_order)
WHERE p.slug = 'organisateur-coffre-pliable-xl'
ON CONFLICT DO NOTHING;

-- Parfum voiture
INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, img.url, img.alt, img.sort_order
FROM products p
CROSS JOIN (VALUES
  ('https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80', 'Parfum oud flacon', 1),
  ('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80', 'Parfum sur grille aération', 2),
  ('https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80', 'Parfum collection', 3)
) AS img(url, alt, sort_order)
WHERE p.slug = 'parfum-voiture-premium-oud'
ON CONFLICT DO NOTHING;
