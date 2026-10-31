import { useRef, useState } from "react";
import { uploadWithProgress } from "@/admin/lib/upload";
import { prepareForUpload, useImageBudgetKb } from "@/admin/lib/prepare";
import { savingsText } from "@/admin/lib/compress";

export interface UploadedFile {
  name: string;
  url: string;
  type: string;
}

type Row = {
  id: number;
  name: string;
  state: "queued" | "optimising" | "uploading" | "done" | "error";
  pct: number;
  note?: string;
  warning?: string;
};

/**
 * Multi-file drop zone. Each file is optimised and uploaded one at a time
 * with its own progress bar; `onUploaded` fires per file as it finishes, so a
 * failure on one file never loses the others.
 */
export function BulkUpload({
  bucket,
  accept = "image/*,.heic,.heif",
  allowVideo = false,
  hint,
  onUploaded,
}: {
  bucket: "product-images" | "site-images";
  accept?: string;
  allowVideo?: boolean;
  hint?: string;
  onUploaded: (f: UploadedFile) => Promise<void> | void;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const seq = useRef(0);
  const budget = useImageBudgetKb();

  const patch = (id: number, p: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...p } : r)));

  const run = async (files: File[]) => {
    const accepted = files.filter(
      (f) =>
        f.type.startsWith("image/") ||
        /\.hei[cf]$/i.test(f.name) ||
        (allowVideo && /^video\/(mp4|webm)$/.test(f.type)),
    );
    const rejected = files.length - accepted.length;
    const queue = accepted.map((f) => ({ file: f, id: ++seq.current }));
    setRows((rs) => [
      ...queue.map((q) => ({ id: q.id, name: q.file.name, state: "queued" as const, pct: 0 })),
      ...(rejected
        ? [
            {
              id: ++seq.current,
              name: `${rejected} file(s) skipped`,
              state: "error" as const,
              pct: 0,
              note: allowVideo ? "Only images, MP4 and WEBM" : "Only image files",
            },
          ]
        : []),
      ...rs,
    ]);
    setBusy(true);
    for (const { file, id } of queue) {
      try {
        const max = file.type.startsWith("video/") ? 50 : 25;
        if (file.size > max * 1024 * 1024) throw new Error(`Over ${max} MB`);
        patch(id, { state: "optimising" });
        const prepared = await prepareForUpload(file, budget);
        patch(id, {
          state: "uploading",
          note: prepared.file.type.startsWith("image/") ? savingsText(prepared) : undefined,
          warning: prepared.warning,
        });
        const url = await uploadWithProgress(prepared.file, bucket, (pct) => patch(id, { pct }));
        await onUploaded({ name: file.name, url, type: prepared.file.type });
        patch(id, { state: "done", pct: 100 });
      } catch (e) {
        patch(id, { state: "error", note: e instanceof Error ? e.message : "Failed" });
      }
    }
    setBusy(false);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          void run([...e.dataTransfer.files]);
        }}
        className={`w-full border-2 border-dashed px-6 py-8 text-center transition-colors ${over ? "border-[#C9A84C] bg-[#C9A84C]/5" : "border-[#C9A84C]/25 hover:border-[#C9A84C]/50"}`}
      >
        <span className="block text-[#C9A84C] text-2xl" aria-hidden="true">
          ⇪
        </span>
        <span className="block text-[#F8F6F1] text-sm mt-1">
          Drop several files here, or click to choose
        </span>
        <span className="block text-[rgba(248,246,241,0.4)] text-[11px] mt-1">
          {hint ?? `Photos are optimised automatically to about ${budget} KB each.`}
        </span>
      </button>
      <input
        ref={input}
        type="file"
        multiple
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        aria-label="Choose files to upload"
        onChange={(e) => {
          const fs = [...(e.target.files ?? [])];
          e.target.value = "";
          if (fs.length) void run(fs);
        }}
      />
      {rows.length > 0 && (
        <ul className="mt-3 space-y-1.5 max-h-64 overflow-y-auto" aria-live="polite">
          {rows.map((r) => (
            <li key={r.id} className="bg-[#0A0A0A] border border-white/5 px-3 py-2 text-[11px]">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-[#F8F6F1]">{r.name}</span>
                <span
                  className={`shrink-0 ${r.state === "done" ? "text-emerald-400" : r.state === "error" ? "text-red-400" : "text-[#C9A84C]"}`}
                >
                  {r.state === "uploading"
                    ? `${r.pct}%`
                    : r.state === "optimising"
                      ? "optimising…"
                      : r.state}
                </span>
              </div>
              {(r.state === "uploading" || r.state === "done") && (
                <div className="mt-1.5 h-1 bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-[#C9A84C] origin-left transition-transform"
                    style={{ transform: `scaleX(${r.pct / 100})` }}
                  />
                </div>
              )}
              {r.note && (
                <p
                  className={`mt-1 ${r.state === "error" ? "text-red-400" : "text-emerald-400/80"}`}
                >
                  {r.note}
                </p>
              )}
              {r.warning && <p className="mt-0.5 text-amber-300">⚠ {r.warning}</p>}
            </li>
          ))}
        </ul>
      )}
      {busy && <p className="sr-only">Uploading…</p>}
    </div>
  );
}
