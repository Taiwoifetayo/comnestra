import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/database.types";

export type ProductRow = Tables<"products">;
export type ReviewRow = Tables<"reviews">;
export type StockMovementRow = Tables<"stock_movements">;

export const productsService = {
  /** Fetch all active products with optional category filter */
  async list(category?: string, searchQuery?: string) {
    let query = supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }
    if (searchQuery) {
      query = query.or(
        `name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as ProductRow[];
  },

  /** Get a single product by ID */
  async getById(id: string) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data as ProductRow;
  },

  /** Get a single product by slug */
  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data as ProductRow;
  },

  /** Create a new product (vendor only) */
  async create(product: TablesInsert<"products">) {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();
    if (error) throw error;
    return data as ProductRow;
  },

  /** Update an existing product */
  async update(id: string, updates: TablesUpdate<"products">) {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as ProductRow;
  },

  /** Soft-delete (deactivate) a product */
  async deactivate(id: string) {
    return this.update(id, { is_active: false });
  },

  /** Get all products for a specific vendor */
  async listByVendor(vendorId: string) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as ProductRow[];
  },

  /** Get distinct categories from active products */
  async getCategories() {
    const { data, error } = await supabase
      .from("products")
      .select("category")
      .eq("is_active", true)
      .order("category");
    if (error) throw error;
    return [...new Set(data.map((p) => p.category))];
  },

  /** Increment view count for a product */
  async incrementView(id: string) {
    const { error } = await supabase.rpc("increment_view_count" as any, {
      product_id: id,
    });
    if (error) throw error;
  },

  /* ── Reviews ── */
  async getReviews(productId: string) {
    const { data, error } = await supabase
      .from("reviews")
      .select("*, profiles:user_id(full_name, avatar_url)")
      .eq("product_id", productId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async createReview(review: TablesInsert<"reviews">) {
    const { data, error } = await supabase
      .from("reviews")
      .insert(review)
      .select()
      .single();
    if (error) throw error;
    return data as ReviewRow;
  },

  /* ── Stock Movements ── */
  async getStockMovements(productId: string) {
    const { data, error } = await supabase
      .from("stock_movements")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as StockMovementRow[];
  },

  async recordStockMovement(movement: TablesInsert<"stock_movements">) {
    const { data, error } = await supabase
      .from("stock_movements")
      .insert(movement)
      .select()
      .single();
    if (error) throw error;
    return data as StockMovementRow;
  },
};