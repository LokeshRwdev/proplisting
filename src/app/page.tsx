import Image from "next/image";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PropertyCard } from "@/components/property/property-card";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  featuredProperties,
  popularCities,
  propertyCategories,
  searchTags,
} from "@/constants/market";

const stats = [
  ["1,250+", "verified listings"],
  ["18 min", "median owner response"],
  ["42+", "premium localities"],
];

const testimonials = [
  {
    quote:
      "The commercial shortlist was sharper than anything we found on large portals. We closed a clinic space in three site visits.",
    name: "Dr. Kavita Rao",
    role: "Clinic founder",
  },
  {
    quote:
      "The listing flow made it simple to present our warehouse with the right details, photos, and serious enquiries.",
    name: "Arvind Sahu",
    role: "Property owner",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <SiteHeader />

      <section className="relative min-h-[760px] bg-zinc-950 pt-28 text-white">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85"
          alt="Premium residential property exterior"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,11,0.88),rgba(9,9,11,0.38),rgba(9,9,11,0.24))]" />
        <div className="relative mx-auto flex min-h-[632px] max-w-7xl flex-col justify-end px-5 pb-8 sm:px-8 lg:px-10">
          <div className="max-w-3xl pb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-200">
              Premium Bhilai real estate
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Find homes and commercial spaces worth visiting.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-100">
              Browse verified flats, land, offices, shops, restaurants, and
              warehouses with fast owner connections and local market context.
            </p>
          </div>

          <div className="rounded-[32px] border border-white/25 bg-white p-3 text-zinc-950 shadow-2xl">
            <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.7fr_auto]">
              <label className="rounded-3xl bg-zinc-50 px-5 py-4">
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Location
                </span>
                <input
                  className="mt-1 w-full bg-transparent text-base font-semibold outline-none placeholder:text-zinc-400"
                  placeholder="Search Bhilai, Durg, Raipur"
                />
              </label>
              <label className="rounded-3xl bg-zinc-50 px-5 py-4">
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Intent
                </span>
                <select className="mt-1 w-full bg-transparent text-base font-semibold outline-none">
                  <option>Buy</option>
                  <option>Rent</option>
                  <option>Sell</option>
                </select>
              </label>
              <label className="rounded-3xl bg-zinc-50 px-5 py-4">
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Property
                </span>
                <select className="mt-1 w-full bg-transparent text-base font-semibold outline-none">
                  <option>Apartment</option>
                  <option>Land</option>
                  <option>Office</option>
                  <option>Shop</option>
                  <option>Warehouse</option>
                </select>
              </label>
              <label className="rounded-3xl bg-zinc-50 px-5 py-4">
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Budget
                </span>
                <select className="mt-1 w-full bg-transparent text-base font-semibold outline-none">
                  <option>Any budget</option>
                  <option>Under ₹50 L</option>
                  <option>₹50 L - ₹1 Cr</option>
                  <option>₹1 Cr+</option>
                </select>
              </label>
              <button className="rounded-3xl bg-rose-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-rose-700">
                Search
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {searchTags.map((tag) => (
              <a
                key={tag}
                href="#listings"
                className="rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/25"
              >
                {tag}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 sm:grid-cols-3 sm:px-8 lg:px-10">
          {stats.map(([value, label]) => (
            <div key={label} className="border-l border-zinc-200 pl-5">
              <p className="text-3xl font-semibold text-zinc-950">{value}</p>
              <p className="mt-1 text-sm font-medium text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="listings" className="px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Featured listings"
            title="Verified spaces with the details buyers ask for first"
            description="Each listing is structured for quick comparison across pricing, area, location quality, and owner readiness."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section id="categories" className="bg-white px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Property categories"
            title="Residential and commercial inventory in one workflow"
            description="Support for land, flats, offices, restaurants, shops, and warehouses keeps discovery simple for every intent."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {propertyCategories.map((category) => (
              <article
                key={category.name}
                className="rounded-[24px] border border-zinc-200 bg-stone-50 p-6 transition hover:border-rose-200 hover:bg-rose-50/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold text-zinc-950">
                    {category.name}
                  </h3>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-rose-600 shadow-sm">
                    {category.count}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-zinc-600">
                  {category.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-600">
              Popular cities
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              Local coverage for Bhilai and its fastest-moving corridors
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Search across neighborhoods where residential demand and
              commercial footfall are already measurable.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {popularCities.map((city) => (
              <a
                key={city}
                href="#listings"
                className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-lg font-semibold text-zinc-950 shadow-sm transition hover:border-zinc-950"
              >
                {city}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="commercial" className="bg-zinc-950 px-5 py-20 text-white sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[36px]">
            <Image
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85"
              alt="Modern commercial tower"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-200">
              Premium commercial
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Offices, shops, restaurants, and warehouses ready for serious
              operators.
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-300">
              Compare frontage, floor plate, power load, parking, loading
              access, and owner terms before scheduling visits.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["Lease-ready offices", "Retail frontage", "F&B fit-outs", "Industrial storage"].map(
                (item) => (
                  <div key={item} className="rounded-2xl bg-white/10 p-5">
                    <p className="font-semibold">{item}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Why choose us"
            title="A faster path from search to site visit"
            description="BhilaiProps is structured around verified data, responsive owners, and workflows that work for Indian residential and commercial deals."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              "Verified owner and agent profiles",
              "Structured amenities, media, maps, and pricing",
              "Realtime enquiries, saves, and listing analytics",
            ].map((item) => (
              <div key={item} className="rounded-[24px] bg-stone-50 p-6">
                <p className="text-lg font-semibold leading-7 text-zinc-950">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="rounded-[28px] border border-zinc-200 bg-white p-8 shadow-sm"
            >
              <blockquote className="text-xl font-medium leading-9 text-zinc-950">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-6">
                <p className="font-semibold text-zinc-950">{testimonial.name}</p>
                <p className="text-sm text-zinc-500">{testimonial.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-rose-600 px-6 py-14 text-center text-white sm:px-10">
          <h2 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight">
            Ready to list a property with better leads and richer presentation?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-rose-50">
            Create a verified listing for homes, land, offices, shops,
            restaurants, and warehouses with media, coordinates, and owner
            details.
          </p>
          <a
            href="/properties/new"
            className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
          >
            Start listing
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
