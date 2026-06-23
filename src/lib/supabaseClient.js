import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured = !!(supabaseUrl && supabaseAnonKey)

if (!isConfigured) {
  console.warn("Supabase credentials are missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.")
}

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => { 
          return { error: { message: "Supabase environment variables are missing. Please add them in Vercel settings." } }
        },
        signUp: async () => { 
          return { error: { message: "Supabase environment variables are missing. Please add them in Vercel settings." } }
        },
        signOut: async () => {}
      }
    }
