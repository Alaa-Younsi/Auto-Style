import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

// Using untyped client; explicit types are asserted at each call site
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
