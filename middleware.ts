import { next } from "@vercel/edge";

export const config = {
  matcher: "/product/:slug*",
};

const SITE_URL = "https://auto-style.shop";
const SITE_NAME = "Auto Style";
const FALLBACK_IMAGE = `${SITE_URL}/og-image.png`;

// Social scrapers do not execute JS, so on this SPA every shared /product/:slug link
// would otherwise preview as the generic homepage card from index.html. This serves
// those user-agents a small standalone document carrying the real product's tags.
// Real browsers fall straight through to the app untouched.
const CRAWLER_UA =
  /facebookexternalhit|facebookcatalog|WhatsApp|Instagram|Twitterbot|TelegramBot|Discordbot|LinkedInBot|Slackbot|Pinterest|SkypeUriPreview|redditbot|Googlebot|bingbot|Applebot|vkShare|W3C_Validator|Embedly|Iframely/i;

interface ProductImageRow {
  url: string;
  sort_order: number;
}

interface ProductRow {
  slug: string;
  name_fr: string;
  name_ar: string | null;
  description_fr: string | null;
  description_ar: string | null;
  price: number;
  stock: number;
  product_images: ProductImageRow[];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function truncate(value: string, max = 200): string {
  const collapsed = value.replace(/\s+/g, " ").trim();
  return collapsed.length <= max ? collapsed : `${collapsed.slice(0, max - 1).trimEnd()}…`;
}

function renderPreview(product: ProductRow, canonical: string): string {
  const name = product.name_fr || product.name_ar || SITE_NAME;
  const title = `${name} — ${SITE_NAME}`;
  const description = truncate(
    product.description_fr ||
      product.description_ar ||
      "Accessoires automobiles premium. Livraison dans les 69 wilayas d'Algérie, paiement à la livraison.",
  );
  const image =
    [...(product.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order)[0]?.url ??
    FALLBACK_IMAGE;
  const availability = product.stock > 0 ? "in stock" : "out of stock";

  const e = escapeHtml;
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<title>${e(title)}</title>
<meta name="description" content="${e(description)}" />
<link rel="canonical" href="${e(canonical)}" />
<meta property="og:type" content="product" />
<meta property="og:site_name" content="${e(SITE_NAME)}" />
<meta property="og:title" content="${e(title)}" />
<meta property="og:description" content="${e(description)}" />
<meta property="og:url" content="${e(canonical)}" />
<meta property="og:image" content="${e(image)}" />
<meta property="og:image:alt" content="${e(name)}" />
<meta property="og:locale" content="fr_FR" />
<meta property="og:locale:alternate" content="ar_DZ" />
<meta property="product:price:amount" content="${product.price}" />
<meta property="product:price:currency" content="DZD" />
<meta property="product:availability" content="${availability}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${e(title)}" />
<meta name="twitter:description" content="${e(description)}" />
<meta name="twitter:image" content="${e(image)}" />
</head>
<body><a href="${e(canonical)}">${e(title)}</a></body>
</html>`;
}

export default async function middleware(request: Request) {
  const userAgent = request.headers.get("user-agent") ?? "";
  if (!CRAWLER_UA.test(userAgent)) return next();

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  // Without env vars the crawler just gets the generic index.html card — the same
  // result as before this middleware existed, which is the right way to fail.
  if (!supabaseUrl || !supabaseAnonKey) return next();

  const url = new URL(request.url);
  const slug = url.pathname.replace(/^\/product\//, "").replace(/\/+$/, "");
  if (!slug || slug.includes("/")) return next();

  try {
    const query = new URLSearchParams({
      slug: `eq.${slug}`,
      status: "eq.active",
      select:
        "slug,name_fr,name_ar,description_fr,description_ar,price,stock,product_images(url,sort_order)",
      limit: "1",
    });
    const response = await fetch(`${supabaseUrl}/rest/v1/products?${query}`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        Accept: "application/json",
      },
    });
    if (!response.ok) return next();

    const rows = (await response.json()) as ProductRow[];
    const product = rows[0];
    if (!product) return next();

    return new Response(renderPreview(product, `${SITE_URL}/product/${product.slug}`), {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, s-maxage=600, stale-while-revalidate=86400",
      },
    });
  } catch {
    // A crawler is never worth a 500.
    return next();
  }
}
