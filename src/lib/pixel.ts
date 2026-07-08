declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type PixelParams = Record<string, string | number | string[] | undefined>;

function track(event: string, params?: PixelParams, eventId?: string) {
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
