declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type PixelParams = Record<string, string | number | string[] | undefined>;

function track(event: string, params?: PixelParams) {
  window.fbq?.("track", event, params);
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

export function trackPurchase(params: PixelParams) {
  track("Purchase", params);
}
