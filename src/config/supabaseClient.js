/* global process */
import { createClient } from '@supabase/supabase-js';

// Récupération des variables d'environnement en tenant compte
// d'une éventuelle absence de l'objet process côté navigateur
let supabaseUrl;
let supabaseAnonKey;

if (typeof process !== 'undefined') {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
} else if (typeof import.meta !== 'undefined') {
  supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
  supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export { supabase };
export default supabase;
