import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/database.types";

export type VendorRow = Tables<"vendors">;

export const sellerService = {
  /** Get vendor profile by owner ID */
  async getByOwner(ownerId: string) {
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("owner_id", ownerId)
      .single();
    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data as VendorRow;
  },

  /** Get vendor profile by slug */
  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from("vendors")
      .select("*, products(*)")
      .eq("slug", slug)
      .single();
    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data as VendorRow & { products: Tables<"products">[] };
  },

  /** Get vendor profile by ID */
  async getById(id: string) {
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data as VendorRow;
  },

  /** Create a new vendor profile */
  async create(vendor: TablesInsert<"vendors">) {
    const { data, error } = await supabase
      .from("vendors")
      .insert(vendor)
      .select()
      .single();
    if (error) throw error;
    return data as VendorRow;
  },

  /** Update vendor profile */
  async update(id: string, updates: TablesUpdate<"vendors">) {
    const { data, error } = await supabase
      .from("vendors")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as VendorRow;
  },

  /** Get seller dashboard stats */
  async getDashboardStats(vendorId: string) {
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("status, total")
      .eq("vendor_id", vendorId);
    if (ordersError) throw ordersError;

    const { data: products, error: prodError } = await supabase
      .from("products")
      .select("id, stock, is_active")
      .eq("vendor_id", vendorId);
    if (prodError) throw prodError;

    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled" && o.status !== "refunded")
      .reduce((sum, o) => sum + Number(o.total), 0);
    const activeProducts = products.filter((p) => p.is_active).length;
    const lowStock = products.filter((p) => p.stock < 5).length;

    return {
      totalOrders,
      totalRevenue,
      activeProducts,
      lowStock,
      pendingOrders: orders.filter((o) => o.status === "pending").length,
    };
  },

  /** List all vendors (for marketplace browsing) */
  async listAll() {
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("is_active", true)
      .eq("is_verified", true)
      .order("avg_rating", { ascending: false });
    if (error) throw error;
    return data as VendorRow[];
  },
};