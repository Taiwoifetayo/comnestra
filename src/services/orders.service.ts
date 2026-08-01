import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/database.types";

export type OrderRow = Tables<"orders">;
export type OrderItemRow = Tables<"order_items">;
export type DisputeRow = Tables<"disputes">;

export const ordersService = {
  /** Fetch orders for the current user (buyer) */
  async listMyOrders(buyerId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("buyer_id", buyerId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as (OrderRow & { order_items: OrderItemRow[] })[];
  },

  /** Fetch orders belonging to a vendor (seller dashboard) */
  async listByVendor(vendorId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as (OrderRow & { order_items: OrderItemRow[] })[];
  },

  /** Get a single order by ID (with items) */
  async getById(id: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", id)
      .single();
    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data as OrderRow & { order_items: OrderItemRow[] };
  },

  /** Create a new order (from cart checkout) */
  async create(order: TablesInsert<"orders">, items: TablesInsert<"order_items">[]) {
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert(order)
      .select()
      .single();
    if (orderError) throw orderError;

    const orderItems = items.map((item) => ({
      ...item,
      order_id: orderData.id,
    }));

    const { data: itemsData, error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)
      .select();
    if (itemsError) throw itemsError;

    return {
      ...orderData,
      order_items: itemsData,
    } as OrderRow & { order_items: OrderItemRow[] };
  },

  /** Update order status (vendor / admin) */
  async updateStatus(id: string, status: TablesUpdate<"orders">["status"]) {
    const updates: TablesUpdate<"orders"> = { status };
    if (status === "cancelled") {
      updates.cancelled_at = new Date().toISOString();
    }
    if (status === "delivered") {
      updates.delivered_at = new Date().toISOString();
    }
    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", id)
      .select("*, order_items(*)")
      .single();
    if (error) throw error;
    return data as OrderRow & { order_items: OrderItemRow[] };
  },

  /** Cancel an order (buyer) */
  async cancel(id: string, reason?: string) {
    return this.updateStatus(id, "cancelled");
  },

  /** Get orders by status for a vendor dashboard */
  async listByVendorAndStatus(vendorId: string, status: string) {
    let query = supabase
      .from("orders")
      .select("*, order_items(*, product:products(name))")
      .eq("vendor_id", vendorId);

    if (status !== "all") {
      query = query.eq("status", status as any);
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    return data as (OrderRow & { order_items: OrderItemRow[] })[];
  },

  /* ── Disputes ── */
  async listDisputes(vendorId?: string) {
    let query = supabase
      .from("disputes")
      .select("*, orders:order_id(*)")
      .order("created_at", { ascending: false });

    if (vendorId) {
      query = query.eq("raised_against", vendorId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createDispute(dispute: TablesInsert<"disputes">) {
    const { data, error } = await supabase
      .from("disputes")
      .insert(dispute)
      .select()
      .single();
    if (error) throw error;
    return data as DisputeRow;
  },
};