import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/database.types";

export type CartItemRow = Tables<"cart_items">;

export const cartService = {
  /** Get all cart items for a user, joined with product data */
  async list(userId: string) {
    const { data, error } = await supabase
      .from("cart_items")
      .select("*, products(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data as (CartItemRow & { products: Tables<"products"> })[];
  },

  /** Add an item to cart (or increment quantity if already exists) */
  async upsert(userId: string, productId: string, vendorId: string, quantity: number = 1) {
    // Check if item already exists
    const { data: existing } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .single();

    if (existing) {
      return this.updateQuantity(existing.id, existing.quantity + quantity);
    }

    const { data, error } = await supabase
      .from("cart_items")
      .insert({ user_id: userId, product_id: productId, vendor_id: vendorId, quantity })
      .select()
      .single();
    if (error) throw error;
    return data as CartItemRow;
  },

  /** Update quantity for a specific cart item */
  async updateQuantity(cartItemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.remove(cartItemId);
    }
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq("id", cartItemId)
      .select()
      .single();
    if (error) throw error;
    return data as CartItemRow;
  },

  /** Remove an item from cart */
  async remove(cartItemId: string) {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId);
    if (error) throw error;
  },

  /** Clear entire cart for a user */
  async clear(userId: string) {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId);
    if (error) throw error;
  },

  /** Get cart item count for a user */
  async getCount(userId: string) {
    const { count, error } = await supabase
      .from("cart_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    if (error) throw error;
    return count ?? 0;
  },
};