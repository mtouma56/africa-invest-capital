import { createClient } from '@supabase/supabase-js';

// Next.js exposes public env vars with the NEXT_PUBLIC_ prefix
const supabaseUrl =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase credentials are missing. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.'
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };
export default supabase;
