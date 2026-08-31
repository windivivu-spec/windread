export function supabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export function requiredSupabasePublicConfig() {
  const config = supabasePublicConfig();
  if (!config) {
    throw new Error("Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc Supabase publishable key.");
  }
  return config;
}
