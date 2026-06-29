-- Add video URL column to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url text;

-- Allow admin to delete orders (was missing from 0002_rls.sql)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'orders'
    AND policyname = 'authenticated delete orders'
  ) THEN
    CREATE POLICY "authenticated delete orders"
      ON orders FOR DELETE TO authenticated USING (true);
  END IF;
END $$;
