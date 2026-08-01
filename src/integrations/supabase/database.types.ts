export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.5" }
  public: {
    Tables: {
      ai_insights: {
        Row: {
          confidence: number | null
          created_at: string
          data: Json | null
          expires_at: string | null
          id: string
          insight_type: string
          is_actioned: boolean
          product_id: string | null
          summary: string
          title: string
          vendor_id: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          id?: string
          insight_type: string
          is_actioned?: boolean
          product_id?: string | null
          summary: string
          title: string
          vendor_id?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          id?: string
          insight_type?: string
          is_actioned?: boolean
          product_id?: string | null
          summary?: string
          title?: string
          vendor_id?: string | null
        }
        Relationships: [
          { foreignKeyName: "ai_insights_product_id_fkey", columns: ["product_id"], isOneToOne: false, referencedRelation: "products", referencedColumns: ["id"] },
          { foreignKeyName: "ai_insights_vendor_id_fkey", columns: ["vendor_id"], isOneToOne: false, referencedRelation: "vendors", referencedColumns: ["id"] },
        ]
      }
      cart_items: {
        Row: { created_at: string; id: string; product_id: string; quantity: number; updated_at: string; user_id: string; vendor_id: string }
        Insert: { created_at?: string; id?: string; product_id: string; quantity: number; updated_at?: string; user_id: string; vendor_id: string }
        Update: { created_at?: string; id?: string; product_id?: string; quantity?: number; updated_at?: string; user_id?: string; vendor_id?: string }
        Relationships: [
          { foreignKeyName: "cart_items_product_id_fkey", columns: ["product_id"], isOneToOne: false, referencedRelation: "products", referencedColumns: ["id"] },
          { foreignKeyName: "cart_items_user_id_fkey", columns: ["user_id"], isOneToOne: false, referencedRelation: "profiles", referencedColumns: ["id"] },
          { foreignKeyName: "cart_items_vendor_id_fkey", columns: ["vendor_id"], isOneToOne: false, referencedRelation: "vendors", referencedColumns: ["id"] },
        ]
      }
      disputes: {
        Row: { created_at: string; description: string | null; evidence_urls: string[] | null; id: string; order_id: string; raised_against: string; raised_by: string; reason: string; resolution: string | null; resolved_at: string | null; resolved_by: string | null; status: Database["public"]["Enums"]["dispute_status"]; updated_at: string }
        Insert: { created_at?: string; description?: string | null; evidence_urls?: string[] | null; id?: string; order_id: string; raised_against: string; raised_by: string; reason: string; resolution?: string | null; resolved_at?: string | null; resolved_by?: string | null; status?: Database["public"]["Enums"]["dispute_status"]; updated_at?: string }
        Update: { created_at?: string; description?: string | null; evidence_urls?: string[] | null; id?: string; order_id?: string; raised_against?: string; raised_by?: string; reason?: string; resolution?: string | null; resolved_at?: string | null; resolved_by?: string | null; status?: Database["public"]["Enums"]["dispute_status"]; updated_at?: string }
        Relationships: [
          { foreignKeyName: "disputes_order_id_fkey", columns: ["order_id"], isOneToOne: false, referencedRelation: "orders", referencedColumns: ["id"] },
          { foreignKeyName: "disputes_raised_against_fkey", columns: ["raised_against"], isOneToOne: false, referencedRelation: "profiles", referencedColumns: ["id"] },
          { foreignKeyName: "disputes_raised_by_fkey", columns: ["raised_by"], isOneToOne: false, referencedRelation: "profiles", referencedColumns: ["id"] },
          { foreignKeyName: "disputes_resolved_by_fkey", columns: ["resolved_by"], isOneToOne: false, referencedRelation: "profiles", referencedColumns: ["id"] },
        ]
      }
      order_items: {
        Row: { created_at: string; currency: Database["public"]["Enums"]["currency_code"]; id: string; order_id: string; product_id: string; product_image: string | null; product_name: string; quantity: number; total_price: number; unit_price: number }
        Insert: { created_at?: string; currency?: Database["public"]["Enums"]["currency_code"]; id?: string; order_id: string; product_id: string; product_image?: string | null; product_name: string; quantity: number; total_price: number; unit_price: number }
        Update: { created_at?: string; currency?: Database["public"]["Enums"]["currency_code"]; id?: string; order_id?: string; product_id?: string; product_image?: string | null; product_name?: string; quantity?: number; total_price?: number; unit_price?: number }
        Relationships: [
          { foreignKeyName: "order_items_order_id_fkey", columns: ["order_id"], isOneToOne: false, referencedRelation: "orders", referencedColumns: ["id"] },
          { foreignKeyName: "order_items_product_id_fkey", columns: ["product_id"], isOneToOne: false, referencedRelation: "products", referencedColumns: ["id"] },
        ]
      }
      orders: {
        Row: { billing_address: Json | null; buyer_id: string; cancelled_at: string | null; cancelled_reason: string | null; created_at: string; currency: Database["public"]["Enums"]["currency_code"]; delivered_at: string | null; delivery_estimate: string | null; discount_amount: number; id: string; notes: string | null; payment_method: Database["public"]["Enums"]["payment_method"]; payment_ref: string | null; shipping_address: Json; shipping_cost: number; status: Database["public"]["Enums"]["order_status"]; subtotal: number; tax_amount: number; total: number; updated_at: string; vendor_id: string }
        Insert: { billing_address?: Json | null; buyer_id: string; cancelled_at?: string | null; cancelled_reason?: string | null; created_at?: string; currency?: Database["public"]["Enums"]["currency_code"]; delivered_at?: string | null; delivery_estimate?: string | null; discount_amount?: number; id?: string; notes?: string | null; payment_method?: Database["public"]["Enums"]["payment_method"]; payment_ref?: string | null; shipping_address?: Json; shipping_cost?: number; status?: Database["public"]["Enums"]["order_status"]; subtotal: number; tax_amount?: number; total: number; updated_at?: string; vendor_id: string }
        Update: { billing_address?: Json | null; buyer_id?: string; cancelled_at?: string | null; cancelled_reason?: string | null; created_at?: string; currency?: Database["public"]["Enums"]["currency_code"]; delivered_at?: string | null; delivery_estimate?: string | null; discount_amount?: number; id?: string; notes?: string | null; payment_method?: Database["public"]["Enums"]["payment_method"]; payment_ref?: string | null; shipping_address?: Json; shipping_cost?: number; status?: Database["public"]["Enums"]["order_status"]; subtotal?: number; tax_amount?: number; total?: number; updated_at?: string; vendor_id?: string }
        Relationships: [
          { foreignKeyName: "orders_buyer_id_fkey", columns: ["buyer_id"], isOneToOne: false, referencedRelation: "profiles", referencedColumns: ["id"] },
          { foreignKeyName: "orders_vendor_id_fkey", columns: ["vendor_id"], isOneToOne: false, referencedRelation: "vendors", referencedColumns: ["id"] },
        ]
      }
      products: {
        Row: { avg_rating: number; category: string; country_of_origin: string | null; created_at: string; currency: Database["public"]["Enums"]["currency_code"]; description: string | null; id: string; images: string[] | null; is_active: boolean; is_ai_pick: boolean; is_featured: boolean; is_verified: boolean; low_stock_threshold: number; metadata: Json | null; name: string; original_price: number | null; price: number; short_description: string | null; slug: string; stock: number; subcategory: string | null; tags: string[] | null; thumbnail: string | null; total_reviews: number; total_sold: number; unit: string; updated_at: string; vendor_id: string; video_url: string | null; view_count: number; weight_kg: number | null }
        Insert: { avg_rating?: number; category: string; country_of_origin?: string | null; created_at?: string; currency?: Database["public"]["Enums"]["currency_code"]; description?: string | null; id?: string; images?: string[] | null; is_active?: boolean; is_ai_pick?: boolean; is_featured?: boolean; is_verified?: boolean; low_stock_threshold?: number; metadata?: Json | null; name: string; original_price?: number | null; price: number; short_description?: string | null; slug: string; stock?: number; subcategory?: string | null; tags?: string[] | null; thumbnail?: string | null; total_reviews?: number; total_sold?: number; unit?: string; updated_at?: string; vendor_id: string; video_url?: string | null; view_count?: number; weight_kg?: number | null }
        Update: { avg_rating?: number; category?: string; country_of_origin?: string | null; created_at?: string; currency?: Database["public"]["Enums"]["currency_code"]; description?: string | null; id?: string; images?: string[] | null; is_active?: boolean; is_ai_pick?: boolean; is_featured?: boolean; is_verified?: boolean; low_stock_threshold?: number; metadata?: Json | null; name?: string; original_price?: number | null; price?: number; short_description?: string | null; slug?: string; stock?: number; subcategory?: string | null; tags?: string[] | null; thumbnail?: string | null; total_reviews?: number; total_sold?: number; unit?: string; updated_at?: string; vendor_id?: string; video_url?: string | null; view_count?: number; weight_kg?: number | null }
        Relationships: [
          { foreignKeyName: "products_vendor_id_fkey", columns: ["vendor_id"], isOneToOne: false, referencedRelation: "vendors", referencedColumns: ["id"] },
        ]
      }
      profiles: {
        Row: { avatar_url: string | null; city: string | null; country: string | null; created_at: string; email_verified_at: string | null; full_name: string; id: string; phone: string | null; phone_verified_at: string | null; preferred_currency: Database["public"]["Enums"]["currency_code"]; role: Database["public"]["Enums"]["user_role"]; updated_at: string }
        Insert: { avatar_url?: string | null; city?: string | null; country?: string | null; created_at?: string; email_verified_at?: string | null; full_name?: string; id: string; phone?: string | null; phone_verified_at?: string | null; preferred_currency?: Database["public"]["Enums"]["currency_code"]; role?: Database["public"]["Enums"]["user_role"]; updated_at?: string }
        Update: { avatar_url?: string | null; city?: string | null; country?: string | null; created_at?: string; email_verified_at?: string | null; full_name?: string; id?: string; phone?: string | null; phone_verified_at?: string | null; preferred_currency?: Database["public"]["Enums"]["currency_code"]; role?: Database["public"]["Enums"]["user_role"]; updated_at?: string }
        Relationships: []
      }
      reviews: {
        Row: { content: string | null; created_at: string; helpful_count: number; id: string; images: string[] | null; is_approved: boolean; is_verified_purchase: boolean; order_id: string | null; product_id: string; rating: number; title: string | null; updated_at: string; user_id: string }
        Insert: { content?: string | null; created_at?: string; helpful_count?: number; id?: string; images?: string[] | null; is_approved?: boolean; is_verified_purchase?: boolean; order_id?: string | null; product_id: string; rating: number; title?: string | null; updated_at?: string; user_id: string }
        Update: { content?: string | null; created_at?: string; helpful_count?: number; id?: string; images?: string[] | null; is_approved?: boolean; is_verified_purchase?: boolean; order_id?: string | null; product_id?: string; rating?: number; title?: string | null; updated_at?: string; user_id?: string }
        Relationships: [
          { foreignKeyName: "reviews_order_id_fkey", columns: ["order_id"], isOneToOne: false, referencedRelation: "orders", referencedColumns: ["id"] },
          { foreignKeyName: "reviews_product_id_fkey", columns: ["product_id"], isOneToOne: false, referencedRelation: "products", referencedColumns: ["id"] },
          { foreignKeyName: "reviews_user_id_fkey", columns: ["user_id"], isOneToOne: false, referencedRelation: "profiles", referencedColumns: ["id"] },
        ]
      }
      stock_movements: {
        Row: { created_at: string; id: string; notes: string | null; product_id: string; quantity: number; reason: string; reference_id: string | null; vendor_id: string }
        Insert: { created_at?: string; id?: string; notes?: string | null; product_id: string; quantity: number; reason: string; reference_id?: string | null; vendor_id: string }
        Update: { created_at?: string; id?: string; notes?: string | null; product_id?: string; quantity?: number; reason?: string; reference_id?: string | null; vendor_id?: string }
        Relationships: [
          { foreignKeyName: "stock_movements_product_id_fkey", columns: ["product_id"], isOneToOne: false, referencedRelation: "products", referencedColumns: ["id"] },
          { foreignKeyName: "stock_movements_vendor_id_fkey", columns: ["vendor_id"], isOneToOne: false, referencedRelation: "vendors", referencedColumns: ["id"] },
        ]
      }
      vendors: {
        Row: { avg_rating: number; business_name: string; city: string | null; commission_pct: number; country: string; cover_url: string | null; created_at: string; description: string | null; email: string | null; id: string; is_active: boolean; is_verified: boolean; logo_url: string | null; owner_id: string; phone: string | null; slug: string; total_products: number; total_reviews: number; updated_at: string; website: string | null }
        Insert: { avg_rating?: number; business_name: string; city?: string | null; commission_pct?: number; country: string; cover_url?: string | null; created_at?: string; description?: string | null; email?: string | null; id?: string; is_active?: boolean; is_verified?: boolean; logo_url?: string | null; owner_id: string; phone?: string | null; slug: string; total_products?: number; total_reviews?: number; updated_at?: string; website?: string | null }
        Update: { avg_rating?: number; business_name?: string; city?: string | null; commission_pct?: number; country?: string; cover_url?: string | null; created_at?: string; description?: string | null; email?: string | null; id?: string; is_active?: boolean; is_verified?: boolean; logo_url?: string | null; owner_id?: string; phone?: string | null; slug?: string; total_products?: number; total_reviews?: number; updated_at?: string; website?: string | null }
        Relationships: [
          { foreignKeyName: "vendors_owner_id_fkey", columns: ["owner_id"], isOneToOne: false, referencedRelation: "profiles", referencedColumns: ["id"] },
        ]
      }
    }
    Views: { [_ in never]: never }
    Functions: { show_limit: { Args: never; Returns: number }; show_trgm: { Args: { "": string }; Returns: string[] } }
    Enums: {
      currency_code: "USD" | "ETB" | "KES" | "NGN" | "ZAR" | "GHS" | "TZS" | "UGX" | "RWF" | "XOF"
      dispute_status: "open" | "under_review" | "resolved" | "closed"
      order_status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
      payment_method: "card" | "mobile_money" | "bank_transfer" | "crypto"
      user_role: "buyer" | "vendor" | "admin"
    }
    CompositeTypes: { [_ in never]: never }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]