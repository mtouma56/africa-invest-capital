import { createClient } from '@supabase/supabase-js';

// Vite n'expose que les variables préfixées par `envPrefix`. On utilise
// `NEXT_PUBLIC_` pour rester cohérent avec l'ancienne configuration, d'où
// l'ajout de ce préfixe dans `vite.config.js`.
const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase credentials are missing. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.'
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };
export default supabase;
