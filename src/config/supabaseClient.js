/* global process */
import { createClient } from '@supabase/supabase-js';

// Utilisation des variables NEXT_PUBLIC côté client uniquement
let supabase = null;

if (typeof window !== 'undefined') {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
}

export { supabase };
export default supabase;
