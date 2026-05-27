export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "USER" | "AGENT" | "ADMIN";
          full_name: string;
          email: string | null;
          phone: string | null;
          avatar_url: string | null;
          bio: string | null;
          company_name: string | null;
          rera_id: string | null;
          is_verified: boolean;
          last_seen_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          role?: "USER" | "AGENT" | "ADMIN";
          full_name: string;
          email?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          company_name?: string | null;
          rera_id?: string | null;
          is_verified?: boolean;
          last_seen_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      properties: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          slug: string;
          description: string;
          contact_name: string;
          contact_phone: string;
          contact_email: string;
          price: number;
          listing_type: "BUY" | "RENT" | "SELL";
          property_type:
            | "LAND"
            | "FLAT"
            | "APARTMENT"
            | "OFFICE"
            | "RESTAURANT_SPACE"
            | "SHOP"
            | "WAREHOUSE";
          status: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED";
          bedrooms: number | null;
          bathrooms: number | null;
          balconies: number | null;
          area_sqft: number;
          plot_area_sqft: number | null;
          carpet_area_sqft: number | null;
          furnishing: "UNFURNISHED" | "SEMI_FURNISHED" | "FULLY_FURNISHED" | null;
          amenities: string[];
          address_line1: string;
          address_line2: string | null;
          locality: string;
          city: string;
          state: string;
          pincode: string | null;
          latitude: number | null;
          longitude: number | null;
          coordinates: unknown | null;
          availability_date: string | null;
          is_featured: boolean;
          featured_until: string | null;
          view_count: number;
          moderation_note: string | null;
          approved_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          slug: string;
          description: string;
          contact_name: string;
          contact_phone: string;
          contact_email: string;
          price: number;
          listing_type: Database["public"]["Tables"]["properties"]["Row"]["listing_type"];
          property_type: Database["public"]["Tables"]["properties"]["Row"]["property_type"];
          status?: Database["public"]["Tables"]["properties"]["Row"]["status"];
          bedrooms?: number | null;
          bathrooms?: number | null;
          balconies?: number | null;
          area_sqft: number;
          plot_area_sqft?: number | null;
          carpet_area_sqft?: number | null;
          furnishing?: Database["public"]["Tables"]["properties"]["Row"]["furnishing"];
          amenities?: string[];
          address_line1: string;
          address_line2?: string | null;
          locality: string;
          city: string;
          state?: string;
          pincode?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          coordinates?: string | null;
          availability_date?: string | null;
        };
        Update: Partial<
          Omit<
            Database["public"]["Tables"]["properties"]["Row"],
            "id" | "owner_id" | "coordinates" | "created_at" | "updated_at"
          >
        >;
        Relationships: [
          {
            foreignKeyName: "properties_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      property_images: {
        Row: {
          id: string;
          property_id: string;
          storage_path: string;
          public_url: string | null;
          blur_data_url: string | null;
          alt_text: string | null;
          sort_order: number;
          is_cover: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          storage_path: string;
          public_url?: string | null;
          blur_data_url?: string | null;
          alt_text?: string | null;
          sort_order?: number;
          is_cover?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["property_images"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
        ];
      };
      property_videos: {
        Row: {
          id: string;
          property_id: string;
          storage_path: string;
          public_url: string | null;
          thumbnail_url: string | null;
          title: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          storage_path: string;
          public_url?: string | null;
          thumbnail_url?: string | null;
          title?: string | null;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["property_videos"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "property_videos_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
