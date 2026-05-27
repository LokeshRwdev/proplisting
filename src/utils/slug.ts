export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function createUniqueSlug(parts: string[]) {
  const base = slugify(parts.filter(Boolean).join(" "));
  const suffix = Date.now().toString(36);

  return `${base || "property"}-${suffix}`;
}
