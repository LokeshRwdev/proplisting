import type { SupabaseClient } from "@supabase/supabase-js";

import { createUniqueSlug } from "@/utils/slug";
import type { CreatePropertyInput } from "@/validations/property";
import type { Database } from "@/types/database";

type PropertyInsert =
  Database["public"]["Tables"]["properties"]["Insert"];
type PropertyImageInsert =
  Database["public"]["Tables"]["property_images"]["Insert"];
type PropertyVideoInsert =
  Database["public"]["Tables"]["property_videos"]["Insert"];

export async function createPropertyListing(
  supabase: SupabaseClient<Database>,
  ownerId: string,
  input: CreatePropertyInput,
) {
  const payload: PropertyInsert = {
    owner_id: ownerId,
    title: input.title,
    slug: createUniqueSlug([input.title, input.locality, input.city]),
    description: input.description,
    contact_name: input.contactName,
    contact_phone: input.contactPhone,
    contact_email: input.contactEmail,
    price: input.price,
    listing_type: input.listingType,
    property_type: input.propertyType,
    status: "PENDING",
    bedrooms: input.bedrooms ?? null,
    bathrooms: input.bathrooms ?? null,
    balconies: input.balconies ?? null,
    area_sqft: input.areaSqft,
    plot_area_sqft: input.plotAreaSqft ?? null,
    carpet_area_sqft: input.carpetAreaSqft ?? null,
    furnishing: input.furnishing ?? null,
    amenities: input.amenities,
    address_line1: input.addressLine1,
    address_line2: input.addressLine2 ?? null,
    locality: input.locality,
    city: input.city,
    state: input.state,
    pincode: input.pincode ?? null,
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
    coordinates:
      input.latitude !== null &&
      input.latitude !== undefined &&
      input.longitude !== null &&
      input.longitude !== undefined
        ? `SRID=4326;POINT(${input.longitude} ${input.latitude})`
        : null,
    availability_date: input.availabilityDate ?? null,
  };

  const { data: property, error } = await supabase
    .from("properties")
    .insert(payload)
    .select("id, slug, status")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (input.images.length > 0) {
    const images: PropertyImageInsert[] = input.images.map((image, index) => ({
      property_id: property.id,
      storage_path: image.storagePath,
      public_url: image.publicUrl ?? null,
      alt_text: image.altText ?? input.title,
      sort_order: index,
      is_cover: index === 0,
    }));

    const { error: imageError } = await supabase
      .from("property_images")
      .insert(images);

    if (imageError) {
      throw new Error(imageError.message);
    }
  }

  if (input.videos.length > 0) {
    const videos: PropertyVideoInsert[] = input.videos.map((video, index) => ({
      property_id: property.id,
      storage_path: video.storagePath,
      public_url: video.publicUrl ?? null,
      title: video.altText ?? input.title,
      sort_order: index,
    }));

    const { error: videoError } = await supabase
      .from("property_videos")
      .insert(videos);

    if (videoError) {
      throw new Error(videoError.message);
    }
  }

  return property;
}

export async function attachPropertyImages(
  supabase: SupabaseClient<Database>,
  propertyId: string,
  title: string,
  images: Array<{ storagePath: string; publicUrl: string | null }>,
) {
  if (images.length === 0) {
    return;
  }

  const rows: PropertyImageInsert[] = images.map((image, index) => ({
    property_id: propertyId,
    storage_path: image.storagePath,
    public_url: image.publicUrl,
    alt_text: title,
    sort_order: index,
    is_cover: index === 0,
  }));

  const { error } = await supabase.from("property_images").insert(rows);

  if (error) {
    throw new Error(error.message);
  }
}

export async function attachPropertyVideos(
  supabase: SupabaseClient<Database>,
  propertyId: string,
  title: string,
  videos: Array<{ storagePath: string; publicUrl: string | null }>,
) {
  if (videos.length === 0) {
    return;
  }

  const rows: PropertyVideoInsert[] = videos.map((video, index) => ({
    property_id: propertyId,
    storage_path: video.storagePath,
    public_url: video.publicUrl,
    title,
    sort_order: index,
  }));

  const { error } = await supabase.from("property_videos").insert(rows);

  if (error) {
    throw new Error(error.message);
  }
}
