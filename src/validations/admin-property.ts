import { z } from "zod";

import {
  furnishingStatuses,
  listingTypes,
  propertyTypes,
} from "@/constants/property-options";

export const propertyStatusSchema = z.enum([
  "DRAFT",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "ARCHIVED",
]);

const optionalNumber = z.number().finite().nonnegative().nullable().optional();

export const adminPropertyUpdateSchema = z.object({
  title: z.string().trim().min(8).max(120).optional(),
  description: z.string().trim().min(40).max(2500).optional(),
  contactName: z.string().trim().min(2).max(120).optional(),
  contactPhone: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .regex(/^[+()0-9 -]+$/, "Enter a valid phone number.")
    .optional(),
  contactEmail: z.email().max(160).optional(),
  price: z.number().finite().nonnegative().optional(),
  listingType: z.enum(listingTypes).optional(),
  propertyType: z.enum(propertyTypes).optional(),
  status: propertyStatusSchema.optional(),
  bedrooms: optionalNumber,
  bathrooms: optionalNumber,
  balconies: optionalNumber,
  areaSqft: z.number().finite().positive().optional(),
  plotAreaSqft: optionalNumber,
  carpetAreaSqft: optionalNumber,
  furnishing: z.enum(furnishingStatuses).nullable().optional(),
  amenities: z.array(z.string().trim().min(1).max(80)).max(30).optional(),
  addressLine1: z.string().trim().min(5).max(180).optional(),
  addressLine2: z.string().trim().max(500).nullable().optional(),
  locality: z.string().trim().min(2).max(90).optional(),
  city: z.string().trim().min(2).max(80).optional(),
  state: z.string().trim().min(2).max(80).optional(),
  pincode: z.string().trim().regex(/^[1-9][0-9]{5}$/).nullable().optional(),
  latitude: z.number().finite().min(-90).max(90).nullable().optional(),
  longitude: z.number().finite().min(-180).max(180).nullable().optional(),
  availabilityDate: z.string().date().nullable().optional(),
  isFeatured: z.boolean().optional(),
  moderationNote: z.string().trim().max(1000).nullable().optional(),
});

export type AdminPropertyUpdateInput = z.infer<
  typeof adminPropertyUpdateSchema
>;
