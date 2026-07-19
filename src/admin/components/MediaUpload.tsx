import { useState, useRef, useCallback } from "react";
import { uploadFile } from "@/lib/adminApi";
import { convertHeicIfNeeded } from "@/admin/lib/heic";

type Kind = "image" | "video" | "pdf" | "file";

function guessKind(url: string): Kind {
  const clean = url.split("?")[0].toLowerCase();
  if (/\.(png|jpe?g|gif|webp|svg|avif)$/.test(clean)) return "image";
  if (/\.(mp4|webm|mov|m4v|ogv)$/.test(clean)) return "video";
  if (/\.pdf$/.test(clean)) return "pdf";
  return "file";
}

interface MediaUploadProps {
  value?: string;
  onChange: (url: string) => void;
  bucket?: string;
  label?: string;
  className?: string;
  accept?: string;
  maxSizeMb?: number;
  aspectRatio?: string;
  helpText?: string;
}

/** Generic uploader for images, video, GIFs, or PDFs — with a URL-paste fallback that always works regardless of storage bucket policy. */
export function MediaUpload({
  value,
  onChange,
  bucket = "site-images",
  label = "Media",
  className = "",
  accept = "image/*,video/*,application/pdf",
  maxSizeMb = 50,
  aspectRatio = "16/9",
  helpText,
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (file.size > maxSizeMb * 1024 * 1024) { setError(`File must be smaller than ${maxSizeMb} MB — or paste a hosted URL below instead`); return; }
    setError("");
    try {
      let toUpload = file;
      if (/\.hei[cf]$/i.test(file.name) || file.type === "image/heic" || file.type === "image/heif") {
        setConverting(true);
        try {
          toUpload = await convertHeicIfNeeded(file);
        } catch {
          setError("This iPhone (HEIC) photo couldn't be converted automatically. Please export it as JPG/PNG first, then upload.");
          setConverting(false);
          return;
        }
        setConverting(false);
      }
      setUploading(true);
      const url = await uploadFile(toUpload, bucket);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Paste a hosted URL below instead.");
    } finally {
      setUploading(false);
    }
  }, [bucket, onChange, maxSizeMb]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const kind = value ? guessKind(value) : null;

  return (
    <div className={className}>
      {label && <label className="block text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] mb-2">{label}</label>}
      {helpText && <p className="text-[rgba(248,246,241,0.3)] text-[10px] mb-2">{helpText}</p>}

      <div
        className={`relative border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden ${
          isDragOver ? "border-[#C9A84C] bg-[rgba(201,168,76,0.05)]" : "border-[rgba(201,168,76,0.2)] hover:border-[rgba(201,168,76,0.4)]"
        }`}
        style={{ aspectRatio: kind === "pdf" || kind === "file" ? undefined : aspectRatio, minHeight: "100px" }}
        onDrop={onDrop}
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <>
            {kind === "image" && <img src={value} alt="Preview" className="w-full h-full object-cover" />}
            {kind === "video" && <video src={value} className="w-full h-full object-cover" muted loop autoPlay playsInline />}
            {(kind === "pdf" || kind === "file") && (
              <div className="flex items-center gap-3 p-4">
                <span className="text-[#C9A84C] text-2xl">{kind === "pdf" ? "📄" : "📎"}</span>
                <span className="text-[#F8F6F1] text-xs truncate">{value.split("/").pop()}</span>
              </div>
            )}
            {(kind === "image" || kind === "video") && (
              <div className="absolute inset-0 bg-[rgba(10,10,10,0.0)] hover:bg-[rgba(10,10,10,0.6)] transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="text-center">
                  <div className="text-[#C9A84C] text-2xl mb-1">↑</div>
                  <p className="text-[#F8F6F1] text-xs">Click to change</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <div className="text-[#C9A84C] text-3xl mb-2">↑</div>
            <p className="text-[rgba(248,246,241,0.5)] text-xs mb-1">
              Drop a file here or <span className="text-[#C9A84C]">click to browse</span>
            </p>
            <p className="text-[rgba(248,246,241,0.25)] text-[10px]">Max {maxSizeMb}MB</p>
          </div>
        )}

        {(uploading || converting) && (
          <div className="absolute inset-0 bg-[rgba(10,10,10,0.85)] flex flex-col items-center justify-center z-10">
            <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-[#C9A84C] text-[10px] uppercase tracking-wider">{converting ? "Converting HEIC photo…" : "Uploading…"}</p>
          </div>
        )}

        {isDragOver && !value && (
          <div className="absolute inset-0 border-2 border-[#C9A84C] bg-[rgba(201,168,76,0.08)] flex items-center justify-center pointer-events-none">
            <p className="text-[#C9A84C] text-sm font-medium">Drop to upload</p>
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />

      <div className="mt-2 flex gap-2">
        <input
          type="url"
          value={value ?? ""}
          onChange={e => onChange(e.target.value)}
          placeholder="Or paste a hosted file URL…"
          className="flex-1 bg-[#0A0A0A] border border-[rgba(201,168,76,0.1)] text-[#F8F6F1] px-3 py-2 text-xs placeholder:text-[rgba(248,246,241,0.2)] focus:outline-none focus:border-[rgba(201,168,76,0.4)] transition-colors"
        />
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-[10px] uppercase tracking-wider text-red-400 hover:text-red-300 px-2 whitespace-nowrap">
            Clear
          </button>
        )}
      </div>

      {error && <p className="text-red-400 text-[11px] mt-1">{error}</p>}
    </div>
  );
}
