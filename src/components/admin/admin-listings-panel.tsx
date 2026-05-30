"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import Image from "next/image";
import {
  furnishingStatuses,
  listingTypes,
  propertyTypes,
} from "@/constants/property-options";
import type { AdminProperty } from "@/services/admin-properties";
import type { Database } from "@/types/database";

type PropertyStatus =
  Database["public"]["Tables"]["properties"]["Row"]["status"];

type ApiListResponse = {
  properties: AdminProperty[];
};

type ApiErrorResponse = {
  message?: string;
};

type EditValues = {
  title: string;
  description: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  price: string;
  listingType: AdminProperty["listing_type"];
  propertyType: AdminProperty["property_type"];
  status: AdminProperty["status"];
  bedrooms: string;
  bathrooms: string;
  areaSqft: string;
  furnishing: "" | NonNullable<AdminProperty["furnishing"]>;
  locality: string;
  city: string;
  moderationNote: string;
  isFeatured: boolean;
};

const statusTabs: Array<"ALL" | PropertyStatus> = [
  "ALL",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "ARCHIVED",
  "DRAFT",
];

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toEditValues(property: AdminProperty): EditValues {
  return {
    title: property.title,
    description: property.description,
    contactName: property.contact_name,
    contactPhone: property.contact_phone,
    contactEmail: property.contact_email,
    price: String(property.price),
    listingType: property.listing_type,
    propertyType: property.property_type,
    status: property.status,
    bedrooms: property.bedrooms === null ? "" : String(property.bedrooms),
    bathrooms: property.bathrooms === null ? "" : String(property.bathrooms),
    areaSqft: String(property.area_sqft),
    furnishing: property.furnishing ?? "",
    locality: property.locality,
    city: property.city,
    moderationNote: property.moderation_note ?? "",
    isFeatured: property.is_featured,
  };
}

function numberOrNull(value: string) {
  return value.trim() === "" ? null : Number(value);
}

export function AdminListingsPanel() {
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [status, setStatus] = useState<"ALL" | PropertyStatus>("PENDING");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<AdminProperty | null>(null);
  const [editValues, setEditValues] = useState<EditValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const counts = useMemo(() => {
    return properties.reduce<Record<string, number>>(
      (current, property) => ({
        ...current,
        [property.status]: (current[property.status] ?? 0) + 1,
        ALL: (current.ALL ?? 0) + 1,
      }),
      {},
    );
  }, [properties]);

  const loadProperties = useCallback(async (nextStatus = status, nextQuery = query) => {
    setIsLoading(true);
    setMessage("");

    const params = new URLSearchParams();

    if (nextStatus !== "ALL") {
      params.set("status", nextStatus);
    }

    if (nextQuery.trim()) {
      params.set("q", nextQuery.trim());
    }

    const response = await fetch(`/api/admin/properties?${params.toString()}`);
    const result: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const error = result as ApiErrorResponse | null;
      setMessage(error?.message ?? "Unable to load listings.");
      setProperties([]);
      setIsLoading(false);
      return;
    }

    const data = result as ApiListResponse;
    setProperties(data.properties);
    setIsLoading(false);
  }, [query, status]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadProperties();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadProperties]);

  function selectProperty(property: AdminProperty) {
    setSelected(property);
    setEditValues(toEditValues(property));
    setMessage("");
  }

  async function updateProperty(
    propertyId: string,
    payload: Record<string, unknown>,
  ) {
    setIsSaving(true);
    setMessage("");

    const response = await fetch(`/api/admin/properties/${propertyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const error = result as ApiErrorResponse | null;
      setMessage(error?.message ?? "Unable to update listing.");
      setIsSaving(false);
      return;
    }

    setMessage("Listing updated.");
    setIsSaving(false);
    await loadProperties();
  }

  async function archiveProperty(propertyId: string) {
    setIsSaving(true);
    setMessage("");

    const response = await fetch(`/api/admin/properties/${propertyId}`, {
      method: "DELETE",
    });
    const result: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const error = result as ApiErrorResponse | null;
      setMessage(error?.message ?? "Unable to archive listing.");
      setIsSaving(false);
      return;
    }

    setMessage("Listing archived.");
    setSelected(null);
    setEditValues(null);
    setIsSaving(false);
    await loadProperties();
  }

  async function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadProperties(status, query);
  }

  async function submitEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selected || !editValues) {
      return;
    }

    await updateProperty(selected.id, {
      title: editValues.title,
      description: editValues.description,
      contactName: editValues.contactName,
      contactPhone: editValues.contactPhone,
      contactEmail: editValues.contactEmail,
      price: Number(editValues.price),
      listingType: editValues.listingType,
      propertyType: editValues.propertyType,
      status: editValues.status,
      bedrooms: numberOrNull(editValues.bedrooms),
      bathrooms: numberOrNull(editValues.bathrooms),
      areaSqft: Number(editValues.areaSqft),
      furnishing: editValues.furnishing || null,
      locality: editValues.locality,
      city: editValues.city,
      moderationNote: editValues.moderationNote || null,
      isFeatured: editValues.isFeatured,
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <section className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-950">Listing moderation</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Review, approve, edit, reject, feature, or archive submitted
              listings.
            </p>
          </div>
          <form onSubmit={submitSearch} className="flex gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, city, slug"
              className="input h-11 min-w-0 lg:w-72"
            />
            <button
              type="submit"
              className="rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-rose-600"
            >
              Search
            </button>
          </form>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setStatus(tab);
                void loadProperties(tab, query);
              }}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                status === tab
                  ? "bg-zinc-950 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {formatEnum(tab)} {counts[tab] ? `(${counts[tab]})` : ""}
            </button>
          ))}
        </div>

        {message ? (
          <p className="mt-4 rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-700">
            {message}
          </p>
        ) : null}

        <div className="mt-5 overflow-hidden rounded-[24px] border border-zinc-200">
          <div className="grid grid-cols-[1.3fr_0.8fr_0.7fr_0.8fr] bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            <span>Listing</span>
            <span>Owner</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          {isLoading ? (
            <div className="p-6 text-sm font-medium text-zinc-500">
              Loading listings...
            </div>
          ) : null}

          {!isLoading && properties.length === 0 ? (
            <div className="p-6 text-sm font-medium text-zinc-500">
              No listings found.
            </div>
          ) : null}

          {properties.map((property) => (
            <article
              key={property.id}
              className="grid grid-cols-1 gap-4 border-t border-zinc-200 px-4 py-4 lg:grid-cols-[1.3fr_0.8fr_0.7fr_0.8fr] lg:items-center"
            >
              <div>
                <p className="font-semibold text-zinc-950">{property.title}</p>
                <p className="mt-1 text-sm text-zinc-500">
                  {formatEnum(property.property_type)} /{" "}
                  {formatEnum(property.listing_type)} / {property.locality},{" "}
                  {property.city}
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  {property.image_count} images / {property.video_count} videos
                </p>
              </div>
              <div className="text-sm text-zinc-600">
                <p className="font-medium text-zinc-800">
                  {property.contact_name}
                </p>
                <p>{property.contact_phone}</p>
                <p>{property.contact_email}</p>
              </div>
              <StatusBadge status={property.status} />
              <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
                <button
                  type="button"
                  onClick={() => selectProperty(property)}
                  className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() =>
                    updateProperty(property.id, { status: "APPROVED" })
                  }
                  className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:bg-zinc-300"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() =>
                    updateProperty(property.id, { status: "REJECTED" })
                  }
                  className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-zinc-300"
                >
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm xl:sticky xl:top-6 xl:self-start">
        {!selected || !editValues ? (
          <div className="flex min-h-96 items-center justify-center rounded-[24px] bg-zinc-50 p-8 text-center">
            <div>
              <p className="font-semibold text-zinc-950">
                Select a listing to edit
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Admin edits support moderation status, pricing, location,
                featuring, and core listing details.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={submitEdit} className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-zinc-950">
                  Edit listing
                </h2>
                <p className="mt-1 text-sm text-zinc-500">{selected.slug}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setEditValues(null);
                }}
                className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-600"
              >
                Close
              </button>
            </div>

            <AdminField label="Title">
              <input
                value={editValues.title}
                onChange={(event) =>
                  setEditValues({ ...editValues, title: event.target.value })
                }
                className="input"
              />
            </AdminField>
            <AdminField label="Description">
              <textarea
                value={editValues.description}
                onChange={(event) =>
                  setEditValues({
                    ...editValues,
                    description: event.target.value,
                  })
                }
                rows={4}
                className="input resize-none"
              />
            </AdminField>
            <div className="grid gap-4 sm:grid-cols-3">
              <AdminField label="Contact name">
                <input
                  value={editValues.contactName}
                  onChange={(event) =>
                    setEditValues({
                      ...editValues,
                      contactName: event.target.value,
                    })
                  }
                  className="input"
                />
              </AdminField>
              <AdminField label="Phone">
                <input
                  value={editValues.contactPhone}
                  onChange={(event) =>
                    setEditValues({
                      ...editValues,
                      contactPhone: event.target.value,
                    })
                  }
                  className="input"
                />
              </AdminField>
              <AdminField label="Email">
                <input
                  type="email"
                  value={editValues.contactEmail}
                  onChange={(event) =>
                    setEditValues({
                      ...editValues,
                      contactEmail: event.target.value,
                    })
                  }
                  className="input"
                />
              </AdminField>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Price">
                <input
                  type="number"
                  value={editValues.price}
                  onChange={(event) =>
                    setEditValues({ ...editValues, price: event.target.value })
                  }
                  className="input"
                />
              </AdminField>
              <AdminField label="Area sq.ft">
                <input
                  type="number"
                  value={editValues.areaSqft}
                  onChange={(event) =>
                    setEditValues({
                      ...editValues,
                      areaSqft: event.target.value,
                    })
                  }
                  className="input"
                />
              </AdminField>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Listing type">
                <select
                  value={editValues.listingType}
                  onChange={(event) =>
                    setEditValues({
                      ...editValues,
                      listingType: event.target.value as EditValues["listingType"],
                    })
                  }
                  className="input"
                >
                  {listingTypes.map((type) => (
                    <option key={type} value={type}>
                      {formatEnum(type)}
                    </option>
                  ))}
                </select>
              </AdminField>
              <AdminField label="Property type">
                <select
                  value={editValues.propertyType}
                  onChange={(event) =>
                    setEditValues({
                      ...editValues,
                      propertyType: event.target.value as EditValues["propertyType"],
                    })
                  }
                  className="input"
                >
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {formatEnum(type)}
                    </option>
                  ))}
                </select>
              </AdminField>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Bedrooms">
                <input
                  type="number"
                  value={editValues.bedrooms}
                  onChange={(event) =>
                    setEditValues({
                      ...editValues,
                      bedrooms: event.target.value,
                    })
                  }
                  className="input"
                />
              </AdminField>
              <AdminField label="Bathrooms">
                <input
                  type="number"
                  value={editValues.bathrooms}
                  onChange={(event) =>
                    setEditValues({
                      ...editValues,
                      bathrooms: event.target.value,
                    })
                  }
                  className="input"
                />
              </AdminField>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Locality">
                <input
                  value={editValues.locality}
                  onChange={(event) =>
                    setEditValues({
                      ...editValues,
                      locality: event.target.value,
                    })
                  }
                  className="input"
                />
              </AdminField>
              <AdminField label="City">
                <input
                  value={editValues.city}
                  onChange={(event) =>
                    setEditValues({ ...editValues, city: event.target.value })
                  }
                  className="input"
                />
              </AdminField>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Status">
                <select
                  value={editValues.status}
                  onChange={(event) =>
                    setEditValues({
                      ...editValues,
                      status: event.target.value as EditValues["status"],
                    })
                  }
                  className="input"
                >
                  {statusTabs
                    .filter((item) => item !== "ALL")
                    .map((item) => (
                      <option key={item} value={item}>
                        {formatEnum(item)}
                      </option>
                    ))}
                </select>
              </AdminField>
              <AdminField label="Furnishing">
                <select
                  className="input"
                  value={editValues.furnishing}
                  onChange={(event) =>
                    setEditValues({
                      ...editValues,
                      furnishing: event.target
                        .value as EditValues["furnishing"],
                    })
                  }
                >
                  <option value="">Not applicable</option>
                  {furnishingStatuses.map((item) => (
                    <option key={item} value={item}>
                      {formatEnum(item)}
                    </option>
                  ))}
                </select>
              </AdminField>
            </div>
            <label className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-4 text-sm font-semibold text-zinc-700">
              <input
                type="checkbox"
                checked={editValues.isFeatured}
                onChange={(event) =>
                  setEditValues({
                    ...editValues,
                    isFeatured: event.target.checked,
                  })
                }
                className="size-4 accent-rose-600"
              />
              Feature listing
            </label>
            <AdminField label="Moderation note">
              <textarea
                value={editValues.moderationNote}
                onChange={(event) =>
                  setEditValues({
                    ...editValues,
                    moderationNote: event.target.value,
                  })
                }
                rows={3}
                className="input resize-none"
              />
            </AdminField>
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:bg-zinc-300"
              >
                Save changes
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => archiveProperty(selected.id)}
                className="rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:text-zinc-300"
              >
                Archive listing
              </button>
            </div>
          </form>
        )}
      </aside>
    </div>
  );
}

function StatusBadge({ status }: { status: PropertyStatus }) {
  const classes: Record<PropertyStatus, string> = {
    DRAFT: "bg-zinc-100 text-zinc-700",
    PENDING: "bg-amber-100 text-amber-800",
    APPROVED: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-red-100 text-red-800",
    ARCHIVED: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${classes[status]}`}
    >
      {formatEnum(status)}
    </span>
  );
}

function AdminField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-zinc-800">
        {label}
      </span>
      {children}
    </label>
  );
}
