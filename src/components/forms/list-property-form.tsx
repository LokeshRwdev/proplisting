"use client";

import { FormEvent, ReactNode, useMemo, useState, useEffect } from "react";

import {
  amenityOptions,
  furnishingStatuses,
  listingTypes,
  propertyTypes,
  residentialPropertyTypes,
} from "@/constants/property-options";
import { createPropertySchema } from "@/validations/property";

type FormValues = {
  title: string;
  description: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  price: string;
  listingType: (typeof listingTypes)[number];
  propertyType: (typeof propertyTypes)[number];
  bedrooms: string;
  bathrooms: string;
  balconies: string;
  areaSqft: string;
  plotAreaSqft: string;
  carpetAreaSqft: string;
  furnishing: "" | (typeof furnishingStatuses)[number];
  addressLine1: string;
  addressLine2: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  availabilityDate: string;
};

type FieldErrors = Partial<Record<keyof FormValues | "amenities" | "images" | "videos", string>>;

const initialValues: FormValues = {
  title: "",
  description: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  price: "",
  listingType: "SELL",
  propertyType: "APARTMENT",
  bedrooms: "",
  bathrooms: "",
  balconies: "",
  areaSqft: "",
  plotAreaSqft: "",
  carpetAreaSqft: "",
  furnishing: "",
  addressLine1: "",
  addressLine2: "",
  locality: "",
  city: "",
  state: "",
  pincode: "",
  availabilityDate: "",
};

function numberOrNull(value: string) {
  return value.trim() === "" ? null : Number(value);
}

function formatOption(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isResidentialProperty(type: FormValues["propertyType"]) {
  return residentialPropertyTypes.some((item) => item === type);
}

function isLandProperty(type: FormValues["propertyType"]) {
  return type === "LAND";
}

function getFileSummary(files: File[]) {
  if (files.length === 0) {
    return "No files selected";
  }

  return files.map((file) => file.name).join(", ");
}

const googleMapsKey =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "DUMMY_GOOGLE_MAPS_KEY";

export function ListPropertyForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [detectedLocation, setDetectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [serverMessage, setServerMessage] = useState("");
  const [locationMessage, setLocationMessage] = useState("");

  const showHomeSpecs = isResidentialProperty(values.propertyType);
  const showPlotArea = isLandProperty(values.propertyType);
  const showCommercialSpecs = !showHomeSpecs && !showPlotArea;

  const payload = useMemo(
    () => ({
      title: values.title,
      description: values.description,
      contactName: values.contactName,
      contactPhone: values.contactPhone,
      contactEmail: values.contactEmail,
      price: Number(values.price),
      listingType: values.listingType,
      propertyType: values.propertyType,
      bedrooms: showHomeSpecs ? numberOrNull(values.bedrooms) : null,
      bathrooms: showPlotArea ? null : numberOrNull(values.bathrooms),
      balconies: showHomeSpecs ? numberOrNull(values.balconies) : null,
      areaSqft: Number(values.areaSqft),
      plotAreaSqft: showPlotArea ? numberOrNull(values.plotAreaSqft) : null,
      carpetAreaSqft: showPlotArea ? null : numberOrNull(values.carpetAreaSqft),
      furnishing: showPlotArea ? null : values.furnishing || null,
      amenities,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2,
      locality: values.locality,
      city: values.city,
      state: values.state,
      pincode: values.pincode || null,
      latitude: detectedLocation?.latitude ?? null,
      longitude: detectedLocation?.longitude ?? null,
      availabilityDate: values.availabilityDate || null,
      images: [],
      videos: [],
    }),
    [amenities, detectedLocation, showHomeSpecs, showPlotArea, values],
  );

  const addressQuery = [
    values.addressLine1,
    values.addressLine2,
    values.locality,
    values.city,
    values.state,
    values.pincode,
    "India",
  ]
    .filter(Boolean)
    .join(", ");
  const mapQuery = detectedLocation
    ? `${detectedLocation.latitude},${detectedLocation.longitude}`
    : addressQuery;
  const mapSrc = mapQuery
    ? `https://www.google.com/maps/embed/v1/place?key=${googleMapsKey}&q=${encodeURIComponent(mapQuery)}`
    : "";

  const imagePreviews = useMemo(() => images.map((file) => URL.createObjectURL(file)), [images]);
  const videoPreviews = useMemo(() => videos.map((file) => URL.createObjectURL(file)), [videos]);

  useEffect(() => {
    return () => {
      // revoke created object URLs when component unmounts or files change
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      videoPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews, videoPreviews]);

  function setField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function setPropertyType(value: FormValues["propertyType"]) {
    setValues((current) => ({
      ...current,
      propertyType: value,
      bedrooms: isResidentialProperty(value) ? current.bedrooms : "",
      bathrooms: value === "LAND" ? "" : current.bathrooms,
      balconies: isResidentialProperty(value) ? current.balconies : "",
      plotAreaSqft: value === "LAND" ? current.plotAreaSqft : "",
      carpetAreaSqft: value === "LAND" ? "" : current.carpetAreaSqft,
      furnishing: value === "LAND" ? "" : current.furnishing,
    }));
  }

  function toggleAmenity(amenity: string) {
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity],
    );
  }

  function detectLocation() {
    setLocationMessage("");

    if (!navigator.geolocation) {
      setLocationMessage("Location detection is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDetectedLocation({
          latitude: Number(position.coords.latitude.toFixed(7)),
          longitude: Number(position.coords.longitude.toFixed(7)),
        });
        setLocationMessage(
          "Current location detected. It will be resolved by Google when submitted.",
        );
      },
      () => {
        setLocationMessage(
          "Unable to detect current location. Check browser location permission.",
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerMessage("");

    const parsed = createPropertySchema.safeParse(payload);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      setErrors({
        title: fieldErrors.title?.[0],
        description: fieldErrors.description?.[0],
        contactName: fieldErrors.contactName?.[0],
        contactPhone: fieldErrors.contactPhone?.[0],
        contactEmail: fieldErrors.contactEmail?.[0],
        price: fieldErrors.price?.[0],
        listingType: fieldErrors.listingType?.[0],
        propertyType: fieldErrors.propertyType?.[0],
        bedrooms: fieldErrors.bedrooms?.[0],
        bathrooms: fieldErrors.bathrooms?.[0],
        balconies: fieldErrors.balconies?.[0],
        areaSqft: fieldErrors.areaSqft?.[0],
        plotAreaSqft: fieldErrors.plotAreaSqft?.[0],
        carpetAreaSqft: fieldErrors.carpetAreaSqft?.[0],
        furnishing: fieldErrors.furnishing?.[0],
        amenities: fieldErrors.amenities?.[0],
        addressLine1: fieldErrors.addressLine1?.[0],
        addressLine2: fieldErrors.addressLine2?.[0],
        locality: fieldErrors.locality?.[0],
        city: fieldErrors.city?.[0],
        state: fieldErrors.state?.[0],
        pincode: fieldErrors.pincode?.[0],
        availabilityDate: fieldErrors.availabilityDate?.[0],
      });
      return;
    }

    const formData = new FormData();
    formData.append("payload", JSON.stringify(parsed.data));
    images.forEach((file) => formData.append("images", file));
    videos.forEach((file) => formData.append("videos", file));

    setStatus("submitting");

    const response = await fetch("/api/properties", {
      method: "POST",
      body: formData,
    });
    const result: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        result &&
        typeof result === "object" &&
        "message" in result &&
        typeof result.message === "string"
          ? result.message
          : "Unable to submit property.";

      setServerMessage(message);
      setStatus("idle");
      return;
    }

    setStatus("success");
    setValues(initialValues);
    setAmenities([]);
    setImages([]);
    setVideos([]);
    setDetectedLocation(null);
    setServerMessage("Property submitted for review.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <Field label="Property title" error={errors.title}>
            <input
              value={values.title}
              onChange={(event) => setField("title", event.target.value)}
              placeholder="Luxury 3 BHK near Smriti Nagar"
              className="input"
            />
          </Field>
          <Field label="Listing type" error={errors.listingType}>
            <div className="grid grid-cols-2 rounded-2xl bg-zinc-100 p-1">
              {listingTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setField("listingType", type)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    values.listingType === type
                      ? "bg-white text-zinc-950 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-950"
                  }`}
                >
                  {formatOption(type)}
                </button>
              ))}
            </div>
          </Field>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Field label="Property type" error={errors.propertyType}>
            <select
              value={values.propertyType}
              onChange={(event) =>
                setPropertyType(event.target.value as FormValues["propertyType"])
              }
              className="input"
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {formatOption(type)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Availability date" error={errors.availabilityDate}>
            <input
              type="date"
              value={values.availabilityDate}
              onChange={(event) =>
                setField("availabilityDate", event.target.value)
              }
              className="input"
            />
          </Field>
        </div>

        <Field label="Description" error={errors.description} className="mt-5">
          <textarea
            value={values.description}
            onChange={(event) => setField("description", event.target.value)}
            placeholder="Describe the property, location, access, condition, amenities, and ideal buyer or tenant."
            rows={5}
            className="input resize-none"
          />
        </Field>
      </section>

      <section className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-zinc-950">
          Contact details
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          These details will be stored with the listing for owner enquiries and
          admin verification.
        </p>
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <Field label="Name" error={errors.contactName}>
            <input
              value={values.contactName}
              onChange={(event) => setField("contactName", event.target.value)}
              placeholder="Point of Contact"
              className="input"
            />
          </Field>
          <Field label="Phone number" error={errors.contactPhone}>
            <input
              value={values.contactPhone}
              onChange={(event) => setField("contactPhone", event.target.value)}
              placeholder="+91 98765 43210"
              className="input"
            />
          </Field>
          <Field label="Email" error={errors.contactEmail}>
            <input
              type="email"
              value={values.contactEmail}
              onChange={(event) => setField("contactEmail", event.target.value)}
              placeholder="owner@example.com"
              className="input"
            />
          </Field>
        </div>
      </section>

      <section className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-zinc-950">
          Pricing and specs
        </h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Price" error={errors.price}>
            <input
              type="number"
              min="0"
              value={values.price}
              onChange={(event) => setField("price", event.target.value)}
              placeholder={values.listingType === "RENT" ? "45000" : "8500000"}
              className="input"
            />
          </Field>
          <Field label="Built-up area sq.ft" error={errors.areaSqft}>
            <input
              type="number"
              min="1"
              value={values.areaSqft}
              onChange={(event) => setField("areaSqft", event.target.value)}
              placeholder="1450"
              className="input"
            />
          </Field>
          {showPlotArea ? (
            <Field label="Plot area sq.ft" error={errors.plotAreaSqft}>
              <input
                type="number"
                min="0"
                value={values.plotAreaSqft}
                onChange={(event) =>
                  setField("plotAreaSqft", event.target.value)
                }
                className="input"
              />
            </Field>
          ) : null}
          {!showPlotArea ? (
            <Field label="Carpet area sq.ft" error={errors.carpetAreaSqft}>
              <input
                type="number"
                min="0"
                value={values.carpetAreaSqft}
                onChange={(event) =>
                  setField("carpetAreaSqft", event.target.value)
                }
                className="input"
              />
            </Field>
          ) : null}
          {showHomeSpecs ? (
            <>
              <Field label="Bedrooms" error={errors.bedrooms}>
                <input
                  type="number"
                  min="0"
                  value={values.bedrooms}
                  onChange={(event) => setField("bedrooms", event.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Balconies" error={errors.balconies}>
                <input
                  type="number"
                  min="0"
                  value={values.balconies}
                  onChange={(event) =>
                    setField("balconies", event.target.value)
                  }
                  className="input"
                />
              </Field>
            </>
          ) : null}
          {!showPlotArea ? (
            <>
              <Field label={showCommercialSpecs ? "Washrooms" : "Bathrooms"} error={errors.bathrooms}>
                <input
                  type="number"
                  min="0"
                  value={values.bathrooms}
                  onChange={(event) =>
                    setField("bathrooms", event.target.value)
                  }
                  className="input"
                />
              </Field>
              <Field label="Furnishing" error={errors.furnishing}>
                <select
                  value={values.furnishing}
                  onChange={(event) =>
                    setField(
                      "furnishing",
                      event.target.value as FormValues["furnishing"],
                    )
                  }
                  className="input"
                >
                  <option value="">Not applicable</option>
                  {furnishingStatuses.map((statusValue) => (
                    <option key={statusValue} value={statusValue}>
                      {formatOption(statusValue)}
                    </option>
                  ))}
                </select>
              </Field>
            </>
          ) : null}
        </div>
      </section>

      <section className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-zinc-950">Location</h2>
          <button
            type="button"
            onClick={detectLocation}
            className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-950"
          >
            Detect current location
          </button>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Field label="Address line 1" error={errors.addressLine1}>
            <input
              value={values.addressLine1}
              onChange={(event) => setField("addressLine1", event.target.value)}
              className="input"
            />
          </Field>
          <Field label="Address line 2" error={errors.addressLine2}>
            <input
              value={values.addressLine2}
              onChange={(event) => setField("addressLine2", event.target.value)}
              className="input"
            />
          </Field>
          <Field label="Locality" error={errors.locality}>
            <input
              value={values.locality}
              onChange={(event) => setField("locality", event.target.value)}
              placeholder="Smriti Nagar"
              className="input"
            />
          </Field>
          <Field label="City" error={errors.city}>
            <input
              value={values.city}
              onChange={(event) => setField("city", event.target.value)}
              className="input"
            />
          </Field>
          <Field label="State" error={errors.state}>
            <input
              value={values.state}
              onChange={(event) => setField("state", event.target.value)}
              className="input"
            />
          </Field>
          <Field label="Pincode" error={errors.pincode}>
            <input
              value={values.pincode}
              onChange={(event) => setField("pincode", event.target.value)}
              placeholder="490020"
              className="input"
            />
          </Field>
        </div>
        <p className="mt-4 text-sm leading-6 text-zinc-500">
          Use the address fields, or detect your current location for a more
          precise map point. Coordinates are not editable here and are resolved
          by Google on submit.
        </p>
        {locationMessage ? (
          <p className="mt-2 text-sm font-semibold text-zinc-700">
            {locationMessage}
          </p>
        ) : null}
        <div className="mt-5 overflow-hidden rounded-[24px] border border-zinc-200 bg-zinc-100">
          {mapSrc ? (
            <iframe
              title="Selected property location"
              src={mapSrc}
              className="h-72 w-full"
              loading="lazy"
            />
          ) : (
            <div className="flex h-72 items-center justify-center px-6 text-center text-sm font-medium text-zinc-500">
              Enter the property address or detect current location to preview
              it on Google Maps.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-zinc-950">
          Amenities and media
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {amenityOptions.map((amenity) => (
            <label
              key={amenity}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-400"
            >
              <input
                type="checkbox"
                checked={amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="size-4 accent-rose-600"
              />
              {amenity}
            </label>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <UploadField
            label="Property images"
            accept="image/jpeg,image/png,image/webp"
            multiple
            summary={getFileSummary(images)}
            onChange={setImages}
            error={errors.images}
          />
          <UploadField
            label="Property videos"
            accept="video/mp4,video/webm"
            multiple
            summary={getFileSummary(videos)}
            onChange={setVideos}
            error={errors.videos}
          />
        </div>
        {(images.length > 0 || videos.length > 0) && (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div>
              {images.length > 0 ? (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-zinc-800">Image previews</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative h-24 w-full overflow-hidden rounded-lg bg-zinc-100">
                        <img src={src} alt={`preview-${i}`} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <div>
              {videos.length > 0 ? (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-zinc-800">Video previews</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {videoPreviews.map((src, i) => (
                      <video key={i} src={src} controls className="h-36 w-full rounded-md bg-zinc-100 object-contain" />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </section>

      <div className="sticky bottom-4 z-10 rounded-[24px] border border-zinc-200 bg-white/90 p-4 shadow-xl backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-zinc-950">
              Submit for admin review
            </p>
            <p className="text-sm text-zinc-500">
              Listings are saved as pending until moderation approves them.
            </p>
            {serverMessage ? (
              <p
                className={`mt-2 text-sm font-medium ${
                  status === "success" ? "text-emerald-700" : "text-red-600"
                }`}
              >
                {serverMessage}
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-full bg-rose-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            {status === "submitting" ? "Submitting..." : "Submit listing"}
          </button>
        </div>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

function Field({ label, error, className = "", children }: FieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-zinc-800">
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-2 block text-sm text-red-600">{error}</span>
      ) : null}
    </label>
  );
}

type UploadFieldProps = {
  label: string;
  accept: string;
  multiple?: boolean;
  summary: string;
  error?: string;
  onChange: (files: File[]) => void;
};

function UploadField({
  label,
  accept,
  multiple = false,
  summary,
  error,
  onChange,
}: UploadFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-zinc-800">
        {label}
      </span>
      <span className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-zinc-300 bg-zinc-50 px-5 py-8 text-center transition hover:border-rose-400 hover:bg-rose-50/40">
        <span className="text-sm font-semibold text-zinc-950">
          Choose files from device
        </span>
        <span className="mt-2 max-w-sm text-xs leading-5 text-zinc-500">
          {summary}
        </span>
      </span>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(event) => onChange(Array.from(event.target.files ?? []))}
      />
      {error ? (
        <span className="mt-2 block text-sm text-red-600">{error}</span>
      ) : null}
    </label>
  );
}
