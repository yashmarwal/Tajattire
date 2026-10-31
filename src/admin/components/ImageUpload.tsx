import { useState, useRef, useCallback } from "react";
import { uploadWithProgress, deleteStoredFile } from "@/admin/lib/upload";
import { prepareForUpload, useImageBudgetKb } from "@/admin/lib/prepare";
import { savingsText } from "@/admin/lib/compress";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  bucket?: "product-images" | "site-images";
  label?: string;
  className?: string;
  aspectRatio?: string;
  /** Delete the previous file from storage after a successful replacement. */
  deleteReplaced?: boolean;
}

type Phase = "idle" | "preparing" | "uploading";

/** Drop or pick one image → HEIC conversion → compression within the size
 * budget → upload with progress. A replacement is uploaded BEFORE the old
 * file is deleted, so a failed upload never leaves an empty slot. */
export function ImageUpload({
  value,
  onChange,
  bucket = "product-images",
  label = "Image",
  className = "",
  aspectRatio = "3/4",
  deleteReplaced = false,
}: ImageUploadProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [pct, setPct] = useState(0);
  const [error, setError] = useState("");
  const [report, setReport] = useState<{ text: string; warning?: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const budget = useImageBudgetKb();

  const handleFile = useCallback(
    async (file: File) => {
      const isHeic =
        /\.hei[cf]$/i.test(file.name) || file.type === "image/heic" || file.type === "image/heif";
      if (!isHeic && !file.type.startsWith("image/"))
        return setError("Please choose an image file.");
      const limit = file.type === "image/gif" ? 20 : 25;
      if (file.size > limit * 1024 * 1024) return setError(`That file is over ${limit} MB.`);
      setError("");
      setReport(null);
      try {
        setPhase("preparing");
        const prepared = await prepareForUpload(file, budget);
        setPhase("uploading");
        setPct(0);
        const url = await uploadWithProgress(prepared.file, bucket, setPct);
        const old = value;
        onChange(url);
        setReport({ text: savingsText(prepared), warning: prepared.warning });
        if (deleteReplaced && old && old !== url) void deleteStoredFile(old);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed. Try again.");
      } finally {
        setPhase("idle");
      }
    },
    [bucket, budget, onChange, value, deleteReplaced],
  );

  const busy = phase !== "idle";

  return (
    <div className={className}>
      {label && (
        <span className="block text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] mb-2">
          {label}
        </span>
      )}
      <button
        type="button"
        disabled={busy}
        className={`relative block w-full border-2 border-dashed transition-colors overflow-hidden text-left ${
          isDragOver
            ? "border-[#C9A84C] bg-[rgba(201,168,76,0.05)]"
            : "border-[rgba(201,168,76,0.2)] hover:border-[rgba(201,168,76,0.45)]"
        }`}
        style={{ aspectRatio, minHeight: 120 }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f) void handleFile(f);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => inputRef.current?.click()}
        aria-label={value ? `Replace ${label}` : `Upload ${label}`}
      >
        {value && !previewFailed ? (
          <>
            <img
              key={value}
              src={value}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setPreviewFailed(true)}
              onLoad={() => setPreviewFailed(false)}
            />
            <span className="absolute inset-x-0 bottom-0 bg-black/65 text-[#F8F6F1] text-[11px] py-1.5 text-center">
              Click or drop to replace
            </span>
          </>
        ) : (
          <span className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-[#C9A84C] text-3xl mb-2" aria-hidden="true">
              ↑
            </span>
            <span className="text-[rgba(248,246,241,0.6)] text-xs">
              {value
                ? "Couldn't preview this file — drop a new one"
                : "Drop an image here or click to browse"}
            </span>
            <span className="text-[rgba(248,246,241,0.3)] text-[10px] mt-1">
              JPG · PNG · WEBP · HEIC · GIF — compressed automatically to about {budget} KB
            </span>
          </span>
        )}
        {busy && (
          <span
            className="absolute inset-0 bg-[rgba(10,10,10,0.85)] flex flex-col items-center justify-center gap-3 z-10"
            role="status"
          >
            <span className="text-[#C9A84C] text-[10px] uppercase tracking-wider">
              {phase === "preparing" ? "Optimising photo…" : `Uploading ${pct}%`}
            </span>
            <span className="w-2/3 h-1 bg-white/10 rounded-full overflow-hidden">
              <span
                className="block h-full bg-[#C9A84C] origin-left transition-transform"
                style={{ transform: `scaleX(${phase === "preparing" ? 0.05 : pct / 100})` }}
              />
            </span>
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
          e.target.value = "";
        }}
      />
      <input
        type="url"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste an image URL…"
        className="mt-2 w-full bg-[#0A0A0A] border border-[rgba(201,168,76,0.1)] text-[#F8F6F1] px-3 py-2 text-xs placeholder:text-[rgba(248,246,241,0.25)] focus:outline-none focus:border-[rgba(201,168,76,0.4)]"
      />
      {report && (
        <p className="text-emerald-400/90 text-[11px] mt-1.5" role="status">
          Optimised: {report.text}
        </p>
      )}
      {report?.warning && <p className="text-amber-300 text-[11px] mt-1">⚠ {report.warning}</p>}
      {error && (
        <p className="text-red-400 text-[11px] mt-1.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
