import { supabase } from "@/integrations/supabase/client";

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export function validateImage(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type) && !file.type.startsWith("image/")) {
    return "Vyber prosím obrázok (JPG, PNG alebo WEBP).";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Fotka je príliš veľká. Skús menšiu (do 8 MB).";
  }
  return null;
}

/**
 * Re-encodes any image (including iPhone HEIC photos, which upload fine as
 * raw bytes but are unreliable to display cross-browser) into a size-capped
 * JPEG. Falls back to the original file if decoding fails for any reason.
 */
export async function normalizeImage(file: File, maxSide = 1600): Promise<File> {
  if (file.type === "image/jpeg" && file.size <= MAX_IMAGE_BYTES) return file;
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Obrázok sa nepodarilo dekódovať."));
      el.src = url;
    });
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.88));
    if (!blob) return file;
    return new File([blob], "fotka.jpg", { type: "image/jpeg" });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function uploadImage(
  bucket: "avatars" | "activity-photos" | "profile-gallery" | "profile-cover",
  userId: string,
  file: File,
) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "image/jpeg",
  });
  if (error) throw error;
  return `${bucket}/${path}`;
}

/** Uploads to the public "blog-images" bucket and returns a permanent public URL. */
export async function uploadBlogImage(file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("blog-images").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || "image/jpeg",
  });
  if (error) throw error;
  return supabase.storage.from("blog-images").getPublicUrl(path).data.publicUrl;
}

/** Stored value is "bucket/path" — removes the underlying file. */
export async function deleteStoredImage(stored: string): Promise<void> {
  const [bucket, ...rest] = stored.split("/");
  const path = rest.join("/");
  if (!bucket || !path) return;
  await supabase.storage.from(bucket).remove([path]);
}

/** Stored value is "bucket/path". Returns a temporary readable URL. */
export async function resolveImageUrl(stored: string | null | undefined): Promise<string | null> {
  if (!stored) return null;
  if (stored.startsWith("http")) return stored;
  const [bucket, ...rest] = stored.split("/");
  const path = rest.join("/");
  if (!bucket || !path) return null;
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24);
  return data?.signedUrl ?? null;
}
