import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hshhdjlhfqegmdzdezwa.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzaGhkamxoZnFlZ21kemRlendhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNjc4ODMsImV4cCI6MjA4ODk0Mzg4M30.aqKrJqRl-zG4I625sSwHwsln3VEb9AzaI3oyH9mbleA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
