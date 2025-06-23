import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ecbccmbgvbdybpqlrxor.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjYmNjbWJndmJkeWJwcWxyeG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MjI3NTMsImV4cCI6MjA2NjA5ODc1M30.xcw9ooGr1EWw_6u1JkEMuxIRtCLNtpt0b3Q1xmVfF9o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
