export type ListingIntent = "Buy" | "Rent" | "Sell";

export type PropertyType =
  | "Land"
  | "Flat"
  | "Apartment"
  | "Office"
  | "Restaurant Space"
  | "Shop"
  | "Warehouse";

export type FeaturedProperty = {
  id: string;
  title: string;
  location: string;
  price: string;
  intent: Exclude<ListingIntent, "Sell">;
  type: PropertyType;
  area: string;
  beds?: number;
  baths?: number;
  imageUrl: string;
  rating: number;
  isVerified: boolean;
};

export type PropertyCategory = {
  name: PropertyType;
  count: string;
  description: string;
};
