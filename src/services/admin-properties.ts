import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";
import type { AdminPropertyUpdateInput } from "@/validations/admin-property";

export type AdminProperty =
  Database["public"]["Tables"]["properties"]["Row"] & {
    owner: {
      full_name: string;
      email: string | null;
      phone: string | null;
      role: "USER" | "AGENT" | "ADMIN";
    } | null;
    image_count: number;
    video_count: number;
  };

type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];
type PropertyUpdate = Database["public"]["Tables"]["properties"]["Update"];

export async function listAdminProperties(
  supabase: SupabaseClient<Database>,
  filters: {
    status?: PropertyRow["status"];
    query?: string;
  },
) {
  let query = supabase
    .from("properties")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(100);

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.query) {
    const term = `%${filters.query}%`;
    query = query.or(
      `title.ilike.${term},locality.ilike.${term},city.ilike.${term},slug.ilike.${term}`,
    );
  }

  const { data: properties, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const ownerIds = [...new Set(properties.map((property) => property.owner_id))];
  const propertyIds = properties.map((property) => property.id);

  const [{ data: owners }, { data: images }, { data: videos }] =
    await Promise.all([
      ownerIds.length > 0
        ? supabase
            .from("profiles")
            .select("id, full_name, email, phone, role")
            .in("id", ownerIds)
        : Promise.resolve({ data: [] }),
      propertyIds.length > 0
        ? supabase.from("property_images").select("property_id").in("property_id", propertyIds)
        : Promise.resolve({ data: [] }),
      propertyIds.length > 0
        ? supabase.from("property_videos").select("property_id").in("property_id", propertyIds)
        : Promise.resolve({ data: [] }),
    ]);

  return properties.map<AdminProperty>((property) => {
    const owner = owners?.find((item) => item.id === property.owner_id) ?? null;
    const imageCount =
      images?.filter((item) => item.property_id === property.id).length ?? 0;
    const videoCount =
      videos?.filter((item) => item.property_id === property.id).length ?? 0;

    return {
      ...property,
      owner,
      image_count: imageCount,
      video_count: videoCount,
    };
  });
}

export async function updateAdminProperty(
  supabase: SupabaseClient<Database>,
  propertyId: string,
  input: AdminPropertyUpdateInput,
) {
  const payload: PropertyUpdate = {
    title: input.title,
    description: input.description,
    contact_name: input.contactName,
    contact_phone: input.contactPhone,
    contact_email: input.contactEmail,
    price: input.price,
    listing_type: input.listingType,
    property_type: input.propertyType,
    status: input.status,
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    balconies: input.balconies,
    area_sqft: input.areaSqft,
    plot_area_sqft: input.plotAreaSqft,
    carpet_area_sqft: input.carpetAreaSqft,
    furnishing: input.furnishing,
    amenities: input.amenities,
    address_line1: input.addressLine1,
    address_line2: input.addressLine2,
    locality: input.locality,
    city: input.city,
    state: input.state,
    pincode: input.pincode,
    latitude: input.latitude,
    longitude: input.longitude,
    availability_date: input.availabilityDate,
    is_featured: input.isFeatured,
    moderation_note: input.moderationNote,
    approved_at: input.status === "APPROVED" ? new Date().toISOString() : undefined,
  };

  const cleanedPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  ) as PropertyUpdate;

  const { data, error } = await supabase
    .from("properties")
    .update(cleanedPayload)
    .eq("id", propertyId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function softDeleteAdminProperty(
  supabase: SupabaseClient<Database>,
  propertyId: string,
) {
  const { error } = await supabase
    .from("properties")
    .update({
      deleted_at: new Date().toISOString(),
      status: "ARCHIVED",
    })
    .eq("id", propertyId);

  if (error) {
    throw new Error(error.message);
  }
}
