import { createBrowserClient } from "@supabase/ssr";
import { requiredSupabasePublicConfig } from "./env";

export function createClient() {
  const { url, key } = requiredSupabasePublicConfig();
  return createBrowserClient(url, key);
}
