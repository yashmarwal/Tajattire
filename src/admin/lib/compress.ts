/**
 * In-browser image compression before upload.
 *
 * • Resizes to a sensible maximum edge and re-encodes to WebP, stepping the
 *   quality down until the file fits the size budget (or quality would
 *   visibly suffer).
 * • Leaves GIFs, animated WebP, SVG and videos untouched.
 * • Reports the saving and warns when a source is too small/low quality.
 */
export interface CompressResult {
  file: File;
  before: number;
  after: number;
  width?: number;
  height?: number;
  skipped?: string;
  warning?: string;
}

export interface CompressOptions {
  maxBytes?: number; // size budget
  maxEdge?: number; // longest side in px
  minQuality?: number;
}

export const DEFAULT_BUDGET_KB = 350;

async function isAnimatedWebp(file: File) {
  if (file.type !== "image/webp") return false;
  const head = new Uint8Array(await file.slice(0, 64).arrayBuffer());
  const text = String.fromCharCode(...head);
  if (text.includes("ANIM") || text.includes("ANMF")) return true;
  // Extended WebP header: bit 1 of the flags byte marks animation
  return text.slice(12, 16) === "VP8X" && ((head[20] ?? 0) & 0x02) !== 0;
}

function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ("createImageBitmap" in window) return createImageBitmap(file).catch(() => loadViaImg(file));
  return loadViaImg(file);
}
function loadViaImg(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read this image"));
    };
    img.src = url;
  });
}

const toBlob = (canvas: HTMLCanvasElement, q: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", q));

export async function compressImage(
  file: File,
  opts: CompressOptions = {},
): Promise<CompressResult> {
  const maxBytes = opts.maxBytes ?? DEFAULT_BUDGET_KB * 1024;
  const maxEdge = opts.maxEdge ?? 2000;
  const minQuality = opts.minQuality ?? 0.6;
  const before = file.size;

  if (!file.type.startsWith("image/"))
    return { file, before, after: before, skipped: "not an image" };
  if (file.type === "image/gif")
    return { file, before, after: before, skipped: "GIF kept as-is (animation)" };
  if (file.type === "image/svg+xml")
    return { file, before, after: before, skipped: "SVG kept as-is" };
  if (await isAnimatedWebp(file))
    return { file, before, after: before, skipped: "animated WebP kept as-is" };

  const bmp = await loadBitmap(file);
  const w0 = "naturalWidth" in bmp ? bmp.naturalWidth : bmp.width;
  const h0 = "naturalHeight" in bmp ? bmp.naturalHeight : bmp.height;
  const scale = Math.min(1, maxEdge / Math.max(w0, h0));
  const w = Math.round(w0 * scale);
  const h = Math.round(h0 * scale);

  const warning =
    Math.max(w0, h0) < 900
      ? `Small source (${w0}×${h0}px) — it may look soft on large screens. Use a larger photo if you have one.`
      : before < 40 * 1024 && Math.max(w0, h0) >= 900
        ? "This file is very small for its size in pixels and may already be heavily compressed."
        : undefined;

  // Already small enough and not oversized → keep the original untouched
  if (
    before <= maxBytes &&
    scale === 1 &&
    (file.type === "image/webp" || file.type === "image/jpeg")
  ) {
    if ("close" in bmp) bmp.close();
    return {
      file,
      before,
      after: before,
      width: w0,
      height: h0,
      skipped: "already within budget",
      warning,
    };
  }

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { file, before, after: before, skipped: "canvas unavailable", warning };
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bmp as CanvasImageSource, 0, 0, w, h);
  if ("close" in bmp) bmp.close();

  let q = 0.86;
  let blob = await toBlob(canvas, q);
  while (blob && blob.size > maxBytes && q > minQuality) {
    q = Math.max(minQuality, q - 0.06);
    blob = await toBlob(canvas, q);
  }
  // Still over budget at the quality floor → shrink dimensions a little
  let cw = w;
  let ch = h;
  while (blob && blob.size > maxBytes && Math.max(cw, ch) > 1200) {
    cw = Math.round(cw * 0.85);
    ch = Math.round(ch * 0.85);
    canvas.width = cw;
    canvas.height = ch;
    ctx.drawImage((await loadBitmap(file)) as CanvasImageSource, 0, 0, cw, ch);
    blob = await toBlob(canvas, q);
  }
  if (!blob || blob.size >= before) {
    return {
      file,
      before,
      after: before,
      width: w0,
      height: h0,
      skipped: "original was already smaller",
      warning,
    };
  }
  const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return {
    file: new File([blob], name, { type: "image/webp" }),
    before,
    after: blob.size,
    width: cw,
    height: ch,
    warning,
  };
}

export const formatBytes = (n: number) =>
  n >= 1024 * 1024
    ? `${(n / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(n / 1024))} KB`;

export function savingsText(r: CompressResult) {
  if (r.skipped) return `${formatBytes(r.before)} · ${r.skipped}`;
  const pct = Math.round((1 - r.after / r.before) * 100);
  return `${formatBytes(r.before)} → ${formatBytes(r.after)} (−${pct}%)`;
}
