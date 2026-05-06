import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yzrofltbmouqibmbgyab.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_lcCQfA-kwFJ6wrfG7ujF9A_QbbqjFDI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
