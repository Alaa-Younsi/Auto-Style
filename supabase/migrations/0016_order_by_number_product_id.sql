-- Expose product_id on order_items returned by get_order_by_number so the
-- storefront can send content_ids in the Meta Pixel Purchase event.
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
        'product_id', oi.product_id,
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
