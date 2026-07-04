import type { TranslationKey } from "@/i18n/translations";

/** Maps a `place_order` RPC error (prefixed with a stable ERR_ code, see
 * supabase/migrations/0012_order_validation.sql) to a translation key. */
export function orderErrorKey(message: string | undefined): TranslationKey {
  if (!message) return "checkout_error_generic";
  if (message.includes("ERR_CART_EMPTY")) return "checkout_error_cart_empty";
  if (message.includes("ERR_STOCK")) return "checkout_error_stock";
  if (message.includes("ERR_WILAYA_DISABLED")) return "checkout_error_wilaya_disabled";
  if (message.includes("ERR_PRODUCT_UNAVAILABLE")) return "checkout_error_product_unavailable";
  return "checkout_error_generic";
}
