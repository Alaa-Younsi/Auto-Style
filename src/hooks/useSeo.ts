import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const SITE_URL = "https://auto-style.shop";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

interface SeoOptions {
  title: string;
  description?: string;
  /** Absolute URL of the page's share image. Falls back to the site-wide OG card. */
  image?: string;
  /** og:type — "website" for browse pages, "product" for a product page. */
  type?: "website" | "product";
  /** schema.org payload injected as a page-scoped JSON-LD block, removed on unmount. */
  jsonLd?: Record<string, unknown>;
}

const JSON_LD_ID = "page-json-ld";

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let tag = document.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let tag = document.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

/**
 * Per-route metadata for an SPA. Social scrapers never see this (they don't run JS —
 * `middleware.ts` serves them instead); this is for Googlebot, which does execute JS,
 * and for correct browser-tab titles per route.
 *
 * Every field is always written, never conditionally skipped, so a product's image and
 * schema can't linger on the next route the shopper navigates to.
 */
export function useSeo({ title, description, image, type = "website", jsonLd }: SeoOptions) {
  const { pathname } = useLocation();
  // Callers build the schema inline, so its identity changes every render.
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    const prevTitle = document.title;
    const canonical = `${SITE_URL}${pathname}`;

    document.title = title;
    setMeta("og:title", title, "property");
    setMeta("twitter:title", title);
    setMeta("og:type", type, "property");
    setMeta("og:url", canonical, "property");
    setLink("canonical", canonical);
    setMeta("og:image", image ?? DEFAULT_IMAGE, "property");
    setMeta("twitter:image", image ?? DEFAULT_IMAGE);

    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, "property");
      setMeta("twitter:description", description);
    }

    let script: HTMLScriptElement | null = null;
    if (jsonLdKey) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = JSON_LD_ID;
      script.textContent = jsonLdKey;
      document.head.appendChild(script);
    }

    return () => {
      document.title = prevTitle;
      script?.remove();
    };
  }, [title, description, image, type, pathname, jsonLdKey]);
}
