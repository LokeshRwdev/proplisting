import type { FeaturedProperty, PropertyCategory } from "@/types/property";

export const featuredProperties: FeaturedProperty[] = [
  {
    id: "nehru-nagar-villa",
    title: "Sunlit villa near Nehru Nagar",
    location: "Nehru Nagar, Bhilai",
    price: "₹1.48 Cr",
    intent: "Buy",
    type: "Apartment",
    area: "2,650 sq.ft",
    beds: 4,
    baths: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
    rating: 4.9,
    isVerified: true,
  },
  {
    id: "civic-centre-office",
    title: "Glass-front office floor",
    location: "Civic Centre, Bhilai",
    price: "₹1.85 L/mo",
    intent: "Rent",
    type: "Office",
    area: "3,200 sq.ft",
    baths: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    rating: 4.8,
    isVerified: true,
  },
  {
    id: "smriti-nagar-flat",
    title: "Park-facing premium flat",
    location: "Smriti Nagar, Bhilai",
    price: "₹46,000/mo",
    intent: "Rent",
    type: "Flat",
    area: "1,540 sq.ft",
    beds: 3,
    baths: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
    rating: 4.7,
    isVerified: true,
  },
];

export const propertyCategories: PropertyCategory[] = [
  {
    name: "Land",
    count: "420+",
    description: "Verified plots for homes, warehouses, and investments.",
  },
  {
    name: "Flat",
    count: "310+",
    description: "Ready and under-construction homes across top sectors.",
  },
  {
    name: "Office",
    count: "95+",
    description: "Premium workspaces for startups, clinics, and enterprises.",
  },
  {
    name: "Shop",
    count: "140+",
    description: "High-footfall retail spaces and main-road showrooms.",
  },
  {
    name: "Warehouse",
    count: "65+",
    description: "Industrial sheds and logistics-ready spaces near highways.",
  },
  {
    name: "Restaurant Space",
    count: "38+",
    description: "Fitted and shell commercial spaces for F&B operators.",
  },
];

export const popularCities = [
  "Bhilai",
  "Durg",
  "Raipur",
  "Bhilai-3",
  "Charoda",
  "Kumhari",
];

export const searchTags = [
  "3 BHK near Smriti Nagar",
  "Commercial in Civic Centre",
  "Land near Junwani",
  "Warehouse on NH-53",
];
