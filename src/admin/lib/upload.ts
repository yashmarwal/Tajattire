import { supabase } from "@/lib/supabase";

const URL_ = import.meta.env.VITE_SUPABASE_URL ?? "";
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";
export const CACHE_SECONDS = 31536000; // 1 year — every upload gets a unique name

const safeExt = (name: string) =>
  (name.split(".").pop() ?? "bin")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 5) || "bin";

/** Uploads one file with real byte progress (XHR — fetch can't report upload
 * progress) and a long cache header. Resolves to the public URL. */
export async function uploadWithProgress(
  file: File,
  bucket: string,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Your session has expired — please sign in again.");
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt(file.name)}`;

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${URL_}/storage/v1/object/${bucket}/${path}`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("apikey", KEY);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.setRequestHeader("cache-control", `max-age=${CACHE_SECONDS}`);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.upload.onprogress = (e) =>
      e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve();
      let msg = xhr.responseText;
      try {
        msg = JSON.parse(xhr.responseText).message ?? msg;
      } catch {
        /* plain text */
      }
      if (/row-level security|unauthori[sz]ed|policy/i.test(msg))
        reject(
          new Error(
            "Upload not allowed for this account. Sign in with an admin e-mail (see the Dashboard's security card).",
          ),
        );
      else if (/mime|type/i.test(msg))
        reject(
          new Error("That file type isn't allowed. Use JPG, PNG, WEBP, GIF, MP4, WEBM or PDF."),
        );
      else if (/size|too large|payload/i.test(msg))
        reject(new Error("That file is larger than the upload limit."));
      else reject(new Error(`Upload failed (${xhr.status}). ${msg}`.trim()));
    };
    xhr.onerror = () => reject(new Error("Network error — check your connection and try again."));
    xhr.send(file);
  });
  onProgress?.(100);
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/** If `url` is a file in one of our buckets, delete it (best-effort). Used
 * after a replacement has finished uploading, never before. */
export async function deleteStoredFile(url: string | undefined | null) {
  if (!url || !URL_ || !url.startsWith(`${URL_}/storage/v1/object/public/`)) return;
  const rest = url.slice(`${URL_}/storage/v1/object/public/`.length).split("?")[0];
  const [bucket, ...parts] = rest.split("/");
  if (!["product-images", "site-images"].includes(bucket) || parts.length === 0) return;
  try {
    await supabase.storage.from(bucket).remove([decodeURIComponent(parts.join("/"))]);
  } catch {
    /* leaving an orphan file is harmless */
  }
}
