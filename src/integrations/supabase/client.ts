import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const SUPABASE_URL = "https://hyhyukynznovttyfypjb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5aHl1a3luem5vdnR0eWZ5cGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzODU2NTksImV4cCI6MjEwMDk2MTY1OX0.f_fPdJC6IMq3zt9zJaufOtDD4TaLjXIN8J2bvtTamj4";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);