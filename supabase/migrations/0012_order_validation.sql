-- Auto Style — Harden place_order before ad launch:
--   * reject empty cart
--   * reject non-positive / non-integer quantities (RPC is open to anon, so this is a real boundary)
--   * reject orders that would oversell stock instead of silently clamping to 0
-- Error messages are prefixed with a stable code so the client can show a
-- specific, translated message instead of a generic "something went wrong".

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
  v_order_id      uuid;
  v_order_number  text;
  v_subtotal      numeric := 0;
  v_shipping      numeric := 400;
  v_delivery_type text;
  v_total         numeric;
  v_item          jsonb;
  v_qty           int;
  v_product       record;
  v_dp            record;
BEGIN
  IF items IS NULL OR jsonb_array_length(items) = 0 THEN
    RAISE EXCEPTION 'ERR_CART_EMPTY: no items in order';
  END IF;

  v_delivery_type := COALESCE(customer->>'delivery_type', 'home');
  v_order_number  := 'AS-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(gen_random_uuid()::text, 1, 5));

  -- Validate items, compute subtotal using server-side prices, and check stock
  FOR v_item IN SELECT * FROM jsonb_array_elements(items)
  LOOP
    v_qty := (v_item->>'quantity')::int;
    IF v_qty IS NULL OR v_qty <= 0 THEN
      RAISE EXCEPTION 'ERR_PRODUCT_UNAVAILABLE: invalid quantity for product %', v_item->>'product_id';
    END IF;

    SELECT id, price, stock, name_fr, name_ar
    INTO v_product
    FROM products
    WHERE id = (v_item->>'product_id')::uuid
      AND status = 'active';

    IF NOT FOUND THEN
      RAISE EXCEPTION 'ERR_PRODUCT_UNAVAILABLE: product not found or inactive: %', v_item->>'product_id';
    END IF;

    IF v_product.stock < v_qty THEN
      RAISE EXCEPTION 'ERR_STOCK: insufficient stock for product %', v_product.name_fr;
    END IF;

    v_subtotal := v_subtotal + v_product.price * v_qty;
  END LOOP;

  -- Lookup wilaya delivery price
  SELECT home_price, office_price, active
  INTO v_dp
  FROM delivery_prices
  WHERE wilaya = customer->>'wilaya';

  IF FOUND THEN
    IF NOT v_dp.active THEN
      RAISE EXCEPTION 'ERR_WILAYA_DISABLED: delivery is currently unavailable for this wilaya: %', customer->>'wilaya';
    END IF;
    IF v_delivery_type = 'office' THEN
      v_shipping := v_dp.office_price;
    ELSE
      v_shipping := v_dp.home_price;
    END IF;
  ELSE
    -- Fallback to store_settings
    SELECT shipping_fee INTO v_shipping FROM store_settings WHERE id = 1;
  END IF;

  v_total := v_subtotal + v_shipping;

  -- Insert order
  INSERT INTO orders (
    order_number, customer_name, customer_phone,
    wilaya, city, address, notes,
    subtotal, shipping, total,
    status, language, delivery_type
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
    COALESCE(customer->>'language', 'fr'),
    v_delivery_type
  )
  RETURNING id INTO v_order_id;

  -- Insert order items with server-side prices and decrement stock
  -- (stock sufficiency was already verified above, so this decrement can't go negative)
  FOR v_item IN SELECT * FROM jsonb_array_elements(items)
  LOOP
    v_qty := (v_item->>'quantity')::int;

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
      v_qty,
      v_item->>'color',
      v_item->>'size',
      v_item->>'image_url'
    );

    UPDATE products
    SET stock = stock - v_qty
    WHERE id = v_product.id;
  END LOOP;

  RETURN v_order_number;
END;
$$;

GRANT EXECUTE ON FUNCTION place_order(jsonb, jsonb) TO anon;

-- ── Guest order lookup ───────────────────────────────────────────────────────
-- The order-confirmation page needs to read back the order a guest just
-- placed. Anon has no SELECT policy on `orders` (that table holds phone
-- numbers/addresses for every customer, so a blanket "anon can read orders"
-- policy would let anyone dump the whole table via the REST API). Instead,
-- expose a single-row lookup by exact order_number through a SECURITY
-- DEFINER function — there is no "list all orders" equivalent for anon.
CREATE OR REPLACE FUNCTION get_order_by_number(p_order_number text)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT jsonb_build_object(
    'id', o.id,
    'order_number', o.order_number,
    'customer_name', o.customer_name,
    'wilaya', o.wilaya,
    'city', o.city,
    'delivery_type', o.delivery_type,
    'subtotal', o.subtotal,
    'shipping', o.shipping,
    'total', o.total,
    'status', o.status,
    'created_at', o.created_at,
    'order_items', COALESCE(
      (SELECT jsonb_agg(jsonb_build_object(
        'id', oi.id,
        'name_fr', oi.name_fr,
        'name_ar', oi.name_ar,
        'price', oi.price,
        'quantity', oi.quantity,
        'color', oi.color,
        'size', oi.size,
        'image_url', oi.image_url
      )) FROM order_items oi WHERE oi.order_id = o.id),
      '[]'::jsonb
    )
  )
  FROM orders o
  WHERE o.order_number = p_order_number;
$$;

GRANT EXECUTE ON FUNCTION get_order_by_number(text) TO anon;
