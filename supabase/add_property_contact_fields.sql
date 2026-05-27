-- Run this on an existing BhilaiProps database if properties table already exists.
-- Fresh projects can use supabase/schema.sql directly.

alter table public.properties
add column if not exists contact_name text,
add column if not exists contact_phone text,
add column if not exists contact_email text;

update public.properties
set
  contact_name = coalesce(contact_name, profiles.full_name),
  contact_phone = coalesce(contact_phone, profiles.phone, ''),
  contact_email = coalesce(contact_email, profiles.email, '')
from public.profiles
where public.properties.owner_id = profiles.id
  and (
    public.properties.contact_name is null
    or public.properties.contact_phone is null
    or public.properties.contact_email is null
  );

alter table public.properties
alter column contact_name set not null,
alter column contact_phone set not null,
alter column contact_email set not null;
