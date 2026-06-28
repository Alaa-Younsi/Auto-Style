-- Auto Style — Seed Data
-- 8 categories + 12 bilingual products with placeholder images

-- ── Categories ────────────────────────────────────────────────────────────────

INSERT INTO categories (slug, name_fr, name_ar, description_fr, description_ar, image_url, sort_order) VALUES
  ('interieur', 'Intérieur', 'داخلي', 'Accessoires pour l''habitacle', 'إكسسوارات المقصورة الداخلية', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600', 1),
  ('exterieur', 'Extérieur', 'خارجي', 'Protection et style extérieur', 'الحماية والأناقة الخارجية', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600', 2),
  ('eclairage', 'Éclairage', 'إضاءة', 'LED, ampoules, phares', 'LED، مصابيح، أضواء', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', 3),
  ('electronique', 'Électronique', 'إلكترونيات', 'Gadgets et technologies embarqués', 'أجهزة وتقنيات متطورة', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', 4),
  ('audio', 'Audio', 'صوتيات', 'Autoradios, enceintes, amplis', 'راديو، مكبرات صوت', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600', 5),
  ('entretien', 'Entretien', 'صيانة', 'Produits de nettoyage et soin', 'منتجات التنظيف والعناية', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600', 6),
  ('jantes', 'Jantes & Pneus', 'جنوط وإطارات', 'Jantes alu, housses, accessoires', 'جنوط ألمنيوم وإكسسوارات', 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600', 7),
  ('accessoires', 'Accessoires', 'ملحقات', 'Divers accessoires pratiques', 'ملحقات متنوعة وعملية', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600', 8)
ON CONFLICT (slug) DO NOTHING;

-- ── Products ──────────────────────────────────────────────────────────────────

-- 1. Tapis de sol
WITH cat AS (SELECT id FROM categories WHERE slug='interieur')
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, details_fr, details_ar, price, compare_at_price, category_id, stock, style_code, colors, sizes, featured, status) VALUES
('tapis-sol-premium', 'Tapis de sol Premium', 'سجاد أرضية بريميوم',
 'Tapis 3D sur mesure pour une protection optimale de votre habitacle.',
 'سجاد ثلاثي الأبعاد مصنوع خصيصاً لحماية مثالية لمقصورتك.',
 ARRAY['Matière : caoutchouc TPE 3D', 'Sur-mesure pour votre modèle', 'Antidérapant intégré', 'Lavable en machine'],
 ARRAY['مادة: مطاط TPE ثلاثي الأبعاد', 'مصمم خصيصاً لطرازك', 'مقاومة للانزلاق', 'قابل للغسيل'],
 3500, 4500,
 (SELECT id FROM cat), 25, 'TP-001',
 '[{"hex":"#1a1a1a","label_fr":"Noir","label_ar":"أسود"},{"hex":"#6b4c11","label_fr":"Marron","label_ar":"بني"}]',
 '[{"label":"Universel"},{"label":"Berline"},{"label":"SUV"}]',
 true, 'active')
ON CONFLICT (slug) DO NOTHING;

-- 2. Housse de volant
WITH cat AS (SELECT id FROM categories WHERE slug='interieur')
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, details_fr, details_ar, price, compare_at_price, category_id, stock, style_code, colors, sizes, featured, status) VALUES
('housse-volant-sport', 'Housse Volant Sport', 'غطاء مقود رياضي',
 'Housse en cuir synthétique respirant pour un grip parfait.',
 'غطاء من الجلد الصناعي المسامي لمسكة مثالية.',
 ARRAY['Cuir synthétique perforé', 'Diamètre 38 cm', 'Installation facile', 'Résistant à la transpiration'],
 ARRAY['جلد صناعي مثقوب', 'قطر 38 سم', 'تركيب سهل', 'مقاوم للتعرق'],
 1200, NULL,
 (SELECT id FROM cat), 40, 'HV-002',
 '[{"hex":"#1a1a1a","label_fr":"Noir","label_ar":"أسود"},{"hex":"#C41E3A","label_fr":"Noir/Rouge","label_ar":"أسود/أحمر"},{"hex":"#6b6b6b","label_fr":"Gris","label_ar":"رمادي"}]',
 '[{"label":"38cm"},{"label":"40cm"}]',
 true, 'active')
ON CONFLICT (slug) DO NOTHING;

-- 3. Caméra de recul
WITH cat AS (SELECT id FROM categories WHERE slug='electronique')
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, details_fr, details_ar, price, compare_at_price, category_id, stock, style_code, colors, sizes, featured, status) VALUES
('camera-recul-hd', 'Caméra de Recul HD', 'كاميرا خلفية HD',
 'Caméra HD grand angle pour un stationnement en toute sécurité.',
 'كاميرا HD بزاوية واسعة للركن الآمن.',
 ARRAY['Résolution 1080P HD', 'Angle 170°', 'Vision nocturne infrarouge', 'Étanche IP67', 'Lignes de guidage dynamiques'],
 ARRAY['دقة 1080P HD', 'زاوية 170°', 'رؤية ليلية بالأشعة تحت الحمراء', 'مقاوم للماء IP67', 'خطوط إرشادية ديناميكية'],
 2800, 3500,
 (SELECT id FROM cat), 18, 'CR-003',
 '[{"hex":"#1a1a1a","label_fr":"Noir","label_ar":"أسود"}]',
 '[]',
 true, 'active')
ON CONFLICT (slug) DO NOTHING;

-- 4. Barre LED
WITH cat AS (SELECT id FROM categories WHERE slug='eclairage')
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, details_fr, details_ar, price, compare_at_price, category_id, stock, style_code, colors, sizes, featured, status) VALUES
('barre-led-tout-terrain', 'Barre LED Tout-Terrain 50cm', 'بار LED للطرق الوعرة 50سم',
 'Barre lumineuse haute puissance pour 4×4 et SUV.',
 'بار ضوئي عالي الطاقة للسيارات الرباعية والـSUV.',
 ARRAY['150W de puissance', 'Lumens : 15 000 lm', 'IP67 étanche', 'Support universel inclus', 'Température : 6000K'],
 ARRAY['قوة 150 واط', 'الإضاءة: 15 000 لومن', 'مقاوم للماء IP67', 'حامل عالمي مرفق', 'درجة الحرارة: 6000K'],
 5500, NULL,
 (SELECT id FROM cat), 12, 'BL-004',
 '[{"hex":"#F4F4F5","label_fr":"Blanc","label_ar":"أبيض"}]',
 '[{"label":"50cm"},{"label":"1m"}]',
 false, 'active')
ON CONFLICT (slug) DO NOTHING;

-- 5. Autoradio Android
WITH cat AS (SELECT id FROM categories WHERE slug='audio')
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, details_fr, details_ar, price, compare_at_price, category_id, stock, style_code, colors, sizes, featured, status) VALUES
('autoradio-android-10', 'Autoradio Android 10" Tactile', 'راديو أندرويد 10 بوصة باللمس',
 'Unité centrale Android avec écran tactile 10 pouces, GPS, Bluetooth.',
 'وحدة مركزية أندرويد بشاشة لمسية 10 بوصة، GPS، بلوتوث.',
 ARRAY['Écran IPS 10" 1280×720', 'Android 13', 'GPS intégré', 'Bluetooth 5.0', 'WiFi 4G', 'Caméra recul compatible'],
 ARRAY['شاشة IPS 10 بوصة 1280×720', 'أندرويد 13', 'GPS مدمج', 'بلوتوث 5.0', 'واي فاي 4G', 'متوافق مع كاميرا الخلف'],
 18500, 22000,
 (SELECT id FROM cat), 8, 'AR-005',
 '[{"hex":"#1a1a1a","label_fr":"Noir","label_ar":"أسود"}]',
 '[{"label":"2 DIN"}]',
 true, 'active')
ON CONFLICT (slug) DO NOTHING;

-- 6. Kit entretien
WITH cat AS (SELECT id FROM categories WHERE slug='entretien')
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, details_fr, details_ar, price, compare_at_price, category_id, stock, style_code, colors, sizes, featured, status) VALUES
('kit-entretien-pro', 'Kit Entretien Pro 5 en 1', 'طقم صيانة احترافي 5 في 1',
 'Kit complet pour l''entretien intérieur et extérieur de votre véhicule.',
 'طقم شامل لصيانة السيارة من الداخل والخارج.',
 ARRAY['Shampoing auto 500ml', 'Cire protectrice 250ml', 'Nettoyant tableau de bord', 'Chiffons microfibre ×3', 'Applicateur éponge'],
 ARRAY['شامبو السيارة 500مل', 'شمع واقٍ 250مل', 'منظف لوحة القيادة', 'قماش مايكروفايبر ×3', 'إسفنجة تطبيق'],
 2200, NULL,
 (SELECT id FROM cat), 50, 'KE-006',
 '[]',
 '[]',
 false, 'active')
ON CONFLICT (slug) DO NOTHING;

-- 7. Porte-gobelet
WITH cat AS (SELECT id FROM categories WHERE slug='interieur')
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, details_fr, details_ar, price, compare_at_price, category_id, stock, style_code, colors, sizes, featured, status) VALUES
('porte-gobelet-universel', 'Porte-gobelet Universel', 'حامل أكواب عالمي',
 'Porte-gobelet double extensible pour console centrale ou fenêtre.',
 'حامل أكواب مزدوج قابل للتمديد للكونسول أو النافذة.',
 ARRAY['Universel tous véhicules', 'Rotation 360°', 'Extensible 60-110mm', 'Matière : ABS premium'],
 ARRAY['مناسب لجميع السيارات', 'دوران 360°', 'قابل للتمديد 60-110مم', 'مادة: ABS فاخر'],
 800, NULL,
 (SELECT id FROM cat), 80, 'PG-007',
 '[{"hex":"#1a1a1a","label_fr":"Noir","label_ar":"أسود"},{"hex":"#C0C0C0","label_fr":"Argent","label_ar":"فضي"}]',
 '[]',
 false, 'active')
ON CONFLICT (slug) DO NOTHING;

-- 8. Dashcam
WITH cat AS (SELECT id FROM categories WHERE slug='electronique')
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, details_fr, details_ar, price, compare_at_price, category_id, stock, style_code, colors, sizes, featured, status) VALUES
('dashcam-4k', 'Dashcam 4K Ultra HD', 'كاميرا داش 4K فائقة الدقة',
 'Caméra tableau de bord 4K avec HDR, GPS intégré et mode parking.',
 'كاميرا السيارة 4K مع HDR، GPS مدمج ووضع الركن.',
 ARRAY['Résolution 4K 30fps', 'Grand angle 160°', 'Mode nuit HDR', 'GPS intégré', 'Mode parking', 'Écran 3" IPS'],
 ARRAY['دقة 4K بـ30 إطار/ث', 'زاوية 160°', 'وضع الليل HDR', 'GPS مدمج', 'وضع الركن', 'شاشة 3 بوصة IPS'],
 7500, 9000,
 (SELECT id FROM cat), 15, 'DC-008',
 '[{"hex":"#1a1a1a","label_fr":"Noir","label_ar":"أسود"}]',
 '[]',
 true, 'active')
ON CONFLICT (slug) DO NOTHING;

-- 9. Support téléphone
WITH cat AS (SELECT id FROM categories WHERE slug='accessoires')
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, details_fr, details_ar, price, compare_at_price, category_id, stock, style_code, colors, sizes, featured, status) VALUES
('support-telephone-magnetique', 'Support Téléphone Magnétique', 'حامل هاتف مغناطيسي',
 'Support magnétique puissant pour tableau de bord ou grille d''aération.',
 'حامل مغناطيسي قوي للوحة القيادة أو فتحة التهوية.',
 ARRAY['Aimant N52 ultra-puissant', 'Rotation 360°', '2 modes de fixation', 'Compatible Qi sans fil', 'Universel tous smartphones'],
 ARRAY['مغناطيس N52 فائق القوة', 'دوران 360°', 'وضعان للتثبيت', 'متوافق مع الشحن اللاسلكي Qi', 'مناسب لجميع الهواتف'],
 900, NULL,
 (SELECT id FROM cat), 60, 'ST-009',
 '[{"hex":"#1a1a1a","label_fr":"Noir","label_ar":"أسود"},{"hex":"#C0C0C0","label_fr":"Argent","label_ar":"فضي"}]',
 '[]',
 false, 'active')
ON CONFLICT (slug) DO NOTHING;

-- 10. Coussin lombaire
WITH cat AS (SELECT id FROM categories WHERE slug='interieur')
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, details_fr, details_ar, price, compare_at_price, category_id, stock, style_code, colors, sizes, featured, status) VALUES
('coussin-lombaire-sport', 'Coussin Lombaire Sport', 'وسادة قطنية رياضية',
 'Coussin de soutien lombaire en mémoire de forme pour longs trajets.',
 'وسادة دعم أسفل الظهر بذاكرة الشكل للرحلات الطويلة.',
 ARRAY['Mousse mémoire de forme', 'Housse amovible et lavable', 'Fixation sangles universelles', 'Aide à réduire les douleurs'],
 ARRAY['إسفنج ذاكرة الشكل', 'غطاء قابل للخلع والغسيل', 'تثبيت بأحزمة عالمية', 'يساعد على تقليل آلام الظهر'],
 1500, NULL,
 (SELECT id FROM cat), 35, 'CL-010',
 '[{"hex":"#1a1a1a","label_fr":"Noir","label_ar":"أسود"},{"hex":"#2d4a7a","label_fr":"Bleu","label_ar":"أزرق"},{"hex":"#C41E3A","label_fr":"Rouge","label_ar":"أحمر"}]',
 '[]',
 false, 'active')
ON CONFLICT (slug) DO NOTHING;

-- 11. Housse de siège
WITH cat AS (SELECT id FROM categories WHERE slug='interieur')
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, details_fr, details_ar, price, compare_at_price, category_id, stock, style_code, colors, sizes, featured, status) VALUES
('housses-siege-premium', 'Housses Siège Premium Cuir', 'أغطية مقاعد جلد بريميوم',
 'Jeu complet de housses en similicuir pour 5 places.',
 'طقم كامل من أغطية الجلد الصناعي لـ5 مقاعد.',
 ARRAY['Similicuir haute qualité', 'Jeu complet 5 places', 'Installation en 30 min', 'Imperméable et facile à nettoyer', 'Compatible airbags latéraux'],
 ARRAY['جلد صناعي عالي الجودة', 'طقم كامل لـ5 مقاعد', 'تركيب في 30 دقيقة', 'مقاوم للماء وسهل التنظيف', 'متوافق مع الوسائد الهوائية'],
 8500, 11000,
 (SELECT id FROM cat), 20, 'HS-011',
 '[{"hex":"#1a1a1a","label_fr":"Noir","label_ar":"أسود"},{"hex":"#1a1a1a","label_fr":"Noir/Rouge","label_ar":"أسود/أحمر"},{"hex":"#4a3728","label_fr":"Marron","label_ar":"بني"}]',
 '[{"label":"Universel"}]',
 true, 'active')
ON CONFLICT (slug) DO NOTHING;

-- 12. Organisateur coffre
WITH cat AS (SELECT id FROM categories WHERE slug='accessoires')
INSERT INTO products (slug, name_fr, name_ar, description_fr, description_ar, details_fr, details_ar, price, compare_at_price, category_id, stock, style_code, colors, sizes, featured, status) VALUES
('organisateur-coffre', 'Organisateur Coffre Pliable', 'منظم صندوق السيارة القابل للطي',
 'Organisateur de coffre rigide avec compartiments multiples.',
 'منظم صندوق قوي مع أقسام متعددة.',
 ARRAY['Structure rigide EVA', 'Pliable en secondes', '6 compartiments', 'Poignée de transport', 'Capacité 30L'],
 ARRAY['هيكل EVA صلب', 'قابل للطي في ثوانٍ', '6 أقسام', 'مقبض للحمل', 'سعة 30 لتر'],
 1800, NULL,
 (SELECT id FROM cat), 45, 'OC-012',
 '[{"hex":"#1a1a1a","label_fr":"Noir","label_ar":"أسود"},{"hex":"#2c4a3e","label_fr":"Kaki","label_ar":"كاكي"}]',
 '[]',
 false, 'active')
ON CONFLICT (slug) DO NOTHING;

-- ── Product images (placeholder images from Unsplash) ──────────────────────

-- Using subquery to get product ids by slug for image insertion
INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', p.name_fr, 0
FROM products p WHERE p.slug = 'tapis-sol-premium'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800', p.name_fr, 0
FROM products p WHERE p.slug = 'housse-volant-sport'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800', p.name_fr, 0
FROM products p WHERE p.slug = 'camera-recul-hd'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800', p.name_fr, 0
FROM products p WHERE p.slug = 'barre-led-tout-terrain'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800', p.name_fr, 0
FROM products p WHERE p.slug = 'autoradio-android-10'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1504222490345-c075b7c1f0b7?w=800', p.name_fr, 0
FROM products p WHERE p.slug = 'kit-entretien-pro'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800', p.name_fr, 0
FROM products p WHERE p.slug = 'porte-gobelet-universel'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800', p.name_fr, 0
FROM products p WHERE p.slug = 'dashcam-4k'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', p.name_fr, 0
FROM products p WHERE p.slug = 'support-telephone-magnetique'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1601367487849-3de4dbf47869?w=800', p.name_fr, 0
FROM products p WHERE p.slug = 'coussin-lombaire-sport'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', p.name_fr, 0
FROM products p WHERE p.slug = 'housses-siege-premium'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800', p.name_fr, 0
FROM products p WHERE p.slug = 'organisateur-coffre'
ON CONFLICT DO NOTHING;
