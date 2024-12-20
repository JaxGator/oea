import { createClient } from "@supabase/supabase-js";
import { Database } from "./types/database";

const supabaseUrl = "https://qegpuqitjfocyyrivlhv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZ3B1cWl0amZvY3l5cml2bGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg5NjQxNDgsImV4cCI6MjAyNDU0MDE0OH0.GzWZqVKqD5zfWGg_7yyoZDyoSaKaIf7j7h_7ZkGcxqg";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);