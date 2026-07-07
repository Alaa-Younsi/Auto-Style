export interface Category {
  id: string;
  slug: string;
  name_fr: string;
  name_ar: string;
  description_fr: string | null;
  description_ar: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProductColor {
  label_fr: string;
  label_ar: string;
  hex: string;
}

export interface ProductSize {
  label: string;
}

export interface Product {
  id: string;
  slug: string;
  name_fr: string;
  name_ar: string;
  description_fr: string | null;
  description_ar: string | null;
  details_fr: string[];
  details_ar: string[];
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  stock: number;
  style_code: string | null;
  colors: ProductColor[];
  sizes: ProductSize[];
  featured: boolean;
  status: "active" | "draft";
  video_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
}

export interface ProductWithImages extends Product {
  product_images: ProductImage[];
  categories: Category | null;
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  wilaya: string;
  city: string;
  address: string | null;
  notes: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  language: string;
  delivery_type: DeliveryType;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  name_fr: string;
  name_ar: string;
  price: number;
  quantity: number;
  color: string | null;
  size: string | null;
  image_url: string | null;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

/** Shape returned by the `get_order_by_number` RPC — the guest-facing
 * subset of an order (no phone/address/notes), keyed to a known order_number. */
export interface GuestOrder {
  id: string;
  order_number: string;
  customer_name: string;
  wilaya: string;
  city: string;
  delivery_type: DeliveryType;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  created_at: string;
  order_items: Pick<OrderItem, "id" | "name_fr" | "name_ar" | "price" | "quantity" | "color" | "size" | "image_url">[];
}

export interface StoreSettings {
  id: number;
  shipping_fee: number;
  free_ship_threshold: number;
}

export type DeliveryType = "home" | "office";

export interface DeliveryPrice {
  id: string;
  wilaya: string;
  home_price: number;
  office_price: number;
  active: boolean;
  updated_at: string;
}

export interface ClientReview {
  id: string;
  client_name: string;
  stars: number;
  review_text: string;
  image_url: string | null;
  active: boolean;
  created_at: string;
}
