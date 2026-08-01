import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/database.types";

export type AuthProfile = Tables<"profiles">;
export type UserRole = "buyer" | "vendor" | "admin";

export const authService = {
  async signUp(email: string, password: string, fullName: string) {
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) throw authError;
    if (!authData.user) throw new Error("Sign-up failed: no user returned");

    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      full_name: fullName,
      role: "buyer",
    });
    if (profileError) throw profileError;

    return authData;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /** Get the current session (null if not authenticated) */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /** Subscribe to auth state changes. Returns unsubscribe function. */
  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return data.subscription.unsubscribe;
  },

  /** Get the current user's profile from the `profiles` table */
  async getProfile(userId: string): Promise<AuthProfile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) {
      if (error.code === "PGRST116") return null; // not found
      throw error;
    }
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Pick<AuthProfile, "full_name" | "avatar_url" | "phone" | "city" | "country" | "preferred_currency">>) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};