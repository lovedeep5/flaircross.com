// Minimal type stubs for Supabase query inference
// Full generated types: supabase gen types typescript --project-id <id>

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; full_name: string | null; company_name: string | null; phone: string | null; role: string; stripe_customer_id: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; full_name?: string | null; company_name?: string | null; phone?: string | null; role?: string; stripe_customer_id?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; full_name?: string | null; company_name?: string | null; phone?: string | null; role?: string; stripe_customer_id?: string | null; created_at?: string; updated_at?: string };
        Relationships: [];
      };
      products: {
        Row: { id: string; name: string; slug: string; description: string | null; short_description: string | null; type: string; status: string; is_public: boolean; assigned_user_id: string | null; stripe_product_id: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; name: string; slug: string; description?: string | null; short_description?: string | null; type: string; status?: string; is_public?: boolean; assigned_user_id?: string | null; stripe_product_id?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; name?: string; slug?: string; description?: string | null; short_description?: string | null; type?: string; status?: string; is_public?: boolean; assigned_user_id?: string | null; stripe_product_id?: string | null; created_at?: string; updated_at?: string };
        Relationships: [
          { foreignKeyName: "products_assigned_user_id_fkey"; columns: ["assigned_user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }
        ];
      };
      prices: {
        Row: { id: string; product_id: string; nickname: string | null; unit_amount: number; currency: string; interval: string | null; stripe_price_id: string | null; is_default: boolean; created_at: string };
        Insert: { id?: string; product_id: string; nickname?: string | null; unit_amount: number; currency: string; interval?: string | null; stripe_price_id?: string | null; is_default?: boolean; created_at?: string };
        Update: { id?: string; product_id?: string; nickname?: string | null; unit_amount?: number; currency?: string; interval?: string | null; stripe_price_id?: string | null; is_default?: boolean; created_at?: string };
        Relationships: [
          { foreignKeyName: "prices_product_id_fkey"; columns: ["product_id"]; isOneToOne: false; referencedRelation: "products"; referencedColumns: ["id"] }
        ];
      };
      orders: {
        Row: { id: string; user_id: string; product_id: string | null; price_id: string | null; stripe_session_id: string | null; stripe_payment_intent: string | null; amount: number; currency: string; status: string; created_at: string };
        Insert: { id?: string; user_id: string; product_id?: string | null; price_id?: string | null; stripe_session_id?: string | null; stripe_payment_intent?: string | null; amount: number; currency: string; status: string; created_at?: string };
        Update: { id?: string; user_id?: string; product_id?: string | null; price_id?: string | null; stripe_session_id?: string | null; stripe_payment_intent?: string | null; amount?: number; currency?: string; status?: string; created_at?: string };
        Relationships: [
          { foreignKeyName: "orders_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "orders_product_id_fkey"; columns: ["product_id"]; isOneToOne: false; referencedRelation: "products"; referencedColumns: ["id"] },
          { foreignKeyName: "orders_price_id_fkey"; columns: ["price_id"]; isOneToOne: false; referencedRelation: "prices"; referencedColumns: ["id"] }
        ];
      };
      subscriptions: {
        Row: { id: string; user_id: string; product_id: string | null; price_id: string | null; stripe_subscription_id: string | null; stripe_customer_id: string | null; status: string; current_period_start: string | null; current_period_end: string | null; cancel_at_period_end: boolean; canceled_at: string | null; trial_start: string | null; trial_end: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; user_id: string; product_id?: string | null; price_id?: string | null; stripe_subscription_id?: string | null; stripe_customer_id?: string | null; status: string; current_period_start?: string | null; current_period_end?: string | null; cancel_at_period_end?: boolean; canceled_at?: string | null; trial_start?: string | null; trial_end?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; user_id?: string; product_id?: string | null; price_id?: string | null; stripe_subscription_id?: string | null; stripe_customer_id?: string | null; status?: string; current_period_start?: string | null; current_period_end?: string | null; cancel_at_period_end?: boolean; canceled_at?: string | null; trial_start?: string | null; trial_end?: string | null; created_at?: string; updated_at?: string };
        Relationships: [
          { foreignKeyName: "subscriptions_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "subscriptions_product_id_fkey"; columns: ["product_id"]; isOneToOne: false; referencedRelation: "products"; referencedColumns: ["id"] },
          { foreignKeyName: "subscriptions_price_id_fkey"; columns: ["price_id"]; isOneToOne: false; referencedRelation: "prices"; referencedColumns: ["id"] }
        ];
      };
      testimonials: {
        Row: { id: string; name: string; company: string | null; role: string | null; body: string; rating: number; is_active: boolean; sort_order: number; created_at: string; updated_at: string };
        Insert: { id?: string; name: string; company?: string | null; role?: string | null; body: string; rating?: number; is_active?: boolean; sort_order?: number; created_at?: string; updated_at?: string };
        Update: { id?: string; name?: string; company?: string | null; role?: string | null; body?: string; rating?: number; is_active?: boolean; sort_order?: number; created_at?: string; updated_at?: string };
        Relationships: [];
      };
      portfolio_items: {
        Row: { id: string; title: string; description: string | null; category: string | null; url: string | null; image_url: string | null; tags: string[] | null; is_active: boolean; sort_order: number; created_at: string; updated_at: string };
        Insert: { id?: string; title: string; description?: string | null; category?: string | null; url?: string | null; image_url?: string | null; tags?: string[] | null; is_active?: boolean; sort_order?: number; created_at?: string; updated_at?: string };
        Update: { id?: string; title?: string; description?: string | null; category?: string | null; url?: string | null; image_url?: string | null; tags?: string[] | null; is_active?: boolean; sort_order?: number; created_at?: string; updated_at?: string };
        Relationships: [];
      };
      contact_leads: {
        Row: { id: string; name: string; email: string; message: string; created_at: string };
        Insert: { id?: string; name: string; email: string; message: string; created_at?: string };
        Update: { id?: string; name?: string; email?: string; message?: string; created_at?: string };
        Relationships: [];
      };
      product_bundle_items: {
        Row: { id: string; product_id: string; description: string; sort_order: number };
        Insert: { id?: string; product_id: string; description: string; sort_order?: number };
        Update: { id?: string; product_id?: string; description?: string; sort_order?: number };
        Relationships: [
          { foreignKeyName: "product_bundle_items_product_id_fkey"; columns: ["product_id"]; isOneToOne: false; referencedRelation: "products"; referencedColumns: ["id"] }
        ];
      };
      managed_sites: {
        Row: { id: string; user_id: string; subscription_id: string | null; url: string | null; status: string; notes: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; user_id: string; subscription_id?: string | null; url?: string | null; status: string; notes?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; user_id?: string; subscription_id?: string | null; url?: string | null; status?: string; notes?: string | null; created_at?: string; updated_at?: string };
        Relationships: [
          { foreignKeyName: "managed_sites_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
