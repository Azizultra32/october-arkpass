import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gqahazcatpgzzfujnidk.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_S8OZykoIt9RnHjqW8Kt4vg_1qOj_4w8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
