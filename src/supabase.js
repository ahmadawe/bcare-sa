import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yzrofltbmouqibmbgyab.supabase.co'
const supabaseAnonKey = 'sb_publishable_lcCQfA-kwFJ6wrfG7ujF9A_QbbqjFDI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
