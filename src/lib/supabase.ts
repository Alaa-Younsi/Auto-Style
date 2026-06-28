import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

// Using untyped client; explicit types are asserted at each call site
// 5-second timeout so the mock fallback triggers fast when Supabase is unavailable
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, init) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      return fetch(url, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
    },
  },
});
