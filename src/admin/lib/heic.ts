/** Browsers other than Safari cannot display HEIC/HEIF (the default iPhone
 * photo format) in <img>/<video> tags — it just renders blank. Convert to
 * JPEG client-side before upload so it always displays everywhere. */
export async function convertHeicIfNeeded(file: File): Promise<File> {
  const isHeic = file.type === "image/heic" || file.type === "image/heif" || /\.hei[cf]$/i.test(file.name);
  if (!isHeic) return file;

  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
  const blob = Array.isArray(result) ? result[0] : result;
  const newName = file.name.replace(/\.hei[cf]$/i, ".jpg");
  return new File([blob], newName, { type: "image/jpeg" });
}
