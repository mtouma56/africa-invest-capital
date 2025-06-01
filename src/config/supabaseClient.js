import { createClient } from '@supabase/supabase-js';

// Utilisation des variables NEXT_PUBLIC côté client uniquement
let supabase = null;

if (typeof window !== 'undefined') {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
export default supabase;
