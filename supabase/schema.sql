-- BhilaiProps Supabase schema
-- Paste into Supabase SQL Editor on a fresh project.

create extension if not exists "pgcrypto";
create extension if not exists "postgis";

create type public.user_role as enum ('USER', 'AGENT', 'ADMIN');
create type public.property_type as enum ('LAND', 'FLAT', 'APARTMENT', 'OFFICE', 'RESTAURANT_SPACE', 'SHOP', 'WAREHOUSE');
create type public.listing_type as enum ('BUY', 'RENT', 'SELL');
create type public.property_status as enum ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED');
create type public.furnishing_status as enum ('UNFURNISHED', 'SEMI_FURNISHED', 'FULLY_FURNISHED');
create type public.chat_status as enum ('OPEN', 'CLOSED', 'BLOCKED');
create type public.inquiry_status as enum ('NEW', 'CONTACTED', 'SITE_VISIT', 'NEGOTIATION', 'CLOSED', 'LOST');
create type public.payment_status as enum ('CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED');
create type public.subscription_status as enum ('ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELLED', 'EXPIRED');
create type public.notification_type as enum ('INQUIRY', 'MESSAGE', 'PAYMENT', 'PROPERTY_APPROVED', 'PROPERTY_REJECTED', 'SYSTEM');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'USER',
  full_name text not null,
  email text,
  phone text,
  avatar_url text,
  bio text,
  company_name text,
  rera_id text,
  is_verified boolean not null default false,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  slug text not null unique,
  description text not null,
  contact_name text not null,
  contact_phone text not null,
  contact_email text not null,
  price numeric(14,2) not null check (price >= 0),
  listing_type public.listing_type not null,
  property_type public.property_type not null,
  status public.property_status not null default 'DRAFT',
  bedrooms integer check (bedrooms is null or bedrooms >= 0),
  bathrooms integer check (bathrooms is null or bathrooms >= 0),
  balconies integer check (balconies is null or balconies >= 0),
  area_sqft numeric(12,2) not null check (area_sqft > 0),
  plot_area_sqft numeric(12,2) check (plot_area_sqft is null or plot_area_sqft > 0),
  carpet_area_sqft numeric(12,2) check (carpet_area_sqft is null or carpet_area_sqft > 0),
  furnishing public.furnishing_status,
  amenities text[] not null default '{}',
  address_line1 text not null,
  address_line2 text,
  locality text not null,
  city text not null,
  state text not null default 'Chhattisgarh',
  pincode text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  coordinates geography(point, 4326),
  availability_date date,
  is_featured boolean not null default false,
  featured_until timestamptz,
  view_count bigint not null default 0,
  moderation_note text,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  storage_path text not null,
  public_url text,
  blur_data_url text,
  alt_text text,
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.property_videos (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  storage_path text not null,
  public_url text,
  thumbnail_url text,
  title text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, property_id)
);

create table public.chats (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete set null,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  status public.chat_status not null default 'OPEN',
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  constraint chats_distinct_users check (buyer_id <> owner_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.chats(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  attachment_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  email text,
  phone text not null,
  message text,
  status public.inquiry_status not null default 'NEW',
  site_visit_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  agent_id uuid references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type public.notification_type not null,
  title text not null,
  body text,
  data jsonb not null default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_name text not null,
  razorpay_subscription_id text unique,
  status public.subscription_status not null default 'TRIALING',
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  razorpay_order_id text unique,
  razorpay_payment_id text unique,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'INR',
  purpose text not null,
  status public.payment_status not null default 'CREATED',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.property_views (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  viewer_id uuid references public.profiles(id) on delete set null,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  filters jsonb not null default '{}',
  notify boolean not null default true,
  created_at timestamptz not null default now()
);

create index properties_owner_idx on public.properties(owner_id);
create index properties_status_idx on public.properties(status);
create index properties_search_idx on public.properties(city, locality, listing_type, property_type, price);
create index properties_coordinates_idx on public.properties using gist(coordinates);
create index property_images_property_idx on public.property_images(property_id);
create index chats_participants_idx on public.chats(buyer_id, owner_id);
create index messages_chat_created_idx on public.messages(chat_id, created_at desc);
create index inquiries_owner_idx on public.inquiries(owner_id, status);
create index notifications_user_idx on public.notifications(user_id, read_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

create trigger properties_set_updated_at before update on public.properties
for each row execute function public.set_updated_at();

create or replace function public.set_property_coordinates()
returns trigger
language plpgsql
as $$
begin
  if new.latitude is not null and new.longitude is not null then
    new.coordinates = st_setsrid(st_makepoint(new.longitude, new.latitude), 4326)::geography;
  else
    new.coordinates = null;
  end if;

  return new;
end;
$$;

create trigger properties_set_coordinates before insert or update on public.properties
for each row execute function public.set_property_coordinates();

create trigger inquiries_set_updated_at before update on public.inquiries
for each row execute function public.set_updated_at();

create trigger subscriptions_set_updated_at before update on public.subscriptions
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'ADMIN' and deleted_at is null
  );
$$;

create or replace function public.is_chat_participant(chat_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.chats
    where id = chat_uuid and (buyer_id = auth.uid() or owner_id = auth.uid())
  );
$$;

alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.property_videos enable row level security;
alter table public.favorites enable row level security;
alter table public.chats enable row level security;
alter table public.messages enable row level security;
alter table public.inquiries enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.property_views enable row level security;
alter table public.saved_searches enable row level security;

create policy "profiles are publicly readable" on public.profiles
for select using (deleted_at is null);
create policy "users update own profile" on public.profiles
for update using (id = auth.uid()) with check (id = auth.uid());
create policy "users insert own profile" on public.profiles
for insert with check (id = auth.uid());

create policy "public can view approved properties" on public.properties
for select using (status = 'APPROVED' and deleted_at is null);
create policy "owners can view own properties" on public.properties
for select using (owner_id = auth.uid());
create policy "owners create properties" on public.properties
for insert with check (owner_id = auth.uid());
create policy "owners update own unapproved properties" on public.properties
for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "admins manage properties" on public.properties
for all using (public.is_admin()) with check (public.is_admin());

create policy "public can view approved property images" on public.property_images
for select using (exists (select 1 from public.properties p where p.id = property_id and p.status = 'APPROVED' and p.deleted_at is null));
create policy "owners manage property images" on public.property_images
for all using (exists (select 1 from public.properties p where p.id = property_id and p.owner_id = auth.uid()))
with check (exists (select 1 from public.properties p where p.id = property_id and p.owner_id = auth.uid()));

create policy "public can view approved property videos" on public.property_videos
for select using (exists (select 1 from public.properties p where p.id = property_id and p.status = 'APPROVED' and p.deleted_at is null));
create policy "owners manage property videos" on public.property_videos
for all using (exists (select 1 from public.properties p where p.id = property_id and p.owner_id = auth.uid()))
with check (exists (select 1 from public.properties p where p.id = property_id and p.owner_id = auth.uid()));

create policy "users manage own favorites" on public.favorites
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "chat participants read chats" on public.chats
for select using (buyer_id = auth.uid() or owner_id = auth.uid());
create policy "users create own chats" on public.chats
for insert with check (buyer_id = auth.uid() or owner_id = auth.uid());
create policy "chat participants update chats" on public.chats
for update using (buyer_id = auth.uid() or owner_id = auth.uid());

create policy "chat participants read messages" on public.messages
for select using (public.is_chat_participant(chat_id));
create policy "chat participants send messages" on public.messages
for insert with check (sender_id = auth.uid() and public.is_chat_participant(chat_id));

create policy "users create inquiries" on public.inquiries
for insert with check (user_id is null or user_id = auth.uid());
create policy "inquiry parties read inquiries" on public.inquiries
for select using (user_id = auth.uid() or owner_id = auth.uid() or public.is_admin());
create policy "owners and admins update inquiries" on public.inquiries
for update using (owner_id = auth.uid() or public.is_admin());

create policy "public can view reviews" on public.reviews
for select using (true);
create policy "users create own reviews" on public.reviews
for insert with check (reviewer_id = auth.uid());

create policy "users manage own notifications" on public.notifications
for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users view own subscriptions" on public.subscriptions
for select using (user_id = auth.uid() or public.is_admin());
create policy "admins manage subscriptions" on public.subscriptions
for all using (public.is_admin()) with check (public.is_admin());
create policy "users view own payments" on public.payments
for select using (user_id = auth.uid() or public.is_admin());
create policy "admins manage payments" on public.payments
for all using (public.is_admin()) with check (public.is_admin());
create policy "users create property views" on public.property_views
for insert with check (viewer_id is null or viewer_id = auth.uid());
create policy "owners view analytics" on public.property_views
for select using (exists (select 1 from public.properties p where p.id = property_id and p.owner_id = auth.uid()) or public.is_admin());
create policy "users manage saved searches" on public.saved_searches
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('property-images', 'property-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('property-videos', 'property-videos', false, 104857600, array['video/mp4', 'video/webm']),
  ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('documents', 'documents', false, 20971520, array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "public read property images" on storage.objects
for select using (bucket_id = 'property-images');
create policy "authenticated users upload property images" on storage.objects
for insert with check (bucket_id = 'property-images' and auth.role() = 'authenticated');
create policy "authenticated users manage own storage files" on storage.objects
for update using (owner = auth.uid()) with check (owner = auth.uid());
create policy "authenticated users delete own storage files" on storage.objects
for delete using (owner = auth.uid());
create policy "public read avatars" on storage.objects
for select using (bucket_id = 'avatars');
create policy "authenticated users upload avatars" on storage.objects
for insert with check (bucket_id = 'avatars' and auth.role() = 'authenticated');
