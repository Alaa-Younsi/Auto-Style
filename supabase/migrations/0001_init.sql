-- Auto Style — Initial Schema

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_fr text NOT NULL,
  name_ar text NOT NULL,
  description_fr text,
  description_ar text,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_fr text NOT NULL,
  name_ar text NOT NULL,
  description_fr text,
  description_ar text,
  details_fr text[] NOT NULL DEFAULT '{}',
  details_ar text[] NOT NULL DEFAULT '{}',
  price numeric(10,2) NOT NULL,
  compare_at_price numeric(10,2),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  stock integer NOT NULL DEFAULT 0,
  style_code text,
  colors jsonb NOT NULL DEFAULT '[]',
  sizes jsonb NOT NULL DEFAULT '[]',
  featured boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Product images
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt text,
  sort_order integer NOT NULL DEFAULT 0
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  wilaya text NOT NULL,
  city text NOT NULL,
  address text NOT NULL,
  notes text,
  subtotal numeric(10,2) NOT NULL,
  shipping numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
  language text NOT NULL DEFAULT 'fr',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Order items (prices/names snapshotted at purchase)
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  name_fr text NOT NULL,
  name_ar text NOT NULL,
  price numeric(10,2) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  color text,
  size text,
  image_url text
);

-- Store settings (singleton row — id=1)
CREATE TABLE IF NOT EXISTS store_settings (
  id integer PRIMARY KEY DEFAULT 1,
  shipping_fee numeric(10,2) NOT NULL DEFAULT 500,
  free_ship_threshold numeric(10,2) NOT NULL DEFAULT 5000
);

INSERT INTO store_settings (id, shipping_fee, free_ship_threshold)
VALUES (1, 500, 5000)
ON CONFLICT (id) DO NOTHING;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
