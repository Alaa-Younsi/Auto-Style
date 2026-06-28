-- Auto Style — Row Level Security

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- ── Public read ──────────────────────────────────────────────────────────────

CREATE POLICY "public read categories"
  ON categories FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public read active products"
  ON products FOR SELECT TO anon
  USING (status = 'active');

CREATE POLICY "authenticated read all products"
  ON products FOR SELECT TO authenticated USING (true);

CREATE POLICY "public read product images"
  ON product_images FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public read store settings"
  ON store_settings FOR SELECT TO anon, authenticated USING (true);

-- ── Authenticated full access (owner) ────────────────────────────────────────

CREATE POLICY "authenticated manage categories"
  ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated manage products"
  ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated manage product images"
  ON product_images FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated read orders"
  ON orders FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated update orders"
  ON orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated read order items"
  ON order_items FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated manage settings"
  ON store_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── Storage bucket ────────────────────────────────────────────────────────────
-- Run this in Supabase Dashboard → Storage → Policies, or via SQL editor:
-- CREATE BUCKET product-images (public = true);
-- For now we just note the policy intent; bucket creation is done via the dashboard.
