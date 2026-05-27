import { z } from "zod";

import {
  furnishingStatuses,
  listingTypes,
  propertyTypes,
} from "@/constants/property-options";

const nullableNumber = z
  .number()
  .finite()
  .nonnegative()
  .nullable()
  .optional();

const optionalText = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((value) => (value ? value : null));

export const propertyMediaSchema = z.object({
  storagePath: z.string().trim().min(1).max(600),
  publicUrl: z.url().optional(),
  altText: z.string().trim().max(160).optional(),
});

export const createPropertySchema = z.object({
  title: z.string().trim().min(8).max(120),
  description: z.string().trim().min(40).max(2500),
  contactName: z.string().trim().min(2).max(120),
  contactPhone: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .regex(/^[+()0-9 -]+$/, "Enter a valid phone number."),
  contactEmail: z.email().max(160),
  price: z.number().finite().nonnegative(),
  listingType: z.enum(listingTypes),
  propertyType: z.enum(propertyTypes),
  bedrooms: nullableNumber,
  bathrooms: nullableNumber,
  balconies: nullableNumber,
  areaSqft: z.number().finite().positive(),
  plotAreaSqft: nullableNumber,
  carpetAreaSqft: nullableNumber,
  furnishing: z.enum(furnishingStatuses).nullable().optional(),
  amenities: z.array(z.string().trim().min(1).max(80)).max(30).default([]),
  addressLine1: z.string().trim().min(5).max(180),
  addressLine2: optionalText,
  locality: z.string().trim().min(2).max(90),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80).default("Chhattisgarh"),
  pincode: z.string().trim().regex(/^[1-9][0-9]{5}$/).nullable().optional(),
  latitude: z.number().finite().min(-90).max(90).nullable().optional(),
  longitude: z.number().finite().min(-180).max(180).nullable().optional(),
  availabilityDate: z.string().date().nullable().optional(),
  images: z.array(propertyMediaSchema).max(12).default([]),
  videos: z.array(propertyMediaSchema).max(4).default([]),
}).superRefine((value, ctx) => {
  if (value.propertyType === "LAND") {
    if (value.bedrooms !== null && value.bedrooms !== undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["bedrooms"],
        message: "Bedrooms are not applicable for land.",
      });
    }

    if (value.bathrooms !== null && value.bathrooms !== undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["bathrooms"],
        message: "Bathrooms are not applicable for land.",
      });
    }

    if (value.furnishing !== null && value.furnishing !== undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["furnishing"],
        message: "Furnishing is not applicable for land.",
      });
    }
  }
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
