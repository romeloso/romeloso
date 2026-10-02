import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase preparado para sync en la nube.
 * El MVP usa localStorage; cuando existan VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY,
 * este módulo podrá usarse desde repositorios remotos.
 */
export function createSupabaseClient(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

  if (!url || !anonKey) {
    return null
  }

  return createClient(url, anonKey)
}

export const supabase = createSupabaseClient()
