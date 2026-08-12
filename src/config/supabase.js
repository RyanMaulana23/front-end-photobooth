import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://qwbybpyffkrucmzvwls.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3YnlicHlmZmtydWNtenZ3bHMiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc4NDM2OTYxMSwiZXhwIjoyMTAwOTQ1NjExfQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
