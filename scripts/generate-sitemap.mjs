import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Run with `bun run scripts/generate-sitemap.mjs` — Bun loads .env automatically.
const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE_URL = "https://auto-style.shop";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const staticRoutes = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/shop", changefreq: "daily", priority: "0.9" },
];

function urlEntry(loc, changefreq, priority) {
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

async function main() {
  const entries = staticRoutes.map((r) => urlEntry(`${SITE_URL}${r.path}`, r.changefreq, r.priority));

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from("products")
      .select("slug")
      .eq("status", "active");

    if (error) {
      console.warn("Sitemap: could not fetch products, falling back to static routes only.", error.message);
    } else {
      for (const { slug } of data ?? []) {
        entries.push(urlEntry(`${SITE_URL}/product/${slug}`, "weekly", "0.8"));
      }
    }
  } else {
    console.warn("Sitemap: Supabase env vars missing, generating static routes only.");
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;

  const outPath = resolve(__dirname, "../public/sitemap.xml");
  writeFileSync(outPath, xml, "utf-8");
  console.log(`Sitemap written to ${outPath} (${entries.length} URLs)`);
}

main();
