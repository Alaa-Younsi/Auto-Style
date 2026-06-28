-- Auto Style — place_order function (SECURITY DEFINER so anon can call it)
-- Recomputes all line prices server-side; never trusts client-sent prices.

CREATE OR REPLACE FUNCTION place_order(
  items jsonb,
  customer jsonb
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id uuid;
  v_order_number text;
  v_subtotal numeric := 0;
  v_shipping numeric;
  v_free_threshold numeric;
  v_total numeric;
  v_item jsonb;
  v_product record;
  v_line_price numeric;
BEGIN
  -- Load shipping settings
  SELECT shipping_fee, free_ship_threshold
  INTO v_shipping, v_free_threshold
  FROM store_settings
  WHERE id = 1;

  -- Generate order number: AS-YYYYMMDD-XXXXX
  v_order_number := 'AS-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(gen_random_uuid()::text, 1, 5));

  -- Compute subtotal using server-side prices
  FOR v_item IN SELECT * FROM jsonb_array_elements(items)
  LOOP
    SELECT id, price, stock, name_fr, name_ar
    INTO v_product
    FROM products
    WHERE id = (v_item->>'product_id')::uuid
      AND status = 'active';

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product not found: %', v_item->>'product_id';
    END IF;

    v_line_price := v_product.price * (v_item->>'quantity')::int;
    v_subtotal := v_subtotal + v_line_price;
  END LOOP;

  -- Apply shipping
  IF v_subtotal >= v_free_threshold THEN
    v_shipping := 0;
  END IF;
  v_total := v_subtotal + v_shipping;

  -- Insert order
  INSERT INTO orders (
    order_number, customer_name, customer_phone,
    wilaya, city, address, notes,
    subtotal, shipping, total,
    status, language
  ) VALUES (
    v_order_number,
    customer->>'customer_name',
    customer->>'customer_phone',
    customer->>'wilaya',
    customer->>'city',
    customer->>'address',
    customer->>'notes',
    v_subtotal, v_shipping, v_total,
    'pending',
    COALESCE(customer->>'language', 'fr')
  )
  RETURNING id INTO v_order_id;

  -- Insert order items with server-side prices
  FOR v_item IN SELECT * FROM jsonb_array_elements(items)
  LOOP
    SELECT id, price, name_fr, name_ar
    INTO v_product
    FROM products
    WHERE id = (v_item->>'product_id')::uuid;

    INSERT INTO order_items (
      order_id, product_id,
      name_fr, name_ar,
      price, quantity,
      color, size, image_url
    ) VALUES (
      v_order_id,
      v_product.id,
      v_product.name_fr,
      v_product.name_ar,
      v_product.price,
      (v_item->>'quantity')::int,
      v_item->>'color',
      v_item->>'size',
      v_item->>'image_url'
    );

    -- Decrement stock
    UPDATE products
    SET stock = GREATEST(0, stock - (v_item->>'quantity')::int)
    WHERE id = v_product.id;
  END LOOP;

  RETURN v_order_number;
END;
$$;

-- Allow anon role to call place_order
GRANT EXECUTE ON FUNCTION place_order(jsonb, jsonb) TO anon;
