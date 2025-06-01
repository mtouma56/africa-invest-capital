import { createClient } from '@supabase/supabase-js';

/* global process */
const supabaseUrl =
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL : undefined;
const supabaseAnonKey =
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be provided'
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };
export default supabase;
