/** Browsers other than Safari cannot display HEIC/HEIF (the default iPhone
 * photo format) in <img>/<video> tags — it just renders blank. Convert to
 * JPEG client-side before upload so it always displays everywhere.
 *
 * Uses heic-to's CSP-safe build (no Worker/Blob-URL tricks that can silently
 * fail under bundling or a strict Content-Security-Policy — heic2any hit
 * exactly that failure mode). */
export async function convertHeicIfNeeded(file: File): Promise<File> {
  const looksHeic = file.type === "image/heic" || file.type === "image/heif" || /\.hei[cf]$/i.test(file.name);
  if (!looksHeic) return file;

  const { heicTo } = await import("heic-to/csp");
  const blob = await heicTo({ blob: file, type: "image/jpeg", quality: 0.9 });
  const newName = file.name.replace(/\.hei[cf]$/i, ".jpg");
  return new File([blob], newName, { type: "image/jpeg" });
}
