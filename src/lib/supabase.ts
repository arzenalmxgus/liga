import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rmqnjokcddotmhwhjuqq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtcW5qb2tjZGRvdG1od2hqdXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4NTAyOTAsImV4cCI6MjA0OTQyNjI5MH0.t5jodBGwOEmijxO8e6Oofd6fuTHRLHjm8E7gjbiq4WA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)