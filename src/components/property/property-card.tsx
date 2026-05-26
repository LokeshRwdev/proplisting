import Image from "next/image";

import type { FeaturedProperty } from "@/types/property";

type PropertyCardProps = {
  property: FeaturedProperty;
};

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-900 shadow-sm backdrop-blur">
          {property.intent}
        </div>
        {property.isVerified ? (
          <div className="absolute right-4 top-4 rounded-full bg-emerald-950/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            Verified
          </div>
        ) : null}
      </div>
      <div className="space-y-4 p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold leading-6 text-zinc-950">
              {property.title}
            </h3>
            <span className="shrink-0 text-sm font-semibold text-zinc-800">
              {property.rating.toFixed(1)}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500">{property.location}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-600">
          <span>{property.type}</span>
          <span className="text-zinc-300">/</span>
          <span>{property.area}</span>
          {property.beds ? (
            <>
              <span className="text-zinc-300">/</span>
              <span>{property.beds} beds</span>
            </>
          ) : null}
        </div>
        <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
          <p className="text-xl font-semibold text-zinc-950">
            {property.price}
          </p>
          <a
            href={`/properties/${property.id}`}
            className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            View
          </a>
        </div>
      </div>
    </article>
  );
}
