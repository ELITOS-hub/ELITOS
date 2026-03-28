import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Using the same Supabase project as backend database
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://egxygpfgntowlqttjtuu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVneHlncGZnbnRvd2xxdHRqdHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2Nzg5MzUsImV4cCI6MjA5MDI1NDkzNX0.3d0uF2y-egO1-MECta84K8BUi9PzDdKzpplWOckADzI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is properly configured (needs anon key for Google OAuth)
export const isSupabaseConfigured = () => {
  return supabaseAnonKey !== '' && supabaseAnonKey !== 'your-anon-key' && supabaseAnonKey !== 'your-anon-key-from-supabase-dashboard';
};
