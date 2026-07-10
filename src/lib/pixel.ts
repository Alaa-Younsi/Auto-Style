declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type PixelParams = Record<string, string | number | string[] | undefined>;

// Commerce events are worthless (and pollute Meta's Diagnostics) if `value` isn't
// a real positive number — e.g. price data that hasn't loaded yet resolving to
// undefined/NaN. Better to silently skip the event than send garbage.
function hasValidValue(params?: PixelParams): boolean {
  if (!params || !("value" in params)) return true;
  const value = params.value;
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function track(event: string, params?: PixelParams, eventId?: string) {
  if (!hasValidValue(params)) {
    if (import.meta.env.DEV) {
      console.warn(`[pixel] Skipped "${event}" — invalid or missing value`, params);
    }
    return;
  }
  if (eventId) {
    window.fbq?.("track", event, params, { eventID: eventId });
  } else {
    window.fbq?.("track", event, params);
  }
}

export function trackPageView() {
  window.fbq?.("track", "PageView");
}

export function trackViewContent(params: PixelParams) {
  track("ViewContent", params);
}

export function trackAddToCart(params: PixelParams) {
  track("AddToCart", params);
}

export function trackInitiateCheckout(params: PixelParams) {
  track("InitiateCheckout", params);
}

// eventId should be a stable unique identifier for the order (e.g. its id)
// so a future server-side Conversions API Purchase event can be deduplicated
// against this browser-side one instead of double-counting.
export function trackPurchase(params: PixelParams, eventId: string) {
  track("Purchase", params, eventId);
}
