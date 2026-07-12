import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// If the env vars aren't set yet (e.g. testing locally before Supabase is wired up),
// export null instead of throwing, so the rest of the app can still render.
export const supabase = url && key ? createClient(url, key) : null;
