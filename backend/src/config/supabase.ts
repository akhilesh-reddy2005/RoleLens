import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

/**
 * Server-side Supabase client using the service role key.
 * This client bypasses Row Level Security and must never be exposed to the frontend.
 * All queries performed with it must manually scope by the authenticated user id.
 */
export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const RESUME_BUCKET = "resumes";
