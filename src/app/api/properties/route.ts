import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { geocodePropertyAddress } from "@/services/geocoding";
import {
  attachPropertyImages,
  attachPropertyVideos,
  createPropertyListing,
} from "@/services/properties";
import { createPropertySchema } from "@/validations/property";

const imageMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const videoMimeTypes = new Set(["video/mp4", "video/webm"]);
const maxImageSize = 10 * 1024 * 1024;
const maxVideoSize = 100 * 1024 * 1024;

type UploadedMedia = {
  storagePath: string;
  publicUrl: string | null;
};

function getFiles(formData: FormData, key: string) {
  return formData.getAll(key).filter((item): item is File => item instanceof File);
}

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function validateFiles(
  files: File[],
  options: {
    label: string;
    maxCount: number;
    maxSize: number;
    mimeTypes: Set<string>;
  },
) {
  if (files.length > options.maxCount) {
    return `${options.label} uploads are limited to ${options.maxCount} files.`;
  }

  const invalidFile = files.find(
    (file) => !options.mimeTypes.has(file.type) || file.size > options.maxSize,
  );

  if (!invalidFile) {
    return null;
  }

  return `${invalidFile.name} is not an allowed ${options.label.toLowerCase()} file.`;
}

async function uploadFiles({
  files,
  bucket,
  userId,
  propertyId,
  isPublic,
}: {
  files: File[];
  bucket: "property-images" | "property-videos";
  userId: string;
  propertyId: string;
  isPublic: boolean;
}) {
  const supabase = await createSupabaseServerClient();
  const uploaded: UploadedMedia[] = [];

  for (const file of files) {
    const path = `${userId}/${propertyId}/${crypto.randomUUID()}-${sanitizeFileName(file.name)}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      throw new Error(error.message);
    }

    const publicUrl = isPublic
      ? supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
      : null;

    uploaded.push({
      storagePath: path,
      publicUrl,
    });
  }

  return uploaded;
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return NextResponse.json(
      { message: "Request must be multipart form data." },
      { status: 400 },
    );
  }

  const payload = formData.get("payload");

  if (typeof payload !== "string") {
    return NextResponse.json(
      { message: "Missing property payload." },
      { status: 400 },
    );
  }

  const rawBody: unknown = (() => {
    try {
      return JSON.parse(payload);
    } catch {
      return null;
    }
  })();
  const parsed = createPropertySchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Invalid property payload.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const imageFiles = getFiles(formData, "images");
  const videoFiles = getFiles(formData, "videos");
  const imageError = validateFiles(imageFiles, {
    label: "Image",
    maxCount: 12,
    maxSize: maxImageSize,
    mimeTypes: imageMimeTypes,
  });
  const videoError = validateFiles(videoFiles, {
    label: "Video",
    maxCount: 4,
    maxSize: maxVideoSize,
    mimeTypes: videoMimeTypes,
  });

  if (imageError || videoError) {
    return NextResponse.json(
      { message: imageError ?? videoError },
      { status: 422 },
    );
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { message: "You must be signed in to list a property." },
        { status: 401 },
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json(
        { message: "Create your profile before listing a property." },
        { status: 403 },
      );
    }

    const coordinates = await geocodePropertyAddress(parsed.data);
    const property = await createPropertyListing(supabase, user.id, {
      ...parsed.data,
      latitude: coordinates?.latitude ?? null,
      longitude: coordinates?.longitude ?? null,
      images: [],
      videos: [],
    });

    const uploadedImages = await uploadFiles({
      files: imageFiles,
      bucket: "property-images",
      userId: user.id,
      propertyId: property.id,
      isPublic: true,
    });
    const uploadedVideos = await uploadFiles({
      files: videoFiles,
      bucket: "property-videos",
      userId: user.id,
      propertyId: property.id,
      isPublic: false,
    });

    await attachPropertyImages(
      supabase,
      property.id,
      parsed.data.title,
      uploadedImages,
    );
    await attachPropertyVideos(
      supabase,
      property.id,
      parsed.data.title,
      uploadedVideos,
    );

    return NextResponse.json(
      {
        message: "Property submitted for review.",
        property,
      },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to create property listing.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
