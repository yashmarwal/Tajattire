import { useState, useRef, useCallback } from "react";
import { uploadImage } from "@/lib/adminApi";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  bucket?: "product-images" | "site-images";
  label?: string;
  className?: string;
  aspectRatio?: string;
}

export function ImageUpload({
  value,
  onChange,
  bucket = "product-images",
  label = "Image",
  className = "",
  aspectRatio = "3/4",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) { setError("Please select an image or GIF file"); return; }
    const isGif = file.type === "image/gif";
    const maxSize = isGif ? 20 * 1024 * 1024 : 8 * 1024 * 1024;
    if (file.size > maxSize) { setError(`${isGif ? "GIF" : "Image"} must be smaller than ${isGif ? 20 : 8} MB`); return; }
    setError("");
    setUploading(true);
    try {
      const url = await uploadImage(file, bucket);
      onChange(url);
    } catch {
      setError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }, [bucket, onChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className={className}>
      {label && (
        <label className="block text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] mb-2">{label}</label>
      )}

      {/* Drop zone / preview */}
      <div
        className={`relative border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden ${
          isDragOver
            ? "border-[#C9A84C] bg-[rgba(201,168,76,0.05)]"
            : "border-[rgba(201,168,76,0.2)] hover:border-[rgba(201,168,76,0.4)]"
        }`}
        style={{ aspectRatio, minHeight: "120px" }}
        onDrop={onDrop}
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {/* Change overlay */}
            <div className="absolute inset-0 bg-[rgba(10,10,10,0.0)] hover:bg-[rgba(10,10,10,0.6)] transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
              <div className="text-center">
                <div className="text-[#C9A84C] text-2xl mb-1">↑</div>
                <p className="text-[#F8F6F1] text-xs">Click to change</p>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <div className="text-[#C9A84C] text-3xl mb-2">↑</div>
            <p className="text-[rgba(248,246,241,0.5)] text-xs mb-1">
              Drop image or GIF here or <span className="text-[#C9A84C]">click to browse</span>
            </p>
            <p className="text-[rgba(248,246,241,0.25)] text-[10px]">PNG · JPG · GIF · WEBP · Max 8MB (20MB for GIF)</p>
          </div>
        )}

        {/* Uploading overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-[rgba(10,10,10,0.85)] flex flex-col items-center justify-center z-10">
            <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-[#C9A84C] text-[10px] uppercase tracking-wider">Uploading…</p>
          </div>
        )}

        {/* Drag indicator */}
        {isDragOver && !value && (
          <div className="absolute inset-0 border-2 border-[#C9A84C] bg-[rgba(201,168,76,0.08)] flex items-center justify-center pointer-events-none">
            <p className="text-[#C9A84C] text-sm font-medium">Drop to upload</p>
          </div>
        )}
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />

      {/* URL fallback */}
      <input
        type="url"
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
        placeholder="Or paste an image URL…"
        className="mt-2 w-full bg-[#0A0A0A] border border-[rgba(201,168,76,0.1)] text-[#F8F6F1] px-3 py-2 text-xs placeholder:text-[rgba(248,246,241,0.2)] focus:outline-none focus:border-[rgba(201,168,76,0.4)] transition-colors"
      />

      {error && <p className="text-red-400 text-[11px] mt-1">{error}</p>}
    </div>
  );
}
