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

export async function uploadImage(bucket: "avatars" | "activity-photos" | "profile-gallery", userId: string, file: File) {
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
