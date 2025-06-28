import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Ce message apparaîtra seulement dans le navigateur
if (typeof window !== 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
  console.error(
    'Supabase credentials are missing. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.'
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };
export default supabase;
