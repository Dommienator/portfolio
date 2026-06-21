import { createClient } from "@supabase/supabase-js";

// Public client: safe to use in the browser. Can only read data that
// Row Level Security policies (see supabase/schema.sql) allow to the public.
export function getPublicSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Admin client: SERVER-ONLY. Uses the service role key, which bypasses Row
// Level Security entirely. Never import this file from a "use client" component.
export function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
