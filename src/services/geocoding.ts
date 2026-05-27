import type { CreatePropertyInput } from "@/validations/property";

type GoogleGeocodeResponse = {
  status: string;
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
};

export async function geocodePropertyAddress(input: CreatePropertyInput) {
  const apiKey =
    process.env.GOOGLE_MAPS_API_KEY ??
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey.includes("DUMMY")) {
    return null;
  }

  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");

  if (input.latitude !== null && input.latitude !== undefined && input.longitude !== null && input.longitude !== undefined) {
    url.searchParams.set("latlng", `${input.latitude},${input.longitude}`);
  } else {
    const address = [
    input.addressLine1,
    input.addressLine2,
    input.locality,
    input.city,
    input.state,
    input.pincode,
    "India",
  ]
    .filter(Boolean)
    .join(", ");

    url.searchParams.set("address", address);
  }

  url.searchParams.set("key", apiKey);

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as GoogleGeocodeResponse;
  const location = data.results[0]?.geometry.location;

  if (data.status !== "OK" || !location) {
    return null;
  }

  return {
    latitude: location.lat,
    longitude: location.lng,
  };
}
