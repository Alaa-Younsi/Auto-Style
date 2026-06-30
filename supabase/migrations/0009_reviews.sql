-- Auto Style — Client reviews

CREATE TABLE IF NOT EXISTS client_reviews (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  stars       integer NOT NULL CHECK (stars BETWEEN 1 AND 5),
  review_text text NOT NULL,
  image_url   text,
  active      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE client_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read active reviews"
  ON client_reviews FOR SELECT TO anon, authenticated
  USING (active = true);

CREATE POLICY "authenticated read all reviews"
  ON client_reviews FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated manage reviews"
  ON client_reviews FOR ALL TO authenticated USING (true) WITH CHECK (true);
