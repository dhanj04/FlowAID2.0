import { createClient } from '@supabase/supabase-js';

// Use default values for development if environment variables are not set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdnZra3Brem95eWJsYnR0c3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA5NTg4MDcsImV4cCI6MTk5NjUzNDgwN30.KbcLj4GGFKhJCS8Gg5xsT3CpWfQRUpYJhSn6a222VJM';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
