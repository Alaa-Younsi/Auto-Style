import { useRef } from "react";

/**
 * Bot-repellent for public forms: a hidden field real users never see/fill,
 * plus a minimum time-to-submit check (scripted bots tend to submit near-instantly).
 * Server-side (place_order RPC) remains the authoritative guard against direct API abuse.
 */
export function useHoneypot() {
  const mountedAt = useRef(Date.now());

  const isSpam = (honeypotValue: string | undefined) =>
    !!honeypotValue || Date.now() - mountedAt.current < 1500;

  return { isSpam };
}
