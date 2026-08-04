import { createClient } from '@supabase/supabase-js'

let rawUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co').trim()
const supabaseAnonKey = (process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder').trim()

// Garante que a URL tem https:// caso o usuário tenha esquecido na hora de copiar
if (!rawUrl.startsWith('http')) {
  rawUrl = `https://${rawUrl}`
}

// Remove /rest/v1/ do final ou barras extras (a biblioteca do Supabase já adiciona isso automaticamente)
rawUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')

export const supabase = createClient(rawUrl, supabaseAnonKey)
