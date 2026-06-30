-- Auto Style — Delivery prices per wilaya + delivery type on orders

-- Add delivery_type to orders
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS delivery_type text NOT NULL DEFAULT 'home'
  CHECK (delivery_type IN ('home', 'office'));

-- Delivery prices table (one row per wilaya)
CREATE TABLE IF NOT EXISTS delivery_prices (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wilaya      text UNIQUE NOT NULL,
  home_price  numeric(10,2) NOT NULL DEFAULT 400,
  office_price numeric(10,2) NOT NULL DEFAULT 400,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE delivery_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read delivery prices"
  ON delivery_prices FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "authenticated manage delivery prices"
  ON delivery_prices FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger to keep updated_at fresh
CREATE OR REPLACE FUNCTION update_delivery_prices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delivery_prices_updated_at
  BEFORE UPDATE ON delivery_prices
  FOR EACH ROW EXECUTE FUNCTION update_delivery_prices_updated_at();

-- Seed all 69 wilayas at 400 DA default
INSERT INTO delivery_prices (wilaya, home_price, office_price) VALUES
  ('01 - Adrar', 400, 400),
  ('02 - Chlef', 400, 400),
  ('03 - Laghouat', 400, 400),
  ('04 - Oum El Bouaghi', 400, 400),
  ('05 - Batna', 400, 400),
  ('06 - Béjaïa', 400, 400),
  ('07 - Biskra', 400, 400),
  ('08 - Béchar', 400, 400),
  ('09 - Blida', 400, 400),
  ('10 - Bouira', 400, 400),
  ('11 - Tamanrasset', 400, 400),
  ('12 - Tébessa', 400, 400),
  ('13 - Tlemcen', 400, 400),
  ('14 - Tiaret', 400, 400),
  ('15 - Tizi Ouzou', 400, 400),
  ('16 - Alger', 400, 400),
  ('17 - Djelfa', 400, 400),
  ('18 - Jijel', 400, 400),
  ('19 - Sétif', 400, 400),
  ('20 - Saïda', 400, 400),
  ('21 - Skikda', 400, 400),
  ('22 - Sidi Bel Abbès', 400, 400),
  ('23 - Annaba', 400, 400),
  ('24 - Guelma', 400, 400),
  ('25 - Constantine', 400, 400),
  ('26 - Médéa', 400, 400),
  ('27 - Mostaganem', 400, 400),
  ('28 - M''Sila', 400, 400),
  ('29 - Mascara', 400, 400),
  ('30 - Ouargla', 400, 400),
  ('31 - Oran', 400, 400),
  ('32 - El Bayadh', 400, 400),
  ('33 - Illizi', 400, 400),
  ('34 - Bordj Bou Arréridj', 400, 400),
  ('35 - Boumerdès', 400, 400),
  ('36 - El Tarf', 400, 400),
  ('37 - Tindouf', 400, 400),
  ('38 - Tissemsilt', 400, 400),
  ('39 - El Oued', 400, 400),
  ('40 - Khenchela', 400, 400),
  ('41 - Souk Ahras', 400, 400),
  ('42 - Tipaza', 400, 400),
  ('43 - Mila', 400, 400),
  ('44 - Aïn Defla', 400, 400),
  ('45 - Naâma', 400, 400),
  ('46 - Aïn Témouchent', 400, 400),
  ('47 - Ghardaïa', 400, 400),
  ('48 - Relizane', 400, 400),
  ('49 - Timimoun', 400, 400),
  ('50 - Bordj Badji Mokhtar', 400, 400),
  ('51 - Ouled Djellal', 400, 400),
  ('52 - Béni Abbès', 400, 400),
  ('53 - In Salah', 400, 400),
  ('54 - In Guezzam', 400, 400),
  ('55 - Touggourt', 400, 400),
  ('56 - Djanet', 400, 400),
  ('57 - El M''Ghair', 400, 400),
  ('58 - El Meniaa', 400, 400),
  ('59 - Aflou', 400, 400),
  ('60 - El Abiodh Sidi Cheikh', 400, 400),
  ('61 - El Aricha', 400, 400),
  ('62 - El Kantara', 400, 400),
  ('63 - Barika', 400, 400),
  ('64 - Boussaâda', 400, 400),
  ('65 - Bir El Ater', 400, 400),
  ('66 - Ksar El Boukhari', 400, 400),
  ('67 - Ksar Chellala', 400, 400),
  ('68 - Aïn Oussara', 400, 400),
  ('69 - Messaad', 400, 400)
ON CONFLICT (wilaya) DO NOTHING;
