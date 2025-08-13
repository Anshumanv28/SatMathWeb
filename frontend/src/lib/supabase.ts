import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://glppwlmcgyrwzqwukryw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdscHB3bG1jZ3lyd3pxd3Vrcnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMTE3NjAsImV4cCI6MjA2ODY4Nzc2MH0.30lgB48oqd7QaITJZjKHXCmBUnpGv0e6PHdbCbOBq5Q';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth types
export interface AuthState {
  user: any | null;
  loading: boolean;
} 