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
  address: string;
  notes: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  language: string;
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

export interface StoreSettings {
  id: number;
  shipping_fee: number;
  free_ship_threshold: number;
}
