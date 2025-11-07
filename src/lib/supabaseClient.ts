import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ffefusbzuazaubxlmdxi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmZWZ1c2J6dWF6YXVieGxtZHhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNjM1OTYsImV4cCI6MjA3NzkzOTU5Nn0.3eByWFWZZAfSzH0nNJTXmNw-j-jBkS8tfPceLYW-ZN8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
