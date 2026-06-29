-- Storage bucket policies for product-images
-- Run this in: Supabase Dashboard → SQL Editor

-- Allow authenticated users (admin) to upload files
CREATE POLICY "admin upload product images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to overwrite / update files
CREATE POLICY "admin update product images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to delete files
CREATE POLICY "admin delete product images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images');

-- Public read for everyone (anon + authenticated)
CREATE POLICY "public read product images storage"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'product-images');
