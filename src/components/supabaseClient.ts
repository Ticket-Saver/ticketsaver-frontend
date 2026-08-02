import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

/**
 * Cliente Supabase. Se inicializa sólo si tenemos URL + anon key en el
 * `.env`. Cuando faltan (caso típico en local dev), exportamos `null` y
 * los consumidores caen a su comportamiento offline / simulado. Antes
 * `createClient('', '')` lanzaba `supabaseUrl is required` durante el
 * primer import y rompía toda la app.
 */
const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

if (!supabase && import.meta.env.DEV) {
  console.warn(
    '[supabaseClient] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY no configuradas — corriendo en modo offline.'
  )
}

export default supabase
